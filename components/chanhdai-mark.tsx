import React from 'react';
import { cn } from '@/lib/utils';

export function ChanhDaiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-auto', className)}
    >
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-serif text-[28px] fill-gray-900 dark:fill-white font-normal"
        letterSpacing="2"
      >
        Sayandeep
      </text>
    </svg>
  );
}

