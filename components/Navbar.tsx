'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatedThemeToggler } from '@/registry/magicui/animated-theme-toggler';
import { SocialStories, type Story } from '@/components/ui/social-stories';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_STORIES, StoryDoc } from '@/lib/portfolio-db';

const NAVBAR_STORIES: Story[] = DEFAULT_STORIES.map((s, idx) => ({
  id: s.id || String(idx + 1),
  platform: (s.platform === 'linkedin' || s.platform === 'instagram' ? s.platform : 'instagram') as 'linkedin' | 'instagram',
  mediaUrl: s.mediaUrl,
  linkUrl: s.linkUrl,
  caption: s.caption || s.storyName,
  duration: s.duration || 6,
}));

const NAVBAR_PROFILE = {
  name: 'Sayandeep Pradhan',
  avatarUrl: '/assets/avatar.webp',
};

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>(NAVBAR_STORIES);

  // Real-time listener for stories from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'stories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as StoryDoc[];
          list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
          const formatted: Story[] = list
            .filter((s) => Boolean(s.mediaUrl))
            .map((s, idx) => ({
              id: s.id || String(idx + 1),
              platform: (String(s.platform || 'instagram').toLowerCase() === 'linkedin' ? 'linkedin' : 'instagram') as 'linkedin' | 'instagram',
              mediaUrl: s.mediaUrl,
              linkUrl: s.linkUrl || '',
              caption: s.caption || s.storyName || 'Story',
              duration: Number(s.duration) || 6,
            }));
          if (formatted.length > 0) {
            setStories(formatted);
          } else {
            setStories(NAVBAR_STORIES);
          }
        } else {
          setStories(NAVBAR_STORIES);
        }
      },
      (err) => {
        console.warn('Navbar stories Firestore listener error, using defaults:', err);
      }
    );
    return () => unsub();
  }, []);


  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'blogs'];
      const scrollY = window.scrollY;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 140;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: pathname === '/' ? '#home' : '/', id: 'home' },
    { name: 'Experience', href: pathname === '/' ? '#experience' : '/experience', id: 'experience' },
    { name: 'Projects', href: pathname === '/' ? '#projects' : '/projects', id: 'projects' },
    { name: 'Blogs', href: pathname === '/' ? '#blogs' : '/blogs', id: 'blogs' },
    { name: 'Gallery', href: '/gallery', id: 'gallery' },
  ];

  const isLinkActive = (id: string, href: string) => {
    if (pathname === '/blogs' && id === 'blogs') return true;
    if (pathname === '/gallery' && id === 'gallery') return true;
    if (pathname === '/experience' && id === 'experience') return true;
    if (pathname === '/projects' && id === 'projects') return true;
    if (pathname === '/' && activeSection === id) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-[#0b0d11]/85 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/60 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand with Interactive Social Stories Avatar */}
        <div className="flex items-center gap-3">
          <SocialStories
            stories={stories}
            profile={NAVBAR_PROFILE}
            triggerClassName="w-8 h-8 sm:w-9 sm:h-9"
          />
          <Link href="/" className="group flex items-center">
            <span className="font-script text-2xl sm:text-[28px] font-normal tracking-tight text-gray-900 dark:text-white transition-opacity group-hover:opacity-85">
              Sayandeep
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id, link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative text-[14px] font-sans transition-colors py-1 ${
                  active
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gray-900 dark:bg-white rounded-full transition-all" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler
            variant="square"
            aria-label="Toggle Theme"
            suppressHydrationWarning
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors flex items-center justify-center [&_svg]:w-4 [&_svg]:h-4 cursor-pointer"
          />

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            suppressHydrationWarning
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#0b0d11]/95 backdrop-blur-md px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id, link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-sans py-1.5 transition-colors ${
                  active
                    ? 'text-[#00c0e8] font-medium'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
