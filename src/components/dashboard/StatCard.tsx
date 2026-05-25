'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

/** Accent color presets for stat cards */
export type StatAccent = 'sky' | 'violet' | 'emerald' | 'amber';

const accentMap: Record<StatAccent, { bg: string; text: string; bar: string }> = {
  sky: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    bar: 'bg-gradient-to-r from-sky-500 to-sky-400',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    bar: 'bg-gradient-to-r from-violet-500 to-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
  },
};

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  /** Lucide icon component (optional, new feature) */
  icon?: LucideIcon;
  /** Accent color preset (optional, defaults to sky) */
  accent?: StatAccent;
  /** Optional progress percentage 0-100 for micro progress bar */
  progress?: number;
  /** Stagger animation index */
  index?: number;
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'sky',
  progress,
  index = 0,
}: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/10"
    >
      {/* Subtle gradient glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg} blur-3xl -z-10`} />

      {/* Icon */}
      {Icon && (
        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
      )}

      {/* Value */}
      <p className="text-3xl font-extrabold text-white tracking-tight">
        {value}
      </p>

      {/* Label */}
      <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      {/* Micro progress bar */}
      {typeof progress === 'number' && (
        <div className="mt-4 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${colors.bar}`}
          />
        </div>
      )}

      {/* Hint text */}
      {hint && (
        <p className="mt-3 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </motion.div>
  );
}
