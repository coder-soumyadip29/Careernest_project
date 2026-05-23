'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/context/AuthContext';
import { getInquiries } from '@/lib/storage';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const all = getInquiries();
    setInquiryCount(all.filter((i) => i.userId === user?.id || i.email === user?.email).length);
  }, [user]);

  return (
    <DashboardShell variant="user">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Welcome, {user?.name}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Track your placement activity, update your profile, and submit hiring inquiries.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Your Inquiries" value={inquiryCount} hint="Submissions to CarrierNest" />
          <StatCard label="Profile Status" value="Active" hint="Account in good standing" />
          <StatCard label="Program Access" value="Standard" hint="Upgrade for enterprise features" />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link
            href="/dashboard/profile"
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 transition hover:-translate-y-0.5 dark:border-slate-600/50 dark:bg-slate-900/90"
          >
            <h3 className="font-bold text-slate-900 dark:text-white">Update Profile</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Edit your name, email, password, and avatar.</p>
          </Link>
          <Link
            href="/contact"
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 transition hover:-translate-y-0.5 dark:border-slate-600/50 dark:bg-slate-900/90"
          >
            <h3 className="font-bold text-slate-900 dark:text-white">Submit Inquiry</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Contact our team about placements or partnerships.</p>
          </Link>
          <Link
            href="/services"
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 transition hover:-translate-y-0.5 dark:border-slate-600/50 dark:bg-slate-900/90"
          >
            <h3 className="font-bold text-slate-900 dark:text-white">Browse Services</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">View detailed offerings and pricing.</p>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
