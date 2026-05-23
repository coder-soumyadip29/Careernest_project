'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Users, GraduationCap, Zap, Sparkles, BarChart3 } from 'lucide-react';
import SiteLayout from '@/components/layout/SiteLayout';
import SectionHeading from '@/components/ui/SectionHeading';
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

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  return (
    <SiteLayout>
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeading
            badge="Services"
            title="Enterprise-ready"
            highlight="HR solutions"
            description="Explore our full suite of placement, recruitment, and analytics services. Request a custom quote for your organization."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] ?? Zap;
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-8 shadow-lg dark:border-slate-600/50 dark:bg-slate-900/90"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-accent text-slate-950">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-200">
                      {service.price}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{service.longDescription}</p>
                  <ul className="mt-5 space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:underline"
                  >
                    Request inquiry <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
