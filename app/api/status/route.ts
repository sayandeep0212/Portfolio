import { NextResponse } from 'next/server';
import { getLaptopStatus } from '@/lib/statusStore';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const statusLimiter = new RateLimiter({ intervalMs: 60_000, maxRequests: 60 });

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rate = statusLimiter.check(ip);

  if (!rate.success) {
    return NextResponse.json(
      { error: 'Rate limit reached' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  const status = await getLaptopStatus();
  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15',
    },
  });
}

