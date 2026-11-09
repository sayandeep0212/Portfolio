'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface DottedUnderlineProps {
  dotRadius?: number;
  patternWidth?: number;
  patternHeight?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function DottedUnderline({
  dotRadius = 1,
  patternWidth = 5,
  patternHeight = 3,
  height = 3,
  color = 'currentColor',
  className,
}: DottedUnderlineProps) {
  const patternId = React.useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        'absolute left-0 bottom-0 w-full pointer-events-none text-gray-400 dark:text-gray-500',
        className
      )}
      height={height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <pattern
          id={patternId}
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={dotRadius}
            cy={dotRadius}
            r={dotRadius}
            fill={color === 'currentColor' ? 'currentColor' : color}
          />
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}

export default DottedUnderline;

