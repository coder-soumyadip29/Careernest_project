import SiteLayout from '@/components/layout/SiteLayout';
import SectionHeading from '@/components/ui/SectionHeading';
import ContactForm from '@/components/forms/ContactForm';
import { companyInfo } from '@/lib/data';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeading
            badge="Contact"
            title="We're here to"
            highlight="help you hire"
            description="Submit an inquiry and our placement specialists will reach out within one business day."
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: companyInfo.email },
                { icon: Phone, label: 'Phone', value: companyInfo.phone },
                { icon: MapPin, label: 'Location', value: companyInfo.address },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-600/50 dark:bg-slate-900/80">
                  <item.icon className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
