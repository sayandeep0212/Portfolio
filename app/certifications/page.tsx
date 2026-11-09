'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AutumnLeaves from '@/components/AutumnLeaves';
import NightMeteors from '@/components/NightMeteors';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DEFAULT_CERTIFICATES, CertificateDoc } from '@/lib/portfolio-db';

export default function CertificationsPage() {
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
        console.warn('CertificationsPage Firestore snapshot error, using defaults:', err);
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
            <Award className="w-3.5 h-3.5" />
            <span>Professional Credentials</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-gray-900 dark:text-white mb-3">
            Certifications & Badges
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-sans max-w-2xl leading-relaxed">
            Professional certifications in artificial intelligence, cybersecurity defense, software engineering, and cloud databases.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((c, idx) => (
            <div
              key={c.id || idx}
              className="p-6 rounded-2xl bg-white dark:bg-[#121622] border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:border-gray-300 dark:hover:border-gray-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`relative w-12 h-12 rounded-xl p-2 shrink-0 flex items-center justify-center border shadow-sm ${
                      c.isDarkBox
                        ? 'bg-[#171717] border-gray-900'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60'
                    }`}
                  >
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={c.issuer}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Award className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-normal text-gray-900 dark:text-white leading-snug">
                      {c.title}
                    </h2>
                    <p className="text-xs font-medium text-[#007f99] dark:text-[#38bdf8] font-sans mt-0.5">
                      {c.issuer}
                    </p>
                  </div>
                </div>

                {c.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                    {c.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {c.year || 'Certified'}
                </span>

                {c.credentialId && (
                  <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
                    ID: {c.credentialId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
