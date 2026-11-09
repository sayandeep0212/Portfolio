'use client';

import React from 'react';
import Image from 'next/image';
import { FadeIn } from './MotionWrapper';

export default function Education() {
  const educationList = [
    {
      institution: 'Adamas University',
      qualification: 'Bachelor of Technology - BTech, Computer Science',
      period: 'Aug 2025 – Jun 2029',
      logo: '/assets/edu-adamas.webp',
    },
    {
      institution: 'Kandapasara D.P. High School',
      qualification: 'High School Diploma, Pure Science',
      period: 'Jan 2017 – May 2025',
      logo: '/assets/edu-school.webp',
    },
  ];

  return (
    <section className="pt-10 pb-6">
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-6">
          Education
        </h2>

        {/* Content list without blue line */}
        <div className="relative space-y-3.5">
          {educationList.map((edu, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-10 h-10 rounded-lg bg-white dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-700/60 shrink-0 flex items-center justify-center">
                  <Image
                    src={edu.logo}
                    alt={edu.institution}
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-gray-900 dark:text-white leading-snug">
                    {edu.institution}
                  </h3>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                    {edu.qualification}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500 font-sans shrink-0 hidden sm:block">
                {edu.period}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
