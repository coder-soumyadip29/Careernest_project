'use client';

import { motion } from 'framer-motion';
import { useState, type PointerEvent } from 'react';

const floatingPanels = [
  {
    title: 'Talent Pulse',
    value: '24 active',
    detail: 'In the past 2 hours',
    style: { top: '12%', left: '4%', width: '10.4rem', height: '5rem' },
  },
  {
    title: 'Match Rate',
    value: '98%',
    detail: 'Quality fit score',
    style: { top: '22%', right: '4%', width: '10rem', height: '5.4rem' },
  },
  {
    title: 'Live Roles',
    value: '312',
    detail: 'New openings',
    style: { bottom: '16%', left: '6%', width: '9.5rem', height: '4.8rem' },
  },
  {
    title: 'Interview Flow',
    value: '+46%',
    detail: 'Faster than last month',
    style: { bottom: '12%', right: '4%', width: '11rem', height: '5.2rem' },
  },
];

export default function LiveScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    setTilt({ x, y });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex items-center justify-center perspective-[1800px]"
    >
      <motion.div
        className="relative w-[26rem] h-[34rem] sm:w-[28rem] sm:h-[36rem] md:w-[30rem] md:h-[38rem]"
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-slate-950/90 border border-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-secondary/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-accent/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.18),transparent_35%)] pointer-events-none" />
          <div className="absolute -left-10 top-16 w-36 h-36 rounded-full bg-brand-secondary/10 blur-3xl" />
          <div className="absolute right-8 bottom-20 w-40 h-40 rounded-full bg-brand-accent/10 blur-3xl" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-[18.5rem] h-[18.5rem] rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_35px_90px_rgba(15,23,42,0.35)] overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_40%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),transparent_45%)] pointer-events-none" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0.25 }}
                  animate={{ scale: [0.92, 1, 0.92], opacity: [0.25, 0.55, 0.25] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="w-[9.5rem] h-[9.5rem] rounded-[2rem] bg-gradient-to-br from-brand-secondary/35 via-brand-accent/20 to-transparent shadow-[0_0_80px_rgba(56,189,248,0.16)]"
                />
              </div>
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-slate-300">Realtime</span>
                    <span className="rounded-full bg-brand-secondary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-brand-secondary tracking-[0.2em]">
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 rounded-full bg-white/10 w-[90%]" />
                    <div className="h-3 rounded-full bg-white/10 w-[68%]" />
                    <div className="h-3 rounded-full bg-white/10 w-[50%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Career Cloud</p>
                  <p className="text-sm sm:text-base text-slate-300 max-w-[15rem]">
                    A tactile live dashboard for talent sourcing, pipeline motion, and real-time matches.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {floatingPanels.map((panel, index) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.18 + 0.4, duration: 0.8, ease: 'easeOut' }}
              className="absolute rounded-[1.75rem] border border-white/10 bg-white/10 backdrop-blur-xl shadow-[0_24px_70px_rgba(15,23,42,0.15)]"
              style={panel.style}
            >
              <div className="h-full px-4 py-3 flex flex-col justify-between">
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">{panel.title}</div>
                <div className="space-y-1">
                  <p className="text-2xl font-extrabold text-white">{panel.value}</p>
                  <p className="text-[11px] text-slate-300">{panel.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            animate={{ rotate: [0, 8, 0, -8, 0], y: [0, -10, 0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[15rem] h-[15rem] rounded-full border border-white/10"
          />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => {
          const base = index * 12;
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.1 + index * 0.04, scale: 0.7 + index * 0.07, x: [0, (index - 2) * 18, 0], y: [0, (index - 3) * -14, 0] }}
              transition={{ repeat: Infinity, duration: 8, delay: index * 0.4, ease: 'easeInOut' }}
              className="absolute rounded-full bg-brand-secondary/20 blur-3xl"
              style={{
                width: `${base + 40}px`,
                height: `${base + 40}px`,
                top: `${index % 2 === 0 ? 12 : 64}%`,
                left: `${index % 3 === 0 ? 10 : 78}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
