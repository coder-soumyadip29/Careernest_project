'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex bg-[var(--color-background)]">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:flex w-[260px] flex-col border-r border-white/[0.06] bg-white/[0.02]">
          <div className="p-6">
            <div className="h-6 w-32 rounded-lg bg-white/[0.06] animate-shimmer" />
          </div>
          <div className="flex-1 p-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 rounded-xl bg-white/[0.04] animate-shimmer" />
            ))}
          </div>
        </aside>
        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
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

  return <>{children}</>;
}
