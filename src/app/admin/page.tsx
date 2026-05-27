'use client';

import DashboardShell from '@/components/layout/DashboardShell';
import AnalyticsSummary from '@/components/admin/AnalyticsSummary';

export default function AdminDashboardPage() {
  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Analytics Overview</h1>
        <p className="mt-2 text-slate-400">
          High-level insights, registration metrics, and contact form diagnostics.
        </p>
        <div className="mt-8">
          <AnalyticsSummary />
        </div>
      </div>
    </DashboardShell>
  );
}
