'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch & increment view count for this session
    async function recordView() {
      try {
        const hasViewed = sessionStorage.getItem('portfolio_viewed_session');
        const method = hasViewed ? 'GET' : 'POST';

        const res = await fetch('/api/views', {
          method,
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.views === 'number') {
            setViews(data.views);
            if (!hasViewed) {
              sessionStorage.setItem('portfolio_viewed_session', 'true');
            }
          }
        }
      } catch {
        // Handled gracefully without hardcoded numbers
      }
    }

    recordView();

    // 2. Real-time Firestore listener: instantly updates when ANY new user checks the portfolio
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, 'analytics', 'website');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (isMounted && snap.exists()) {
            const data = snap.data();
            if (typeof data.views === 'number') {
              setViews(data.views);
            }
          }
        },
        () => {
          // Graceful fallback if snapshot listener encounters network glitch
        }
      );
    } catch {}

    // 3. Fallback sync on window focus or 60s visibility tick (onSnapshot handles real-time push)
    const syncLatest = async () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/api/views');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.views === 'number') {
            setViews(data.views);
          }
        }
      } catch {}
    };

    const interval = setInterval(syncLatest, 60000);
    window.addEventListener('focus', syncLatest);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', syncLatest);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 select-none py-1 px-2 transition-colors hover:text-gray-800 dark:hover:text-gray-200"
      title="Total Portfolio Views (Real-time Live Analytics)"
    >
      {/* Concentric Eye Icon matching reference image pixel-for-pixel */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0"
      >
        <path d="M2 12s3.5-6.5 10-6.5 10 6.5 10 6.5-3.5 6.5-10 6.5S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
      <span className="font-mono text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 tabular-nums font-normal">
        {views !== null ? views.toLocaleString() : '...'}
      </span>
    </div>
  );
}
