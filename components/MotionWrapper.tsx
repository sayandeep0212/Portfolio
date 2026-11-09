'use client';

import React, { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  duration?: number;
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  duration = 0.75,
}: FadeInProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;

    switch (direction) {
      case 'up':
        y = 28;
        break;
      case 'down':
        y = -28;
        break;
      case 'left':
        x = 28;
        break;
      case 'right':
        x = -28;
        break;
      default:
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x,
          y,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, direction, duration]);

  return (
    <div ref={elRef} className={className} style={{ willChange: 'opacity, transform' }}>
      {children}
    </div>
  );
}

export function MotionText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = container.querySelectorAll('.gsap-word');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordEls,
        {
          opacity: 0,
          y: 12,
          filter: 'blur(5px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.035,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 92%',
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [text]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="gsap-word inline-block mr-1.5" style={{ willChange: 'opacity, transform, filter' }}>
          {word}
        </span>
      ))}
    </span>
  );
}
