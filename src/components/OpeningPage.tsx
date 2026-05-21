'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface OpeningPageProps {
  onComplete: () => void;
}

export default function OpeningPage({ onComplete }: OpeningPageProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Set a timer to finish preloading sequence
    const timer = setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 800); // Allow exit transition to complete
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const letterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  };

  const brandName = "CarrierNest";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isDone ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-primary"
    >
      {/* Wave decorative background in preloader */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-secondary via-brand-primary to-brand-primary" />

      <div className="text-center relative z-10 flex flex-col items-center">
        {/* Modern animated nest icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-tr from-brand-secondary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-secondary/35"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </motion.div>

        {/* Dynamic typography brand wordmark */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 flex">
          {brandName.split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle slide up */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-brand-light text-sm tracking-widest uppercase font-medium"
        >
          Nurturing Professional Growth
        </motion.p>
      </div>

      {/* Modern page transition curtains */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isDone ? "-100%" : "100%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 bg-brand-secondary z-20"
      />
    </motion.div>
  );
}
