import { NextResponse } from 'next/server';
import { setLaptopHeartbeat } from '@/lib/statusStore';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Rate limiter: 45 heartbeats per minute per IP
const heartbeatLimiter = new RateLimiter({ intervalMs: 60_000, maxRequests: 45 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = heartbeatLimiter.check(ip);

  if (!rate.success) {
    return NextResponse.json(
      { error: 'Heartbeat rate limit reached' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  const updated = await setLaptopHeartbeat();
  return NextResponse.json({
    success: true,
    timestamp: Date.now(),
    status: updated,
  });
}
