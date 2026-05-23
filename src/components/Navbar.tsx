'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { navLinks } from '@/lib/data';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'py-3 bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/10 shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image src="/careernest-logo12.png" alt="CarrierNest" width={36} height={36} className="rounded-md object-contain" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-brand-primary group-hover:text-brand-secondary transition-colors duration-200">
            CarrierNest
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] font-semibold transition-colors duration-250 relative py-1 group ${
                isActive(link.href)
                  ? 'text-brand-secondary'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-secondary'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-brand-secondary transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="hidden sm:inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-secondary"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="hidden sm:inline-flex items-center gap-1 text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-[15px] font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-secondary"
                >
                  Sign In
                </Link>
              )}
              <Link
                href={user ? dashboardHref : '/signup'}
                className="hidden sm:flex px-5 py-2.5 rounded-xl text-[14px] font-bold text-slate-950 bg-gradient-to-r from-brand-secondary to-brand-accent items-center gap-1.5"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/90 text-slate-700 dark:border-white/20 dark:bg-slate-900/85 dark:text-slate-100"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200/50 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-[15px] font-semibold ${
                    isActive(link.href) ? 'text-brand-secondary' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={dashboardHref} className="py-2 font-semibold text-slate-700 dark:text-slate-200">
                    Dashboard
                  </Link>
                  <button type="button" onClick={logout} className="py-2 text-left font-semibold text-red-500">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="py-2 font-semibold text-slate-700 dark:text-slate-200">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-2 inline-flex justify-center rounded-xl py-3 font-bold text-slate-950 bg-gradient-to-r from-brand-secondary to-brand-accent"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
