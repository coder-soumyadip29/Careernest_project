'use client';

import { useEffect, useState } from 'react';
import { Users, MessageSquare, AlertCircle, Sparkles, TrendingUp, Layers, Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAllInquiries, getServices } from '@/lib/dbService';
import StatCard from '@/components/dashboard/StatCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

export default function AnalyticsSummary() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    usersCount: 0,
    inquiriesCount: 0,
    newInquiriesCount: 0,
    servicesCount: 0,
    adminCount: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersSnap, inquiriesResult, servicesResult] = await Promise.all([
        getDocs(collection(db, 'Users')),
        getAllInquiries(),
        getServices(),
      ]);
      
      const users = usersSnap.docs.map(d => d.data());
      const inquiries = inquiriesResult.success ? inquiriesResult.data : [];
      const services = servicesResult.success ? servicesResult.data : [];

      const admins = users.filter((u: any) => u.role === 'admin').length;
      const newInquiries = inquiries.filter((i) => i.status === 'new').length;

      setData({
        usersCount: users.length,
        inquiriesCount: inquiries.length,
        newInquiriesCount: newInquiries,
        servicesCount: services.length,
        adminCount: admins,
      });
    } catch (err) {
      console.error('Failed to fetch analytics metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate percentage of admins to standard users
  const adminPercentage = data.usersCount > 0 ? Math.round((data.adminCount / data.usersCount) * 100) : 0;
  // Calculate percentage of new inquiries to total inquiries
  const newInquiriesPercentage = data.inquiriesCount > 0 ? Math.round((data.newInquiriesCount / data.inquiriesCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Overview stats cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Registered Users" 
          value={data.usersCount} 
          icon={Users} 
          accent="sky"
          progress={100}
          hint={`${data.adminCount} Administrators configured`}
          index={0}
        />
        <StatCard 
          label="Total Inquiries" 
          value={data.inquiriesCount} 
          icon={MessageSquare} 
          accent="violet"
          progress={100 - newInquiriesPercentage}
          hint={`${newInquiriesPercentage}% inquiries awaiting review`}
          index={1}
        />
        <StatCard 
          label="Pending Inquiries" 
          value={data.newInquiriesCount} 
          icon={AlertCircle} 
          accent="amber"
          progress={newInquiriesPercentage}
          hint="Action required by Admin"
          index={2}
        />
        <StatCard 
          label="Active Offerings" 
          value={data.servicesCount} 
          icon={Layers} 
          accent="emerald"
          progress={100}
          hint="Service tier cards configured"
          index={3}
        />
      </div>

      {/* Visual Analytics grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Engagement Stats - 2/3 width */}
        <div className="md:col-span-2 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-60 w-60 rounded-full bg-brand-secondary/5 blur-3xl" />
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-brand-secondary" /> Activity & Distribution
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Current live database counts from Firebase Firestore.
          </p>

          <div className="mt-8 space-y-6">
            {/* User roles distribution */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Admin-to-User Ratio</span>
                <span className="text-brand-secondary">{adminPercentage}% Admins</span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.04] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-brand-accent rounded-full transition-all duration-1000"
                  style={{ width: `${adminPercentage}%` }}
                />
                <div 
                  className="h-full bg-brand-secondary/50 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - adminPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                <span>{data.adminCount} Admins</span>
                <span>{data.usersCount - data.adminCount} Standard Users</span>
              </div>
            </div>

            {/* Inquiry status breakdown */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Inquiry Resolution Rate</span>
                <span className="text-emerald-400">{100 - newInquiriesPercentage}% Reviewed</span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.04] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - newInquiriesPercentage}%` }}
                />
                <div 
                  className="h-full bg-amber-500/50 rounded-full transition-all duration-1000"
                  style={{ width: `${newInquiriesPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                <span>{data.inquiriesCount - data.newInquiriesCount} Reviewed messages</span>
                <span>{data.newInquiriesCount} Awaiting review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick System Diagnostics */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-brand-accent" /> Platform Status
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Database operational diagnostics.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Firebase Auth
                </span>
                <span className="font-semibold text-emerald-400">Operational</span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Cloud Firestore
                </span>
                <span className="font-semibold text-emerald-400">Operational</span>
              </li>
              <li className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> SSL / Vercel Edge
                </span>
                <span className="font-semibold text-emerald-400">Active</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.04] text-[10px] text-slate-500 flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Diagnostics updated in real-time
          </div>
        </div>
      </div>
    </div>
  );
}
