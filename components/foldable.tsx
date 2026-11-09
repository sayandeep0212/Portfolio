'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  isValidElement,
  Children,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BookOpen, BookMinus } from 'lucide-react';
import { playBookOpenSound, playBookCloseSound } from '@/lib/sounds';

interface FoldableContextValue {
  progress: number;
  setProgress: (p: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const FoldableContext = createContext<FoldableContextValue | null>(null);

export function useFoldable() {
  const ctx = useContext(FoldableContext);
  if (!ctx) {
    throw new Error('useFoldable must be used within a <Foldable>');
  }
  return ctx;
}

interface FoldableProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Foldable({ children, className, defaultOpen = false }: FoldableProps) {
  const [progress, setProgressState] = useState(defaultOpen ? 1 : 0);
  const isOpen = progress > 0.5;

  const setProgress = (p: number) => {
    setProgressState(Math.max(0, Math.min(1, p)));
  };

  const setIsOpen = (open: boolean) => {
    if (open) playBookOpenSound();
    else playBookCloseSound();
    setProgressState(open ? 1 : 0);
  };

  const toggle = () => {
    setProgressState((prev) => {
      const next = prev > 0.5 ? 0 : 1;
      if (next === 1) {
        playBookOpenSound();
      } else {
        playBookCloseSound();
      }
      return next;
    });
  };

  return (
    <FoldableContext.Provider
      value={{
        progress,
        setProgress,
        isOpen,
        setIsOpen,
        toggle,
      }}
    >
      <div
        className={cn(
          'relative flex flex-col items-center select-none w-full [--foldable-radius:1.5rem]',
          className
        )}
      >
        {children}
      </div>
    </FoldableContext.Provider>
  );
}

export function FoldableCover({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
FoldableCover.displayName = 'FoldableCover';

export function FoldableInsideLeft({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
FoldableInsideLeft.displayName = 'FoldableInsideLeft';

export function FoldableInsideRight({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
FoldableInsideRight.displayName = 'FoldableInsideRight';

/** One page's window onto the two-page inner view. */
export function SpreadHalf({
  side,
  children,
  className,
}: {
  side: 'left' | 'right';
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute inset-y-0 w-[200%]',
        side === 'left' ? 'left-0' : 'right-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function FoldableStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { progress, toggle } = useFoldable();

  // Extract the 3 compound sections from children
  let insideRight: ReactNode = null;
  let cover: ReactNode = null;
  let insideLeft: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const type = child.type as any;
    const name = type?.displayName || type?.name;
    if (type === FoldableInsideRight || name === 'FoldableInsideRight') {
      insideRight = (child.props as any).children;
    } else if (type === FoldableCover || name === 'FoldableCover') {
      cover = (child.props as any).children;
    } else if (type === FoldableInsideLeft || name === 'FoldableInsideLeft') {
      insideLeft = (child.props as any).children;
    }
  });

  // Calculate 3D rotation and translation
  // Rotation from 0 (closed) to -180deg (open)
  const rotationY = progress * -180;

  // Center shift:
  // At progress = 0: 1 page wide [0, W], visual center = +0.5W.
  // At progress = 1: 2 pages wide [-W, +W], visual center = 0.
  // Shifting the stage by `+ (progress * 50)%` keeps visual center anchored in screen center!
  const shiftPercent = progress * 50;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't toggle fold if clicking interactive links or buttons
    if (target.closest('a, button, input')) return;
    toggle();
  };

  return (
    <div className="relative w-full flex items-center justify-center py-4 overflow-visible">
      <div
        className={cn(
          'relative w-[320px] sm:w-[350px] md:w-[360px] h-[480px] sm:h-[490px] transition-transform duration-300 ease-out',
          className
        )}
        style={{
          perspective: '1400px',
          transform: `translateX(${shiftPercent}%)`,
          containerType: 'inline-size',
        }}
      >
        {/* ============================================================ */}
        {/* BASE LAYER: Inside Right Page (Fixed on the right of spine) */}
        {/* ============================================================ */}
        <div
          onClick={progress > 0.7 ? handleCardClick : undefined}
          title={progress > 0.7 ? 'Click to fold booklet' : undefined}
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-2xl overflow-hidden [container-type:inline-size]',
            progress > 0.7 ? 'cursor-pointer' : ''
          )}
          style={{
            zIndex: 1,
          }}
        >
          {insideRight}
          {/* Subtle crease shadow on spine (left edge) */}
          <div className="absolute inset-y-0 left-0 w-6 pointer-events-none bg-gradient-to-r from-black/20 dark:from-black/40 via-black/5 to-transparent" />
        </div>

        {/* ============================================================ */}
        {/* TURNING FLAP: Hinged at the spine (left: 0), rotates 0 -> -180 */}
        {/* ============================================================ */}
        <motion.div
          animate={{
            rotateY: rotationY,
          }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 22,
            mass: 0.8,
          }}
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '0% 50% 0',
            zIndex: progress > 0.5 ? 20 : 10,
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* FACE A: Front Cover (OuterView - Folded Situation) */}
          <div
            onClick={progress < 0.3 ? handleCardClick : undefined}
            title={progress < 0.3 ? 'Click to unfold spread' : undefined}
            className={cn(
              'absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111520] border border-gray-200/80 dark:border-gray-800/80 shadow-2xl overflow-hidden [container-type:inline-size]',
              progress < 0.3 ? 'cursor-pointer' : ''
            )}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {cover}

            {/* Dynamic shading during fold */}
            <div
              className="absolute inset-0 pointer-events-none bg-black transition-opacity"
              style={{
                opacity: Math.sin(progress * Math.PI) * 0.3,
              }}
            />
          </div>

          {/* FACE B: Inside Left (SpreadHalf side="left" - Unfolded Situation) */}
          <div
            onClick={progress > 0.7 ? handleCardClick : undefined}
            title={progress > 0.7 ? 'Click to fold booklet' : undefined}
            className={cn(
              'absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-2xl overflow-hidden [container-type:inline-size]',
              progress > 0.7 ? 'cursor-pointer' : ''
            )}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {insideLeft}

            {/* Dynamic crease shadow on spine (right edge when flipped) */}
            <div className="absolute inset-y-0 right-0 w-6 pointer-events-none bg-gradient-to-l from-black/20 dark:from-black/40 via-black/5 to-transparent" />

            {/* Dynamic shading during fold */}
            <div
              className="absolute inset-0 pointer-events-none bg-black transition-opacity"
              style={{
                opacity: Math.sin(progress * Math.PI) * 0.3,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function FoldableSlider({ className }: { className?: string }) {
  const { progress, setProgress, toggle, isOpen } = useFoldable();

  return (
    <div
      className={cn(
        'w-full max-w-[320px] sm:max-w-[420px] mx-auto mt-6 flex flex-col items-center gap-3',
        className
      )}
    >
      {/* Scrubber Track */}
      <div className="w-full flex items-center gap-3 bg-white/80 dark:bg-[#121622]/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
        <button
          onClick={toggle}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isOpen ? 'Click to fold booklet' : 'Click to unfold spread'}
          aria-label={isOpen ? 'Click to fold booklet' : 'Click to unfold spread'}
        >
          {isOpen ? <BookMinus className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => setProgress(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00c0e8]"
        />

        <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 min-w-[36px] text-right tabular-nums">
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={toggle}
        className="text-xs font-mono text-[#007f99] dark:text-[#38bdf8] hover:underline flex items-center gap-1.5"
      >
        <span>{isOpen ? 'Click card to fold booklet' : 'Click card to unfold spread'}</span>
      </button>
    </div>
  );
}
