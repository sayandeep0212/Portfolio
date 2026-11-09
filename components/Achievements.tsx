'use client';

import React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { FadeIn } from './MotionWrapper';

export default function Achievements() {
  return (
    <section id="achievements" className="pt-10 pb-6">
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-1.5">
          Achievements
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-sans mb-6">
          Recognition and awards won in hackathons, project displays, and design competitions.
        </p>

        {/* 2x2 Grid without blue line */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00c0e8]/10 flex items-center justify-center shrink-0">
                    <Image
                      src="/assets/icons/trophy.svg"
                      alt="Trophy"
                      width={15}
                      height={15}
                    />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-gray-900 dark:text-white">
                    1st Place — AU Gamedev Nova 2k25
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                  Team: Noctrail Interactives
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans mb-4">
                  Our game, &quot;Echoes: The Curse,&quot; won the top spot with its thrilling storyline and engaging gameplay, built using the Godot engine.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500 font-sans border-t border-gray-100 dark:border-gray-800 pt-2.5">
                <span>Sayandeep (UI/Dev)</span>
                <span>Kushankur (Main Dev)</span>
                <span>Surajit (Researcher)</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00c0e8]/10 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#007f99] dark:text-[#38bdf8]" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-gray-900 dark:text-white">
                    Winner — Logo Design Competition
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                  ACM Student Chapter, Adamas University
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans mb-4">
                  Awarded the title of winner organized by the ACM Student Chapter, Adamas University, in recognition of outstanding creativity, innovation, and excellence in design.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-2.5">
                {['Design', 'Illustrator', 'Branding'].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-cyan-50/70 dark:bg-cyan-950/30 text-[#007f99] dark:text-cyan-400 border border-cyan-100/60 dark:border-cyan-900/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00c0e8]/10 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#007f99] dark:text-[#38bdf8]" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-gray-900 dark:text-white">
                    2nd Place — Inter-College Poster
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                  Theme: Quality Education
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans mb-4">
                  Secured 2nd position in the Inter-College Poster Making Competition. Later selected for the next-level competition spanning all departments.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-2.5">
                {['Poster', 'Creative', 'Selected'].map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-cyan-50/70 dark:bg-cyan-950/30 text-[#007f99] dark:text-cyan-400 border border-cyan-100/60 dark:border-cyan-900/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00c0e8]/10 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-[#007f99] dark:text-[#38bdf8]" />
                  </div>
                  <h3 className="font-serif text-xl font-normal text-gray-900 dark:text-white">
                    Google Student Ambassador
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                  The Visionary (Sapphire) Tier Completed
                </div>

                <div className="my-1">
                  <div className="font-serif text-4xl sm:text-5xl font-normal text-[#00c0e8] dark:text-[#38bdf8]">
                    1072
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    National Rank
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-2.5 text-[11px] text-gray-400 dark:text-gray-500">
                GSA National Program Recognition
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
