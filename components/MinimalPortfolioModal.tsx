'use client';

import React, { useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Mail, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { ChanhDaiMark } from './chanhdai-mark';
import {
  Foldable,
  FoldableCover,
  FoldableInsideLeft,
  FoldableInsideRight,
  FoldableStage,
  SpreadHalf,
} from './foldable';

const PROFILE = {
  displayName: 'Sayandeep Pradhan',
  jobTitle: 'Tech Lead & Full Stack Developer',
  bio: 'Creating with code. Tech Lead @ GameLiminals. Building scalable platforms, AI tools, and fluid interfaces.',
  address: 'Kolkata, India',
  avatar: '/assets/avatar.webp',
  github: 'https://github.com/sayandeep0212',
  twitter: 'https://x.com/sayandeep0212',
  facebook: 'https://www.facebook.com/PradhanSayandeep',
  linkedin: 'https://www.linkedin.com/in/sayandeep0212/',
  email: 'sayandeep0212@gmail.com',
};

const EXPERIENCES = [
  {
    org: 'GameLiminals',
    role: 'Tech Lead & Full Stack Dev',
    date: 'Dec 2025 – Present',
  },
  {
    org: 'Google',
    role: 'Google Student Ambassador',
    date: 'Jun 2026 – Present',
  },
  {
    org: 'eDC IIT Delhi',
    role: 'Student Ambassador',
    date: 'Dec 2025 – Feb 2026',
  },
];

const HIGHLIGHTS = [
  {
    title: 'Git & GitHub Explained with Relationship Example',
    date: 'Jun 19, 2024',
    href: 'https://medium.com/@sayandeep0212/git-and-github-explained-easily-commands-github-tips-account-setup-and-ci-cd-with-a-3bda0c21aad6',
  },
  {
    title: 'VibeForge 1.0 Hackathon Platform',
    date: 'vibeforge-1-0.tech',
    href: 'https://vibeforge-1-0.tech',
  },
  {
    title: 'Brief AI — Morning Executive Briefing',
    date: 'brief.co.in',
    href: 'https://brief.co.in',
  },
];

interface MinimalPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MinimalPortfolioModal({
  isOpen,
  onClose,
}: MinimalPortfolioModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Glassy Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
          />

          {/* Fixed Floating Close Button */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-md cursor-pointer group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-3xl flex flex-col items-center my-auto"
          >
            {/* Foldable Component System */}
            <Foldable className="[--foldable-radius:--spacing(6)]">
              {/* A container one page wide: sizes follow the page, not the screen. */}
              <FoldableStage className="@container/foldable">
                <FoldableInsideRight>
                  <SpreadHalf side="right">
                    <InnerView />
                  </SpreadHalf>
                </FoldableInsideRight>
                <FoldableCover>
                  <OuterView />
                </FoldableCover>
                <FoldableInsideLeft>
                  <SpreadHalf side="left">
                    <InnerView />
                  </SpreadHalf>
                </FoldableInsideLeft>
              </FoldableStage>
            </Foldable>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Front view when booklet is closed: uses LIGHT MODE banner */
function OuterView() {
  return (
    <div className="flex size-full flex-col bg-white dark:bg-[#111520] text-gray-900 dark:text-gray-100">
      <Cover mode="light" />
      <Profile className="px-[6.25cqw] pt-1">
        <Bio className="@max-xs/foldable:hidden" />
      </Profile>
      <SocialRow className="px-[6.25cqw] pt-2" />
      <ExperiencePreview
        items={EXPERIENCES.slice(0, 2)}
        className="mt-auto px-[6.25cqw] pb-[6.25cqw] @max-xs/foldable:pt-2 @max-xs/foldable:[&_li:nth-child(n+2)]:hidden @max-xs/foldable:[&>p]:hidden"
      />
    </div>
  );
}

/** Two-page unified inner view when booklet is open: uses DARK/NIGHT MODE banner */
function InnerView() {
  return (
    <div className="flex size-full flex-col bg-white dark:bg-[#121622] text-gray-900 dark:text-gray-100">
      {/* Spans both pages like a wallpaper across the crease with dark/night mode banner */}
      <Cover mode="dark" />
      <div className="grid flex-1 grid-cols-2">
        {/* Left Page: Profile, Bio, Location & Socials */}
        <Profile className="px-[6.25cqw] pt-1 flex flex-col justify-between pb-[6.25cqw]">
          <div>
            <Bio />
            <p className="text-xs text-muted-foreground @max-xs/foldable:hidden flex items-center gap-1 font-mono mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#00c0e8]" />
              {PROFILE.address}
            </p>
          </div>
          <SocialGrid className="pt-2 border-t border-gray-100 dark:border-gray-800" />
        </Profile>

        {/* Right Page: Experience In Short & Featured Highlights */}
        <div className="px-[6.25cqw] pt-[3cqw] pb-[6.25cqw] flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                Experience
              </p>
              <span className="text-[9px] font-mono text-[#007f99] dark:text-[#38bdf8] bg-[#00c0e8]/10 px-1.5 py-0.5 rounded">
                Click card to fold
              </span>
            </div>
            <ul className="border-b border-gray-100 dark:border-gray-800 space-y-1.5 pb-2">
              {EXPERIENCES.map((exp) => (
                <li
                  key={exp.org}
                  className="flex flex-col gap-0.5 border-t border-gray-100 dark:border-gray-800/60 py-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="truncate text-gray-900 dark:text-white">
                      {exp.org}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
                      {exp.date}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#007f99] dark:text-[#38bdf8]">
                    {exp.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 pt-2">
            <p className="mb-1.5 font-mono text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
              Featured
            </p>
            <ul className="space-y-1">
              {HIGHLIGHTS.map((h) => (
                <li key={h.title} className="text-xs">
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-[#00c0e8] group"
                  >
                    <span className="truncate max-w-[150px]">{h.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Cover component: renders light mode banner when folded, dark mode banner when unfolded */
function Cover({ mode = 'dark' }: { mode?: 'light' | 'dark' }) {
  const bannerSrc =
    mode === 'light'
      ? '/assets/hero-banner-light.webp'
      : '/assets/hero-banner-dark.webp';

  return (
    <div className="relative flex h-[35cqw] shrink-0 items-center justify-center border-b border-gray-100 dark:border-gray-800 overflow-hidden bg-gray-900">
      <Image
        src={bannerSrc}
        alt={`${mode} mode banner`}
        fill
        className="object-cover"
        sizes="360px"
        priority
      />
      <div
        className={cn(
          'absolute inset-0',
          mode === 'light'
            ? 'bg-gradient-to-t from-black/40 via-transparent to-black/10'
            : 'bg-gradient-to-t from-black/80 via-black/30 to-black/20'
        )}
      />
      <ChanhDaiMark className="relative z-10 h-[10cqw] w-[20cqw]" />
    </div>
  );
}

/** Profile component: Avatar is positioned prominently in FRONT of the banner with negative top margin and high z-index */
function Profile({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn('relative z-20 flex flex-col gap-2.5 @max-xs/foldable:gap-2', className)}
    >
      {/* Avatar positioned in front of banner overlapping bottom edge */}
      <div className="relative z-30 -mt-[calc(max(2.75rem,22cqw)/2)] inline-block w-fit">
        <img
          className="size-[max(2.75rem,22cqw)] rounded-full border-4 border-white dark:border-[#121622] object-cover shadow-2xl relative z-30 @max-xs/foldable:border-2 ring-2 ring-black/5 dark:ring-white/10"
          src={PROFILE.avatar}
          alt={PROFILE.displayName}
          draggable={false}
        />
      </div>
      <div>
        <p className="text-lg sm:text-xl font-medium tracking-tight @max-xs/foldable:text-base text-gray-900 dark:text-white">
          {PROFILE.displayName}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 @max-xs/foldable:text-xs">
          {PROFILE.jobTitle}
        </p>
      </div>
      {children}
    </div>
  );
}

function Bio({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'text-xs text-balance text-gray-600 dark:text-gray-300 @max-xs/foldable:text-xs leading-relaxed',
        className
      )}
    >
      {PROFILE.bio}
    </p>
  );
}

function SocialRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-xs relative z-20', className)}>
      <a
        href={PROFILE.github}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:text-black dark:hover:text-white transition-colors"
        title="GitHub"
      >
        <FaGithub className="w-3.5 h-3.5" />
      </a>
      <a
        href={PROFILE.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:text-[#0077b5] transition-colors"
        title="LinkedIn"
      >
        <FaLinkedinIn className="w-3.5 h-3.5" />
      </a>
      <a
        href={PROFILE.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:text-[#1da1f2] transition-colors"
        title="Twitter/X"
      >
        <FaXTwitter className="w-3.5 h-3.5" />
      </a>
      <a
        href={PROFILE.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:text-[#1877F2] transition-colors"
        title="Facebook"
      >
        <FaFacebookF className="w-3.5 h-3.5" />
      </a>
      <a
        href={`mailto:${PROFILE.email}`}
        className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:text-[#00c0e8] transition-colors"
        title="Email"
      >
        <Mail className="w-3.5 h-3.5 text-red-500" />
      </a>
      <span className="text-[10px] font-mono text-gray-400 ml-auto">
        Click card to unfold
      </span>
    </div>
  );
}

function SocialGrid({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-1.5 relative z-20', className)}>
      <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Connect
      </p>
      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:text-black dark:hover:text-white border border-gray-100 dark:border-gray-800 truncate"
        >
          <FaGithub className="w-3 h-3 shrink-0" />
          <span className="truncate">GitHub</span>
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:text-[#0077b5] border border-gray-100 dark:border-gray-800 truncate"
        >
          <FaLinkedinIn className="w-3 h-3 shrink-0 text-[#0077b5]" />
          <span className="truncate">LinkedIn</span>
        </a>
        <a
          href={PROFILE.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:text-[#1da1f2] border border-gray-100 dark:border-gray-800 truncate"
        >
          <FaXTwitter className="w-3 h-3 shrink-0 text-[#1da1f2]" />
          <span className="truncate">Twitter</span>
        </a>
        <a
          href={PROFILE.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:text-[#1877F2] border border-gray-100 dark:border-gray-800 truncate"
        >
          <FaFacebookF className="w-3 h-3 shrink-0 text-[#1877F2]" />
          <span className="truncate">Facebook</span>
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="flex items-center gap-1.5 p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/60 hover:text-[#00c0e8] border border-gray-100 dark:border-gray-800 truncate"
        >
          <Mail className="w-3 h-3 shrink-0 text-red-500" />
          <span className="truncate">Email</span>
        </a>
      </div>
    </div>
  );
}

function ExperiencePreview({
  items,
  className,
}: {
  items: typeof EXPERIENCES;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 font-mono text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Latest Experience
      </p>
      <ul className="border-b border-gray-100 dark:border-gray-800">
        {items.map((item) => (
          <li
            key={item.org}
            className="flex flex-col gap-0.5 border-t border-gray-100 dark:border-gray-800/60 py-1.5"
          >
            <span className="truncate text-xs font-medium text-gray-800 dark:text-gray-200">
              {item.org}
            </span>
            <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 tabular-nums">
              {item.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
