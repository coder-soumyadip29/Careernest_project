'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FolderKanban,
  UserCheck,
  ShieldCheck,
  PenSquare,
  User,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import StatCard from '@/components/dashboard/StatCard';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/context/AuthContext';
import { getInquiries } from '@/lib/storage';

/* ─── Greeting helper ──────────────────────────────────────── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/* ─── Quick Action Card ────────────────────────────────────── */

interface ActionCardProps {
  href: string;
  icon: typeof MessageSquare;
  title: string;
  description: string;
  index: number;
}

function ActionCard({ href, icon: Icon, title, description, index }: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary/10 transition-colors group-hover:bg-brand-secondary/20">
          <Icon className="h-5 w-5 text-brand-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white group-hover:text-brand-secondary transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition-all group-hover:text-brand-secondary group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

/* ─── Dashboard Page ───────────────────────────────────────── */

export default function UserDashboardPage() {
  const { user, firebaseUser } = useAuth();
  const { name, profileCompletion, emailVerified } = useUserData();
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const all = getInquiries();
    setInquiryCount(all.filter((i) => i.userId === user?.uid || i.email === user?.email).length);
  }, [user]);

  const accountStatus = emailVerified ? 'Verified' : 'Active';

  return (
    <DashboardShell variant="user">
      <div className="max-w-6xl">
        {/* ── Welcome Section ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {name || 'there'}
            <span className="inline-block ml-2 origin-[70%_70%] animate-[wave_2.5s_ease-in-out_infinite]">
              👋
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {getFormattedDate()}
            <span className="mx-2 text-slate-700">·</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-secondary">
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </p>
        </motion.div>

        {/* ── Statistics Grid ──────────────────────────────── */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Submitted Inquiries"
            value={inquiryCount}
            hint="Total inquiries sent"
            icon={MessageSquare}
            accent="sky"
            index={0}
          />
          <StatCard
            label="Active Projects"
            value={0}
            hint="No active projects yet"
            icon={FolderKanban}
            accent="violet"
            index={1}
          />
          <StatCard
            label="Profile Completion"
            value={`${profileCompletion}%`}
            hint="Complete your profile for best results"
            icon={UserCheck}
            accent="emerald"
            progress={profileCompletion}
            index={2}
          />
          <StatCard
            label="Account Status"
            value={accountStatus}
            hint={emailVerified ? 'Email verified' : 'Verify your email'}
            icon={ShieldCheck}
            accent="amber"
            index={3}
          />
        </div>

        {/* ── Quick Actions ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
              Quick Actions
            </h2>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              href="/contact"
              icon={PenSquare}
              title="Submit New Inquiry"
              description="Contact our team about placements, partnerships, or custom requirements."
              index={0}
            />
            <ActionCard
              href="/dashboard/profile"
              icon={User}
              title="Update Profile"
              description="Edit your name, avatar, password, and account information."
              index={1}
            />
            <ActionCard
              href="/services"
              icon={Briefcase}
              title="Browse Services"
              description="View detailed offerings, pricing, and feature comparisons."
              index={2}
            />
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
