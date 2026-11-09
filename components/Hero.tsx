'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, usePageInView } from 'motion/react';
import { gsap } from '@/lib/gsap';
import { TextSwap } from '@/components/text-swap';
import ViewCounter from '@/components/ViewCounter';
import ScratchAvatar from '@/components/ScratchAvatar';

const WORDS = ['Developer', 'Designer', 'Creator', 'Builder'];

export function TextSwapDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isPageInView = usePageInView();
  const isInView = useInView(ref);
  const play = isPageInView && isInView;

  return (
    <div
      ref={ref}
      className="flex items-center gap-1.5 text-sm sm:text-base md:text-[17px] font-medium text-gray-500 dark:text-gray-400"
    >
      <span>I am a</span>
      <span className="inline-grid">
        {/* Placeholder for the tallest word */}
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
        <TextSwap
          as={motion.span}
          className="col-start-1 row-start-1 text-gray-900 dark:text-white font-semibold"
          play={play}
        >
          {WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </TextSwap>
      </span>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (bannerRef.current) {
        tl.fromTo(
          bannerRef.current,
          { opacity: 0, y: 16, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 }
        );
      }

      if (avatarRef.current) {
        tl.fromTo(
          avatarRef.current,
          { opacity: 0, scale: 0.85, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
          '-=0.45'
        );
      }

      if (textRef.current) {
        const textElements = textRef.current.children;
        tl.fromTo(
          textElements,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.35'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="home" className="pt-3 sm:pt-5 pb-2">
      {/* Panoramic Banner - 4-Way Masked: Upper, Down, Left, and Right edges blend seamlessly into background */}
      <div
        ref={bannerRef}
        className="relative w-full aspect-[2.8/1] min-h-[160px] sm:min-h-[220px] md:min-h-[270px] overflow-hidden rounded-2xl sm:rounded-[22px]"
        style={{
          willChange: 'opacity, transform',
          // Symmetrical 4-way masking for both light and dark modes
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.8) 7%, black 12%, black 88%, rgba(0, 0, 0, 0.8) 93%, rgba(0, 0, 0, 0.3) 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.8) 7%, black 12%, black 88%, rgba(0, 0, 0, 0.8) 93%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.8) 7%, black 12%, black 88%, rgba(0, 0, 0, 0.8) 93%, rgba(0, 0, 0, 0.3) 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 3%, rgba(0, 0, 0, 0.8) 7%, black 12%, black 88%, rgba(0, 0, 0, 0.8) 93%, rgba(0, 0, 0, 0.3) 97%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Light Mode Banner (Daytime Cherry Blossom Torii Shrine) */}
          <Image
            src="/assets/hero-banner-light.webp"
            alt="Daytime Pixel Art Cherry Blossom Torii Shrine"
            fill
            priority
            className="object-cover banner-light dark:hidden"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          {/* Dark Mode Banner (Nighttime Torii Gate with Moon and Glowing Lanterns) */}
          <Image
            src="/assets/hero-banner-dark.webp"
            alt="Nighttime Pixel Art Torii Gate with Glowing Lanterns"
            fill
            priority
            className="object-cover banner-dark hidden dark:block"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />

          {/* Symmetrical 4-way edge feather gradients to guarantee seamless blending in light & dark mode */}
          {/* Top edge */}
          <div className="absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-white via-white/60 to-transparent dark:from-[#0b0d11] dark:via-[#0b0d11]/60 dark:to-transparent pointer-events-none z-10" />
          {/* Bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#0b0d11] dark:via-[#0b0d11]/60 dark:to-transparent pointer-events-none z-10" />
          {/* Left edge */}
          <div className="absolute inset-y-0 left-0 w-8 sm:w-14 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-[#0b0d11] dark:via-[#0b0d11]/60 dark:to-transparent pointer-events-none z-10" />
          {/* Right edge */}
          <div className="absolute inset-y-0 right-0 w-8 sm:w-14 bg-gradient-to-l from-white via-white/60 to-transparent dark:from-[#0b0d11] dark:via-[#0b0d11]/60 dark:to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Profile Header Row - Profile picture overlapping ~26%, Name & Bio cleanly placed below banner */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3.5 sm:gap-5 px-3 sm:px-6 relative z-10">
        <div className="flex items-start gap-3.5 sm:gap-5">
          {/* Interactive Scratch Avatar Box with Crisp White Border */}
          <div
            ref={avatarRef}
            className="-mt-7 sm:-mt-8 md:-mt-9 relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-[#735b75] p-1 shadow-md border-[3px] border-white shrink-0 overflow-hidden group"
            style={{ willChange: 'opacity, transform' }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#1c1a24]">
              <ScratchAvatar
                coverImage="/assets/avatar.webp"
                revealedImage="/assets/sayandeep.avif"
                threshold={0.3}
                brushSize={24}
              />
            </div>
          </div>

          {/* Identity & Tagline - Sitting below the banner bottom edge */}
          <div ref={textRef} className="pt-2 sm:pt-3 md:pt-4">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-normal tracking-tight text-gray-900 dark:text-white leading-tight">
              Sayandeep Pradhan
            </h1>

            {/* Animated TextSwap Bio */}
            <div className="mt-1 flex flex-col gap-0.5">
              <TextSwapDemo />
              <p className="text-xs sm:text-sm md:text-[14px] text-gray-500 dark:text-gray-400 font-sans font-normal">
                20, West Bengal, IND
              </p>
            </div>
          </div>
        </div>

        {/* Live Portfolio Viewers Count - Placed under the banner and right side based */}
        <div className="self-end sm:self-auto sm:ml-auto pt-1 sm:pt-4 flex items-center justify-end">
          <ViewCounter />
        </div>
      </div>
    </section>
  );
}
