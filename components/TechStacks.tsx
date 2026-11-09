'use client';

import React from 'react';
import { FadeIn } from './MotionWrapper';
import { cn } from '@/lib/utils';
import { LinkPreview } from './link-preview';
import { playTapSound } from '@/lib/sounds';
import {
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiPython,
  SiFigma,
  SiFramer,
  SiThreedotjs,
  SiC,
  SiNodedotjs,
  SiFastapi,
  SiMysql,
  SiOpenapiinitiative,
  SiDocker,
  SiFirebase,
  SiSupabase,
  SiRedis,
  SiGit,
  SiGithub,
  SiCloudflare,
  SiVercel,
  SiGooglecloud,
  SiNetlify,
  SiRender,
  SiGithubactions,
  SiNpm,
  SiPostman,
  SiCursor,
  SiClaude,
  SiHuggingface,
  SiElectron,
  SiExpo,
  SiKalilinux,
  SiWireshark,
} from 'react-icons/si';
import { RiOpenaiFill } from 'react-icons/ri';
import { MdSecurity } from 'react-icons/md';

// Custom Official Oracle SQL Logo Component
function OracleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 50 32" fill="none" className={className} style={style}>
      <path
        d="M34.1917 0H15.8167C11.624 0 7.60225 1.68133 4.63605 4.68033C1.66985 7.67933 0 11.7481 0 15.9916C0 20.235 1.66119 24.3056 4.62426 27.3077C7.58734 30.3099 11.6074 32 15.8 32H34.1917C38.3843 32 42.4052 30.3143 45.3698 27.3137C48.3345 24.3131 50 20.2435 50 16C50 11.7565 48.3345 7.68688 45.3698 4.68629C42.4052 1.68571 38.3843 0 34.1917 0ZM33.7896 26.3616H16.2208C13.5414 26.3069 10.99 25.1912 9.11424 23.254C7.23845 21.3168 6.1878 18.7124 6.1878 16C6.1878 13.2876 7.23845 10.6832 9.11424 8.74602C10.99 6.8088 13.5414 5.69309 16.2208 5.63838H33.7896C36.5047 5.63838 39.1087 6.73005 41.0286 8.67323C42.9485 10.6164 44.0271 13.2519 44.0271 16C44.0271 18.7481 42.9485 21.3836 41.0286 23.3268C39.1087 25.27 36.5047 26.3616 33.7896 26.3616Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface TechItem {
  name: string;
  href: string;
  icon: React.ElementType;
  iconClass?: string;
  iconStyle?: React.CSSProperties;
}

