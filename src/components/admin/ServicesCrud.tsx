'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Pencil, Trash2, Zap, Briefcase, GraduationCap, Award, TrendingUp, Globe, X, 
  Layers, AlertCircle 
} from 'lucide-react';
import { getServices, addService, updateService, deleteService } from '@/lib/dbService';
import type { ServiceItem } from '@/lib/types';
import FormField, { inputClassName } from '@/components/ui/FormField';

const ICON_MAP = {
  zap: Zap,
  briefcase: Briefcase,
  graduation: GraduationCap,
  award: Award,
  trending: TrendingUp,
  globe: Globe,
};

type IconName = keyof typeof ICON_MAP;

export default function ServicesCrud() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName>('zap');
  const [validationError, setValidationError] = useState('');

  const loadServices = async () => {
    setLoading(true);
    try {
      const result = await getServices();
      if (result.success) {
        setServices(result.data);
      } else {
        console.error('Failed to load services:', result.error);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openNewModal = () => {
    setName('');
    setDescription('');
    setLongDescription('');
    setPrice('');
    setFeaturesInput('');
    setSelectedIcon('zap');
    setValidationError('');
    setIsNew(true);
    // Create a temporary layout structure
    setEditingService({
      id: '',
      name: '',
      description: '',
      longDescription: '',
      price: '',
      features: [],
      icon: 'zap',
    });
  };

  const openEditModal = (service: ServiceItem) => {
    setName(service.name);
    setDescription(service.description);
    setLongDescription(service.longDescription || '');
    setPrice(service.price);
    setFeaturesInput(service.features ? service.features.join(', ') : '');
    setSelectedIcon((service.icon as IconName) in ICON_MAP ? (service.icon as IconName) : 'zap');
    setValidationError('');
    setIsNew(false);
    setEditingService(service);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price.trim()) {
      setValidationError('Service Name, Short Description, and Price are required.');
      return;
    }
    
    setActionLoading(true);
    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      longDescription: longDescription.trim(),
      price: price.trim(),
      features: featuresInput.split(',').map((f) => f.trim()).filter(Boolean),
      icon: selectedIcon,
    };

    try {
      let result;
      if (isNew) {
        result = await addService(serviceData);
      } else if (editingService) {
        result = await updateService(editingService.id, serviceData);
      }
      
      if (result && !result.success) {
        setValidationError(result.error);
        return;
      }

      setEditingService(null);
      await loadServices();
    } catch (err) {
      console.error('Failed to save service:', err);
      setValidationError('Failed to save service offerings. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      const result = await deleteService(deletingId);
      if (!result.success) {
        console.error('Failed to delete service:', result.error);
        return;
      }
      setDeletingId(null);
      await loadServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          Configure service tier cards displayed to clients on the landing website.
        </p>
        <button
          type="button"
          onClick={openNewModal}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-secondary to-brand-accent px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-brand-secondary/10 hover:opacity-90 transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> Add Service Tier
        </button>
      </div>

      {/* Services Grid layout */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className="h-60 rounded-3xl border border-white/[0.06] bg-white/[0.02] animate-shimmer" 
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          layout 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = ICON_MAP[(s.icon as IconName) in ICON_MAP ? (s.icon as IconName) : 'zap'];
            return (
              <motion.div
                key={s.id}
                layout
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
              >
                {/* Accent glow */}
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-secondary/5 blur-3xl group-hover:bg-brand-secondary/10 transition-colors duration-500" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-secondary/10 border border-brand-secondary/15 text-brand-secondary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      {s.price}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white tracking-tight">{s.name}</h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">{s.description}</p>
                  
                  {s.features && s.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {s.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-brand-accent/60" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                      {s.features.length > 3 && (
                        <li className="text-[10px] text-brand-secondary font-semibold uppercase tracking-wider">
                          + {s.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(s)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.08] transition duration-200"
                    title="Edit Service"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(s.id)}
                    className="p-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition duration-200"
                    title="Delete Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setEditingService(null)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0a1a]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10"
            >
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="absolute right-5 top-5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-secondary" /> 
                {isNew ? 'Create Service Tier' : 'Edit Service details'}
              </h3>
              
              {validationError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-300 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <FormField label="Service Name" id="svc-name">
                  <input
                    id="svc-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Premium Placement Prep"
                    className={inputClassName}
                    required
                  />
                </FormField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Price Tier Label" id="svc-price">
                    <input
                      id="svc-price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹9,999 / mo or Free"
                      className={inputClassName}
                      required
                    />
                  </FormField>

                  <FormField label="Service Icon" id="svc-icon">
                    <div className="flex gap-2 items-center h-[50px] border border-white/[0.08] bg-white/[0.03] rounded-2xl px-2.5">
                      {(Object.keys(ICON_MAP) as IconName[]).map((name) => {
                        const Icon = ICON_MAP[name];
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => setSelectedIcon(name)}
                            className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                              selectedIcon === name 
                                ? 'bg-brand-secondary text-slate-950 font-bold' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                            title={`Select ${name}`}
                          >
                            <Icon className="h-4 w-4" />
                          </button>
                        );
                      })}
                    </div>
                  </FormField>
                </div>

                <FormField label="Short Card Description" id="svc-desc">
                  <input
                    id="svc-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief 1-2 sentence card tagline"
                    className={inputClassName}
                    required
                  />
                </FormField>

                <FormField label="Detailed Description (optional)" id="svc-long">
                  <textarea
                    id="svc-long"
                    rows={2}
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Detailed paragraph for modal popup views"
                    className={`${inputClassName} resize-none`}
                  />
                </FormField>

                <FormField label="Key Features (comma-separated list)" id="svc-features">
                  <textarea
                    id="svc-features"
                    rows={2}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="e.g. 1-on-1 Mentorship, ATS Review, Mock Interviews"
                    className={`${inputClassName} resize-none`}
                  />
                </FormField>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-white/[0.08] px-4.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.04]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-xl bg-gradient-to-r from-brand-secondary to-brand-accent px-5 py-2.5 text-xs font-bold text-slate-950 hover:opacity-95 shadow-md transition-opacity"
                  >
                    {actionLoading ? 'Saving...' : 'Save Offering'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Service Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-[#0c0a1a]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" /> Confirm Deletion
            </h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete this service tier? This will remove it from the database immediately and it will no longer display on the website.
            </p>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-white/[0.08] px-4.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.04] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4.5 py-2.5 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Deleting...' : 'Delete Offering'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
