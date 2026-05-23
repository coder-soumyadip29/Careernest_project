interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, id, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 dark:border-indigo-500/15 dark:bg-[#080614] dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-2 dark:focus:ring-indigo-400/20';
