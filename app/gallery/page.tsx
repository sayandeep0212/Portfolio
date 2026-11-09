'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, Sparkles, MapPin, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_GALLERY, GalleryDoc } from '@/lib/portfolio-db';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryDoc[]>(DEFAULT_GALLERY);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as GalleryDoc[];
          setGalleryItems(list);
        }
      },
      (err) => {
        console.warn('GalleryPage Firestore snapshot error, using defaults:', err);
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
            <Camera className="w-3.5 h-3.5" />
            <span>Moments & Highlights</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Event & Community Gallery
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
            Snapshots from hackathons, Google developer events, technical workshops, and community leadership milestones.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.tag && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white">
                    {item.tag}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 dark:text-gray-500 mb-1">
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    )}
                    {item.date && item.location && <span>·</span>}
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-xl font-normal text-gray-900 dark:text-white leading-snug">
                    {item.title}
                  </h2>
                  {item.desc && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
