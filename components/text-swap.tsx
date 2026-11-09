'use client';

import React, { Children, useState, useEffect, type ElementType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TextSwapProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  play?: boolean;
  interval?: number;
}

export function TextSwap({
  children,
  as: Component = motion.span,
  className,
  play = true,
  interval = 2200,
}: TextSwapProps) {
  const items = Children.toArray(children);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!play || items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [play, items.length, interval]);

  if (items.length === 0) return null;

  return (
    <Component className={cn('relative inline-flex overflow-hidden', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0, filter: 'blur(3px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(3px)' }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block whitespace-nowrap"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </Component>
  );
}

export default TextSwap;

