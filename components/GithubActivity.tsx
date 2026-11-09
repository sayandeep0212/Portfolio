'use client';

import React, { useState, useEffect } from 'react';
import { FadeIn } from './MotionWrapper';
import {
  GitHubContributionsDefaultTheme,
  GitHubContributionsDemo,
} from '@/components/github-contributions';

export default function GithubActivity() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="activity" className="py-8">
      <FadeIn>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-serif text-2xl font-normal text-gray-900 dark:text-white">
            GitHub Contributions
          </h2>
        </div>

        {/* In Dark Mode: GitHubContributionsDemo (clean default) */}
        {/* In Light Mode: GitHubContributionsDefaultTheme (GitHub Default Theme with specific fill levels) */}
        {mounted && isDarkMode ? (
          <GitHubContributionsDemo
            username="sayandeep0212"
            profileUrl="https://github.com/sayandeep0212"
          />
        ) : (
          <GitHubContributionsDefaultTheme
            username="sayandeep0212"
            profileUrl="https://github.com/sayandeep0212"
          />
        )}
      </FadeIn>
    </section>
  );
}
