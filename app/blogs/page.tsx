'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar, ExternalLink } from 'lucide-react';
import { FaMedium } from 'react-icons/fa6';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import { LinkPreview } from '@/components/link-preview';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_BLOGS, BlogDoc } from '@/lib/portfolio-db';

export default function BlogsPage() {
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
        console.warn('BlogsPage Firestore snapshot error, using defaults:', err);
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
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00c0e8] mb-2 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Technical Insights & Engineering Notes</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Blogs & Articles
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
            Technical guides, architectures, and engineering deep dives published on Medium and tech platforms.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="space-y-6">
          {blogs.map((post, idx) => (
            <article
              key={post.id || idx}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-3">
                  {post.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                  )}
                  {post.readTime && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] border border-emerald-500/20">
                  <FaMedium className="w-3 h-3" />
                  <span>{post.platform || 'Medium'}</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-[26px] font-normal text-gray-900 dark:text-white leading-snug">
                <LinkPreview
                  url={post.href}
                  title={post.title}
                  className="hover:text-[#00c0e8] transition-colors"
                >
                  {post.title}
                </LinkPreview>
              </h2>

              {post.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                  {post.summary}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-gray-100 dark:bg-[#151924] text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-800/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                <LinkPreview
                  url={post.href}
                  title={`Read on ${post.platform || 'Medium'}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-[#007f99] dark:text-[#38bdf8] hover:underline font-medium"
                >
                  <span>Read on {post.platform || 'Medium'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </LinkPreview>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
