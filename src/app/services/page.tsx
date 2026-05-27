'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Layout,
  Users,
  GraduationCap,
  Zap,
  Sparkles,
  BarChart3,
  Briefcase,
  Award,
  TrendingUp,
  Globe,
  Send,
  AlertCircle,
} from 'lucide-react';
import SiteLayout from '@/components/layout/SiteLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import { useServices } from '@/hooks/useServices';

/* ─── Icon Mapping ─────────────────────────────────────────── */

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

/* ─── Skeleton Loader ──────────────────────────────────────── */

function ServiceCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Accent glow shimmer */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-secondary/5 blur-3xl animate-shimmer" />

      {/* Icon + Price row */}
      <div className="flex items-start justify-between gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white/[0.06] animate-shimmer" />
        <div className="h-7 w-28 rounded-full bg-white/[0.06] animate-shimmer" />
      </div>

      {/* Title */}
      <div className="mt-6 h-7 w-3/4 rounded-xl bg-white/[0.06] animate-shimmer" />

      {/* Description lines */}
      <div className="mt-5 space-y-2.5">
        <div className="h-4 w-full rounded-lg bg-white/[0.04] animate-shimmer" />
        <div className="h-4 w-11/12 rounded-lg bg-white/[0.04] animate-shimmer" />
        <div className="h-4 w-4/5 rounded-lg bg-white/[0.04] animate-shimmer" />
      </div>

      {/* Feature dots */}
      <div className="mt-6 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/[0.08] animate-shimmer" />
            <div
              className="h-3.5 rounded-md bg-white/[0.04] animate-shimmer"
              style={{ width: `${60 + i * 12}%` }}
            />
          </div>
        ))}
      </div>

      {/* CTA placeholder */}
      <div className="mt-8 pt-6 border-t border-white/[0.04]">
        <div className="h-12 w-40 rounded-2xl bg-white/[0.06] animate-shimmer" />
      </div>
    </div>
  );
}

/* ─── Service Card ─────────────────────────────────────────── */

function ServiceCard({
  service,
  index,
}: {
  service: {
    id: string;
    name: string;
    description: string;
    longDescription: string;
    price: string;
    features: string[];
    icon: string;
  };
  index: number;
}) {
  const Icon = iconMap[service.icon] ?? Zap;

  return (
    <motion.article
      key={service.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-400 hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1"
    >
      {/* Subtle corner accent glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-secondary/5 blur-3xl transition-colors duration-500 group-hover:bg-brand-secondary/10" />
      <div className="absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-brand-accent/5 blur-3xl transition-colors duration-500 group-hover:bg-brand-accent/8" />

      {/* Header: Icon + Price */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-secondary/15 to-brand-accent/15 border border-brand-secondary/10 text-brand-secondary transition-all duration-300 group-hover:from-brand-secondary/25 group-hover:to-brand-accent/25">
          <Icon className="h-6 w-6" />
        </div>
        <span className="inline-flex items-center rounded-full bg-brand-secondary/8 border border-brand-secondary/15 px-4 py-1.5 text-sm font-bold text-brand-secondary tracking-tight">
          {service.price}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-extrabold text-white tracking-tight leading-snug lg:text-2xl">
        {service.name}
      </h3>

      {/* Long Description */}
      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
        {service.longDescription || service.description}
      </p>

      {/* Features list */}
      {service.features && service.features.length > 0 && (
        <ul className="mt-6 space-y-2.5">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
              <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-8 pt-6 border-t border-white/[0.04]">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-brand-secondary/10 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-secondary/15"
        >
          <Send className="h-4 w-4" />
          Inquire Now
        </Link>
      </div>
    </motion.article>
  );
}

/* ─── Error State ──────────────────────────────────────────── */

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">
        <AlertCircle className="h-7 w-7 text-red-400" />
      </div>
      <p className="text-lg font-semibold text-white">{message}</p>
      <p className="mt-2 text-sm text-slate-400 max-w-md">
        We couldn't connect to the services database. Please check your internet connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-6 py-3 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Retry
      </button>
    </div>
  );
}

/* ─── Empty State ──────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-secondary/10 border border-brand-secondary/15 mb-5">
        <Briefcase className="h-7 w-7 text-brand-secondary" />
      </div>
      <p className="text-lg font-semibold text-white">No Services Available</p>
      <p className="mt-2 text-sm text-slate-400 max-w-md">
        Our service catalog is currently being updated. Please check back soon or reach out to us directly.
      </p>
      <Link
        href="/contact"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-6 py-3 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90"
      >
        <Send className="h-4 w-4" />
        Contact Us
      </Link>
    </div>
  );
}

/* ─── Page Component ───────────────────────────────────────── */

export default function ServicesPage() {
  const { services, loading, error, refresh } = useServices();

  return (
    <SiteLayout>
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Page Heading */}
          <SectionHeading
            badge="Services"
            title="Enterprise-ready"
            highlight="HR solutions"
            description="Explore our full suite of placement, recruitment, and analytics services. Each offering is backed by real-time data and designed to scale with your organization."
          />

          {/* Error State */}
          {error && !loading && <ErrorState message={error} onRetry={refresh} />}

          {/* Loading Skeleton Grid */}
          {loading && (
            <div className="grid gap-8 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} index={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && services.length === 0 && <EmptyState />}

          {/* Service Cards Grid */}
          {!loading && !error && services.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-2">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}

          {/* Bottom CTA Section */}
          {!loading && !error && services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-20 text-center"
            >
              <div className="relative inline-block rounded-3xl border border-white/[0.06] bg-white/[0.02] px-10 py-10 sm:px-16 backdrop-blur-md overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-secondary/5 via-transparent to-brand-accent/5" />

                <div className="relative">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Need a custom solution?
                  </h3>
                  <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Our team can tailor a package that aligns with your hiring goals, budget, and timeline. Let's start a conversation.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-8 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-brand-secondary/10 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                  >
                    <Send className="h-4 w-4" />
                    Get a Custom Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
