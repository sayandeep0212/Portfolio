'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { FadeIn } from './MotionWrapper';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_CERTIFICATES, CertificateDoc } from '@/lib/portfolio-db';

export default function Certifications() {
  const [certs, setCerts] = useState<CertificateDoc[]>(DEFAULT_CERTIFICATES);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as CertificateDoc[];
          setCerts(list);
        }
      },
      (err) => {
        console.warn('Certifications Firestore snapshot error, using defaults:', err);
      }
    );
    return () => unsub();
  }, []);

  return (
    <section className="pt-10 pb-6">
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-6">
          Certifications
        </h2>

        {/* Content list without blue line */}
        <div className="relative space-y-4">
          {certs.map((c, idx) => (
            <div key={c.id || idx} className="flex items-center gap-3.5 group">
              <div
                className={`relative w-10 h-10 rounded-lg p-2 shrink-0 flex items-center justify-center border transition-all ${
                  c.isDarkBox
                    ? 'bg-[#171717] border-gray-900'
                    : 'bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/60'
                }`}
              >
                {c.logo ? (
                  <img
                    src={c.logo}
                    alt={c.issuer}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Award className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-gray-900 dark:text-white leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-sans">
                  {c.issuer} {c.year ? `· ${c.year}` : ''}
                </p>
              </div>
            </div>
          ))}

          {/* See more link */}
          <div className="pt-1">
            <Link
              href="/certifications"
              className="inline-flex items-center gap-1 text-[#00c0e8] dark:text-[#38bdf8] hover:text-[#007f99] dark:hover:text-[#7dd3fc] font-normal text-xs group transition-colors"
            >
              <span className="underline underline-offset-4 decoration-[#00c0e8]/30 group-hover:decoration-[#00c0e8]">
                See all certifications
              </span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
