'use client';

import DashboardShell from '@/components/layout/DashboardShell';
import InquiriesTable from '@/components/admin/InquiriesTable';

export default function AdminInquiriesPage() {
  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Inquiries Inbox</h1>
        <p className="mt-2 text-slate-400">Review and manage client contact form submissions and callback requests.</p>
        <div className="mt-8">
          <InquiriesTable />
        </div>
      </div>
    </DashboardShell>
  );
}
