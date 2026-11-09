'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LeafParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  swayAngle: number;
  swaySpeed: number;
  swayAmp: number;
  flipAngle: number;
  flipSpeed: number;
  angle: number;
  angleSpeed: number;
  size: number;
  aspectRatio: number;
  opacity: number;
  img: HTMLImageElement;
}

const LEAF_SPRITES = [
  '/assets/leaves/leaf-1@3x.webp',
  '/assets/leaves/leaf-2@3x.webp',
  '/assets/leaves/leaf-3@3x.webp',
  '/assets/leaves/leaf-4@3x.webp',
  '/assets/leaves/leaf-5@3x.webp',
  '/assets/leaves/leaf-6@3x.webp',
  '/assets/leaves/leaf-7@3x.webp',
  '/assets/leaves/leaf-8@3x.webp',
  '/assets/leaves/leaf-9@3x.webp',
];

export default function AutumnLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Monitor theme changes on <html class="dark">
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsLightMode(!isDark);
    };

    checkTheme();

    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only animate in light mode and if user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isLightMode || prefersReducedMotion) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    // Load leaf sprite images
    const loadedImages: HTMLImageElement[] = [];
    let imagesLoadedCount = 0;

    LEAF_SPRITES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoadedCount++;
        loadedImages.push(img);
        if (imagesLoadedCount === LEAF_SPRITES.length) {
          startSimulation();
        }
      };
    });

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false; // Maintain crisp pixel-art clarity
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const particles: LeafParticle[] = [];

    const createParticle = (spawnAnywhere = false): LeafParticle => {
      const img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
      const natW = img.naturalWidth || 36;
      const natH = img.naturalHeight || 36;
      const aspectRatio = natH / (natW || 1);

      // Delicate leaf size: 10px to 17px display width
      const size = 10 + Math.random() * 7;

      let startX: number;
      let startY: number;

      if (spawnAnywhere) {
        startX = Math.random() * (width + 100) - 50;
        startY = Math.random() * height;
      } else {
        // Spawn either above viewport or to the left
        if (Math.random() < 0.65) {
          startX = Math.random() * (width + 60) - 40;
          startY = -20 - Math.random() * 30;
        } else {
          startX = -30 - Math.random() * 20;
          startY = Math.random() * (height * 0.7);
        }
      }

      return {
        x: startX,
        y: startY,
        // Gentle autumn breeze drifting from left-to-right & downward
        vx: 1.1 + Math.random() * 1.4,
        vy: 0.7 + Math.random() * 1.1,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.025,
        swayAmp: 14 + Math.random() * 22,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.015 + Math.random() * 0.03,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.025,
        size,
        aspectRatio,
        opacity: 0.75 + Math.random() * 0.22,
        img,
      };
    };

    const startSimulation = () => {
      // Responsive particle count: ~24 leaves on desktop, ~14 on mobile
      const count = window.innerWidth < 640 ? 14 : 24;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(true));
      }

      let lastTime = performance.now();

      const render = (now: number) => {
        animationFrameId = requestAnimationFrame(render);
        if (!isTabVisible) return;

        const delta = Math.min((now - lastTime) / 16.667, 2);
        lastTime = now;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Advance physics
          p.x += p.vx * delta;
          p.y += p.vy * delta;
          p.swayAngle += p.swaySpeed * delta;
          p.flipAngle += p.flipSpeed * delta;
          p.angle += p.angleSpeed * delta;

          const currentX = p.x + Math.sin(p.swayAngle) * p.swayAmp;
          const currentY = p.y;

          // Recycle particle when it exits viewport
          if (currentY > height + 30 || currentX > width + 50) {
            particles[i] = createParticle(false);
            continue;
          }

          // Draw leaf with authentic 3D flutter rotation
          ctx.save();
          ctx.translate(currentX, currentY);
          ctx.rotate(p.angle);
          // ScaleX simulates 3D tumbling fluttering through the air
          ctx.scale(Math.cos(p.flipAngle), 1);
          ctx.globalAlpha = p.opacity;

          ctx.drawImage(
            p.img,
            -p.size / 2,
            (-p.size * p.aspectRatio) / 2,
            p.size,
            p.size * p.aspectRatio
          );

          ctx.restore();
        }
      };

      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isLightMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-20 transition-opacity duration-700 ${
        isLightMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ willChange: isLightMode ? 'transform' : 'auto' }}
    />
  );
}

