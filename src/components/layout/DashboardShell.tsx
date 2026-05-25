'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  FileText,
  LogOut,
  Home,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  PenSquare,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

/* ─── Types ────────────────────────────────────────────────── */

interface DashboardShellProps {
  children: React.ReactNode;
  variant: 'user' | 'admin';
}

interface NavLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

/* ─── Navigation Config ────────────────────────────────────── */

const userLinks: NavLink[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/inquiries', label: 'My Inquiries', icon: MessageSquare },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/contact', label: 'Submit Inquiry', icon: PenSquare },
];

const adminLinks: NavLink[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/content', label: 'Manage Content', icon: FileText },
];

/* ─── Breadcrumb helper ────────────────────────────────────── */

function getBreadcrumb(pathname: string, variant: 'user' | 'admin'): string {
  const links = variant === 'admin' ? adminLinks : userLinks;
  const match = links.find((l) => l.href === pathname);
  const base = variant === 'admin' ? 'Admin' : 'Dashboard';
  return match ? `${base} / ${match.label}` : base;
}

/* ─── Avatar Dropdown ──────────────────────────────────────── */

function AvatarDropdown({
  name,
  photoURL,
  onLogout,
}: {
  name: string;
  photoURL: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
      >
        {/* Avatar circle */}
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-brand-secondary/30 to-brand-accent/30">
          {photoURL ? (
            <Image src={photoURL} alt={name} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white/90">{initials || 'U'}</span>
          )}
        </div>
        <span className="hidden text-sm font-semibold text-white/80 sm:block">{name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-white/[0.08] bg-[#12101f]/95 p-1.5 shadow-xl backdrop-blur-xl z-50"
          >
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <div className="my-1 border-t border-white/[0.06]" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Shell ───────────────────────────────────────────── */

export default function DashboardShell({ children, variant }: DashboardShellProps) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = variant === 'admin' ? adminLinks : userLinks;

  /* ── Route protection ────────────────────────────────────── */
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (variant === 'admin' && user.role !== 'admin') router.replace('/dashboard');
    if (variant === 'user' && user.role === 'admin') router.replace('/admin');
  }, [user, loading, variant, router]);

  /* ── Close mobile drawer on route change ─────────────────── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ── Loading / skeleton state ────────────────────────────── */
  if (loading || !user) {
    return (
      <div className="min-h-screen flex bg-[var(--color-background)]">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/[0.06] bg-white/[0.02]">
          <div className="p-6">
            <div className="h-6 w-32 rounded-lg bg-white/[0.06] animate-shimmer" />
          </div>
          <div className="flex-1 p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-11 rounded-xl bg-white/[0.04] animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </aside>
        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar skeleton */}
          <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-6">
            <div className="h-4 w-40 rounded bg-white/[0.06] animate-shimmer" />
            <div className="h-9 w-9 rounded-full bg-white/[0.06] animate-shimmer" />
          </header>
          <div className="flex-1 p-6 sm:p-8 overflow-auto">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  /* ── Sidebar content (shared between desktop & mobile) ──── */
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-secondary to-brand-accent">
          <span className="text-sm font-extrabold text-slate-950">CN</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">CarrierNest</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {variant === 'admin' ? 'Admin Panel' : 'Dashboard'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/[0.06]" />

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 ${
                active
                  ? 'bg-dash-active text-white'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              {/* Active accent bar */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-brand-secondary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <link.icon className={`h-[18px] w-[18px] ${active ? 'text-brand-secondary' : ''}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1">
        <div className="mx-1 mb-2 border-t border-white/[0.06]" />
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
        >
          <Home className="h-[18px] w-[18px]" />
          Back to website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile Drawer Overlay ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-white/[0.06] bg-[#0a0918]/98 backdrop-blur-xl lg:hidden"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Topbar ──────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[var(--color-background)]/80 px-4 sm:px-6 backdrop-blur-lg">
          {/* Left: Hamburger (mobile) + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-slate-500">
              {getBreadcrumb(pathname, variant)}
            </p>
          </div>

          {/* Right: Avatar dropdown */}
          <div className="flex items-center gap-2">
            <AvatarDropdown
              name={user.name}
              photoURL={user.photoURL}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* ── Page Content ────────────────────────────────── */}
        <main className="flex-1 p-5 sm:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
