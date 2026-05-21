'use client';

import { motion } from 'framer-motion';
import { useState, type PointerEvent } from 'react';

const floatingPanels = [
  {
    title: 'Talent Pulse',
    value: '24 active',
    detail: 'In the past 2 hours',
    style: { top: '10%', left: '5%', width: '10.4rem', height: '5rem' },
  },
  {
    title: 'Match Rate',
    value: '98%',
    detail: 'Quality fit score',
    style: { top: '18%', right: '5%', width: '10rem', height: '5.4rem' },
  },
  {
    title: 'Live Roles',
    value: '312',
    detail: 'New openings',
    style: { bottom: '20%', left: '6%', width: '9.5rem', height: '4.8rem' },
  },
  {
    title: 'Interview Flow',
    value: '+46%',
    detail: 'Faster than last month',
    style: { bottom: '14%', right: '4%', width: '11rem', height: '5.2rem' },
  },
];

const orbiters = Array.from({ length: 5 }).map((_, index) => ({
  id: index,
  size: 14 + index * 3,
  delay: index * 0.15,
  color: index % 2 === 0 ? 'bg-brand-secondary/90' : 'bg-brand-accent/80',
}));

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(242,201,76,0.14),transparent_45%)] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute top-14 left-12 w-44 h-44 rounded-full bg-brand-accent/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="absolute bottom-16 right-10 w-52 h-52 rounded-full bg-brand-secondary/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ y: -160, opacity: 0, scale: 0.92, rotateX: 14, rotateY: -10 }}
        animate={{ y: 0, opacity: 1, scale: 1, rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: 'spring', stiffness: 185, damping: 20, mass: 0.9 }}
        className="relative w-[26rem] h-[34rem] sm:w-[28rem] sm:h-[36rem] md:w-[30rem] md:h-[38rem]"
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-slate-950/95 border border-white/10 shadow-[0_45px_160px_rgba(15,23,42,0.3)] backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-brand-secondary/25 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-accent/15 to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,229,153,0.18),transparent_40%)] pointer-events-none" />
          <div className="absolute -left-10 top-16 w-36 h-36 rounded-full bg-brand-secondary/12 blur-3xl" />
          <div className="absolute right-8 bottom-16 w-40 h-40 rounded-full bg-brand-accent/12 blur-3xl" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-[18.5rem] h-[18.5rem] rounded-[2.5rem] border border-white/10 bg-slate-950/90 shadow-[0_35px_120px_rgba(15,23,42,0.34)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_30%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,201,76,0.16),transparent_40%)] pointer-events-none" />

              <motion.div
                initial={{ scale: 0.88, opacity: 0.2 }}
                animate={{ scale: [0.88, 1, 0.88], opacity: [0.2, 0.45, 0.2] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute inset-8 rounded-[2.25rem] bg-gradient-to-br from-brand-secondary/25 via-brand-accent/15 to-transparent border border-white/10 shadow-[0_0_90px_rgba(242,201,76,0.2)]"
              />

              <div className="relative z-10 inset-0 h-full p-7 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-slate-400">CarrierNest</span>
                    <span className="rounded-full bg-brand-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase text-brand-secondary tracking-[0.2em]">
                      3D Core
                    </span>
                  </div>
                  <div className="relative w-full h-24 rounded-[2rem] bg-[#13131a]/95 border border-white/10 shadow-[0_25px_70px_rgba(15,23,42,0.2)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),transparent_35%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,207,93,0.16),transparent_45%)] pointer-events-none" />
                    <div className="absolute inset-x-8 top-6 h-1.5 rounded-full bg-brand-secondary/30" />
                    <div className="absolute inset-x-10 top-12 h-1.5 rounded-full bg-brand-secondary/20" />
                    <div className="absolute top-16 left-10 text-white text-[11px] uppercase tracking-[0.25em]">
                      Drop Zone
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">Nest</p>
                  <p className="text-sm sm:text-base text-slate-300 max-w-[13rem]">
                    A premium drop-in 3D hub with orbiting intelligence that draws users into the hiring experience.
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                  className="absolute w-[12.5rem] h-[12.5rem] rounded-full border border-brand-secondary/10"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                  className="absolute w-[15rem] h-[15rem] rounded-full border border-brand-accent/10"
                />
                {orbiters.map((orb, index) => {
                  const orbitDistance = 48 + index * 10;
                  const orbitDelay = orb.delay;
                  return (
                    <motion.span
                      key={orb.id}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{
                        opacity: [0, 1, 0.85, 0.7],
                        scale: [0.3, 1, 0.9, 0.3],
                        x: [0, orbitDistance, 0, -orbitDistance, 0],
                        y: [0, -orbitDistance * 0.4, 0, orbitDistance * 0.4, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 14 + index * 2,
                        delay: orbitDelay,
                        ease: 'linear',
                      }}
                      className={`${orb.color} absolute rounded-full shadow-[0_0_40px_rgba(242,201,76,0.24)]`}
                      style={{
                        width: orb.size,
                        height: orb.size,
                        top: '50%',
                        left: '50%',
                        marginTop: -(orb.size / 2),
                        marginLeft: -(orb.size / 2),
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {floatingPanels.map((panel, index) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.18 + 0.35, duration: 0.9, ease: 'easeOut' }}
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
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => {
          const width = 36 + index * 10;
          const height = 36 + index * 10;
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 0.08 + index * 0.03,
                scale: 0.7 + index * 0.05,
                x: [0, (index - 2) * 20, 0],
                y: [0, (index - 3) * -16, 0],
              }}
              transition={{ repeat: Infinity, duration: 10 + index * 2, delay: index * 0.3, ease: 'easeInOut' }}
              className="absolute rounded-full blur-3xl"
              style={{
                width,
                height,
                top: `${index % 2 === 0 ? 14 : 68}%`,
                left: `${index % 3 === 0 ? 12 : 78}%`,
                backgroundColor: 'rgba(242,201,76,0.14)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
