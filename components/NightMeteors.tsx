'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  maxLife: number;
  life: number;
  thickness: number;
  color: string;
}

interface DustParticle {
  x: number;
  y: number;
  opacity: number;
  size: number;
  color: string;
}

interface Butterfly {
  x: number;
  y: number;
  heading: number;
  targetHeading: number;
  speed: number;
  baseSpeed: number;
  size: number;
  flapPhase: number;
  flapSpeed: number;
  wingColor: string;
  glowColor: string;
  dustTimer: number;
  turnTimer: number;
}

const NEON_BLUE_COLORS = [
  '#00c0e8', // signature cyan
  '#38bdf8', // sky neon blue
  '#60a5fa', // soft blue neon
  '#00f0ff', // electric cyan
];

const BUTTERFLY_PALETTES = [
  { wing: 'rgba(0, 240, 255, 0.75)', glow: '#00f0ff' },
  { wing: 'rgba(56, 189, 248, 0.8)', glow: '#38bdf8' },
  { wing: 'rgba(0, 192, 232, 0.75)', glow: '#00c0e8' },
  { wing: 'rgba(96, 165, 250, 0.8)', glow: '#60a5fa' },
  { wing: 'rgba(129, 140, 248, 0.75)', glow: '#818cf8' },
];

export default function NightMeteors() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Monitor theme changes on <html class="dark">
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
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
    // Only animate in dark mode and if reduced motion is not preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isDarkMode || prefersReducedMotion) {
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
    let spawnTimeoutId: NodeJS.Timeout | null = null;
    let isTabVisible = !document.hidden;

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
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 1. Meteors State
    const activeMeteors: Meteor[] = [];

    const spawnSingleMeteor = () => {
      const angle = (35 + Math.random() * 8) * (Math.PI / 180);
      const speed = 7 + Math.random() * 5;
      const length = 55 + Math.random() * 45;
      const thickness = 1.1 + Math.random() * 0.7;
      const color = NEON_BLUE_COLORS[Math.floor(Math.random() * NEON_BLUE_COLORS.length)];

      const startX = Math.random() * (width * 0.85) - 40;
      const startY = Math.random() * (height * 0.45) - 30;

      activeMeteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        opacity: 0,
        maxLife: Math.floor(45 + Math.random() * 25),
        life: 0,
        thickness,
        color,
      });
    };

    const triggerMeteorBurst = () => {
      if (!isTabVisible) {
        scheduleNextBurst();
        return;
      }

      // 3 to 5 meteors per burst
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const delay = i * (220 + Math.random() * 300);
        setTimeout(() => {
          if (isDarkMode && isTabVisible) {
            spawnSingleMeteor();
          }
        }, delay);
      }

      scheduleNextBurst();
    };

    const scheduleNextBurst = () => {
      const interval = 4800 + Math.random() * 800; // ~5 seconds
      spawnTimeoutId = setTimeout(triggerMeteorBurst, interval);
    };

    spawnTimeoutId = setTimeout(triggerMeteorBurst, 1400);

    // 2. Neon Blue Butterflies State
    const activeButterflies: Butterfly[] = [];
    const activeDust: DustParticle[] = [];

    const butterflyCount = window.innerWidth < 640 ? 3 : 5;
    for (let i = 0; i < butterflyCount; i++) {
      const palette = BUTTERFLY_PALETTES[i % BUTTERFLY_PALETTES.length];
      const initialHeading = Math.random() * Math.PI * 2;
      const baseSpeed = 0.8 + Math.random() * 0.6;

      activeButterflies.push({
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height * 0.8) + 50,
        heading: initialHeading,
        targetHeading: initialHeading,
        speed: baseSpeed,
        baseSpeed,
        size: 9 + Math.random() * 4, // small, delicate 9-13px
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.16 + Math.random() * 0.08,
        wingColor: palette.wing,
        glowColor: palette.glow,
        dustTimer: 0,
        turnTimer: Math.floor(30 + Math.random() * 60),
      });
    }

    // Helper to draw realistic small neon wings
    const drawButterflyWings = (size: number, color: string) => {
      // Forewing (larger upper wing)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.1);
      ctx.bezierCurveTo(size * 0.75, -size * 0.9, size * 1.1, -size * 0.2, 0, size * 0.1);
      ctx.fill();

      // Hindwing (smaller lower wing)
      ctx.beginPath();
      ctx.moveTo(0, size * 0.05);
      ctx.bezierCurveTo(size * 0.85, size * 0.35, size * 0.65, size * 0.8, 0, size * 0.35);
      ctx.fill();
    };

    // Animation Loop
    let lastTime = performance.now();

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isTabVisible) return;

      const delta = Math.min((now - lastTime) / 16.667, 2);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // --- A. Render Meteors ---
      for (let i = activeMeteors.length - 1; i >= 0; i--) {
        const m = activeMeteors[i];
        m.life += delta;

        const progress = m.life / m.maxLife;
        if (progress >= 1) {
          activeMeteors.splice(i, 1);
          continue;
        }

        if (progress < 0.2) {
          m.opacity = progress / 0.2;
        } else if (progress > 0.65) {
          m.opacity = (1 - progress) / 0.35;
        } else {
          m.opacity = 1;
        }

        m.x += Math.cos(m.angle) * m.speed * delta;
        m.y += Math.sin(m.angle) * m.speed * delta;

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        gradient.addColorStop(0, 'rgba(0, 192, 232, 0)');
        gradient.addColorStop(0.5, `${m.color}${Math.floor(m.opacity * 0.35 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.85, `${m.color}${Math.floor(m.opacity * 0.85 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${m.opacity * 0.95})`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.shadowColor = m.color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 0.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- B. Render Glowing Dust Trail ---
      for (let i = activeDust.length - 1; i >= 0; i--) {
        const d = activeDust[i];
        d.opacity -= 0.018 * delta;
        if (d.opacity <= 0) {
          activeDust.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 5;
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- C. Render Neon Blue Butterflies ---
      for (let i = 0; i < activeButterflies.length; i++) {
        const b = activeButterflies[i];

        // Smooth steering & wandering in different directions
        b.turnTimer -= delta;
        if (b.turnTimer <= 0) {
          b.targetHeading = Math.random() * Math.PI * 2;
          b.turnTimer = 40 + Math.random() * 80;
        }

        // Boundary reflection: steer back smoothly if near screen edges
        const margin = 70;
        if (b.x < margin) {
          b.targetHeading = 0 + (Math.random() - 0.5) * 1.2;
        } else if (b.x > width - margin) {
          b.targetHeading = Math.PI + (Math.random() - 0.5) * 1.2;
        }
        if (b.y < margin) {
          b.targetHeading = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        } else if (b.y > height - margin) {
          b.targetHeading = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
        }

        // Interpolate heading for fluid curved flight
        let diff = b.targetHeading - b.heading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        b.heading += diff * 0.04 * delta;

        // Advance position
        b.x += Math.cos(b.heading) * b.speed * delta;
        b.y += Math.sin(b.heading) * b.speed * delta;

        // Wing flap cycle
        b.flapPhase += b.flapSpeed * delta;
        const wingSpread = 0.25 + 0.75 * Math.abs(Math.sin(b.flapPhase));

        // Periodically emit a tiny glowing dust spark
        b.dustTimer += delta;
        if (b.dustTimer > 7) {
          b.dustTimer = 0;
          if (activeDust.length < 40) {
            activeDust.push({
              x: b.x + (Math.random() - 0.5) * 4,
              y: b.y + (Math.random() - 0.5) * 4,
              opacity: 0.65,
              size: 1 + Math.random() * 1.2,
              color: b.glowColor,
            });
          }
        }

        // Draw butterfly oriented towards flight heading
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.heading + Math.PI / 2);

        // Neon Glow
        ctx.shadowColor = b.glowColor;
        ctx.shadowBlur = 8;

        // Slender illuminated body
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.1, b.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left Wing
        ctx.save();
        ctx.scale(-wingSpread, 1);
        drawButterflyWings(b.size, b.wingColor);
        ctx.restore();

        // Right Wing
        ctx.save();
        ctx.scale(wingSpread, 1);
        drawButterflyWings(b.size, b.wingColor);
        ctx.restore();

        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-10 transition-opacity duration-700 ${
        isDarkMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ willChange: isDarkMode ? 'transform' : 'auto' }}
    />
  );
}
