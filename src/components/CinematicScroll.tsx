'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for generative 3D particles and lines
interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  // Scroll tracking states
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Mouse tilt for premium parallax effect
  const mouseCoords = useRef({ x: 0, y: 0 });
  const targetMouseCoords = useRef({ x: 0, y: 0 });

  // Preloaded image cache
  const images = useRef<HTMLImageElement[]>([]);
  const totalFrames = 100;

  // Generative 3D structures (Fallback Mode)
  const nodes = useRef<Node3D[]>([]);
  const connections = useRef<Connection[]>([]);
  const stars = useRef<{ x: number; y: number; z: number; size: number }[]>([]);

  // 1. Detect Dark/Light Mode Theme Changes
  useEffect(() => {
    const checkTheme = () => {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      setIsDark(isDarkTheme);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // 2. Preload Sequence or Initialize Generative Engine
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];

    // Fast probe: test a single frame first to decide whether sequence exists
    const probe = new Image();
    probe.src = '/assets/sequence/frame_001.webp';

    const initGenerativeEngine = () => {
      const tempNodes: Node3D[] = [];
      const tempConnections: Connection[] = [];
      const tempStars: { x: number; y: number; z: number; size: number }[] = [];

      // Create a gorgeous concentric lattice (3 concentric shells)
      const layers = [
        { radius: 60, count: 12, color: 'brand-accent' },
        { radius: 110, count: 24, color: 'brand-secondary' },
        { radius: 160, count: 32, color: 'brand-accent' },
      ];

      layers.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          const phi = Math.acos(-1 + (2 * i) / layer.count);
          const theta = Math.sqrt(layer.count * Math.PI) * phi;

          const x = layer.radius * Math.sin(phi) * Math.cos(theta);
          const y = layer.radius * Math.sin(phi) * Math.sin(theta);
          const z = layer.radius * Math.cos(phi);

          tempNodes.push({
            x,
            y,
            z,
            baseX: x,
            baseY: y,
            baseZ: z,
            color: layer.color,
            size: 2 + Math.random() * 3,
          });
        }
      });

      // Create rich connections between close nodes
      for (let i = 0; i < tempNodes.length; i++) {
        let connectedCount = 0;
        for (let j = i + 1; j < tempNodes.length; j++) {
          const dist = Math.hypot(
            tempNodes[i].x - tempNodes[j].x,
            tempNodes[i].y - tempNodes[j].y,
            tempNodes[i].z - tempNodes[j].z
          );

          // Connect nodes within specific shell thresholds
          if (dist < 75 && connectedCount < 3) {
            tempConnections.push({
              from: i,
              to: j,
              opacity: 0.15 + Math.random() * 0.35,
            });
            connectedCount++;
          }
        }
      }

      // Populate flying field stars for immersion
      for (let i = 0; i < 200; i++) {
        tempStars.push({
          x: (Math.random() - 0.5) * 1200,
          y: (Math.random() - 0.5) * 1200,
          z: Math.random() * 800 - 400,
          size: 0.8 + Math.random() * 1.5,
        });
      }

      nodes.current = tempNodes;
      connections.current = tempConnections;
      stars.current = tempStars;
    };

    const loadSequence = async () => {
      let loadedCount = 0;
      let failedCount = 0;

      const promises = Array.from({ length: totalFrames }).map((_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          const frameNum = String(i + 1).padStart(3, '0');
          img.src = `/assets/sequence/frame_${frameNum}.webp`;

          img.onload = () => {
            preloadedImages[i] = img;
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
            resolve();
          };

          img.onerror = () => {
            failedCount++;
            resolve();
          };
        });
      });

      await Promise.all(promises);

      if (failedCount > 10) {
        console.warn(`Could not load sequence files (${failedCount} failed). Initializing premium generative 3D engine fallback.`);
        initGenerativeEngine();
        setIsUsingFallback(true);
        setIsLoaded(true);
      } else {
        images.current = preloadedImages;
        setIsLoaded(true);
      }
    };

    // Probe result: if first frame fails quickly, skip all 100 loads
    probe.onload = () => {
      // Sequence exists — load all frames
      loadSequence();
    };

    probe.onerror = () => {
      // Sequence missing — instantly go to generative fallback, no waiting
      initGenerativeEngine();
      setIsUsingFallback(true);
      setIsLoaded(true);
    };

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 3. Mouse move tracking for delicate parallax interactive tilting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseCoords.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 45,
        y: (e.clientY / window.innerHeight - 0.5) * 45,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 4. Scroll progress tracking with ResizeObserver
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollHeight));
      targetProgress.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 5. Canvas Resize & Redraw Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    return () => resizeObserver.disconnect();
  }, []);

  // 6. Inertial LERP Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Linear interpolation (LERP) for buttery-smooth inertial gliding
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.085;
      mouseCoords.current.x += (targetMouseCoords.current.x - mouseCoords.current.x) * 0.08;
      mouseCoords.current.y += (targetMouseCoords.current.y - mouseCoords.current.y) * 0.08;

      const progress = currentProgress.current;
      const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
      setActiveFrame(frameIndex);

      // Refresh Canvas Dimensions
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      if (!isUsingFallback && images.current[frameIndex]) {
        // --- DRAW SEQUENCE IMAGE ---
        const img = images.current[frameIndex];
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.max(width / imgWidth, height / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const x = (width - newWidth) / 2;
        const y = (height - newHeight) / 2;
        ctx.drawImage(img, x, y, newWidth, newHeight);
      } else {
        // --- DRAW PREMIUM 3D GENERATIVE FALLBACK ---
        drawGenerativeScene(ctx, width, height, progress);
      }

      requestRef.current = requestAnimationFrame(render);
    };

    const drawGenerativeScene = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      progress: number
    ) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const scaleFactor = Math.min(width, height) / 600;

      // Color scheme resolved from CSS properties
      const colorAccent = isDark ? '#38bdf8' : '#0ea5e9';     // Sleek Light Blue
      const colorSecondary = isDark ? '#a78bfa' : '#8b5cf6';  // Elegant Violet/Purple (instead of gold)
      const textPrimary = isDark ? 'rgba(248, 250, 252, 0.9)' : 'rgba(15, 23, 42, 0.9)';

      // Camera transitions mapped directly to scrolling progress
      // 0.0 -> Far overview, slow tilt
      // 0.5 -> Zooming in, rotating rapidly
      // 1.0 -> Massive close fly-through, opening up
      const zoom = 1.0 + progress * 1.5;
      const baseRotationX = progress * Math.PI * 1.5 + mouseCoords.current.y * 0.01;
      const baseRotationY = progress * Math.PI * 2.0 + mouseCoords.current.x * 0.01;

      // Draw background dynamic gradients
      const radialGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        50 * scaleFactor,
        centerX,
        centerY,
        width * 0.65
      );
      if (isDark) {
        radialGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');    // Glowing Light Blue
        radialGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.12)');  // Rich Purple/Violet Glow
        radialGrad.addColorStop(1, 'rgba(5, 3, 15, 0.0)');         // Matches Deep Cosmic Space #05030f
      } else {
        radialGrad.addColorStop(0, 'rgba(240, 249, 255, 0.45)');   // Light Blue Glow
        radialGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.25)');  // Light Violet/Purple Blend
        radialGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      }
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Render star/dust background field
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(15, 23, 42, 0.16)';
      stars.current.forEach((star) => {
        // Perspective mapping for stars
        let z = star.z - progress * 400; // Warp speed effect on scroll
        if (z < -300) z += 800; // Wrap around to maintain density

        const scale = 350 / (350 + z);
        const px = centerX + star.x * scale;
        const py = centerY + star.y * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3D coordinate rotation functions
      const rotateX = (x: number, y: number, z: number, angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { x, y: y * cos - z * sin, z: y * sin + z * cos };
      };

      const rotateY = (x: number, y: number, z: number, angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
      };

      const rotateZ = (x: number, y: number, z: number, angle: number) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return { x: x * cos - y * sin, y: x * sin + y * cos, z };
      };

      // Project 3D nodes onto the 2D canvas context
      const projectedNodes: { x: number; y: number; z: number; color: string; size: number }[] = [];

      nodes.current.forEach((node) => {
        // Add dynamic morphing distortion based on scroll position
        // The nest "unfolds" as you scroll deeper
        const morphAmount = Math.sin(progress * Math.PI) * 45;
        const morphX = node.baseX + (node.baseX > 0 ? morphAmount : -morphAmount);
        const morphY = node.baseY + (node.baseY > 0 ? morphAmount : -morphAmount);
        const morphZ = node.baseZ;

        // Apply 3-axis rotation matrix
        let r = rotateY(morphX, morphY, morphZ, baseRotationY);
        r = rotateX(r.x, r.y, r.z, baseRotationX);
        r = rotateZ(r.x, r.y, r.z, progress * Math.PI * 0.5);

        // Focal zoom perspective calculation
        const focalLength = 380;
        const projectedScale = (focalLength / (focalLength + r.z * 0.6)) * zoom * scaleFactor;
        const px = centerX + r.x * projectedScale;
        const py = centerY + r.y * projectedScale;

        projectedNodes.push({
          x: px,
          y: py,
          z: r.z,
          color: node.color === 'brand-accent' ? colorAccent : colorSecondary,
          size: node.size * projectedScale,
        });
      });

      // Draw Connection Lines (Depth-based opacity layering)
      connections.current.forEach((conn) => {
        const p1 = projectedNodes[conn.from];
        const p2 = projectedNodes[conn.to];

        // Draw connections only if both nodes are in a reasonable viewport frame
        if (p1 && p2) {
          const avgZ = (p1.z + p2.z) / 2;
          const depthOpacity = Math.max(0.05, Math.min(0.85, (200 - avgZ) / 400));
          const lineAlpha = conn.opacity * depthOpacity * (1.2 - progress * 0.4);

          ctx.strokeStyle = conn.from % 2 === 0 ? colorAccent : colorSecondary;
          ctx.lineWidth = Math.max(0.5, (1.8 - avgZ / 250) * scaleFactor);
          ctx.globalAlpha = lineAlpha;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      // Draw Orbiting Glass Rings (CarrierNest launch guides)
      const ringCount = 3;
      for (let i = 0; i < ringCount; i++) {
        const radius = (120 + i * 50) * scaleFactor * zoom;
        const speed = 0.003 * (i + 1);
        const timeRot = Date.now() * speed;

        ctx.strokeStyle = i === 1 ? colorSecondary : colorAccent;
        ctx.lineWidth = 1.2 * scaleFactor;
        ctx.globalAlpha = 0.12 + Math.sin(progress * Math.PI) * 0.15;

        ctx.beginPath();
        // Dynamic ring distortion to match the scrolling physics
        ctx.ellipse(
          centerX,
          centerY,
          radius,
          radius * 0.35,
          baseRotationX + timeRot * 0.1,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Draw Projected Interactive Nodes (sorted by depth for standard painter's Z-sorting algorithm)
      const sortedIndices = Array.from({ length: projectedNodes.length }).map((_, idx) => idx);
      sortedIndices.sort((a, b) => projectedNodes[b].z - projectedNodes[a].z);

      sortedIndices.forEach((idx) => {
        const p = projectedNodes[idx];
        if (p.x >= -50 && p.x <= width + 50 && p.y >= -50 && p.y <= height + 50) {
          // Draw subtle glowing drop-shadow under nodes
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.8);
          glowGrad.addColorStop(0, p.color);
          glowGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Core Solid Particle Point
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Core Dynamic Glowing Launch Nest (Volumetric spotlight at center of nest)
      const corePulse = 0.95 + Math.sin(Date.now() * 0.004) * 0.05;
      const coreSize = 45 * scaleFactor * zoom * corePulse * (1.0 - progress * 0.25);
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        coreSize * 2.5
      );
      coreGrad.addColorStop(0, colorSecondary);
      coreGrad.addColorStop(0.3, colorAccent);
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.003) * 0.15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer bounding core ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.0 * scaleFactor;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1.0;
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isUsingFallback, isDark]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-brand-light transition-colors duration-300">
      {/* 1. Loading Preloader Overlay (Only for sequence image preloading) */}
      {!isLoaded && !isUsingFallback && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1813] text-white">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6 text-center"
          >
            <div className="relative h-1 w-56 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
              Preloading Cinematic Experience {loadingProgress}%
            </p>
          </motion.div>
        </div>
      )}

      {/* 2. Pinned Canvas Node */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

        {/* Cinematic Backdrop Vignette to add depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.06)_100%)] dark:bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.45)_100%)] pointer-events-none" />
      </div>

      {/* 3. Typography Timeline Overlay (Mapped to activeFrame thresholds) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Step 1: Modern Solutions Overlay (Frames 15 - 45) */}
        <div className="absolute top-[100vh] left-0 w-full h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 md:grid-cols-2">
            <AnimatePresence>
              {activeFrame >= 15 && activeFrame <= 45 && (
                <motion.div
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -45 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 max-w-xl p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50/95 via-white/80 to-indigo-50/95 border border-sky-100 shadow-xl shadow-indigo-900/5 backdrop-blur-xl pointer-events-auto dark:from-[#0d0b1e]/95 dark:via-[#0c0a1d]/90 dark:to-[#05030f]/95 dark:border-indigo-500/20 dark:shadow-indigo-950/20"
                >
                  <div className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-sky-100/50 px-4 py-1 text-[11px] uppercase tracking-[0.35em] font-semibold text-sky-800 dark:border-sky-500/40 dark:bg-sky-950/60 dark:text-sky-200">
                    01 / INTELLIGENT MATCHING
                  </div>
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-none">
                    Smart <br />
                    <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:to-violet-400">Talent Matching</span>
                  </h2>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                    CarrierNest algorithms analyze skills, availability, and role fit in real time—connecting interns and graduates with teams that need them most.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Step 2: Secure Architecture Overlay (Frames 55 - 85) */}
        <div className="absolute top-[200vh] left-0 w-full h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 md:grid-cols-2">
            <div className="md:col-start-2">
              <AnimatePresence>
                {activeFrame >= 55 && activeFrame <= 85 && (
                  <motion.div
                    initial={{ opacity: 0, y: 45 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -45 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 max-w-xl p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50/95 via-white/80 to-indigo-50/95 border border-sky-100 shadow-xl shadow-indigo-900/5 backdrop-blur-xl pointer-events-auto dark:from-[#0d0b1e]/95 dark:via-[#0c0a1d]/90 dark:to-[#05030f]/95 dark:border-indigo-500/20 dark:shadow-indigo-950/20"
                  >
                    <div className="inline-flex items-center gap-3 rounded-full border border-violet-200 bg-violet-100/50 px-4 py-1 text-[11px] uppercase tracking-[0.35em] font-semibold text-violet-800 dark:border-violet-500/40 dark:bg-violet-950/60 dark:text-violet-200">
                      02 / SECURED PIPELINES
                    </div>
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-none">
                      Secure <br />
                      <span className="bg-gradient-to-r from-violet-600 to-sky-600 bg-clip-text text-transparent dark:from-violet-300 dark:to-sky-300">Hiring Workflows</span>
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
                      Enterprise-grade security protects candidate data, employer records, and placement pipelines—so every stakeholder hires with confidence.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
