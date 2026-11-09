'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import { LinkPreview } from '@/components/link-preview';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_PROJECTS, ProjectDoc } from '@/lib/portfolio-db';

interface FullProjectItem {
  id?: string;
  title: string;
  category: string;
  period: string;
  context: string;
  href?: string;
  github?: string;
  desc: string;
  tech: string[];
}

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<FullProjectItem[]>(() =>
    DEFAULT_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.status || 'Full Stack & Software',
      period: p.period,
      context: p.context || (p.href ? (p.href.replace(/^https?:\/\//, '').split('/')[0]) : 'Project'),
      href: p.href,
      github: p.github,
      desc: p.desc,
      tech: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : (p.tech ? p.tech.split('·').map(s => s.trim()) : ['React', 'Next.js']),
    }))
  );

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ProjectDoc[];
          const formatted: FullProjectItem[] = docs.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.status || 'Full Stack & Software',
            period: p.period || '',
            context: p.context || (p.href ? (p.href.replace(/^https?:\/\//, '').split('/')[0]) : 'Project'),
            href: p.href,
            github: p.github,
            desc: p.desc,
            tech: Array.isArray(p.tags) && p.tags.length > 0
              ? p.tags
              : (p.tech ? p.tech.split(/[·,]/).map(s => s.trim()).filter(Boolean) : ['Next.js']),
          }));
          setProjectsList(formatted);
        }
      },
      (err) => {
        console.warn('ProjectsPage Firestore snapshot error, using defaults:', err);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0d11] text-gray-900 dark:text-gray-100 flex flex-col selection:bg-[#00c0e8]/20 selection:text-[#007f99]">
      <AutumnLeaves />
      <NightMeteors />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Back to Home button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00c0e8] mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Portfolio Work</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Projects & Open Source
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
            A comprehensive catalog of applications, web ecosystems, and open source desktop utilities I’ve engineered and deployed.
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-8">
          {projectsList.map((p, idx) => {
            const linkUrl = p.href || p.github;

            return (
              <div
                key={p.id || idx}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#007f99] dark:text-[#38bdf8] font-medium">
                      {p.category}
                    </span>
                    <h2 className="font-serif text-2xl font-normal text-gray-900 dark:text-white mt-0.5">
                      {linkUrl ? (
                        <LinkPreview url={linkUrl} className="hover:text-[#00c0e8]">
                          {p.title}
                        </LinkPreview>
                      ) : (
                        <span>{p.title}</span>
                      )}
                    </h2>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-sans mt-0.5">
                      {p.context} {p.period ? `· ${p.period}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Only show website button if p.href is provided */}
                    {p.href && (
                      <LinkPreview
                        url={p.href}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 hover:text-[#00c0e8] transition-colors"
                        title={`Live website for ${p.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </LinkPreview>
                    )}

                    {/* Only show github button if p.github is provided */}
                    {p.github && (
                      <LinkPreview
                        url={p.github}
                        className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </LinkPreview>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                  {p.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800/80">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
