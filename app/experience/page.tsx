'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_EXPERIENCE, ExperienceDoc } from '@/lib/portfolio-db';

interface FullExperienceItem {
  id?: string;
  role: string;
  org: string;
  period: string;
  location: string;
  logo: string;
  summary?: string;
  bullets: string[];
  skills: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<FullExperienceItem[]>(() =>
    DEFAULT_EXPERIENCE.map((exp) => ({
      id: exp.id,
      role: exp.role,
      org: exp.org,
      period: exp.period,
      location: exp.location || 'Kolkata, India',
      logo: exp.logo || '/assets/exp-gameliminals.webp',
      summary: exp.bullets[0] || 'Leadership and engineering impact.',
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
          const formatted: FullExperienceItem[] = list.map((exp) => ({
            id: exp.id,
            role: exp.role,
            org: exp.org,
            period: exp.period || '',
            location: exp.location || 'India',
            logo: exp.logo || '/assets/exp-gameliminals.webp',
            summary: exp.bullets?.[0] || 'Professional and technical contributions.',
            bullets: exp.bullets || [],
            skills: exp.skills || [],
          }));
          setExperiences(formatted);
        }
      },
      (err) => {
        console.warn('ExperiencePage Firestore snapshot error, using defaults:', err);
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
        {/* Breadcrumb / Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Experience & Roles
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
            A comprehensive overview of my leadership roles, technical responsibilities, and contributions across organizations and developer communities.
          </p>
        </div>

        {/* Full Experience Timeline Cards */}
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id || idx}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-700/80 shrink-0 shadow-sm flex items-center justify-center">
                    {exp.logo ? (
                      <img
                        src={exp.logo}
                        alt={exp.org}
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <Briefcase className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                      {exp.org}
                    </h2>
                    <p className="text-sm font-medium text-[#007f99] dark:text-[#38bdf8] font-sans mt-0.5">
                      {exp.role}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end gap-2 text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 font-sans leading-relaxed border-t border-gray-100 dark:border-gray-800/80 pt-4">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <span className="text-[#00c0e8] mt-0.5 select-none">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Skills / Tech */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
