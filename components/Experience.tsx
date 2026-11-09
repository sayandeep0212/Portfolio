'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { FadeIn } from './MotionWrapper';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_EXPERIENCE, ExperienceDoc } from '@/lib/portfolio-db';

interface ExperienceItem {
  id?: string;
  role: string;
  org: string;
  period: string;
  logo: string;
  threshold: number;
  bullets: string[];
  skills: string[];
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.55);

  const [experiences, setExperiences] = useState<ExperienceItem[]>(() =>
    DEFAULT_EXPERIENCE.map((exp, idx) => ({
      id: exp.id,
      role: exp.role,
      org: exp.org,
      period: exp.period,
      logo: exp.logo || '/assets/exp-gameliminals.webp',
      threshold: (idx + 1) / (DEFAULT_EXPERIENCE.length + 1),
      bullets: exp.bullets,
      skills: exp.skills,
    }))
  );

  useEffect(() => {
    const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ExperienceDoc[];
          const formatted: ExperienceItem[] = list.map((exp, idx) => ({
            id: exp.id,
            role: exp.role,
            org: exp.org,
            period: exp.period,
            logo: exp.logo || '/assets/exp-gameliminals.webp',
            threshold: (idx + 1) / (list.length + 1),
            bullets: exp.bullets || [],
            skills: exp.skills || [],
          }));
          setExperiences(formatted);
        }
      },
      (err) => {
        console.warn('Experience Firestore snapshot error, using defaults:', err);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const line = activeLineRef.current;
    const bead = beadRef.current;
    if (!container || !track || !line || !bead) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 70%',
        end: 'bottom 55%',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          line.style.transform = `scaleY(${p})`;
          bead.style.transform = `translate(-50%, -50%) translateY(${p * track.offsetHeight}px)`;
          setProgress(p);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [experiences.length]);

  return (
    <section id="experience" className="pt-10 pb-6" ref={containerRef}>
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-6">
          Experience
        </h2>

        {/* Timeline Container with interactive scroll-driven bar */}
        <div className="relative pl-12 sm:pl-16">
          {/* Top Badge: Concentric blue glowing rings with Briefcase Icon */}
          <div className="absolute left-0 top-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#2563eb] dark:border-[#3b82f6] bg-[#2563eb] dark:bg-[#0c1427] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/60 dark:border-[#60a5fa]/80 flex items-center justify-center bg-[#2563eb] dark:bg-[#0d1b38]/50">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#93c5fd]" />
            </div>
          </div>

          {/* Vertical Track starting directly below top badge */}
          <div ref={trackRef} className="absolute left-[18px] sm:left-[20px] -translate-x-1/2 top-9 sm:top-10 bottom-4 w-[2.5px]">
            {/* Background Dashed Line (Inactive track) */}
            <div className="absolute inset-0 w-full border-l-2 border-dashed border-gray-300 dark:border-gray-700" />

            {/* Foreground Solid Blue Line (Active GSAP-animated progress) */}
            <div
              ref={activeLineRef}
              className="absolute inset-0 w-full bg-[#2563eb] dark:bg-[#3b82f6] origin-top shadow-[0_0_10px_rgba(37,99,235,0.9)] transition-transform duration-75"
              style={{ transform: 'scaleY(0.55)', willChange: 'transform' }}
            />

            {/* Glowing Bead at the tip of the active line */}
            <div
              ref={beadRef}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] shadow-[0_0_10px_#2563eb] z-20 pointer-events-none"
              style={{ willChange: 'transform' }}
            />
          </div>

          {/* Experience Cards */}
          <div className="space-y-10 pt-1">
            {experiences.map((exp, idx) => {
              const isActive = progress >= exp.threshold;
              return (
                <div key={exp.id || idx} className="relative group">
                  {/* Milestone Node on the vertical bar */}
                  <div
                    className={`absolute -left-[30px] sm:-left-[44px] -translate-x-1/2 top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-white dark:bg-[#0b0d11] ${
                      isActive
                        ? 'border-[#2563eb] dark:border-[#3b82f6] shadow-[0_0_10px_rgba(37,99,235,0.8)]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] transition-all duration-200" />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-gray-800/80 p-0.5 border border-gray-100 dark:border-gray-700/80 shrink-0">
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt={exp.org}
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <Briefcase className="w-5 h-5 text-gray-400 p-0.5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                          {exp.org}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-sans mt-0.5">
                          {exp.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-sans shrink-0">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mb-3 text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-[#00c0e8] select-none leading-relaxed">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* See more link opening /experience page */}
          <div className="pt-4">
            <Link
              href="/experience"
              className="inline-flex items-center gap-1 text-[#00c0e8] dark:text-[#38bdf8] hover:text-[#007f99] dark:hover:text-[#7dd3fc] font-normal text-xs group transition-colors"
            >
              <span className="underline underline-offset-4 decoration-[#00c0e8]/30 group-hover:decoration-[#00c0e8]">
                See more experience
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
