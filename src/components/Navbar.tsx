'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled
        ? 'py-3 bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/10 shadow-sm'
        : 'py-5 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image src="/careernest-logo12.png" alt="CarrierNest" width={60} height={60} className="rounded-md object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-brand-primary group-hover:text-brand-secondary transition-colors duration-200">
            CarrierNest
          </span>
        </a>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Solutions', 'For Interns', 'For Companies', 'About Us'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-secondary transition-colors duration-250 relative py-1 group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-secondary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Call To Action Button with subtle glow */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#login"
            className="hidden sm:inline-block text-[15px] font-semibold text-slate-700 dark:text-slate-350 hover:text-brand-secondary transition-colors duration-200"
          >
            Sign In
          </a>
          <motion.a
            whileHover={{ scale: 1.04, boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            href="#get-started"
            className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-brand-secondary to-brand-accent transition-all duration-200 flex items-center gap-1.5"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
