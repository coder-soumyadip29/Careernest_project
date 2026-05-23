'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import ShinyText from '@/components/ShinyText';

/* ─── CarrierNest Nav Links ───────────────────────────────── */
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/#testimonials' },
];

/* ─── Component ─────────────────────────────────────────── */
export default function DesignProHero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-950 dark:bg-[var(--color-background)]">
      {/* ── Video Background ─────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster=""
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── Dark Overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-slate-950 dark:to-[var(--color-background)]" />

      {/* ── All Content (relative z-10) ──────────────────── */}
      <div className="relative z-10 flex h-full flex-col">
        {/* ── Navbar ───────────────────────────────────────── */}
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          className="w-full py-5"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
                <div className="h-3 w-3 rounded-full bg-white" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                CarrierNest
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-1 rounded-full border border-gray-700 px-2 py-1.5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors duration-200 hover:text-white hover:bg-white/10"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/contact"
                  className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm text-white/80 transition-colors duration-200 hover:text-white hover:bg-white/10"
                >
                  Contact Us
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </nav>

            {/* Mobile Hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-white/80 transition hover:text-white hover:bg-white/10"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-xl"
              >
                <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:text-white hover:bg-white/10"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm text-white/80 transition hover:text-white hover:bg-white/10"
                  >
                    Contact Us
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── Top Description Row ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto w-full max-w-7xl px-6 sm:px-8 pt-6 md:pt-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <p className="max-w-md text-sm text-white/80 leading-relaxed md:text-base">
              CarrierNest is a full-stack placement platform for internships, graduate hiring, and enterprise recruitment—with intelligent matching, secure dashboards, and measurable outcomes.
            </p>
            <p className="text-sm text-white/80 md:text-base lg:text-right">
              15k+ Students Placed & 200+ Partner Brands
            </p>
          </div>
        </motion.div>

        {/* ── Center Hero Content ──────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Small Label */}
            <p className="mb-6 text-xs tracking-[0.2em] uppercase text-white/80 sm:text-sm md:mb-8">
              HR Tech & Talent Placement
            </p>

            {/* Main Heading */}
            <h1 style={{ lineHeight: 0.85 }} className="tracking-tighter">
              <span className="block text-4xl font-medium text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Connect top talent with
              </span>
              <ShinyText
                className="block text-4xl font-medium sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-3 md:mt-4"
                speed={3}
              >
                industry-leading opportunities.
              </ShinyText>
            </h1>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="mt-10 md:mt-14"
            >
              <a
                href="/signup"
                className="group inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-900 md:px-8 md:py-4 md:text-base border border-white/20"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom spacer */}
        <div className="h-12 md:h-16" />
      </div>
    </section>
  );
}
