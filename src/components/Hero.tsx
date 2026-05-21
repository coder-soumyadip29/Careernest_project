'use client';

import { motion } from 'framer-motion';
import LiveScene from '@/components/LiveScene';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-brand-light">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(242,201,76,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,159,37,0.12),transparent_30%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-28 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 xl:grid-cols-[1.1fr_0.9fr] items-center"
        >
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 rounded-full border border-brand-secondary/20 bg-white/90 px-4 py-2 shadow-sm shadow-brand-secondary/10 backdrop-blur-sm w-fit">
              <span className="text-[11px] uppercase tracking-[0.35em] font-semibold text-brand-secondary">
                Premium 3D Launch
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-tight"
            >
              CarrierNest arrives as a clean <span className="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">3D live launch</span> with polished motion and fresh UX clarity.
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              A professional landing experience that opens with a focused 3D nest reveal, clear page structure, and breathing space for every interaction.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-primary px-8 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore CarrierNest
              </a>
              <a
                href="#solutions"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-brand-primary transition-colors duration-200 hover:bg-slate-50"
              >
                See the Flow
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200 border border-slate-200/60">
                <p className="text-3xl font-extrabold text-brand-primary">15k+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-500">Students Placed</p>
              </div>
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200 border border-slate-200/60">
                <p className="text-3xl font-extrabold text-brand-primary">96%</p>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-500">Retention Rate</p>
              </div>
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm shadow-slate-200 border border-slate-200/60">
                <p className="text-3xl font-extrabold text-brand-primary">200+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.28em] text-slate-500">Partner Brands</p>
              </div>
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
