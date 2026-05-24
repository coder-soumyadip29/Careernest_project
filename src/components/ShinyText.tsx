'use client';

import { motion } from 'framer-motion';

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

export default function ShinyText({
  children,
  className = '',
  speed = 3,
  disabled = false,
}: ShinyTextProps) {
  return (
    <motion.span
      className={className}
      style={{
        display: 'inline-block',
        color: 'transparent',
        backgroundImage: `linear-gradient(
          100deg,
          #64CEFB 0%,
          #64CEFB 40%,
          #ffffff 50%,
          #64CEFB 60%,
          #64CEFB 100%
        )`,
        backgroundSize: '250% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={
        disabled
          ? {}
          : {
              backgroundPosition: ['150% center', '-50% center'],
            }
      }
      transition={
        disabled
          ? {}
          : {
              duration: speed,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            }
      }
    >
      {children}
    </motion.span>
  );
}
