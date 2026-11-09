'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { FaMedium } from 'react-icons/fa6';
import { FadeIn } from './MotionWrapper';
import { LinkPreview } from './link-preview';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_BLOGS, BlogDoc } from '@/lib/portfolio-db';

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogDoc[]>(DEFAULT_BLOGS);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as BlogDoc[];
          setBlogs(list);
        }
      },
      (err) => {
        console.warn('Blogs Firestore snapshot error, using defaults:', err);
      }
    );
    return () => unsub();
  }, []);

  const featured = blogs[0] || DEFAULT_BLOGS[0];

  return (
    <section id="blogs" className="pt-10 pb-6">
      <FadeIn>
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-1.5">
              Blogs
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-sans">
              Technical articles, guides, and engineering notes.
            </p>
          </div>
          <Link
            href="/blogs"
            className="text-xs sm:text-sm font-mono text-[#007f99] dark:text-[#38bdf8] hover:underline flex items-center gap-1 group pb-1"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Post Card */}
        <article className="p-6 sm:p-7 rounded-2xl bg-white/70 dark:bg-[#10131a]/70 border border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-3">
              {featured.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.date}
                </span>
              )}
              {featured.readTime && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featured.readTime}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] border border-emerald-500/20">
              <FaMedium className="w-3 h-3" />
              <span>{featured.platform || 'Article'}</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-[26px] font-normal text-gray-900 dark:text-white leading-snug">
            <LinkPreview
              url={featured.href}
              title={featured.title}
              className="hover:text-[#00c0e8] transition-colors"
            >
              {featured.title}
            </LinkPreview>
          </h3>

          {featured.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
              {featured.summary}
            </p>
          )}

          {/* Tags */}
          {featured.tags && featured.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-gray-100 dark:bg-[#151924] text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-800/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/80">
            <LinkPreview
              url={featured.href}
              title={`Read on ${featured.platform || 'Medium'}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-[#007f99] dark:text-[#38bdf8] hover:underline font-medium"
            >
              <span>Read on {featured.platform || 'Medium'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </LinkPreview>

            <Link
              href="/blogs"
              className="text-xs font-mono text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View in dedicated page →
            </Link>
          </div>
        </article>
      </FadeIn>
    </section>
  );
}
