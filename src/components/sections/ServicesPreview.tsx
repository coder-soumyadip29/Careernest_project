'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Users, GraduationCap, Zap, Sparkles, BarChart3 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { defaultServices } from '@/lib/data';
import { getServices } from '@/lib/storage';
import { useEffect, useState } from 'react';
import type { ServiceItem } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  layout: Layout,
  graduation: GraduationCap,
  zap: Zap,
  sparkles: Sparkles,
  chart: BarChart3,
};

export default function ServicesPreview() {
  const [preview, setPreview] = useState<ServiceItem[]>(defaultServices.slice(0, 4));

  useEffect(() => {
    setPreview(getServices().slice(0, 4));
  }, []);

  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          badge="Our Services"
          title="Solutions designed for"
          highlight="hiring teams & talent"
          description="From internship pipelines to enterprise dashboards—CarrierNest delivers modular services that scale with your organization."
        />
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
                className="group rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-600/50 dark:bg-slate-900/80"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-secondary to-brand-accent text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{service.description}</p>
                <p className="mt-3 text-sm font-semibold text-sky-700 dark:text-sky-300">{service.price}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
