import { NextResponse } from 'next/server';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const clientId = process.env.SPOTIFY_CLIENT_ID || '911f6b5bde9f49c195a2508eae41f28f';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || 'cec06533cdc54efa8a5c53b711bdcb4a';
const refreshToken =
  process.env.SPOTIFY_REFRESH_TOKEN ||
  'AQAIrbtzghGPXYsMgkLVDDJ6UUIZnbwyREnf7dNw2KHsJJhSQUdmA2R5j2siNMMMNsJ_AE7pnW_I4YG2bp__PVkB0RqFG82hfqBydOhGyRbXM8EP1bPsTXeSzlUTl3JLwBQ';

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const FALLBACK_TRACK = {
  isPlaying: false,
  title: 'Baawra',
  artist: 'Kushagra, Tanishk Bagchi',
  album: 'Baawra',
  albumImageUrl:
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
  songUrl: 'https://open.spotify.com/search/Baawra',
};

// Rate limiter: 60 requests per minute per IP
const spotifyLimiter = new RateLimiter({ intervalMs: 60_000, maxRequests: 60 });

// In-memory token cache (valid for 50 minutes to avoid hammering Spotify token endpoint)
let cachedToken: { access_token: string; expiresAt: number } | null = null;

// In-memory song response cache (valid for 10 seconds for ultra-fast, zero-latency response)
let cachedSong: { data: any; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt) {
    return cachedToken.access_token;
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      cache: 'no-store',
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.access_token) {
      cachedToken = {
        access_token: data.access_token,
        // Cache for expires_in minus 5 minutes buffer (usually ~55 minutes)
        expiresAt: now + (data.expires_in || 3600) * 1000 - 300_000,
      };
      return data.access_token;
    }
  } catch {}

  return null;
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = spotifyLimiter.check(ip);

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

  // Check in-memory song cache first
  const now = Date.now();
  if (cachedSong && now < cachedSong.expiresAt) {
    return NextResponse.json(cachedSong.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const access_token = await getAccessToken();

    if (!access_token) {
      return NextResponse.json(FALLBACK_TRACK);
    }

    // 1. Check if a song is currently playing on Spotify
    const nowPlayingRes = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: 'no-store',
    });

    if (nowPlayingRes.status === 200) {
      const song = await nowPlayingRes.json();
      if (song && song.item) {
        const payload = {
          isPlaying: Boolean(song.is_playing),
          title: song.item.name,
          artist: song.item.artists?.map((_artist: any) => _artist.name).join(', ') || 'Unknown Artist',
          album: song.item.album?.name || '',
          albumImageUrl: song.item.album?.images?.[0]?.url || FALLBACK_TRACK.albumImageUrl,
          songUrl: song.item.external_urls?.spotify || `https://open.spotify.com/search/${encodeURIComponent(song.item.name)}`,
        };

        // Cache for 10 seconds
        cachedSong = { data: payload, expiresAt: now + 10_000 };

        return NextResponse.json(payload, {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            'X-Cache': 'MISS',
          },
        });
      }
    }

    // 2. If nothing currently playing, fetch the most recently played track
    const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: 'no-store',
    });

    if (recentRes.status === 200) {
      const recent = await recentRes.json();
      const track = recent.items?.[0]?.track;
      if (track) {
        const payload = {
          isPlaying: false,
          title: track.name,
          artist: track.artists?.map((_artist: any) => _artist.name).join(', ') || 'Unknown Artist',
          album: track.album?.name || '',
          albumImageUrl: track.album?.images?.[0]?.url || FALLBACK_TRACK.albumImageUrl,
          songUrl: track.external_urls?.spotify || `https://open.spotify.com/search/${encodeURIComponent(track.name)}`,
        };

        // Cache for 15 seconds when paused
        cachedSong = { data: payload, expiresAt: now + 15_000 };

        return NextResponse.json(payload, {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
            'X-Cache': 'MISS',
          },
        });
      }
    }

    return NextResponse.json(FALLBACK_TRACK);
  } catch {
    return NextResponse.json(FALLBACK_TRACK);
  }
}
