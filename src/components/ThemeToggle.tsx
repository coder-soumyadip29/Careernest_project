'use client';

import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    window.localStorage.setItem('carriernest-theme', 'dark');
  }, []);

  return null;
}
