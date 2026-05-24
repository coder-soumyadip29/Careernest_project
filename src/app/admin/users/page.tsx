'use client';

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import FormField, { inputClassName } from '@/components/ui/FormField';
import type { UserProfile } from '@/lib/types';
import { getAllUserProfiles, updateUserProfile } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [editing, setEditing] = useState<UserProfile | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const load = async () => {
    setLoadingUsers(true);
    const profiles = await getAllUserProfiles();
    setUsers(profiles);
    setLoadingUsers(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await updateUserProfile(editing.uid, {
      name: editing.name,
      email: editing.email,
      role: editing.role,
    });
    if (editing.uid === currentUser?.uid) await refreshUser();
    setEditing(null);
    await load();
  };

  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Manage Users</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">View and edit registered accounts.</p>

        {loadingUsers ? (
          <p className="mt-8 text-slate-500">Loading users...</p>
        ) : (
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
                  <tr key={u.uid} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{u.role}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button type="button" onClick={() => setEditing(u)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                onChange={(e) => setEditing({ ...editing, role: e.target.value as UserProfile['role'] })}
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
