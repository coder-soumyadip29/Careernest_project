'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

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
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/75 backdrop-blur-lg border-b border-slate-200/50 shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-accent flex items-center justify-center shadow-md shadow-brand-secondary/20 transition-transform duration-300 group-hover:scale-105">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
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
              className="text-[15px] font-semibold text-slate-600 hover:text-brand-secondary transition-colors duration-250 relative py-1 group"
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
            className="hidden sm:inline-block text-[15px] font-semibold text-slate-700 hover:text-brand-secondary transition-colors duration-200"
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
