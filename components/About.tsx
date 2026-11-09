'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from './MotionWrapper';
import { LinkPreview } from './link-preview';

export default function About() {
  return (
    <section id="about" className="pt-8 sm:pt-10 pb-4">
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
          About.
        </h2>
        <p className="text-[15px] sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans max-w-3xl">
          I am a Computer Science Engineering student passionate about Full Stack Development, Artificial Intelligence, Cloud Technologies and creating impactful digital products. I am the Tech Lead of{' '}
          <LinkPreview
            url="https://gameliminals.cycoders.in"
            className="text-gray-900 dark:text-white font-medium"
          >
            GameLiminals
          </LinkPreview>
          , a student-led game dev community of Adamas University, and also working as a Google Students Ambassador. I love solving problems, writing clean code, and turning ideas into real-world solutions. Always learning and exploring new technologies to grow as a developer. Anyone can reach out to me for any freelancing work!
        </p>

        <div className="mt-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#00c0e8] dark:text-[#38bdf8] hover:text-[#007f99] dark:hover:text-[#7dd3fc] font-normal text-sm group transition-colors"
          >
            <span className="underline underline-offset-4 decoration-[#00c0e8]/30 group-hover:decoration-[#00c0e8]">
              Resume
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
