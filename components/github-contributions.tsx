'use client';

import React, { use, useState, useEffect, useMemo, Suspense } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { LinkPreview } from './link-preview';
import initialData from '@/app/github-data.json';
import {
  getCachedContributions,
  type ContributionsData,
  type DayContribution,
} from '@/lib/get-cached-contributions';

export interface GitHubContributionsProps {
  contributions: Promise<ContributionsData> | ContributionsData;
  githubProfileUrl?: string;
  className?: string;
}

export function GitHubContributionsFallback() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#10131a] p-4 sm:p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-md" />
      </div>
      <div className="mt-6 flex items-center justify-center min-h-[140px]">
        <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-700 border-t-[#00c0e8] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export function GitHubContributions({
  contributions: contributionsProp,
  githubProfileUrl = 'https://github.com/sayandeep0212',
  className,
}: GitHubContributionsProps) {
  // Support both Promise (via React 19 use()) and resolved data object
  const data: ContributionsData =
    contributionsProp && typeof (contributionsProp as any).then === 'function'
      ? use(contributionsProp as Promise<ContributionsData>)
      : (contributionsProp as ContributionsData);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    count: number;
    date: string;
  } | null>(null);

  // Group contributions into 7-day weeks
  const weeks = useMemo(() => {
    const list = data?.contributions || [];
    const grouped: DayContribution[][] = [];
    let currentWeek: DayContribution[] = [];

    if (list.length > 0) {
      const firstDayIndex = new Date(list[0].date).getDay();
      for (let i = 0; i < firstDayIndex; i++) {
        currentWeek.push({ date: '', count: 0, level: -1 });
      }
    }

    for (const day of list) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        grouped.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', count: 0, level: -1 });
      }
      grouped.push(currentWeek);
    }

    return grouped;
  }, [data]);

  // Extract month labels with column indices
  const months = useMemo(() => {
    const list: { label: string; weekIndex: number }[] = [];
    let prevMonth = '';

    weeks.forEach((week, wIdx) => {
      const validDay = week.find((d) => d.date);
      if (validDay) {
        const monthName = new Date(validDay.date).toLocaleString('default', {
          month: 'short',
        });
        if (monthName !== prevMonth) {
          list.push({ label: monthName, weekIndex: wIdx });
          prevMonth = monthName;
        }
      }
    });

    return list;
  }, [weeks]);

  // Check whether custom theme class is passed (e.g. GitHub Default Theme in light mode or Gray & Black in dark mode)
  const hasCustomTheme = Boolean(className && className.includes('data-[level'));

  const getCellFillClass = (level: number) => {
    if (level === -1) return 'fill-transparent';

    if (hasCustomTheme) {
      if (className?.includes('fill-[#eff2f5]')) {
        // Light Mode GitHub Default Green Palette
        switch (level) {
          case 0:
            return 'fill-[#eff2f5] dark:fill-[#14171f]';
          case 1:
            return 'fill-[#aceebb] dark:fill-[#272d37]';
          case 2:
            return 'fill-[#4ac26b] dark:fill-[#444c56]';
          case 3:
            return 'fill-[#2da44e] dark:fill-[#768390]';
          case 4:
            return 'fill-[#116329] dark:fill-[#d0d7de]';
          default:
            return 'fill-[#eff2f5] dark:fill-[#14171f]';
        }
      }

      if (className?.includes('fill-[#14171f]') || className?.includes('fill-[#161b22]')) {
        // Dark Mode Gray and Black Palette
        switch (level) {
          case 0:
            return 'fill-[#14171f]';
          case 1:
            return 'fill-[#272d37]';
          case 2:
            return 'fill-[#444c56]';
          case 3:
            return 'fill-[#768390]';
          case 4:
            return 'fill-[#d0d7de]';
          default:
            return 'fill-[#14171f]';
        }
      }
    }

    // Default Theme: Light mode green, Dark/Night mode gray and black
    switch (level) {
      case 0:
        return 'fill-[#eff2f5] dark:fill-[#14171f]';
      case 1:
        return 'fill-[#aceebb] dark:fill-[#272d37]';
      case 2:
        return 'fill-[#4ac26b] dark:fill-[#444c56]';
      case 3:
        return 'fill-[#2da44e] dark:fill-[#768390]';
      case 4:
        return 'fill-[#116329] dark:fill-[#d0d7de]';
      default:
        return 'fill-[#eff2f5] dark:fill-[#14171f]';
    }
  };

  const totalCount = data?.total?.lastYear || 1040;

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#10131a] p-4 sm:p-6 shadow-sm transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <FaGithub className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <LinkPreview
            url={githubProfileUrl}
            className="text-xs sm:text-sm font-mono font-medium text-gray-900 dark:text-white hover:text-[#00c0e8] dark:hover:text-[#00c0e8] transition-colors"
          >
            {githubProfileUrl.replace('https://github.com/', '@')}
          </LinkPreview>
        </div>
        <div className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 font-sans">
          <span className="font-mono font-semibold text-gray-900 dark:text-white">
            {totalCount.toLocaleString()}
          </span>{' '}
          contributions in the last year
        </div>
      </div>

      {/* Contribution Calendar Heatmap Grid */}
      <div className="relative overflow-x-auto pb-2 scrollbar-thin">
        <svg
          width={weeks.length * 13 + 30}
          height={125}
          className="select-none overflow-visible"
        >
          {/* Month Labels */}
          {months.map((m, idx) => (
            <text
              key={idx}
              x={m.weekIndex * 13 + 30}
              y={10}
              className="fill-gray-400 dark:fill-gray-500 text-[10px] font-mono"
            >
              {m.label}
            </text>
          ))}

          {/* Day of Week Labels */}
          <text x={0} y={32} className="fill-gray-400 dark:fill-gray-500 text-[9px] font-mono">
            Mon
          </text>
          <text x={0} y={58} className="fill-gray-400 dark:fill-gray-500 text-[9px] font-mono">
            Wed
          </text>
          <text x={0} y={84} className="fill-gray-400 dark:fill-gray-500 text-[9px] font-mono">
            Fri
          </text>

          {/* Day Cells */}
          <g transform="translate(30, 18)">
            {weeks.map((week, colIdx) =>
              week.map((day, rowIdx) => {
                if (day.level === -1) return null;
                return (
                  <rect
                    key={`${colIdx}-${rowIdx}`}
                    x={colIdx * 13}
                    y={rowIdx * 13}
                    width={10}
                    height={10}
                    rx={2}
                    data-level={day.level}
                    data-date={day.date}
                    data-count={day.count}
                    className={cn(
                      'cursor-pointer transition-colors duration-150',
                      getCellFillClass(day.level)
                    )}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget
                        .closest('svg')
                        ?.getBoundingClientRect() || { left: 0, top: 0 };
                      setTooltip({
                        x: rect.left - parentRect.left + 5,
                        y: rect.top - parentRect.top - 8,
                        count: day.count,
                        date: day.date,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            )}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 text-[11px] font-mono shadow-lg backdrop-blur-sm whitespace-nowrap"
            style={{
              left: tooltip.x + 30,
              top: tooltip.y + 14,
            }}
          >
            <div className="font-medium">
              {tooltip.count === 0
                ? 'No contributions'
                : `${tooltip.count} contribution${tooltip.count > 1 ? 's' : ''}`}
            </div>
            <div className="text-[10px] text-gray-300 dark:text-gray-600">
              {new Date(tooltip.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Legend */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 font-mono">
        <LinkPreview
          url={githubProfileUrl}
          className="hover:text-[#00c0e8] transition-colors"
        >
          View on GitHub &rarr;
        </LinkPreview>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <svg key={lvl} width={10} height={10} className="rounded-sm">
              <rect
                width={10}
                height={10}
                rx={2}
                data-level={lvl}
                className={cn('transition-colors', getCellFillClass(lvl))}
              />
            </svg>
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Light Mode: GitHub Contributions with Default Theme
export function GitHubContributionsDefaultTheme({
  username = 'sayandeep0212',
  profileUrl = 'https://github.com/sayandeep0212',
}: {
  username?: string;
  profileUrl?: string;
}) {
  const [data, setData] = useState<ContributionsData>(initialData as ContributionsData);

  useEffect(() => {
    let isMounted = true;
    getCachedContributions(username).then((res) => {
      if (isMounted && res && res.contributions && res.contributions.length > 0) {
        setData(res);
      }
    });

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      getCachedContributions(username).then((res) => {
        if (isMounted && res && res.contributions && res.contributions.length > 0) {
          setData(res);
        }
      });
    }, 600000); // 10-minute real-time poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [username]);

  return (
    <GitHubContributions
      contributions={data}
      githubProfileUrl={profileUrl}
      className={cn(
        // GitHub Default Theme
        '**:data-[level="0"]:fill-[#eff2f5] dark:**:data-[level="0"]:fill-[#151b23]',
        '**:data-[level="1"]:fill-[#aceebb] dark:**:data-[level="1"]:fill-[#033a16]',
        '**:data-[level="2"]:fill-[#4ac26b] dark:**:data-[level="2"]:fill-[#196c2e]',
        '**:data-[level="3"]:fill-[#2da44e] dark:**:data-[level="3"]:fill-[#2ea043]',
        '**:data-[level="4"]:fill-[#116329] dark:**:data-[level="4"]:fill-[#56d364]'
      )}
    />
  );
}

// Dark Mode: GitHub Contributions Demo Theme (clean default without className override)
export function GitHubContributionsDemo({
  username = 'sayandeep0212',
  profileUrl = 'https://github.com/sayandeep0212',
}: {
  username?: string;
  profileUrl?: string;
}) {
  const [data, setData] = useState<ContributionsData>(initialData as ContributionsData);

  useEffect(() => {
    let isMounted = true;
    getCachedContributions(username).then((res) => {
      if (isMounted && res && res.contributions && res.contributions.length > 0) {
        setData(res);
      }
    });

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      getCachedContributions(username).then((res) => {
        if (isMounted && res && res.contributions && res.contributions.length > 0) {
          setData(res);
        }
      });
    }, 600000); // 10-minute real-time poll

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [username]);

  return (
    <GitHubContributions
      contributions={data}
      githubProfileUrl={profileUrl}
    />
  );
}

export default GitHubContributions;
