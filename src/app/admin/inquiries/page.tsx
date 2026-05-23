'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import type { Inquiry } from '@/lib/types';
import { getInquiries, saveInquiries } from '@/lib/storage';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const load = () => setInquiries(getInquiries());

  useEffect(() => {
    load();
  }, []);

  const markReviewed = (id: string) => {
    saveInquiries(inquiries.map((i) => (i.id === id ? { ...i, status: 'reviewed' as const } : i)));
    load();
  };

  const remove = (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    saveInquiries(inquiries.filter((i) => i.id !== id));
    load();
  };

  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Inquiry Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Review and respond to contact form submissions.</p>

        <div className="mt-8 space-y-4">
          {inquiries.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No inquiries yet.</p>
          ) : (
            inquiries.map((inq) => (
              <article
                key={inq.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-600/50 dark:bg-slate-900/90"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{inq.name}</p>
                    <p className="text-sm text-sky-700 dark:text-sky-300">{inq.email}</p>
                    {inq.phone && <p className="text-sm text-slate-500">{inq.phone}</p>}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      inq.status === 'new'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
                {inq.subject && <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Subject: {inq.subject}</p>}
                <p className="mt-2 text-slate-600 dark:text-slate-300">{inq.message}</p>
                <p className="mt-3 text-xs text-slate-500">{new Date(inq.timestamp).toLocaleString()}</p>
                <div className="mt-4 flex gap-3">
                  {inq.status === 'new' && (
                    <button
                      type="button"
                      onClick={() => markReviewed(inq.id)}
                      className="rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-900"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button type="button" onClick={() => remove(inq.id)} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
