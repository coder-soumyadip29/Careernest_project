interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-amber-50/90 p-6 dark:from-slate-800/95 dark:to-slate-900/95 dark:border-slate-600/50">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}
