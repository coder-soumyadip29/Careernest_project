'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import FormField, { inputClassName } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const { user, submitInquiry } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Valid email is required.';
    if (!message.trim() || message.trim().length < 10) next.message = 'Message must be at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    setSubmitting(true);
    await submitInquiry({ name, email, phone, subject, message });
    setSubmitting(false);
    setSuccess(true);
    setMessage('');
    setSubject('');
    if (!user) {
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-lg dark:border-slate-600/50 dark:bg-slate-900/90 ${compact ? '' : 'lg:p-10'}`}
    >
      <div className={`grid gap-5 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <FormField label="Full Name" id="contact-name" error={errors.name}>
          <input id="contact-name" className={inputClassName} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </FormField>
        <FormField label="Email" id="contact-email" error={errors.email}>
          <input id="contact-email" type="email" className={inputClassName} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        </FormField>
        {!compact && (
          <>
            <FormField label="Phone (optional)" id="contact-phone">
              <input id="contact-phone" className={inputClassName} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </FormField>
            <FormField label="Subject (optional)" id="contact-subject">
              <input id="contact-subject" className={inputClassName} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Partnership inquiry" />
            </FormField>
          </>
        )}
      </div>
      <div className="mt-5">
        <FormField label="Message" id="contact-message" error={errors.message}>
          <textarea
            id="contact-message"
            rows={compact ? 4 : 5}
            className={`${inputClassName} resize-none`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your hiring or placement needs..."
          />
        </FormField>
      </div>
      {success && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          Thank you! Your inquiry has been submitted. Our team will respond within 24 hours.
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-brand-primary px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60 dark:bg-white dark:text-slate-900"
      >
        <Send className="h-4 w-4" />
        {submitting ? 'Sending...' : 'Submit Inquiry'}
      </button>
    </motion.form>
  );
}
