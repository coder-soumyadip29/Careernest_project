'use client';

import { useEffect, useState } from 'react';
import { 
  Search, MessageSquare, Check, Trash2, Calendar, Mail, Phone, 
  ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAllInquiries } from '@/lib/dbService';
import type { Inquiry } from '@/lib/types';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'reviewed'>('all');
  
  // Expandable row state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Deletion state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const result = await getAllInquiries();
      if (result.success) {
        setInquiries(result.data);
      } else {
        console.error('Failed to load inquiries:', result.error);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleMarkReviewed = async (id: string) => {
    setActionLoading(true);
    try {
      const inquiryDoc = doc(db, 'Inquiries', id);
      await updateDoc(inquiryDoc, { status: 'reviewed' });
      await loadInquiries();
    } catch (err) {
      console.error('Failed to mark inquiry as reviewed:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      const inquiryDoc = doc(db, 'Inquiries', deletingId);
      await deleteDoc(inquiryDoc);
      setDeletingId(null);
      await loadInquiries();
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredInquiries = inquiries.filter((inq) => {
    // 1. Filter by search query
    const query = search.toLowerCase();
    const matchesSearch = 
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      (inq.subject && inq.subject.toLowerCase().includes(query)) ||
      inq.message.toLowerCase().includes(query);
      
    // 2. Filter by status tabs
    const matchesStatus = 
      filterStatus === 'all' || 
      inq.status === filterStatus;
      
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Search & Tabs Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/30 transition-all duration-300"
          />
        </div>

        {/* Status Filters */}
        <div className="flex rounded-2xl bg-white/[0.02] border border-white/[0.08] p-1 self-start">
          {(['all', 'new', 'reviewed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-brand-secondary/15 text-white border border-brand-secondary/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'all' ? 'All Inquiries' : `${status} messages`}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries table layout */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.01] text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="w-10 px-6 py-4"></th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Received At</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const isExpanded = expandedId === inq.id;
                  const isNew = inq.status === 'new';
                  return (
                    <>
                      <tr 
                        key={inq.id}
                        className={`group hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer ${
                          isNew ? 'bg-brand-secondary/[0.01]' : ''
                        }`}
                        onClick={() => toggleExpand(inq.id)}
                      >
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => toggleExpand(inq.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className={`font-semibold ${isNew ? 'text-white' : 'text-slate-300'}`}>
                              {inq.name}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Mail className="h-3 w-3 shrink-0" /> {inq.email}
                            </span>
                            {inq.phone && (
                              <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Phone className="h-3 w-3 shrink-0" /> {inq.phone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <div className="max-w-[200px] truncate">
                            {inq.subject || <span className="italic text-slate-500">No subject</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          <span className="text-xs flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {new Date(inq.timestamp).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            isNew 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            {isNew && (
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleMarkReviewed(inq.id)}
                                className="p-2 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 transition duration-200"
                                title="Mark as Reviewed"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeletingId(inq.id)}
                              className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition duration-200"
                              title="Delete inquiry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Message view row */}
                      {isExpanded && (
                        <tr className="bg-white/[0.01]">
                          <td colSpan={6} className="px-6 py-5 border-t border-white/[0.04] cursor-default">
                            <div className="p-4 rounded-2xl border border-white/[0.04] bg-[#090815]/50">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Message Body</p>
                              <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                                {inq.message}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeletingId(null)} />
          
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-[#0c0a1a]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" /> Confirm Deletion
            </h3>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Are you sure you want to delete this inquiry message? This action cannot be undone.
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
                {actionLoading ? 'Deleting...' : 'Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
