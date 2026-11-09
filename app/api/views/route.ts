import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { RateLimiter, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// Rate limiters:
// - GET: 60 reads per minute per IP
// - POST: 10 increments per 10 minutes per IP (prevents artificial view stuffing)
const viewReadLimiter = new RateLimiter({ intervalMs: 60_000, maxRequests: 60 });
const viewIncrementLimiter = new RateLimiter({ intervalMs: 600_000, maxRequests: 10 });

// In-memory fallback if network fails
let fallbackViews = 187;

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rate = viewReadLimiter.check(ip);

  if (!rate.success) {
    return NextResponse.json(
      { views: fallbackViews, error: 'Rate limit reached' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  try {
    const docRef = doc(db, 'analytics', 'website');
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const views = typeof data.views === 'number' ? data.views : fallbackViews;
      fallbackViews = Math.max(fallbackViews, views);
      return NextResponse.json(
        { views, source: 'firestore' },
        { headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=15' } }
      );
    } else {
      try {
        await setDoc(docRef, { views: fallbackViews, updatedAt: Date.now() }, { merge: true });
      } catch {}
      return NextResponse.json({ views: fallbackViews, source: 'initial' });
    }
  } catch (error: any) {
    return NextResponse.json({ views: fallbackViews, source: 'fallback', error: error?.message });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = viewIncrementLimiter.check(ip);

  // If rate limit exceeded, return current count without incrementing
  if (!rate.success) {
    return NextResponse.json(
      { views: fallbackViews, warning: 'Rate limit: view already recorded recently' },
      { status: 200 }
    );
  }

  try {
    const docRef = doc(db, 'analytics', 'website');

    try {
      await updateDoc(docRef, {
        views: increment(1),
        updatedAt: Date.now(),
      });
    } catch {
      await setDoc(
        docRef,
        {
          views: fallbackViews + 1,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    }

    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const views = typeof snap.data().views === 'number' ? snap.data().views : fallbackViews + 1;
      fallbackViews = Math.max(fallbackViews, views);
      return NextResponse.json({ views, source: 'firestore' });
    }

    fallbackViews += 1;
    return NextResponse.json({ views: fallbackViews, source: 'local' });
  } catch (error: any) {
    fallbackViews += 1;
    return NextResponse.json({ views: fallbackViews, source: 'fallback', error: error?.message });
  }
}
