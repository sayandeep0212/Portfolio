import initialData from '@/app/github-data.json';

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

let memoryCache: { [username: string]: { data: ContributionsData; timestamp: number } } = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function getCachedContributions(
  username: string = 'sayandeep0212'
): Promise<ContributionsData> {
  const cached = memoryCache[username];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    // If in browser, fetch via internal Next.js API route
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/github/contributions?username=${username}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.contributions && data.contributions.length > 0) {
          memoryCache[username] = { data: data as ContributionsData, timestamp: Date.now() };
          return data as ContributionsData;
        }
      }
    } else {
      // Server-side: fetch from GitHub GraphQL API if token is present
      const pat = process.env.GITHUB_PAT || '';

      if (pat) {
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
            Authorization: `Bearer ${pat}`,
            'User-Agent': 'sayandeep-portfolio',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { login: username } }),
          next: { revalidate: 300 },
        });

        if (res.ok) {
          const json = await res.json();
          const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
          if (calendar && Array.isArray(calendar.weeks)) {
            const LEVEL_MAP: Record<string, number> = {
              NONE: 0,
              FIRST_QUARTILE: 1,
              SECOND_QUARTILE: 2,
              THIRD_QUARTILE: 3,
              FOURTH_QUARTILE: 4,
            };
            const contributions: DayContribution[] = [];
            for (const week of calendar.weeks) {
              for (const day of week.contributionDays || []) {
                contributions.push({
                  date: day.date,
                  count: day.contributionCount,
                  level: LEVEL_MAP[day.contributionLevel] ?? 0,
                });
              }
            }
            const data: ContributionsData = {
              total: { lastYear: calendar.totalContributions },
              contributions,
            };
            memoryCache[username] = { data, timestamp: Date.now() };
            return data;
          }
        }
      }
    }
  } catch {
    // Fall back to cached initial data
  }

  return initialData as ContributionsData;
}
