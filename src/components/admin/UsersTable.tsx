'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Shield, User, ArrowUpDown, AlertTriangle, X } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/lib/types';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function UsersTable() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  
  // States for Modals
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'Users'));
      const data = snap.docs.map((d) => d.data() as UserProfile);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSort = (field: 'name' | 'email' | 'role') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users
    .filter((u) => {
      const query = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });

  const handleUpdateRole = async (userToUpdate: UserProfile, newRole: 'user' | 'admin') => {
    setActionLoading(true);
    try {
      const userDoc = doc(db, 'Users', userToUpdate.uid);
      await updateDoc(userDoc, { role: newRole });
      if (userToUpdate.uid === currentUser?.uid) {
        await refreshUser();
      }
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setActionLoading(true);
    try {
      const userDoc = doc(db, 'Users', deletingUser.uid);
      await deleteDoc(userDoc);
      setDeletingUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/30 transition-all duration-300"
          />
        </div>
        <div className="text-xs text-slate-400 flex items-center justify-end px-1">
          Showing {filteredUsers.length} of {users.length} registered accounts
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.01] text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1.5">
                    Email <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-1.5">
                    Role <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = u.uid === currentUser?.uid;
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.uid} className="group hover:bg-white/[0.02] transition-colors duration-200">
                      <td className="px-6 py-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold bg-gradient-to-br ${
                            isAdmin ? 'from-violet-500/20 to-brand-accent/20 text-brand-accent' : 'from-slate-700/20 to-slate-600/20 text-slate-300'
                          } border border-white/5`}>
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="block">{u.name}</span>
                            {isSelf && (
                              <span className="inline-block text-[10px] bg-brand-secondary/10 text-brand-secondary px-1.5 py-0.5 rounded font-medium mt-0.5">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                          isAdmin 
                            ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20' 
                            : 'bg-slate-500/10 text-slate-300 border border-slate-500/10'
                        }`}>
                          {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="inline-flex h-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            Change Role
                          </button>
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => setDeletingUser(u)}
                            className={`p-2 rounded-xl border border-white/5 transition duration-200 ${
                              isSelf 
                                ? 'opacity-40 cursor-not-allowed text-slate-600' 
                                : 'bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                            }`}
                            title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0a1a]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-secondary" /> Change User Role
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Select a new role for <span className="font-semibold text-white">{editingUser.name}</span> ({editingUser.email}).
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateRole(editingUser, 'user')}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  editingUser.role === 'user'
                    ? 'border-brand-secondary bg-brand-secondary/5 text-white'
                    : 'border-white/[0.06] bg-white/[0.01] text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">User Role</p>
                  <p className="text-xs text-slate-500 mt-1">Standard member permissions. Access to user portal.</p>
                </div>
                {editingUser.role === 'user' && <div className="h-2.5 w-2.5 rounded-full bg-brand-secondary" />}
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleUpdateRole(editingUser, 'admin')}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  editingUser.role === 'admin'
                    ? 'border-violet-500 bg-violet-500/5 text-white'
                    : 'border-white/[0.06] bg-white/[0.01] text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                }`}
              >
                <div>
                  <p className="font-bold text-sm">Admin Role</p>
                  <p className="text-xs text-slate-500 mt-1">Full platform access. Manage users, offerings, and view analytics.</p>
                </div>
                {editingUser.role === 'admin' && <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />}
              </button>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-white/[0.08] px-4.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.04]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeletingUser(null)} />
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-[#0c0a1a]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" /> Confirm Deletion
            </h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete the user profile for <span className="font-semibold text-white">{deletingUser.name}</span> ({deletingUser.email})?
              <br />
              <span className="block mt-2 font-medium text-red-400">
                This action is permanent and will immediately delete their Firestore profile documentation.
              </span>
            </p>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeletingUser(null)}
                className="rounded-xl border border-white/[0.08] px-4.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.04] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteUser}
                className="rounded-xl bg-red-600 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
