'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react';
import { Globe, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { POP_IN_VARIANT, SPRING_CONFIG } from '@/lib/motion-config';
import { DottedUnderline, type DottedUnderlineProps } from './dotted-underline';

export type LinkPreviewDottedUnderline = DottedUnderlineProps & {
  paddingBottom?: string;
};

export type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
  title?: string;
  'aria-label'?: string;
  dottedUnderline?: LinkPreviewDottedUnderline | false;
} & (
  { isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never }
);

// Global active preview coordinator: guarantees strictly ONE preview instance can EVER be open on the screen
let currentActiveId: string | null = null;
const globalListeners = new Set<(activeId: string | null) => void>();
let globalCloseTimer: NodeJS.Timeout | null = null;

function setGlobalActiveId(id: string | null) {
  if (globalCloseTimer) {
    clearTimeout(globalCloseTimer);
    globalCloseTimer = null;
  }
  currentActiveId = id;
  globalListeners.forEach((listener) => listener(id));
}

function scheduleGlobalClose(id: string, delay = 100) {
  if (globalCloseTimer) clearTimeout(globalCloseTimer);
  globalCloseTimer = setTimeout(() => {
    if (currentActiveId === id) {
      setGlobalActiveId(null);
    }
  }, delay);
}

export const LinkPreview = ({
  children,
  url,
  className,
  width = 280,
  height = 175,
  isStatic = false,
  imageSrc = '',
  title,
  'aria-label': ariaLabel,
  dottedUnderline,
}: LinkPreviewProps) => {
  const instanceId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [engine, setEngine] = useState<'primary' | 'fallback' | 'failed'>('primary');
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const triggerRef = useRef<HTMLAnchorElement>(null);

  // Subscribe to global active preview coordinator
  useEffect(() => {
    setIsMounted(true);

    const onGlobalChange = (activeId: string | null) => {
      const shouldBeOpen = activeId === instanceId;
      setIsOpen(shouldBeOpen);
      if (!shouldBeOpen) {
        setCoords(null);
        setImgLoaded(false);
        setEngine('primary');
      }
    };

    globalListeners.add(onGlobalChange);
    return () => {
      globalListeners.delete(onGlobalChange);
    };
  }, [instanceId]);

  const domain = useMemo(() => {
    try {
      const u = new URL(url);
      return u.hostname.replace('www.', '') + (u.pathname !== '/' && u.pathname.length < 25 ? u.pathname : '');
    } catch {
      return url;
    }
  }, [url]);

  // High-reliability live website preview screenshot engines
  const previewSrc = useMemo(() => {
    if (!isOpen) return '';
    if (isStatic && imageSrc) return imageSrc;

    const encoded = encodeURIComponent(url);

    // Primary: WordPress mShots (fast, CDN-backed, highly reliable for all websites)
    if (engine === 'primary') {
      return `https://s0.wp.com/mshots/v1/${encoded}?w=800`;
    }

    // Fallback: Microlink API screenshot
    if (engine === 'fallback') {
      return `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`;
    }

    return '';
  }, [isOpen, isStatic, imageSrc, engine, url]);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const previewWidth = width;
    const previewHeight = height;

    let targetX = rect.left + rect.width / 2 - previewWidth / 2;
    targetX = Math.max(12, Math.min(targetX, window.innerWidth - previewWidth - 12));

    let targetY = rect.top - previewHeight - 16;
    if (targetY < 10) {
      targetY = rect.bottom + 12;
    }

    setCoords({ x: targetX, y: targetY });
  }, [width, height]);

  const handleMouseEnter = () => {
    // Instantly switch active preview to this specific component instance
    updatePosition();
    setImgLoaded(false);
    setEngine('primary');
    setGlobalActiveId(instanceId);
  };

  const handleMouseLeave = () => {
    scheduleGlobalClose(instanceId, 100);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!triggerRef.current) return;
    const targetRect = triggerRef.current.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  const underlineConfig =
    dottedUnderline && typeof dottedUnderline === 'object'
      ? dottedUnderline
      : {};
  const showDottedUnderline = dottedUnderline !== false;
  const {
    dotRadius = 1,
    patternWidth = 6,
    patternHeight = 4,
    height: underlineHeight = 4,
    color: underlineColor,
    className: underlineClassName,
    paddingBottom: underlinePaddingBottom = '0.05rem',
  } = underlineConfig;

  return (
    <>
      <a
        ref={triggerRef}
        href={url}
        title={title}
        aria-label={ariaLabel || title}
        target={url.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={cn(
          'group relative transition-colors',
          !className && 'inline-block text-gray-900 dark:text-gray-100 hover:text-[#00c0e8] dark:hover:text-[#00c0e8]',
          className
        )}
      >
        {showDottedUnderline ? (
          <span
            className="relative inline-block"
            style={{ paddingBottom: underlinePaddingBottom }}
          >
            {children}
            <DottedUnderline
              dotRadius={dotRadius}
              patternWidth={patternWidth}
              patternHeight={patternHeight}
              height={underlineHeight}
              color={underlineColor}
              className={underlineClassName}
            />
          </span>
        ) : (
          children
        )}
      </a>

      {isMounted &&
        createPortal(
          <AnimatePresence mode="wait">
            {isOpen && coords !== null && (
              <div
                className="fixed z-50 pointer-events-auto"
                style={{
                  left: coords.x,
                  top: coords.y,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  variants={POP_IN_VARIANT}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={SPRING_CONFIG}
                  className="rounded-2xl shadow-2xl p-1 bg-white/95 dark:bg-[#121622]/95 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 overflow-hidden"
                  style={{
                    x: translateX,
                    width: width + 8,
                  }}
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden bg-gray-100 dark:bg-[#161b26] relative select-none group/preview"
                    style={{
                      width,
                      height,
                    }}
                  >
                    {/* 1. Loading Skeleton / Shimmer */}
                    {!imgLoaded && engine !== 'failed' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gray-50 dark:bg-[#131722] animate-pulse">
                        <Globe className="w-5 h-5 text-[#00c0e8] mb-1.5 animate-spin" />
                        <span className="text-[11px] font-mono text-gray-600 dark:text-gray-300 truncate max-w-[90%]">
                          {domain}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">Loading preview...</span>
                      </div>
                    )}

                    {/* 2. Fallback Card if engines fail */}
                    {engine === 'failed' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#131722] dark:to-[#0d1017]">
                        <div className="w-10 h-10 rounded-xl bg-[#00c0e8]/10 flex items-center justify-center mb-2 text-[#00c0e8]">
                          <Globe className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-medium text-gray-800 dark:text-gray-200 truncate max-w-full px-2">
                          {domain}
                        </span>
                        <div className="flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-[10px] text-gray-600 dark:text-gray-300">
                          <span>Visit website</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    )}

                    {/* 3. Actual Live Website Screenshot with unique key per URL */}
                    {previewSrc && engine !== 'failed' && (
                      <img
                        key={`${url}-${engine}`}
                        src={previewSrc}
                        alt={domain}
                        width={width}
                        height={height}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => {
                          if (engine === 'primary') {
                            setEngine('fallback');
                            setImgLoaded(false);
                          } else {
                            setEngine('failed');
                            setImgLoaded(false);
                          }
                        }}
                        className={cn(
                          'w-full h-full object-cover object-top transition-all duration-300 group-hover/preview:scale-105',
                          imgLoaded ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    )}

                    {/* 4. Frosted Bottom Bar with Domain and External Link */}
                    <div className="absolute bottom-0 inset-x-0 px-2.5 py-1.5 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-white text-[10px] font-mono">
                      <span className="truncate max-w-[190px]">{domain}</span>
                      <div className="flex items-center gap-1 text-[#00c0e8]">
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </a>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
