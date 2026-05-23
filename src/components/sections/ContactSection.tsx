'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactForm from '@/components/forms/ContactForm';
import { companyInfo } from '@/lib/data';

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          badge="Contact Us"
          title="Let's discuss your"
          highlight="hiring goals"
          description="Reach our team for demos, partnerships, or internship program setup. We respond to every inquiry promptly."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: companyInfo.email, href: `mailto:${companyInfo.email}` },
              { icon: Phone, label: 'Phone', value: companyInfo.phone, href: `tel:${companyInfo.phone.replace(/\s/g, '')}` },
              { icon: MapPin, label: 'Office', value: companyInfo.address, href: '#' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-indigo-500/15 dark:bg-[#0c0a1a]/85"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white dark:bg-gradient-to-br dark:from-sky-400 dark:to-violet-400 dark:text-slate-950">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                  {item.href.startsWith('#') ? (
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.value}</p>
                  ) : (
                    <a href={item.href} className="mt-1 block text-sm font-medium text-sky-700 hover:underline dark:text-sky-300">
                      {item.value}
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 shadow-md dark:border-indigo-500/15">
              <iframe
                title="CarrierNest office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.107469986123!2d77.36!3d28.62!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzEyLjAiTiA3N8KwMjEnMzYuMCJF!5e0!3m2!1sen!2sin!4v1"
                className="h-56 w-full border-0 grayscale-[30%] dark:grayscale-[20%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
