'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '@/utils/time';

export default function Navigation() {
  const [sessionTime, setSessionTime] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 flex h-16 items-center justify-between border-b px-4 md:px-20">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
          <span className="text-sm font-medium text-white">AI</span>
        </div>
        <span className="hidden text-lg font-medium sm:inline">Therapy</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Session: {formatTime(sessionTime)}
        </div>

        <div className="relative">
          <div className="h-2 w-2 animate-breathe rounded-full bg-accent" />
          <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-accent" />
        </div>

        <button
          onClick={toggleDarkMode}
          className="focus-ring rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
