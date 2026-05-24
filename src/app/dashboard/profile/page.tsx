'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import FormField, { inputClassName } from '@/components/ui/FormField';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatar, setAvatar] = useState(user?.photoURL ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.photoURL ?? '');
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const result = await updateProfile({ name, photoURL: avatar });
    if (result.ok) setMessage('Profile updated successfully.');
    else setError(result.error ?? 'Update failed.');
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const result = await changePassword(currentPassword, newPassword);
    if (result.ok) {
      setMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } else setError(result.error ?? 'Password update failed.');
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <DashboardShell variant="user">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-brand-primary">Profile Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Manage your account information and security.</p>

        <div className="mt-8 flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-500">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
            )}
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 dark:border-slate-600 dark:text-slate-100"
            >
              Upload Photo
            </button>
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <form onSubmit={handleProfileSave} className="mt-8 space-y-5 rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-600/50 dark:bg-slate-900/90">
          <h2 className="font-bold text-slate-900 dark:text-white">Account Information</h2>
          <FormField label="Full Name" id="profile-name">
            <input id="profile-name" className={inputClassName} value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="Email" id="profile-email">
            <input id="profile-email" type="email" className={inputClassName} value={email} disabled
              title="Email cannot be changed from here"
            />
          </FormField>
          <button type="submit" className="rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Save Profile
          </button>
        </form>

        <form onSubmit={handlePasswordSave} className="mt-8 space-y-5 rounded-2xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-600/50 dark:bg-slate-900/90">
          <h2 className="font-bold text-slate-900 dark:text-white">Change Password</h2>
          <FormField label="Current Password" id="current-pw">
            <input id="current-pw" type="password" className={inputClassName} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </FormField>
          <FormField label="New Password" id="new-pw">
            <input id="new-pw" type="password" className={inputClassName} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </FormField>
          <button type="submit" className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 dark:border-slate-600 dark:text-slate-100">
            Update Password
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
