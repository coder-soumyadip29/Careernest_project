'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  FileText,
  LogOut,
  Home,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

interface DashboardShellProps {
  children: React.ReactNode;
  variant: 'user' | 'admin';
}

const userLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/contact', label: 'Submit Inquiry', icon: MessageSquare },
];

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/content', label: 'Manage Content', icon: FileText },
];

export default function DashboardShell({ children, variant }: DashboardShellProps) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const links = variant === 'admin' ? adminLinks : userLinks;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (variant === 'admin' && user.role !== 'admin') router.replace('/dashboard');
    if (variant === 'user' && user.role === 'admin') router.replace('/admin');
  }, [user, loading, variant, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/80 bg-white/80 dark:border-slate-700 dark:bg-slate-950/90">
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-700">
          <Link href="/" className="text-lg font-extrabold text-brand-primary">
            CarrierNest
          </Link>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {variant === 'admin' ? 'Admin Panel' : 'User Dashboard'}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-primary text-white dark:bg-sky-400 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-700 space-y-2">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-secondary">
            <Home className="h-4 w-4" /> Back to website
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/75 px-6 py-4 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-950/75">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="font-bold text-brand-primary">{user.name}</p>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex-1 p-6 sm:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
