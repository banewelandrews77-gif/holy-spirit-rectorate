import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Bell, 
  Calendar, 
  Mail, 
  ArrowUpRight, 
  TrendingUp, 
  CreditCard, 
  Printer, 
  Church, 
  Plus, 
  FileText,
  Clock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DonationReceipt } from '../../types';
import { DonationReceiptModal } from '../../components/DonationReceiptModal';

export const AdminDashboardPage: React.FC = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<DonationReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/donations/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const viewReceipt = (receiptNumber: string) => {
    fetch(`/api/donations/receipt/${receiptNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.receipt) {
          setSelectedReceipt(data.receipt);
          setReceiptModalOpen(true);
        }
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalAmount = stats?.overview?.totalAmount || 0;
  const totalCount = stats?.overview?.totalCount || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">
            Administrative Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-liturgical text-slate-900 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role: <strong className="capitalize text-slate-800">{user?.role}</strong> • Holy Spirit Rectorate & Outstations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/announcements"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </Link>

          <Link
            to="/admin/donations"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Donations CSV</span>
          </Link>
        </div>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Donations */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Giving</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block">
            GHS {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium block">
            Across all 3 church centers
          </span>
        </div>

        {/* Total Offerings / Donors */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Offerings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block">
            {totalCount}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Recorded digital transactions
          </span>
        </div>

        {/* Active Centers */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parish Centers</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Church className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block">
            3
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Holy Spirit • St. Anthony • St. Matthew
          </span>
        </div>

        {/* Active Channels */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Gateways</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 block">
            3
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Mobile Money • Cards • PayPal
          </span>
        </div>

      </div>

      {/* SUB-STATIONS & OUTSTATIONS DIRECT EDITING HUB */}
      <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-6 border border-amber-900/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Church className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">Sub-Stations Management</span>
            </div>
            <h3 className="text-xl font-bold font-liturgical text-white mt-1">
              Direct Editing by Station & Outstation
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Select any station below to edit its liturgical timetable, publish station notices, or add feast day events.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Master Admin Access Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Holy Spirit Rectorate */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏛️</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Principal Seat
                </span>
              </div>
              <h4 className="font-bold font-liturgical text-base text-white">Holy Spirit Rectorate</h4>
              <p className="text-[11px] text-stone-400 mt-1">Main Parish Avenue, Cathedral Road</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <Link
                to="/admin/timetable?station=holy-spirit"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edit Mass Schedules</span>
                </span>
                <span className="text-[10px] opacity-80">Edit →</span>
              </Link>
              <Link
                to="/admin/subchurches?station=holy-spirit"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 hover:text-white font-medium transition"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Societies & PPC Executives</span>
                </span>
                <span className="text-[10px] opacity-75">Manage →</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/admin/announcements?station=holy-spirit"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Bell className="w-3 h-3 text-amber-300" />
                  <span>Post Notice</span>
                </Link>
                <Link
                  to="/admin/events?station=holy-spirit"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Calendar className="w-3 h-3 text-amber-300" />
                  <span>Add Event</span>
                </Link>
              </div>
              <Link
                to="/"
                target="_blank"
                className="block text-center text-[10px] text-stone-400 hover:text-amber-300 transition pt-1"
              >
                View Public Sanctuary Page ↗
              </Link>
            </div>
          </div>

          {/* Card 2: St. Anthony of Padua */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⛪</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Outstation
                </span>
              </div>
              <h4 className="font-bold font-liturgical text-base text-white">St. Anthony of Padua</h4>
              <p className="text-[11px] text-stone-400 mt-1">13 Tuesdays Devotion & Bread Blessing</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <Link
                to="/admin/timetable?station=st-anthony"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edit Mass & Devotions</span>
                </span>
                <span className="text-[10px] opacity-80">Edit →</span>
              </Link>
              <Link
                to="/admin/subchurches?station=st-anthony"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 hover:text-white font-medium transition"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Societies & Outstation Council</span>
                </span>
                <span className="text-[10px] opacity-75">Manage →</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/admin/announcements?station=st-anthony"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Bell className="w-3 h-3 text-amber-300" />
                  <span>Post Notice</span>
                </Link>
                <Link
                  to="/admin/events?station=st-anthony"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Calendar className="w-3 h-3 text-amber-300" />
                  <span>Add Event</span>
                </Link>
              </div>
              <Link
                to="/subchurches/st-anthony"
                target="_blank"
                className="block text-center text-[10px] text-stone-400 hover:text-amber-300 transition pt-1"
              >
                View St. Anthony Outstation Page ↗
              </Link>
            </div>
          </div>

          {/* Card 3: St. Matthew Catholic Church */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⛪</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Outstation
                </span>
              </div>
              <h4 className="font-bold font-liturgical text-base text-white">St. Matthew Catholic</h4>
              <p className="text-[11px] text-stone-400 mt-1">Community Center Junction</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <Link
                to="/admin/timetable?station=st-matthew"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition"
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Edit Mass & Devotions</span>
                </span>
                <span className="text-[10px] opacity-80">Edit →</span>
              </Link>
              <Link
                to="/admin/subchurches?station=st-matthew"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-stone-200 hover:text-white font-medium transition"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Societies & Outstation Council</span>
                </span>
                <span className="text-[10px] opacity-75">Manage →</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/admin/announcements?station=st-matthew"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Bell className="w-3 h-3 text-amber-300" />
                  <span>Post Notice</span>
                </Link>
                <Link
                  to="/admin/events?station=st-matthew"
                  className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] font-medium transition"
                >
                  <Calendar className="w-3 h-3 text-amber-300" />
                  <span>Add Event</span>
                </Link>
              </div>
              <Link
                to="/subchurches/st-matthew"
                target="_blank"
                className="block text-center text-[10px] text-stone-400 hover:text-amber-300 transition pt-1"
              >
                View St. Matthew Outstation Page ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CMS SHORTCUTS */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-liturgical text-slate-900">Liturgical & Content Management</h3>
            <p className="text-xs text-slate-500">Quickly jump into editing parish schedules, announcements, and content.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/timetable"
            className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">Liturgical Timetable</span>
              <span className="text-[10px] text-amber-800 font-medium block mt-0.5">Masses & Devotions</span>
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">Calendar Events</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Feasts & Retreats</span>
            </div>
          </Link>

          <Link
            to="/admin/announcements"
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">Announcements</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Bulletins & Notices</span>
            </div>
          </Link>

          <Link
            to="/admin/about"
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">About Parish CMS</span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Rector & Clergy</span>
            </div>
          </Link>
        </div>
      </div>

      {/* CHARTS & BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Giving by Church */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold font-liturgical text-slate-900">Giving Breakdown by Church</h3>
            <p className="text-xs text-slate-500">Distribution of offerings across Rectorate and outstations.</p>
          </div>

          <div className="space-y-4">
            {stats?.byChurch?.map((item: any) => {
              const percent = totalAmount > 0 ? ((item.total / totalAmount) * 100).toFixed(1) : 0;
              const churchNames: Record<string, string> = {
                'holy-spirit': 'Holy Spirit Rectorate',
                'st-anthony': 'St. Anthony of Padua',
                'st-matthew': 'St. Matthew Catholic Church'
              };

              return (
                <div key={item.church_id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{churchNames[item.church_id] || item.church_id}</span>
                    <span className="font-mono text-amber-800">
                      GHS {item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Giving by Fund Purpose */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold font-liturgical text-slate-900">Giving by Purpose / Fund</h3>
            <p className="text-xs text-slate-500">Distribution of tithes, building pledges, and harvest.</p>
          </div>

          <div className="space-y-4">
            {stats?.byFund?.map((item: any) => {
              const percent = totalAmount > 0 ? ((item.total / totalAmount) * 100).toFixed(1) : 0;
              const fundNames: Record<string, string> = {
                'tithe': 'Tithe & First Fruits',
                'offertory': 'Sunday Offertory',
                'building': 'Church Building Fund',
                'harvest': 'Harvest & Thanksgiving',
                'intentions': 'Mass Intentions Stipend',
                'welfare': 'St. Vincent de Paul / Welfare'
              };

              return (
                <div key={item.fund_category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{fundNames[item.fund_category] || item.fund_category}</span>
                    <span className="font-mono text-slate-900">
                      GHS {item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-liturgical text-slate-900">Recent Online Offerings</h3>
            <p className="text-xs text-slate-500">Latest donations recorded through the portal.</p>
          </div>
          <Link
            to="/admin/donations"
            className="text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            View Full Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Receipt No</th>
                <th className="pb-3">Donor</th>
                <th className="pb-3">Center</th>
                <th className="pb-3">Fund</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-700">
              {stats?.recentDonations?.map((d: any) => (
                <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-900">{d.receipt_number}</td>
                  <td className="py-3 font-medium text-slate-900">{d.donor_name}</td>
                  <td className="py-3 capitalize text-slate-600">{d.church_id.replace('-', ' ')}</td>
                  <td className="py-3 capitalize text-slate-600">{d.fund_category}</td>
                  <td className="py-3 font-mono font-bold text-slate-900">
                    {d.currency} {d.amount.toFixed(2)}
                  </td>
                  <td className="py-3 uppercase text-[10px] font-semibold text-slate-500">
                    {d.payment_method} {d.momo_network ? `(${d.momo_network})` : ''}
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => viewReceipt(d.receipt_number)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-200"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <DonationReceiptModal
        receipt={selectedReceipt}
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
      />

    </div>
  );
};
