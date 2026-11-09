'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Coffee, Laptop, Moon } from 'lucide-react';
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa6';
import { SiSpotify } from 'react-icons/si';
import { cn } from '@/lib/utils';
import { FadeIn } from './MotionWrapper';
import { LinkPreview } from './link-preview';

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl?: string;
  songUrl: string;
}

const DEFAULT_TRACK: SpotifyTrack = {
  isPlaying: false,
  title: 'Baawra',
  artist: 'Kushagra, Tanishk Bagchi',
  album: 'Baawra',
  songUrl: 'https://open.spotify.com/search/Baawra',
};

function formatLastOnline(timestamp: number | null): string {
  if (!timestamp) return 'recently';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `yesterday at ${timeStr}`;
  }
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Widgets() {
  const [spotify, setSpotify] = useState<SpotifyTrack>(DEFAULT_TRACK);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<number | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    // 1. Optimized Spotify API polling (visibility-aware, zero wasteful background calls)
    async function fetchSpotify() {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        return;
      }
      try {
        const res = await fetch('/api/spotify');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.title) {
            setSpotify(data);
          }
        }
      } catch {
        // Keep fallback
      }
    }

    fetchSpotify();
    // 30s interval when visible
    const spotifyInterval = setInterval(fetchSpotify, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchSpotify();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 2. Real-time Device Online / Offline Firestore listener on analytics/device
    let latestLastSeen = 0;
    let unsubscribe = () => {};
    try {
      const docRef = doc(db, 'analytics', 'device');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (isMounted && snap.exists()) {
            const data = snap.data();
            latestLastSeen = typeof data.lastSeen === 'number' ? data.lastSeen : 0;
            const online = Boolean(latestLastSeen && Date.now() - latestLastSeen < 60 * 1000);
            setIsOnline(online);
            setLastSeen(latestLastSeen || null);
            setRelativeTime(formatLastOnline(latestLastSeen));
          }
        },
        () => {}
      );
    } catch {}

    // Periodic check every 5s to refresh relative time & update online/offline threshold
    const checkInterval = setInterval(() => {
      if (isMounted && latestLastSeen > 0) {
        const online = Date.now() - latestLastSeen < 60 * 1000;
        setIsOnline(online);
        setRelativeTime(formatLastOnline(latestLastSeen));
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(spotifyInterval);
      clearInterval(checkInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      unsubscribe();
    };
  }, []);

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      href: 'https://github.com/sayandeep0212',
      color: 'hover:border-[#333]/50 hover:text-black dark:hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      href: 'https://www.linkedin.com/in/sayandeep0212/',
      color: 'hover:border-[#0077b5]/50 hover:text-[#0077b5]',
    },
    {
      name: 'Twitter/X',
      icon: FaXTwitter,
      href: 'https://x.com/sayandeep0212',
      color: 'hover:border-[#1da1f2]/50 hover:text-[#1da1f2]',
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      href: 'https://www.instagram.com/sayandeep0212/',
      color: 'hover:border-[#e1306c]/50 hover:text-[#e1306c]',
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      href: 'https://www.youtube.com/@SayandeepPradhan',
      color: 'hover:border-[#ff0000]/50 hover:text-[#ff0000]',
    },
    {
      name: 'Medium',
      icon: FaMedium,
      href: 'https://medium.com/@sayandeep0212',
      color: 'hover:border-emerald-500/50 hover:text-emerald-500',
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      href: 'https://www.facebook.com/PradhanSayandeep',
      color: 'hover:border-[#1877F2]/50 hover:text-[#1877F2]',
      title: 'Facebook',
    },
  ];

  return (
    <section className="pt-6 pb-4">
      <FadeIn>
        {/* Top 2 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Real-time Spotify Card */}
          <a
            href={spotify.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer"
            title={`Listen to ${spotify.title} on Spotify`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Spotify Icon / Album Art */}
              {spotify.albumImageUrl ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
                  <Image
                    src={spotify.albumImageUrl}
                    alt={spotify.album || spotify.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                  <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#1db954] flex items-center justify-center text-white shadow-sm">
                    <SiSpotify className="w-2 h-2 fill-current" />
                  </div>
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#1db954] flex items-center justify-center text-white shrink-0">
                  <SiSpotify className="w-5 h-5 fill-current" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[10px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
                  <span>{spotify.isPlaying ? 'NOW PLAYING' : 'RECENTLY PLAYED'}</span>
                  {spotify.isPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <div className="font-serif text-lg font-normal text-gray-900 dark:text-white leading-tight truncate max-w-[210px] group-hover:text-[#1db954] transition-colors">
                  {spotify.title}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-sans truncate max-w-[210px]">
                  {spotify.artist}
                </div>
              </div>
            </div>

            {/* Sound Wave Bars */}
            <div className="flex items-end gap-1 h-4 pr-1 shrink-0">
              <span
                className={`w-0.5 bg-[#1db954] rounded-full sound-bar ${!spotify.isPlaying ? 'pause-anim' : ''}`}
                style={{ animationDelay: '0.1s' }}
              />
              <span
                className={`w-0.5 bg-[#1db954] rounded-full sound-bar ${!spotify.isPlaying ? 'pause-anim' : ''}`}
                style={{ animationDelay: '0.3s' }}
              />
              <span
                className={`w-0.5 bg-[#1db954] rounded-full sound-bar ${!spotify.isPlaying ? 'pause-anim' : ''}`}
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className={`w-0.5 bg-[#1db954] rounded-full sound-bar ${!spotify.isPlaying ? 'pause-anim' : ''}`}
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </a>

          {/* Dynamic Online / Offline Card connected to Laptop Power State */}
          <div
            title={
              isOnline
                ? 'Device is active and online'
                : lastSeen
                ? `Last seen online: ${new Date(lastSeen).toLocaleString()}`
                : 'Device is offline'
            }
            className={cn(
              'flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-[#13171f] border transition-all duration-300',
              isOnline
                ? 'border-gray-100 dark:border-gray-800/80 hover:border-emerald-200 dark:hover:border-emerald-900/60'
                : 'border-gray-100 dark:border-gray-800/60 opacity-85 hover:border-gray-200 dark:hover:border-gray-700'
            )}
          >
            <div
              className={cn(
                'w-9 h-9 rounded-lg border flex items-center justify-center transition-colors',
                isOnline
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700/60 text-gray-400 dark:text-gray-500'
              )}
            >
              {isOnline ? <Laptop className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-serif text-lg font-normal text-gray-900 dark:text-white flex items-center gap-2">
                {isOnline ? 'Online' : 'Offline'}
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full inline-block transition-all',
                    isOnline
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse-dot'
                      : 'bg-gray-400 dark:bg-gray-600'
                  )}
                />
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                {isOnline
                  ? 'Active on laptop · Available for projects'
                  : `Last online ${relativeTime || 'recently'} · Leave a message`}
              </div>
            </div>
          </div>
        </div>

        {/* Let's connect Section */}
        <div className="mt-8">
          <h3 className="font-serif text-2xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Let’s connect
          </h3>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              const isHttp = item.href.startsWith('http') && item.href !== '#';
              const baseClass =
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-normal border border-gray-100 dark:border-gray-800 transition-all group';

              return isHttp ? (
                <LinkPreview
                  key={item.name}
                  url={item.href}
                  title={(item as any).title || item.name}
                  dottedUnderline={false}
                  className={cn(baseClass, item.color)}
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:scale-105 transition-transform group-hover:text-current" />
                  <span className="font-sans">{item.name}</span>
                </LinkPreview>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  title={(item as any).title || item.name}
                  target={item.href === '#' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={cn(baseClass, item.color)}
                >
                  <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:scale-105 transition-transform group-hover:text-current" />
                  <span className="font-sans">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
