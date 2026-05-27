'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Users, GraduationCap, Zap, Sparkles, BarChart3, Briefcase, Award, TrendingUp, Globe } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { useServices } from '@/hooks/useServices';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  layout: Layout,
  graduation: GraduationCap,
  zap: Zap,
  sparkles: Sparkles,
  chart: BarChart3,
  briefcase: Briefcase,
  award: Award,
  trending: TrendingUp,
  globe: Globe,
};

/* ─── Preview Skeleton ─────────────────────────────────────── */

function PreviewSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-11 w-11 rounded-xl bg-white/[0.06] animate-shimmer" />
          <div className="mt-4 h-5 w-3/4 rounded-lg bg-white/[0.06] animate-shimmer" />
          <div className="mt-3 space-y-2">
            <div className="h-3.5 w-full rounded bg-white/[0.04] animate-shimmer" />
            <div className="h-3.5 w-5/6 rounded bg-white/[0.04] animate-shimmer" />
          </div>
          <div className="mt-4 h-4 w-20 rounded bg-white/[0.06] animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function ServicesPreview() {
  const { services, loading } = useServices();
  const preview = services.slice(0, 4);

  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          badge="Our Services"
          title="Solutions designed for"
          highlight="hiring teams & talent"
          description="From internship pipelines to enterprise dashboards—CarrierNest delivers modular services that scale with your organization."
        />

        {loading ? (
          <PreviewSkeleton />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {preview.map((service, index) => {
              const Icon = iconMap[service.icon] ?? Zap;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.55 }}
                  className="group rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-secondary/15 to-brand-accent/15 border border-brand-secondary/10 text-brand-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{service.name}</h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-3">{service.description}</p>
                  <p className="mt-3 text-sm font-semibold text-brand-secondary">{service.price}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-brand-secondary/10 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
