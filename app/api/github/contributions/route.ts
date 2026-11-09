import { NextResponse } from 'next/server';
import initialData from '@/app/github-data.json';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export interface DayContribution {
  date: string;
  count: number;
  level: number;
}

export interface ContributionsData {
  total: {
    lastYear: number;
    [key: string]: number;
  };
  contributions: DayContribution[];
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Rate limiter: 30 requests per minute per IP
const githubLimiter = new RateLimiter({ intervalMs: 60_000, maxRequests: 30 });

// In-memory cache for GitHub contributions (valid for 5 minutes)
let cachedContributions: { [username: string]: { data: ContributionsData; expiresAt: number } } = {};

async function fetchFromGitHubGraphQL(
  username: string,
  token: string
): Promise<ContributionsData | null> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'sayandeep-portfolio',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar || !Array.isArray(calendar.weeks)) {
    return null;
  }

  const contributions: DayContribution[] = [];
  for (const week of calendar.weeks) {
    if (Array.isArray(week.contributionDays)) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          level: LEVEL_MAP[day.contributionLevel] ?? 0,
        });
      }
    }
  }

  return {
    total: {
      lastYear: calendar.totalContributions,
    },
    contributions,
  };
}

async function fetchFromScraper(
  username: string
): Promise<ContributionsData | null> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
    return data as ContributionsData;
  }

  return null;
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = githubLimiter.check(ip);

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateCheck.resetMs / 1000)),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'sayandeep0212';
  const pat = process.env.GITHUB_PAT || '';

  // Check in-memory cache
  const now = Date.now();
  const cached = cachedContributions[username];
  if (cached && now < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // 1. Try official GitHub GraphQL API with PAT
    if (pat) {
      const graphData = await fetchFromGitHubGraphQL(username, pat);
      if (graphData && graphData.contributions.length > 0) {
        cachedContributions[username] = { data: graphData, expiresAt: now + 300_000 };
        return NextResponse.json(graphData, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'X-Cache': 'MISS',
          },
        });
      }
    }

    // 2. Fallback to public contributions scraper
    const scraperData = await fetchFromScraper(username);
    if (scraperData && scraperData.contributions.length > 0) {
      cachedContributions[username] = { data: scraperData, expiresAt: now + 300_000 };
      return NextResponse.json(scraperData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'MISS',
        },
      });
    }

    // 3. Fallback to local snapshot
    return NextResponse.json(initialData, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'FALLBACK',
      },
    });
  } catch {
    return NextResponse.json(initialData);
  }
}
