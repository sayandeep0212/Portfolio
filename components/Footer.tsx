'use client';

import React, { useState } from 'react';
import {
  FaXTwitter,
  FaGithub,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaFacebookF,
  FaMedium,
} from 'react-icons/fa6';
import { GitCommit, Sparkles, BookOpen } from 'lucide-react';
import { LinkPreview } from './link-preview';
import MinimalPortfolioModal from './MinimalPortfolioModal';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMinimalOpen, setIsMinimalOpen] = useState(false);

  // Dynamic commit hash from Vercel deployment or git environment fallback
  const commitHash =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
    process.env.NEXT_PUBLIC_GIT_COMMIT_HASH ||
    '7f5a9b2';

  return (
    <footer className="w-full mt-16 overflow-hidden">
      {/* 1. Atmospheric Gray Effect Area with Masked Upper Edge and Inspiration Quote */}
      <div
        className="relative w-full py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-gray-100/70 via-gray-50/40 to-transparent dark:from-[#13161f]/80 dark:via-[#0e1117]/40 dark:to-transparent"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 6%, rgba(0, 0, 0, 0.85) 14%, black 25%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 6%, rgba(0, 0, 0, 0.85) 14%, black 25%, black 100%)',
        }}
      >
        {/* Subtle radial ambient gray wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[220px] bg-gray-200/50 dark:bg-gray-800/20 blur-3xl rounded-full pointer-events-none" />

        {/* Center Quote */}
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
          <blockquote className="font-serif italic font-normal text-2xl sm:text-3xl md:text-[34px] text-[#374151] dark:text-[#d1d5db] leading-relaxed tracking-tight">
            &ldquo;The best way to predict the future, is to invent it!&rdquo;
          </blockquote>
          <div className="mt-3 font-script text-lg sm:text-xl text-[#6b7280] dark:text-[#9ca3af]">
            ~ Alan Kay
          </div>
        </div>
      </div>

      {/* 2. Technical Developer Footer Info Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12 text-gray-600 dark:text-gray-400 font-sans">
        {/* Top Header Row with Minimal Booklet Quick Trigger */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 text-xs sm:text-[13px] font-mono border-b border-gray-100 dark:border-gray-800/80">
          <div className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
            <span>
              sayandeep0212<span className="text-[#00c0e8]">.vercel.app</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMinimalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#121622] hover:bg-gray-100 dark:hover:bg-[#1a202c] hover:border-[#00c0e8]/50 text-[#007f99] dark:text-[#38bdf8] transition-all text-xs font-mono shadow-sm group"
            >
              <Sparkles className="w-3 h-3 text-[#00c0e8]" />
              <span className="underline decoration-dotted decoration-[#00c0e8]/40 group-hover:decoration-[#00c0e8]">
                see the portfolio in short or minimal
              </span>
              <BookOpen className="w-3 h-3" />
            </button>

            <span className="hidden md:inline text-gray-400 dark:text-gray-500">
              designed in the browser, shipped from kolkata.
            </span>
          </div>
        </div>

        {/* 3-Column Technical Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-7 gap-x-8 py-8 text-xs sm:text-[13px] border-b border-gray-100 dark:border-gray-800/80">
          {/* Row 1 / Col 1: Crafted by */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              crafted by
            </div>
            <div>
              <LinkPreview
                url="https://github.com/sayandeep0212"
                className="text-gray-900 dark:text-gray-200"
              >
                @sayandeep0212
              </LinkPreview>
            </div>
          </div>

          {/* Row 1 / Col 2: Build (GitHub Commit Hash Log) */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              build
            </div>
            <div>
              <LinkPreview
                url={`https://github.com/sayandeep0212/Portfolio/commit/${commitHash}`}
                title={`View commit ${commitHash} on GitHub`}
                className="inline-flex items-center gap-1.5 font-mono text-gray-900 dark:text-gray-200 hover:text-[#00c0e8] transition-colors"
              >
                <GitCommit className="w-3.5 h-3.5 text-[#00c0e8]" />
                <span>{commitHash}</span>
              </LinkPreview>
            </div>
          </div>

          {/* Row 1 / Col 3: Date */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              date
            </div>
            <div className="font-mono text-gray-900 dark:text-gray-200">
              2026-11-04
            </div>
          </div>

          {/* Row 2 / Col 1: Stack */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              stack
            </div>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
              next · react · tailwindcss · gsap
            </div>
          </div>

          {/* Row 2 / Col 2: Typeface */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              typeface
            </div>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
              Instrument Serif · Instrument Sans
            </div>
          </div>

          {/* Row 2 / Col 3: Contact */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              contact
            </div>
            <div>
              <a
                href="mailto:sayandeep0212@gmail.com"
                className="text-gray-900 dark:text-gray-200 border-b border-dotted border-gray-400 dark:border-gray-600 hover:border-gray-900 dark:hover:white transition-colors"
              >
                sayandeep0212@gmail.com
              </a>
            </div>
          </div>

          {/* Row 3 / Col 1: Based in */}
          <div className="space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              based in
            </div>
            <div className="text-gray-800 dark:text-gray-200">
              Kolkata, IN
            </div>
          </div>

          {/* Row 3 / Col 2 & 3: Inspired by */}
          <div className="sm:col-span-2 space-y-1">
            <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase font-mono tracking-wider">
              inspired by
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-800 dark:text-gray-200 font-mono text-xs">
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">01</span>
                <LinkPreview url="https://chanhdai.com">chanhdai.com</LinkPreview>
              </span>
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">02</span>
                <LinkPreview url="https://samworks.vercel.app/">samworks.vercel.app</LinkPreview>
              </span>
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">03</span>
                <LinkPreview url="https://ramx.in">ramx.in</LinkPreview>
              </span>
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">04</span>
                <LinkPreview url="https://manuarora.in">manuarora.in</LinkPreview>
              </span>
              <span>
                <span className="text-gray-400 dark:text-gray-500 mr-1">05</span>
                <LinkPreview url="https://subham12r.dev">subham12r.dev</LinkPreview>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Center Handwritten Signature & Thanks */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="font-script text-5xl sm:text-6xl text-gray-900 dark:text-white transform -rotate-2 select-none">
            Sayandeep
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans tracking-wide">
            thanks for visiting.
          </div>
        </div>

        {/* 4. Social Row with "follow me" Arrow Annotation */}
        <div className="flex items-center justify-between py-6">
          <div className="font-mono text-sm sm:text-base font-normal text-gray-900 dark:text-white">
            sayandeep0212
          </div>

          {/* Follow me annotation with curved arrow & rounded square icon buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[#007f99] dark:text-[#38bdf8] -translate-y-1">
              <span className="font-script text-lg">follow me</span>
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500 rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6c8 2 13 8 15 14" />
                <polyline points="13 19 19 20 20 14" />
              </svg>
            </div>

            {/* Social Buttons with LinkPreview popovers */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LinkPreview
                url="https://github.com/sayandeep0212"
                title="GitHub"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white hover:bg-[#333]/60 hover:border-[#333]/70 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaGithub className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://www.linkedin.com/in/sayandeep0212/"
                title="LinkedIn"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#0077b5] hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://x.com/sayandeep0212"
                title="Twitter/X"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#1da1f2] hover:border-[#1da1f2]/50 hover:bg-[#1da1f2]/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaXTwitter className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://www.instagram.com/sayandeep0212/"
                title="Instagram"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#e1306c] hover:border-[#e1306c]/50 hover:bg-[#e1306c]/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaInstagram className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://www.youtube.com/@SayandeepPradhan"
                title="YouTube"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#ff0000] hover:border-[#ff0000]/50 hover:bg-[#ff0000]/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaYoutube className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://www.facebook.com/PradhanSayandeep"
                title="Facebook"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaFacebookF className="w-4 h-4" />
              </LinkPreview>

              <LinkPreview
                url="https://medium.com/@sayandeep0212"
                title="Medium"
                dottedUnderline={false}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FaMedium className="w-4 h-4" />
              </LinkPreview>
            </div>
          </div>
        </div>

        {/* 5. Bottom Copyright & Metadata Links */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-mono">
          <div>
            © {currentYear} Sayandeep Pradhan. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMinimalOpen(true)}
              className="hover:text-gray-900 dark:hover:text-white transition-colors underline decoration-dotted"
            >
              minimal summary
            </button>
            <span>·</span>
            <a href="/llms.txt" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              llms.txt
            </a>
            <span>·</span>
            <a href="/agent.md" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              agent.md
            </a>
            <span>·</span>
            <a href="/robots.txt" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              robots.txt
            </a>
            <span>·</span>
            <a href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              admin
            </a>
            <span>·</span>
            <a href="https://sayandeep.dev" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              sayandeep0212.dev
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Foldable Minimal Booklet Modal */}
      <MinimalPortfolioModal
        isOpen={isMinimalOpen}
        onClose={() => setIsMinimalOpen(false)}
      />
    </footer>
  );
}
