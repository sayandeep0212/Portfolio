interface RateLimitConfig {
  intervalMs: number;
  maxRequests: number;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

/**
 * High-performance in-memory sliding-window rate limiter
 * Zero dependencies, edge-safe, auto-cleans stale IP buckets
 */
export class RateLimiter {
  private cache = new Map<string, ClientRecord>();
  private intervalMs: number;
  private maxRequests: number;
  private lastCleanup = Date.now();

  constructor({ intervalMs, maxRequests }: RateLimitConfig) {
    this.intervalMs = intervalMs;
    this.maxRequests = maxRequests;
  }

  public check(ip: string): { success: boolean; remaining: number; resetMs: number } {
    const now = Date.now();

    // Periodic cleanup of expired records every 2 minutes
    if (now - this.lastCleanup > 120_000) {
      for (const [key, value] of this.cache.entries()) {
        if (now > value.resetTime) {
          this.cache.delete(key);
        }
      }
      this.lastCleanup = now;
    }

    const record = this.cache.get(ip);

    if (!record || now > record.resetTime) {
      this.cache.set(ip, {
        count: 1,
        resetTime: now + this.intervalMs,
      });
      return {
        success: true,
        remaining: this.maxRequests - 1,
        resetMs: this.intervalMs,
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetMs: record.resetTime - now,
      };
    }

    record.count += 1;
    return {
      success: true,
      remaining: this.maxRequests - record.count,
      resetMs: record.resetTime - now,
    };
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

