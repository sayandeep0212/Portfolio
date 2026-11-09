import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white dark:bg-[#0b0d11] text-gray-900 dark:text-gray-100">
      <h1 className="font-serif text-6xl sm:text-7xl font-normal text-gray-900 dark:text-white">404</h1>
      <p className="mt-3 text-base text-gray-500 dark:text-gray-400 font-sans">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

