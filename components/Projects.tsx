'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Code2 } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { FadeIn } from './MotionWrapper';
import { LinkPreview } from './link-preview';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_PROJECTS, ProjectDoc } from '@/lib/portfolio-db';

interface ProjectItem {
  id?: string;
  title: string;
  period: string;
  context: string;
  href?: string;
  github?: string;
  threshold: number;
  desc: string;
  credits: string;
  tech: string;
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.4);

  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() =>
    DEFAULT_PROJECTS.map((p, idx) => ({
      id: p.id,
      title: p.title,
      period: p.period,
      context: p.context || (p.href ? new URL(p.href).hostname : 'Project'),
      href: p.href,
      github: p.github,
      threshold: (idx + 1) / (DEFAULT_PROJECTS.length + 1),
      desc: p.desc,
      credits: p.developersName || 'Developed by Sayandeep Pradhan',
      tech: p.tech,
    }))
  );

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ProjectDoc[];
          const formatted: ProjectItem[] = docs.map((p, idx) => ({
            id: p.id,
            title: p.title,
            period: p.period || '',
            context: p.context || (p.href ? (p.href.replace(/^https?:\/\//, '').split('/')[0]) : 'Project'),
            href: p.href,
            github: p.github,
            threshold: (idx + 1) / (docs.length + 1),
            desc: p.desc,
            credits: p.developersName || 'Developed by Sayandeep Pradhan',
            tech: p.tech,
          }));
          setProjectsList(formatted);
        }
      },
      (err) => {
        console.warn('Projects Firestore snapshot error, using defaults:', err);
      }
    );
    return () => unsubscribe();
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
  }, [projectsList.length]);


  return (
    <section id="projects" className="pt-10 pb-6" ref={containerRef}>
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-1.5">
          Projects
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-sans mb-6">
          Selected work across web platforms, AI and desktop experiences.
        </p>

        {/* Timeline Container with interactive scroll-driven bar */}
        <div className="relative pl-12 sm:pl-16">
          {/* Top Badge: Concentric blue glowing rings with Code Icon matching reference design */}
          <div className="absolute left-0 top-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#2563eb] dark:border-[#3b82f6] bg-[#2563eb] dark:bg-[#0c1427] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)] z-20">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/60 dark:border-[#60a5fa]/80 flex items-center justify-center bg-[#2563eb] dark:bg-[#0d1b38]/50">
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white dark:text-[#93c5fd]" />
            </div>
          </div>

          {/* Vertical Track starting directly below top badge */}
          <div ref={trackRef} className="absolute left-[18px] sm:left-[20px] -translate-x-1/2 top-9 sm:top-10 bottom-4 w-[2.5px]">
            {/* Background Dashed Line (Inactive track) */}
            <div className="absolute inset-0 w-full border-l-2 border-dashed border-gray-300 dark:border-gray-700" />

            {/* Foreground Solid Blue Line (Active GSAP-animated progress) */}
            <div
              ref={activeLineRef}
              className="absolute inset-0 w-full bg-[#2563eb] dark:bg-[#3b82f6] origin-top shadow-[0_0_10px_rgba(59,130,246,0.9)] transition-transform duration-75"
              style={{ transform: 'scaleY(0.4)', willChange: 'transform' }}
            />

            {/* Glowing Bead at the tip of the active line */}
            <div
              ref={beadRef}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] shadow-[0_0_10px_#2563eb] z-20 pointer-events-none"
              style={{ willChange: 'transform' }}
            />
          </div>

          {/* Project Items */}
          <div className="space-y-8 pt-1">
            {projectsList.map((p, idx) => {
              const isActive = progress >= p.threshold;
              const linkUrl = p.href || p.github;

              return (
                <div
                  key={idx}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  {/* Milestone Node on the vertical bar (EXACTLY MATCHING UPLOADED REFERENCE) */}
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

                  {/* Left Column (Meta & Title) */}
                  <div className="md:col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      {linkUrl ? (
                        <>
                          <LinkPreview
                            url={linkUrl}
                            title={p.title}
                            className="font-serif text-lg sm:text-xl font-normal text-gray-900 dark:text-white leading-tight hover:text-[#00c0e8] transition-colors"
                          >
                            {p.title}
                          </LinkPreview>
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00c0e8] transition-colors"
                            aria-label={`Open ${p.title}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <span className="font-serif text-lg sm:text-xl font-normal text-gray-900 dark:text-white leading-tight">
                          {p.title}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                      {p.context}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                      {p.period}
                    </div>
                  </div>

                  {/* Right Column (Details) */}
                  <div className="md:col-span-8 space-y-2">
                    <p className="text-xs sm:text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                      {p.desc}
                    </p>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                      {p.credits}
                    </div>
                    <div className="text-xs text-[#007f99] dark:text-[#38bdf8] font-sans">
                      <span className="text-gray-400 dark:text-gray-500 mr-1 font-normal">Built with</span>
                      <span className="font-normal">{p.tech}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* See more link opening /projects page */}
          <div className="pt-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-[#00c0e8] dark:text-[#38bdf8] hover:text-[#007f99] dark:hover:text-[#7dd3fc] font-normal text-xs group transition-colors"
            >
              <span className="font-medium underline underline-offset-4 decoration-[#00c0e8]/30 group-hover:decoration-[#00c0e8]">
                See more projects
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ml-0.5 inline-block" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
