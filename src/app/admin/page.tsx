'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import StatCard from '@/components/dashboard/StatCard';
import { getInquiries, getServices, getUsers } from '@/lib/storage';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, inquiries: 0, newInquiries: 0, services: 0 });

  useEffect(() => {
    const inquiries = getInquiries();
    setStats({
      users: getUsers().length,
      inquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === 'new').length,
      services: getServices().length,
    });
  }, []);

  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Admin Overview</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Manage users, inquiries, and platform content from a single control center.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={stats.users} />
          <StatCard label="Total Inquiries" value={stats.inquiries} />
          <StatCard label="New Inquiries" value={stats.newInquiries} hint="Awaiting review" />
          <StatCard label="Active Services" value={stats.services} />
        </div>
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-600/50 dark:bg-slate-900/90">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analytics (Optional)</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Platform engagement metrics will appear here once backend analytics APIs are connected. Current counts reflect live local data from registrations and contact submissions.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
