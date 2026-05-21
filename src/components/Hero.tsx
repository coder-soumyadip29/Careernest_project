'use client';

import { motion } from 'framer-motion';
import LiveScene from '@/components/LiveScene';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -6,
      boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-brand-light">
      {/* Top Right Ambient Glow Spot */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-secondary/12 to-transparent filter blur-3xl -z-10 pointer-events-none" />
      {/* Bottom Left Subtle Warm Spot */}
      <div className="absolute -bottom-20 -left-20 w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-accent/8 to-transparent filter blur-3xl -z-10 pointer-events-none" />

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
        >
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-8">
            {/* Promo Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/15">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-secondary"></span>
              </span>
              <span className="text-[12px] font-bold text-brand-secondary uppercase tracking-widest">
                Trusted by 500+ Top Corporates & Universities
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-primary tracking-tight leading-[1.1]"
            >
              Bridge the Gap Between <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-secondary to-brand-accent bg-clip-text text-transparent">
                Ambitious Talents
              </span> <br />
              and Leading Companies.
            </motion.h2>

            {/* Paragraph Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-xl"
            >
              CarrierNest is the premium ecosystem offering hands-on internship opportunities, real-world professional grooming, and direct fast-track pathways to top corporate roles.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#talents"
                className="px-8 py-4 rounded-2xl text-white font-bold bg-brand-primary shadow-xl shadow-brand-primary/15 flex items-center gap-2 group"
              >
                Hire Talent
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#opportunities"
                className="px-8 py-4 rounded-2xl text-brand-secondary font-bold bg-white border-2 border-slate-200/80 shadow-md shadow-slate-100 hover:border-brand-secondary/30 transition-all duration-200"
              >
                Find Internships
              </motion.a>
            </motion.div>

            {/* Embedded Live Metrics Counter Grid */}
            <motion.div variants={itemVariants} className="pt-4 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <h4 className="text-3xl font-extrabold text-brand-primary">15k+</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Students Placed</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <h4 className="text-3xl font-extrabold text-brand-primary">96%</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Retention Rate</p>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <h4 className="text-3xl font-extrabold text-brand-primary">200+</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Partner Brands</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Live Stage */}
          <div className="lg:col-span-5 relative h-[660px] w-full flex items-center justify-center">
            <LiveScene />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
