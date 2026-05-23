'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  badge: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl mb-14 ${alignClass}`}
    >
      <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-800 dark:border-sky-500/40 dark:bg-slate-800/90 dark:text-sky-200">
        {badge}
      </span>
      <h2 className={`mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-primary ${alignClass}`}>
        {title}{' '}
        {highlight && (
          <span className="bg-gradient-to-r from-sky-600 to-amber-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-amber-300">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
