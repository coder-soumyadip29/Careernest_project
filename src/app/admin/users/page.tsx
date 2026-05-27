'use client';

import DashboardShell from '@/components/layout/DashboardShell';
import UsersTable from '@/components/admin/UsersTable';

export default function AdminUsersPage() {
  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Manage Users</h1>
        <p className="mt-2 text-slate-400">View, sort, filter, modify roles, or delete registered platform accounts.</p>
        <div className="mt-8">
          <UsersTable />
        </div>
      </div>
    </DashboardShell>
  );
}
