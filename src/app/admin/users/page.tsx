'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import FormField, { inputClassName } from '@/components/ui/FormField';
import type { User } from '@/lib/types';
import { getUsers, saveUsers } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);

  const load = () => setUsers(getUsers());

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) return;
    if (!confirm('Delete this user?')) return;
    saveUsers(users.filter((u) => u.id !== id));
    load();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    saveUsers(users.map((u) => (u.id === editing.id ? editing : u)));
    if (editing.id === currentUser?.id) refreshUser();
    setEditing(null);
    load();
  };

  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Manage Users</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">View, edit, and remove registered accounts.</p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 dark:border-slate-600/50 dark:bg-slate-900/90">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{u.role}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button type="button" onClick={() => setEditing(u)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={u.id === currentUser?.id}
                      onClick={() => handleDelete(u.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-40 dark:hover:bg-red-950/30"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <form onSubmit={handleSaveEdit} className="mt-8 space-y-4 rounded-2xl border border-sky-200 bg-sky-50/50 p-6 dark:border-sky-800 dark:bg-slate-900/90">
            <h2 className="font-bold text-slate-900 dark:text-white">Edit User</h2>
            <FormField label="Name" id="edit-name">
              <input id="edit-name" className={inputClassName} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </FormField>
            <FormField label="Email" id="edit-email">
              <input id="edit-email" className={inputClassName} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            </FormField>
            <FormField label="Role" id="edit-role">
              <select
                id="edit-role"
                className={inputClassName}
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value as User['role'] })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-5 py-2 text-sm font-semibold dark:border-slate-600">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
