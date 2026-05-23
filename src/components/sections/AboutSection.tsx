'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Building2 } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { companyInfo } from '@/lib/data';

const cards = [
  {
    icon: Building2,
    title: 'Who We Are',
    body: companyInfo.about,
  },
  {
    icon: Target,
    title: 'Our Mission',
    body: companyInfo.mission,
  },
  {
    icon: Eye,
    title: 'Our Vision',
    body: companyInfo.vision,
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-28 bg-brand-light">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.12),transparent_40%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          badge="About CarrierNest"
          title="Building careers with"
          highlight="enterprise-grade HR technology"
          description="CarrierNest helps universities, startups, and enterprises run placement programs with clarity, security, and measurable outcomes."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="rounded-[1.75rem] border border-sky-100 bg-gradient-to-br from-sky-50/90 to-amber-50/90 p-8 shadow-md dark:from-slate-800/95 dark:to-slate-900/95 dark:border-slate-600/50"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white dark:bg-sky-400 dark:text-slate-900">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{card.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
