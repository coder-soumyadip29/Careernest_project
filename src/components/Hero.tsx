'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LiveScene from '@/components/LiveScene';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.16, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-brand-light">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.24),transparent_35%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr] items-center"
        >
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-sky-50/80 px-4 py-2 shadow-sm backdrop-blur-sm w-fit dark:border-sky-500/40 dark:bg-slate-800/90"
            >
              <span className="text-[11px] uppercase tracking-[0.35em] font-semibold text-sky-800 dark:text-sky-200">
                HR Tech & Talent Placement
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-tight"
            >
              Connect top talent with{' '}
              <span className="bg-gradient-to-r from-sky-600 to-amber-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-amber-300">
                industry-leading opportunities
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              CarrierNest is a full-stack placement platform for internships, graduate hiring, and enterprise recruitment—with intelligent matching, secure dashboards, and measurable outcomes.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-primary text-white px-8 py-4 text-sm font-semibold shadow-[0_18px_50px_rgba(37,99,235,0.16)] transition-transform duration-200 hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.2)] dark:hover:bg-slate-100"
              >
                Get Started
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
              {[
                { value: '15k+', label: 'Students Placed' },
                { value: '96%', label: 'Retention Rate' },
                { value: '200+', label: 'Partner Brands' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.75rem] bg-gradient-to-br from-sky-50/90 to-amber-50/90 p-6 shadow-md shadow-sky-900/5 border border-sky-100 backdrop-blur-sm dark:from-slate-800/95 dark:to-slate-900/95 dark:border-slate-600/50 dark:shadow-black/20"
                >
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-600 dark:text-slate-300">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative rounded-[2.5rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_110px_rgba(15,23,42,0.28)]"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_rgba(255,229,153,0.12),transparent_40%)] pointer-events-none" />
            <div className="relative h-[520px] sm:h-[580px] md:h-[620px] overflow-hidden rounded-[2rem]">
              <LiveScene />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
