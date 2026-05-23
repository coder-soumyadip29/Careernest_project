'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DashboardShell from '@/components/layout/DashboardShell';
import FormField, { inputClassName } from '@/components/ui/FormField';
import type { ServiceItem } from '@/lib/types';
import { generateId, getServices, saveServices } from '@/lib/storage';

const emptyService = (): ServiceItem => ({
  id: generateId('svc'),
  name: '',
  description: '',
  longDescription: '',
  price: '',
  features: [''],
  icon: 'zap',
});

export default function AdminContentPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editing, setEditing] = useState<ServiceItem | null>(null);

  const load = () => setServices(getServices());

  useEffect(() => {
    load();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const cleaned = {
      ...editing,
      features: editing.features.filter((f) => f.trim()),
    };
    const exists = services.some((s) => s.id === cleaned.id);
    saveServices(exists ? services.map((s) => (s.id === cleaned.id ? cleaned : s)) : [cleaned, ...services]);
    setEditing(null);
    load();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this service?')) return;
    saveServices(services.filter((s) => s.id !== id));
    load();
  };

  return (
    <DashboardShell variant="admin">
      <div className="max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-primary">Manage Content</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Add, edit, or remove services displayed on the website.</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(emptyService())}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-accent px-5 py-2.5 text-sm font-bold text-slate-950"
          >
            <Plus className="h-4 w-4" /> Add Service
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-600/50 dark:bg-slate-900/90"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-1">{s.description}</p>
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">{s.price}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(s)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <form onSubmit={handleSave} className="mt-8 space-y-4 rounded-2xl border border-sky-200 p-6 dark:border-sky-800 dark:bg-slate-900/90">
            <h2 className="font-bold text-slate-900 dark:text-white">{services.some((s) => s.id === editing.id) ? 'Edit Service' : 'New Service'}</h2>
            <FormField label="Name" id="svc-name">
              <input id="svc-name" className={inputClassName} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            </FormField>
            <FormField label="Short Description" id="svc-desc">
              <input id="svc-desc" className={inputClassName} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required />
            </FormField>
            <FormField label="Long Description" id="svc-long">
              <textarea id="svc-long" rows={3} className={`${inputClassName} resize-none`} value={editing.longDescription} onChange={(e) => setEditing({ ...editing, longDescription: e.target.value })} />
            </FormField>
            <FormField label="Price" id="svc-price">
              <input id="svc-price" className={inputClassName} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </FormField>
            <FormField label="Features (comma-separated)" id="svc-features">
              <input
                id="svc-features"
                className={inputClassName}
                value={editing.features.join(', ')}
                onChange={(e) => setEditing({ ...editing, features: e.target.value.split(',').map((f) => f.trim()) })}
              />
            </FormField>
            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                Save Service
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-5 py-2 text-sm dark:border-slate-600">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
