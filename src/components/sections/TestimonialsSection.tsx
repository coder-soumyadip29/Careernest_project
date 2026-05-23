'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { testimonials } from '@/lib/data';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-28 bg-brand-light">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          badge="Client Success"
          title="Trusted by"
          highlight="HR leaders & campuses"
          description="Organizations across tech, education, and startups rely on CarrierNest for placement outcomes and hiring efficiency."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-8 shadow-md dark:border-slate-600/50 dark:bg-slate-900/90"
            >
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-slate-700 dark:text-slate-200 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
