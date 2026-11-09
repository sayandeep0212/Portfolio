'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ScratchAvatarProps {
  coverImage?: string;
  revealedImage?: string;
  threshold?: number; // 0.3 = 30%
  brushSize?: number;
  className?: string;
}

const STORAGE_KEY = 'sayandeep_avatar_scratched_v1';

export default function ScratchAvatar({
  coverImage = '/assets/avatar.webp',
  revealedImage = '/assets/sayandeep.avif',
  threshold = 0.3,
  brushSize = 22,
  className = '',
}: ScratchAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [hasScratchedOnce, setHasScratchedOnce] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // 1. Hydration & LocalStorage persistence
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setIsRevealed(true);
      }
    } catch {}
  }, []);

  // 2. Initialize Canvas with the Cover Image
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width) || 128;
    const height = Math.round(rect.height) || 128;

    // Support High-DPI / Retina displays for sharp pixel rendering
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = coverImage;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    };
  }, [coverImage, isRevealed]);

  useEffect(() => {
    if (mounted && !isRevealed) {
      initCanvas();
    }
  }, [mounted, isRevealed, initCanvas]);

  // Window resize observer
  useEffect(() => {
    if (!containerRef.current || isRevealed) return;
    const observer = new ResizeObserver(() => {
      if (!isRevealed) initCanvas();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [initCanvas, isRevealed]);

  // 3. Calculate Scratched Area Percentage
  const checkScratchedPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const stride = 32; // Sample every 8th pixel (4 * 8 bytes) for fast performance
      let transparentPixels = 0;
      let totalSamples = 0;

      for (let i = 3; i < data.length; i += stride) {
        totalSamples++;
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const ratio = transparentPixels / totalSamples;

      // When 30% or more is scratched, fully reveal and persist to localStorage
      if (ratio >= threshold) {
        setIsRevealed(true);
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {}
      }
    } catch {}
  }, [threshold, isRevealed]);

  // 4. Scratch drawing logic
  const getCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return null;

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const scratch = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas || isRevealed) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (lastPos) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x * dpr, lastPos.y * dpr);
        ctx.lineTo(x * dpr, y * dpr);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, (brushSize / 2) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      setLastPos({ x, y });
      if (!hasScratchedOnce) setHasScratchedOnce(true);
      checkScratchedPercentage();
    },
    [brushSize, lastPos, isRevealed, hasScratchedOnce, checkScratchedPercentage]
  );

  // Mouse & Touch event handlers
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    setIsScratching(true);
    const coords = getCoords(e);
    if (coords) scratch(coords.x, coords.y);
  };

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isScratching || isRevealed) return;
      if ('touches' in e && e.cancelable) e.preventDefault();
      const coords = getCoords(e);
      if (coords) scratch(coords.x, coords.y);
    },
    [isScratching, isRevealed, getCoords, scratch]
  );

  const handleEnd = useCallback(() => {
    setIsScratching(false);
    setLastPos(null);
    checkScratchedPercentage();
  }, [checkScratchedPercentage]);

  useEffect(() => {
    if (!isScratching) return;

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isScratching, handleMove, handleEnd]);

  // Optional reset handler (can be triggered to re-experience the scratch)
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsRevealed(false);
    setHasScratchedOnce(false);
    setTimeout(initCanvas, 50);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden rounded-xl ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Bottom Layer: Real Photograph (/assets/sayandeep.avif) */}
      <div className="absolute inset-0 w-full h-full bg-[#1c1a24]">
        <Image
          src={revealedImage}
          alt="Sayandeep Pradhan"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
        />
      </div>

      {/* Top Layer: Scratch Canvas (Cover Image /assets/avatar.webp) */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className="absolute inset-0 w-full h-full z-10 cursor-crosshair transition-opacity duration-500"
          style={{
            touchAction: 'none',
          }}
        />
      )}

      {/* Interactive Hint: Appears only before first scratch and if not revealed */}
      {!isRevealed && !hasScratchedOnce && mounted && (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-1.5 inset-x-1.5 z-20 pointer-events-none flex items-center justify-center"
        >
          <div className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium text-white shadow-lg flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#00c0e8] animate-pulse" />
            <span>Scratch me</span>
          </div>
        </motion.div>
      )}

      {/* Subtle Reset Button (Visible only when revealed, on hover) */}
      {isRevealed && (
        <button
          onClick={handleReset}
          title="Reset scratch card"
          className="absolute top-1 right-1 z-20 p-1 rounded-full bg-black/50 hover:bg-black/80 text-white/70 hover:text-white transition-opacity opacity-0 hover:opacity-100 group-hover:opacity-100 backdrop-blur-xs"
          aria-label="Reset scratch"
        >
          <RotateCcw className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

