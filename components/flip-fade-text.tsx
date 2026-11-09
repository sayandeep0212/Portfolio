'use client';

import React, { useEffect, useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FlipFadeTextProps {
  /**
   * Array of words or phrases to cycle through
   * @default ["STEP THROUGH THE GATE.", "WELCOME TO MY WORLD."]
   */
  words?: string[];
  /**
   * Interval between word changes in milliseconds
   * @default 2200
   */
  interval?: number;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Additional CSS classes for the text
   */
  textClassName?: string;
  /**
   * Animation duration for each letter in seconds
   * @default 0.5
   */
  letterDuration?: number;
  /**
   * Stagger delay between letters on enter in seconds
   * @default 0.035
   */
  staggerDelay?: number;
  /**
   * Stagger delay between letters on exit in seconds
   * @default 0.02
   */
  exitStaggerDelay?: number;
  /**
   * Whether to loop continuously. When false, calls onComplete after last phrase.
   * @default true
   */
  loop?: boolean;
  /**
   * Callback fired when last phrase completes (only when loop is false)
   */
  onComplete?: () => void;
}

const defaultWords = [
  'STEP THROUGH THE GATE.',
  'WELCOME TO MY WORLD.',
];

// Memoized Letter component for 3D perspective flip
const Letter = memo(function Letter({
  char,
  letterDuration,
}: {
  char: string;
  letterDuration: number;
}) {
  return (
    <motion.span
      style={{ transformStyle: 'preserve-3d' }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: 'blur(8px)',
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -20,
          opacity: 0,
          filter: 'blur(8px)',
          transition: {
            duration: letterDuration * 0.65,
            ease: 'easeIn',
          },
        },
      }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
});

// Memoized Word component matching the reference screenshot typography
const Word = memo(function Word({
  text,
  staggerDelay,
  exitStaggerDelay,
  letterDuration,
  textClassName,
}: {
  text: string;
  staggerDelay: number;
  exitStaggerDelay: number;
  letterDuration: number;
  textClassName?: string;
}) {
  const wordsList = useMemo(() => text.split(' '), [text]);

  return (
    <motion.div
      className={cn(
        'flex flex-wrap justify-center gap-x-[0.38em] text-3xl sm:text-5xl md:text-6xl font-sans font-bold uppercase tracking-[0.16em] text-white',
        textClassName
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {wordsList.map((w, wIdx) => (
        <span key={`${w}-${wIdx}`} className="inline-flex">
          {w.split('').map((char, i) => (
            <Letter
              key={`${char}-${i}`}
              char={char}
              letterDuration={letterDuration}
            />
          ))}
        </span>
      ))}
    </motion.div>
  );
});

export function FlipFadeText({
  words = defaultWords,
  interval = 2200,
  className,
  textClassName,
  letterDuration = 0.5,
  staggerDelay = 0.035,
  exitStaggerDelay = 0.02,
  loop = true,
  onComplete,
}: FlipFadeTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const isLast = index === words.length - 1;

    const timer = setTimeout(() => {
      if (isLast && !loop) {
        onComplete?.();
      } else {
        setIndex((prev) => (prev + 1) % words.length);
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [index, interval, loop, onComplete, words.length]);

  const currentWord = useMemo(() => words[index], [words, index]);

  return (
    <div className={cn('flex items-center justify-center min-h-[140px]', className)}>
      <div
        className="relative flex items-center justify-center text-center px-4"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence mode="wait">
          <Word
            key={currentWord}
            text={currentWord}
            staggerDelay={staggerDelay}
            exitStaggerDelay={exitStaggerDelay}
            letterDuration={letterDuration}
            textClassName={textClassName}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlipFadeText;
