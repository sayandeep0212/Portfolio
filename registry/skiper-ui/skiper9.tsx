'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FlipFadeText } from '@/components/flip-fade-text';

export interface Skiper9Props {
  text?: string;
  words?: string[];
  columns?: number;
  interval?: number;
  onComplete?: () => void;
  className?: string;
}

/**
 * Preloader timings & atmosphere:
 *  - Deep dark background with subtle upper-left studio radial vignette
 *  - FlipFadeText in bold uppercase sans-serif with tracking matching reference
 *  - 5 black columns lift straight up (y: 0 -> -100%)
 *  - Stagger runs RIGHT -> LEFT (last column starts first)
 */
const FADE_IN = 1.7; // s (legacy single text fallback)
const HOLD = 0.7; // s
const FADE_OUT = 0.5; // s
const LIFT = 0.65; // s per column
const STAGGER = 0.08; // s between columns
const TEXT_PEAK = 0.95; // max text opacity
const EASE_LIFT = [0.22, 1, 0.36, 1] as const;

type Phase = 'in' | 'out' | 'lift' | 'done';

export function Skiper9({
  text = 'SAYANDEEP PRADHAN',
  words,
  columns = 5,
  interval = 2100,
  onComplete,
  className = '',
}: Skiper9Props) {
  const [phase, setPhase] = useState<Phase>('in');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isFlipMode = Boolean(words && words.length > 0);
  const totalFlipDuration = isFlipMode ? words!.length * interval : (FADE_IN + HOLD) * 1000;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const tOutTime = totalFlipDuration;
    const tLiftTime = tOutTime + 380;
    const tDoneTime = tLiftTime + (LIFT + (columns - 1) * STAGGER) * 1000 + 80;

    const tOut = setTimeout(() => setPhase('out'), tOutTime);
    const tLift = setTimeout(() => setPhase('lift'), tLiftTime);
    const tDone = setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
      onCompleteRef.current?.();
    }, tDoneTime);

    return () => {
      clearTimeout(tOut);
      clearTimeout(tLift);
      clearTimeout(tDone);
      document.body.style.overflow = '';
    };
  }, [columns, totalFlipDuration]);

  if (phase === 'done') return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[99999] overflow-hidden',
        phase === 'lift' ? 'pointer-events-none' : 'pointer-events-auto',
        className
      )}
    >
      {/* 5 Lifting Columns with atmospheric studio vignette (NO solid black behind them so portfolio is revealed as they lift) */}
      <div className="absolute inset-0 flex h-full w-full pointer-events-none">
        {Array.from({ length: columns }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-[#050505] will-change-transform relative overflow-hidden -mr-[1px] last:mr-0"
            initial={{ y: '0%' }}
            animate={{ y: phase === 'lift' ? '-100%' : '0%' }}
            transition={{
              duration: LIFT,
              ease: EASE_LIFT,
              // right-most column moves first for staircase wave
              delay: phase === 'lift' ? (columns - 1 - i) * STAGGER : 0,
            }}
          >
            {/* Soft atmospheric top-left vignette highlight matching reference screenshot */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                width: `${columns * 100}%`,
                left: `-${i * 100}%`,
                background:
                  'radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0.95) 75%, #000000 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Centered animated text */}
      <div className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center">
        <motion.div
          className="px-6 text-center max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'out' || phase === 'lift' ? 0 : 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {isFlipMode ? (
            <FlipFadeText
              words={words}
              interval={interval}
              loop={false}
              letterDuration={0.48}
              staggerDelay={0.035}
              exitStaggerDelay={0.02}
              className="min-h-0"
              textClassName="font-sans font-bold uppercase tracking-[0.16em] text-3xl sm:text-5xl md:text-6xl text-white select-none leading-tight drop-shadow-[0_2px_18px_rgba(255,255,255,0.18)]"
            />
          ) : (
            <motion.p
              className="font-sans text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-[0.16em] text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'in' ? TEXT_PEAK : 0 }}
              transition={{
                duration: phase === 'in' ? FADE_IN : FADE_OUT,
                ease: 'linear',
              }}
            >
              {text}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Skiper9;
