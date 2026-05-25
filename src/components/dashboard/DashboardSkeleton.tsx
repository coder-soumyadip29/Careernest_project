'use client';

/**
 * Skeleton loading UI for the dashboard overview.
 * Mirrors the layout of the real dashboard content so the transition
 * from skeleton → data feels seamless.
 */

function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-white/[0.06] animate-shimmer ${className}`}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl animate-in fade-in">
      {/* Welcome text skeleton */}
      <Bone className="h-9 w-72 mb-3" />
      <Bone className="h-5 w-96 mb-10" />

      {/* Stat cards skeleton — 4 cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-4"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <Bone className="h-10 w-10 rounded-xl" />
            <Bone className="h-8 w-16" />
            <Bone className="h-4 w-28" />
            <Bone className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Quick Actions skeleton — 3 cards */}
      <Bone className="h-6 w-32 mt-12 mb-5" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-3"
            style={{ animationDelay: `${(i + 4) * 120}ms` }}
          >
            <Bone className="h-10 w-10 rounded-xl" />
            <Bone className="h-5 w-36" />
            <Bone className="h-4 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