interface TechCategory {
  title: string;
  items: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    title: 'Frontend & Languages',
    items: [
      {
        name: 'TypeScript',
        href: 'https://www.typescriptlang.org',
        icon: SiTypescript,
        iconStyle: { color: '#3178C6' },
      },
      {
        name: 'React',
        href: 'https://react.dev',
        icon: SiReact,
        iconStyle: { color: '#61DAFB' },
      },
      {
        name: 'Next.js',
        href: 'https://nextjs.org',
        icon: SiNextdotjs,
        iconClass: 'text-neutral-900 dark:text-white',
      },
      {
        name: 'Tailwind',
        href: 'https://tailwindcss.com',
        icon: SiTailwindcss,
        iconStyle: { color: '#06B6D4' },
      },
      {
        name: 'JavaScript',
        href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        icon: SiJavascript,
        iconStyle: { color: '#F7DF1E' },
      },
      {
        name: 'Python',
        href: 'https://www.python.org',
        icon: SiPython,
        iconStyle: { color: '#3776AB' },
      },
      {
        name: 'Figma',
        href: 'https://www.figma.com',
        icon: SiFigma,
        iconStyle: { color: '#F24E1E' },
      },
      {
        name: 'Motion',
        href: 'https://motion.dev',
        icon: SiFramer,
        iconClass: 'text-neutral-900 dark:text-white',
      },
      {
        name: 'Three.js',
        href: 'https://threejs.org',
        icon: SiThreedotjs,
        iconClass: 'text-neutral-900 dark:text-white',
      },
      {
        name: 'HTML',
        href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        icon: SiHtml5,
        iconStyle: { color: '#E34F26' },
      },
      {
        name: 'CSS',
        href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        icon: SiCss,
        iconStyle: { color: '#1572B6' },
      },
      {
        name: 'C',
        href: 'https://en.cppreference.com/w/c',
        icon: SiC,
        iconStyle: { color: '#659AD2' },
      },
    ],
  },
  {
    title: 'Backend, Database & Dev',
    items: [
      {
        name: 'Node.js',
        href: 'https://nodejs.org',
        icon: SiNodedotjs,
        iconStyle: { color: '#5FA04E' },
      },
      {
        name: 'FastAPI',
        href: 'https://fastapi.tiangolo.com',
        icon: SiFastapi,
        iconStyle: { color: '#059669' },
      },
      {
        name: 'MySQL',
        href: 'https://www.mysql.com',
        icon: SiMysql,
        iconStyle: { color: '#4479A1' },
      },
      {
        name: 'Oracle SQL',
        href: 'https://www.oracle.com/database/technologies/appdev/sql.html',
        icon: OracleIcon,
        iconStyle: { color: '#F80000' },
      },
      {
        name: 'OpenAPI',
        href: 'https://www.openapis.org',
        icon: SiOpenapiinitiative,
        iconStyle: { color: '#6BA539' },
      },
      {
        name: 'Docker',
        href: 'https://www.docker.com',
        icon: SiDocker,
        iconStyle: { color: '#2496ED' },
      },
      {
        name: 'Firebase',
        href: 'https://firebase.google.com',
        icon: SiFirebase,
        iconStyle: { color: '#FFCA28' },
      },
      {
        name: 'Supabase',
        href: 'https://supabase.com',
        icon: SiSupabase,
        iconStyle: { color: '#3ECF8E' },
      },
      {
        name: 'Redis',
        href: 'https://redis.io',
        icon: SiRedis,
        iconStyle: { color: '#DC382D' },
      },
      {
        name: 'Git',
        href: 'https://git-scm.com',
        icon: SiGit,
        iconStyle: { color: '#F05032' },
      },
      {
        name: 'GitHub',
        href: 'https://github.com',
        icon: SiGithub,
        iconClass: 'text-neutral-900 dark:text-white',
      },
    ],
  },
  {
    title: 'Cloud, Infrastructure & DevOps',
    items: [
      {
        name: 'Cloudflare',
        href: 'https://www.cloudflare.com',
        icon: SiCloudflare,
        iconStyle: { color: '#F38020' },
      },
      {
        name: 'Vercel',
        href: 'https://vercel.com',
        icon: SiVercel,
        iconClass: 'text-neutral-900 dark:text-white',
      },
      {
        name: 'Google Cloud',
        href: 'https://cloud.google.com',
        icon: SiGooglecloud,
        iconStyle: { color: '#4285F4' },
      },
      {
        name: 'Netlify',
        href: 'https://www.netlify.com',
        icon: SiNetlify,
        iconStyle: { color: '#00C7B7' },
      },
      {
        name: 'Render',
        href: 'https://render.com',
        icon: SiRender,
        iconStyle: { color: '#46E3B7' },
      },
      {
        name: 'CI Pipeline',
        href: 'https://github.com/features/actions',
        icon: SiGithubactions,
        iconStyle: { color: '#2088FF' },
      },
      {
        name: 'npm',
        href: 'https://www.npmjs.com',
        icon: SiNpm,
        iconStyle: { color: '#CB3837' },
      },
      {
        name: 'Postman',
        href: 'https://www.postman.com',
        icon: SiPostman,
        iconStyle: { color: '#FF6C37' },
      },
    ],
  },
  {
    title: 'AI, LLMs & Developer Tools',
    items: [
      {
        name: 'Claude',
        href: 'https://claude.ai',
        icon: SiClaude,
        iconStyle: { color: '#D97706' },
      },
      {
        name: 'OpenAI',
        href: 'https://openai.com',
        icon: RiOpenaiFill,
        iconStyle: { color: '#10A37F' },
      },
      {
        name: 'Hugging Face',
        href: 'https://huggingface.co',
        icon: SiHuggingface,
        iconStyle: { color: '#FFD21E' },
      },
      {
        name: 'Cursor',
        href: 'https://www.cursor.com',
        icon: SiCursor,
        iconClass: 'text-neutral-900 dark:text-white',
      },
    ],
  },
  {
    title: 'Cross-Platform & Mobile',
    items: [
      {
        name: 'Electron',
        href: 'https://www.electronjs.org',
        icon: SiElectron,
        iconStyle: { color: '#47848F' },
      },
      {
        name: 'Expo',
        href: 'https://expo.dev',
        icon: SiExpo,
        iconClass: 'text-neutral-900 dark:text-white',
      },
    ],
  },
  {
    title: 'Security Interests & Fields',
    items: [
      {
        name: 'Cyber Security',
        href: 'https://www.cisa.gov',
        icon: MdSecurity,
        iconStyle: { color: '#EF4444' },
      },
      {
        name: 'Ethical Hacking',
        href: 'https://www.kali.org',
        icon: SiKalilinux,
        iconStyle: { color: '#10B981' },
      },
      {
        name: 'Digital Forensics',
        href: 'https://www.wireshark.org',
        icon: SiWireshark,
        iconStyle: { color: '#0EA5E9' },
      },
    ],
  },
];

export default function TechStacks() {
  return (
    <section id="tech-stack" className="pt-10 pb-8">
      <FadeIn>
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-1.5">
            Tech Stack
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-sans">
            Technologies I work with.
          </p>
        </div>

        {/* Categorized Stack Container matching theme */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-[#10131a]/60 backdrop-blur-sm p-5 sm:p-7 shadow-sm space-y-7">
          {techCategories.map((category, catIdx) => (
            <div
              key={category.title}
              className={cn(
                'space-y-3',
                catIdx !== techCategories.length - 1 &&
                  'pb-7 border-b border-gray-100 dark:border-gray-800/60'
              )}
            >
              {/* Category Subtitle */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c0e8]" />
                <h3 className="text-xs sm:text-[13px] font-mono font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {category.title}
                </h3>
              </div>

              {/* Badges Flow with Official Docs / Website Preview */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {category.items.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <LinkPreview
                      key={`${category.title}-${tech.name}`}
                      url={tech.href}
                      title={`${tech.name} Official Website & Documentation`}
                      dottedUnderline={false}
                      className="inline-block"
                    >
                      <div
                        onMouseEnter={playTapSound}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all duration-200 group cursor-pointer select-none',
                          'bg-gray-50/90 dark:bg-[#141824]/80 text-gray-800 dark:text-gray-200',
                          'border border-gray-200/70 dark:border-gray-800/80',
                          'hover:bg-gray-100 dark:hover:bg-[#1c2232] hover:border-gray-300 dark:hover:border-gray-700',
                          'hover:scale-[1.02] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
                            tech.iconClass
                          )}
                          style={tech.iconStyle}
                        />
                        <span>{tech.name}</span>
                      </div>
                    </LinkPreview>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
