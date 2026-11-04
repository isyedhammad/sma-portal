import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { PersonalHearing } from '../types';
import { MINING_GALLERY, MiningPhoto } from '../data/miningGallery';
import { 
  Clock, 
  CheckCircle2, 
  Layers, 
  Gavel, 
  Calendar, 
  Table as TableIcon, 
  CalendarDays, 
  Search, 
  FileText, 
  Printer, 
  AlertCircle,
  X,
  Compass,
  Maximize2,
  Sparkles,
  Mountain,
  Gem
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    stats, 
    overdueHearings, 
    setActiveIssueOrderHearing, 
    setActiveNoticeDocket,
    setActiveCauseListModal,
    setActiveTab,
    adjournHearing
  } = usePortal();

  const [pipelineView, setPipelineView] = useState<'table' | 'timeline'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Photo Lightbox modal state
  const [selectedPhoto, setSelectedPhoto] = useState<MiningPhoto | null>(null);

  // Adjournment modal
  const [adjournTargetHearing, setAdjournTargetHearing] = useState<PersonalHearing | null>(null);
  const [newAdjournDate, setNewAdjournDate] = useState('');
  const [adjournReason, setAdjournReason] = useState('');

  // Filter upcoming pipeline
  const upcomingHearings = hearings
    .filter(h => {
      if (h.order_issued || h.hearing_status === 'Decided') return false;

      const lease = leases.find(l => l.lease_id === h.lease_id);
      const matchesSearch = 
        h.notice_reference_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.lease_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.hearing_purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lease && lease.lessee_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDistrict = districtFilter === 'all' || (lease && lease.district === districtFilter);

      return matchesSearch && matchesDistrict;
    })
    .sort((a, b) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime());

  const handleOpenAdjourn = (h: PersonalHearing) => {
    setAdjournTargetHearing(h);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(11, 0, 0, 0);
    setNewAdjournDate(nextWeek.toISOString().slice(0, 16));
    setAdjournReason('Counsel requested additional time to produce records.');
  };

  const handleConfirmAdjourn = () => {
    if (adjournTargetHearing && newAdjournDate && adjournReason) {
      adjournHearing(adjournTargetHearing.hearing_id, newAdjournDate, adjournReason);
      setAdjournTargetHearing(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* UNIQUE EXECUTIVE HERO SECTION WITH HD QUARRY & PINK SALT BACKDROP */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 text-white">
        {/* HD Background Imagery with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{ 
            backgroundImage: `url('assets/mining/mining_photo_8.jpg'), url('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80')` 
          }}
        ></div>
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/70"></div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                Licensing Authority • DGM&amp;M Punjab
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                Small Mines Agreements (SMA)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Small Scale Mining Hearings &amp; Enforcement
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitoring <strong>{leases.length} registered Small Scale Mining concessions</strong> across 10 Punjab mining districts — from the subterranean pink salt formations of Khewra &amp; Warcha to the limestone quarries of the Salt Range &amp; Margalla hills.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span><strong>1,836</strong> Total Leases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span><strong>{stats.upcomingHearingsCount}</strong> Scheduled Hearings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-rose-400" />
                <span>Pink Salt, Limestone &amp; Coal Hubs</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => setActiveCauseListModal(true)}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Cause List</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center justify-center gap-2 bg-[#0A6238] hover:bg-[#084e2c] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all border border-emerald-400/40"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Hearing</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURED HD MINING QUARRY & PINK SALT CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-[#0A6238]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Punjab Mineral Formations &amp; Quarry Field Operations
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any quarry photo to inspect geological &amp; regulatory profile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MINING_GALLERY.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Photo Frame with Fallback Handling */}
              <div className="relative h-36 bg-slate-100 overflow-hidden">
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  onError={(e) => {
                    // Graceful fallback to HD Unsplash URL
                    (e.target as HTMLImageElement).src = photo.fallback_url;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <span className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  {photo.category}
                </span>

                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {photo.district}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold text-[10px]">{photo.stats}</span>
                  <span className="text-slate-400 group-hover:text-slate-600 text-[10px]">View Detail →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 CORE STATUTORY KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Registered SMA Leases */}
        <div 
          onClick={() => setActiveTab('leases')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total SSM Leases
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalLeases}
            </span>
            <span className="text-xs text-slate-500 font-medium">concessions</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">{stats.activeLeases} Active</span>
            <span className="text-amber-700 font-semibold">{stats.showCauseLeases} Notice</span>
            <span className="text-rose-700 font-semibold">{stats.suspendedLeases} Suspended</span>
          </div>
        </div>

        {/* KPI 2: Scheduled Upcoming Hearings */}
        <div 
          onClick={() => setPipelineView('timeline')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Hearings
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.upcomingHearingsCount}
            </span>
            <span className="text-xs text-blue-600 font-medium">scheduled</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Next session:</span>
            <span className="font-semibold text-slate-800">
              {upcomingHearings[0] ? new Date(upcomingHearings[0].hearing_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'None'}
            </span>
          </div>
        </div>

        {/* KPI 3: Pending Orders */}
        <div 
          onClick={() => setActiveTab('ledger')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.pendingOrdersCount}
            </span>
            <span className="text-xs text-amber-700 font-medium">awaiting decision</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Heard Cases</span>
            {overdueHearings.length > 0 && (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {overdueHearings.length} Overdue
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: Decisions This Month */}
        <div 
          onClick={() => setActiveTab('ledger')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Decisions This Month
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.decidedThisMonthCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">written orders</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fines Assessed:</span>
            <span className="font-bold text-slate-800">
              PKR {(stats.totalPenaltiesImposed / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

      </div>

      {/* ACTION-REQUIRED ALERT BANNER: Hearings conducted > 7 days ago without an order */}
      {overdueHearings.length > 0 && (
        <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] border-y border-r border-[#FDE68A] rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                  Action Required: {overdueHearings.length} Personal Hearing{overdueHearings.length > 1 ? 's' : ''} Exceeded Statutory 7-Day Order Timeline
                </h3>
                <span className="text-[11px] font-semibold text-amber-800">
                  Rule 52 (PMR 2002)
                </span>
              </div>

              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                The following hearings were conducted more than 7 days ago and still have no written order recorded. Please issue determination:
              </p>

              {/* Overdue items list */}
              <div className="mt-3 space-y-2">
                {overdueHearings.map(hearing => {
                  const lease = leases.find(l => l.lease_id === hearing.lease_id);
                  const daysElapsed = Math.floor((new Date().getTime() - new Date(hearing.hearing_date).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div 
                      key={hearing.hearing_id} 
                      className="bg-white border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{hearing.notice_reference_no}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-800">{lease?.lessee_name}</span>
                          <span className="text-slate-500">({lease?.district})</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          Lease: <span className="font-mono font-semibold text-slate-800">{hearing.lease_id}</span> • Matter: <strong className="text-slate-800">{hearing.hearing_purpose}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-amber-800 font-bold text-xs">
                          {daysElapsed} days since hearing
                        </span>

                        <button
                          onClick={() => setActiveIssueOrderHearing(hearing)}
                          className="bg-[#D97706] hover:bg-[#b45309] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
                        >
                          Record Order
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPCOMING HEARINGS PIPELINE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0A6238]" />
              <span>Upcoming Personal Hearings Docket</span>
              <span className="text-xs px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                {upcomingHearings.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal hearings scheduled for Small Scale Mining lessees in chronological order
            </p>
          </div>

          {/* Search & View Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notice, company, lease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="all">All Districts</option>
              {Array.from(new Set(leases.map(l => l.district))).sort().map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setPipelineView('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  pipelineView === 'table' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setPipelineView('timeline')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  pipelineView === 'timeline' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Table */}
        {pipelineView === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Notice Ref</th>
                  <th className="py-3 px-4">Lease &amp; Mineral</th>
                  <th className="py-3 px-4">Lessee / Company</th>
                  <th className="py-3 px-4">Grounds / Violation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingHearings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      No hearings found in upcoming pipeline.
                    </td>
                  </tr>
                ) : (
                  upcomingHearings.map(hearing => {
                    const lease = leases.find(l => l.lease_id === hearing.lease_id);
                    const hDate = new Date(hearing.hearing_date);

                    return (
                      <tr key={hearing.hearing_id} className="hover:bg-slate-50/80 transition-colors">
                        
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block text-xs">
                            {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                          <button
                            onClick={() => setActiveNoticeDocket(hearing)}
                            className="text-[#0A6238] font-bold hover:underline"
                            title="View official notice"
                          >
                            {hearing.notice_reference_no}
                          </button>
                          <span className="text-[10px] text-slate-400 block">{hearing.hearing_id}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{hearing.lease_id}</span>
                          <span className="text-[11px] text-slate-600">{lease?.mineral_name} • {lease?.district}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block">{lease?.lessee_name || 'N/A'}</span>
                          <span className="text-[11px] text-slate-500">Rep: {lease?.proprietor_representative}</span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-medium text-slate-800 block text-xs">{hearing.hearing_purpose}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {hearing.order_issued ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Order Issued
                            </span>
                          ) : hearing.hearing_status === 'Heard/Under Deliberation' ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Order Pending
                            </span>
                          ) : hearing.hearing_status === 'Adjourned' ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              Adjourned
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              Upcoming
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => setActiveIssueOrderHearing(hearing)}
                            className="bg-[#D97706] hover:bg-[#b45309] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                          >
                            Issue Order
                          </button>

                          <button
                            onClick={() => setActiveNoticeDocket(hearing)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200"
                            title="View Notice Docket"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenAdjourn(hearing)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-purple-700 rounded-lg border border-slate-200"
                            title="Adjourn"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View 2: Timeline Grid */}
        {pipelineView === 'timeline' && (
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingHearings.map(hearing => {
                const lease = leases.find(l => l.lease_id === hearing.lease_id);
                const hDate = new Date(hearing.hearing_date);

                return (
                  <div
                    key={hearing.hearing_id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {hearing.hearing_status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-slate-900">{lease?.lessee_name}</p>
                        <p className="text-[11px] text-slate-500">{hearing.lease_id} • {lease?.mineral_name} ({lease?.district})</p>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 mt-2">
                          <strong>Grounds:</strong> {hearing.hearing_purpose}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setActiveNoticeDocket(hearing)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Notice</span>
                      </button>

                      <button
                        onClick={() => setActiveIssueOrderHearing(hearing)}
                        className="bg-[#D97706] hover:bg-[#b45309] text-white font-bold px-3 py-1 rounded-lg text-xs"
                      >
                        Issue Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* HD PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-300 animate-in zoom-in-95 duration-200">
            <div className="relative h-72 sm:h-80 bg-slate-900">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = selectedPhoto.fallback_url;
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-bold">
                {selectedPhoto.category} • {selectedPhoto.district}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPhoto.title}</h3>
                <p className="text-xs text-emerald-800 font-semibold">{selectedPhoto.stats}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPhoto.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Punjab Mining Cadastre Official Photographic Archive</span>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjourn Dialog */}
      {adjournTargetHearing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Adjourn Hearing</h3>
              <button onClick={() => setAdjournTargetHearing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Notice Ref: <strong>{adjournTargetHearing.notice_reference_no}</strong> ({adjournTargetHearing.lease_id}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Hearing Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                value={newAdjournDate}
                onChange={(e) => setNewAdjournDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Adjournment *
              </label>
              <textarea
                rows={3}
                value={adjournReason}
                onChange={(e) => setAdjournReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAdjournTargetHearing(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjourn}
                className="px-4 py-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold rounded-lg text-xs"
              >
                Confirm Adjournment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
