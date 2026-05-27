'use client';

import DashboardShell from '@/components/layout/DashboardShell';
import ServicesCrud from '@/components/admin/ServicesCrud';

export default function AdminServicesPage() {
  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Manage Services</h1>
        <p className="mt-2 text-slate-400">Create, edit details of, or remove active corporate tier listings.</p>
        <div className="mt-8">
          <ServicesCrud />
        </div>
      </div>
    </DashboardShell>
  );
}
