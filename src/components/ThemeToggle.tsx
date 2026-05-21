'use client';

import { useEffect, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';

const THEME_KEY = 'carriernest-theme';

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/90 text-slate-700 shadow-sm shadow-slate-200/30 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 dark:border-white/20 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
