import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { PersonalHearing } from '../types';
import { 
  Scale, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Gavel, 
  Calendar, 
  Table as TableIcon, 
  CalendarDays, 
  ArrowUpRight, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  ShieldAlert, 
  Building2, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    stats, 
    overdueHearings, 
    setActiveIssueOrderHearing, 
    setActiveNoticeDocket,
    setActiveOrderDocument,
    setActiveCauseListModal,
    setActiveTab,
    setSelectedLeaseForHearing,
    adjournHearing
  } = usePortal();

  const [pipelineView, setPipelineView] = useState<'table' | 'timeline'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Adjournment inline modal state
  const [adjournTargetHearing, setAdjournTargetHearing] = useState<PersonalHearing | null>(null);
  const [newAdjournDate, setNewAdjournDate] = useState('');
  const [adjournReason, setAdjournReason] = useState('');

  // Filter upcoming pipeline: hearings scheduled from now onwards OR under deliberation
  const upcomingHearings = hearings
    .filter(h => {
      // Must not be decided
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
    // default to next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(11, 0, 0, 0);
    setNewAdjournDate(nextWeek.toISOString().slice(0, 16));
    setAdjournReason('Counsel requested additional time to prepare documentary defense.');
  };

  const handleConfirmAdjourn = () => {
    if (adjournTargetHearing && newAdjournDate && adjournReason) {
      adjournHearing(adjournTargetHearing.hearing_id, newAdjournDate, adjournReason);
      setAdjournTargetHearing(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Executive Welcome & Presiding Bench Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              Quasi-Judicial Portal Active Session
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Executive Summary & Judicial Docket
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Statutory supervisory portal for monitoring Small Mines Agreement lease compliances, conducting Personal Hearings, and executing quasi-judicial enforcement orders across all Punjab mining districts.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveCauseListModal(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Cause List</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 border border-emerald-400/30"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule New Hearing</span>
          </button>
        </div>
      </div>

      {/* TOP 4 KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Registered SMA Leases */}
        <div 
          onClick={() => setActiveTab('leases')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-lg transition-all cursor-pointer group hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total SMA Leases
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
              {stats.totalLeases}
            </span>
            <span className="text-xs text-slate-400">agreements</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {stats.activeLeases} Active
            </span>
            <span className="text-amber-400 font-medium">
              {stats.showCauseLeases} Notice
            </span>
            <span className="text-rose-400 font-medium">
              {stats.suspendedLeases} Susp.
            </span>
          </div>
        </div>

        {/* KPI 2: Scheduled Upcoming Hearings */}
        <div 
          onClick={() => setPipelineView('timeline')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-lg transition-all cursor-pointer group hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Upcoming Hearings
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-600/40 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-100 font-sans tracking-tight">
              {stats.upcomingHearingsCount}
            </span>
            <span className="text-xs text-sky-400/80">on docket</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Next session:</span>
            <span className="text-sky-300 font-semibold font-mono">
              {upcomingHearings[0] ? new Date(upcomingHearings[0].hearing_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'None'}
            </span>
          </div>
        </div>

        {/* KPI 3: Pending Orders (Conducted hearings awaiting order) */}
        <div 
          onClick={() => setActiveTab('ledger')}
          className={`p-5 rounded-2xl shadow-lg transition-all cursor-pointer group border ${
            stats.pendingOrdersCount > 0 
              ? 'bg-amber-950/20 border-amber-600/40 hover:border-amber-500/70' 
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-200 font-sans tracking-tight">
              {stats.pendingOrdersCount}
            </span>
            <span className="text-xs text-amber-400/80">awaiting decision</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Under Deliberation</span>
            {overdueHearings.length > 0 && (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {overdueHearings.length} Overdue
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: Orders Finalized This Month */}
        <div 
          onClick={() => setActiveTab('ledger')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-lg transition-all cursor-pointer group hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Orders This Month
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-100 font-sans tracking-tight">
              {stats.decidedThisMonthCount}
            </span>
            <span className="text-xs text-emerald-400/80">decisions written</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Penalties Total:</span>
            <span className="text-emerald-400 font-mono font-bold">
              PKR {(stats.totalPenaltiesImposed / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

      </div>

      {/* ACTION-REQUIRED ALERT BANNER: Hearings conducted > 7 days ago with no order */}
      {overdueHearings.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/40 border-2 border-rose-600/70 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                    Statutory Action Required
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-rose-100">
                    {overdueHearings.length} Personal Hearing{overdueHearings.length > 1 ? 's' : ''} Exceeded Statutory 7-Day Order Timeline
                  </h3>
                </div>
                <span className="text-xs font-medium text-rose-300">
                  Compliance Under Rule 52 (PMR 2002)
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                The following hearing proceedings were conducted over seven days ago and remain pending without formal quasi-judicial written determinations. The Licensing Authority is required to record operative orders promptly to prevent regulatory default:
              </p>

              {/* Overdue items list */}
              <div className="mt-3 space-y-2">
                {overdueHearings.map(hearing => {
                  const lease = leases.find(l => l.lease_id === hearing.lease_id);
                  const daysElapsed = Math.floor((new Date().getTime() - new Date(hearing.hearing_date).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div 
                      key={hearing.hearing_id} 
                      className="bg-slate-950/80 border border-rose-800/50 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-300">{hearing.notice_reference_no}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-200">{lease?.lessee_name}</span>
                          <span className="text-slate-400">({lease?.district})</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Lease: <span className="font-mono text-slate-300">{hearing.lease_id}</span> | Matter: <span className="text-slate-200">{hearing.hearing_purpose}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-rose-400 font-extrabold block text-xs">
                            {daysElapsed} Days Overdue
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Heard: {new Date(hearing.hearing_date).toLocaleDateString()}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveIssueOrderHearing(hearing)}
                          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                          <span>Record Order</span>
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Pipeline Control Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                Statutory Personal Hearings Pipeline
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {upcomingHearings.length} listed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronologically ordered statutory personal hearings summons and cause roster
            </p>
          </div>

          {/* Filters & View Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notice, lessee, lease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Districts</option>
              {Array.from(new Set(leases.map(l => l.district))).sort().map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Table / Timeline View Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setPipelineView('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  pipelineView === 'table' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setPipelineView('timeline')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  pipelineView === 'timeline' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Calendar / Timeline View"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Table View */}
        {pipelineView === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Notice Ref</th>
                  <th className="py-3 px-4">Lease ID & Title</th>
                  <th className="py-3 px-4">Lessee / Company</th>
                  <th className="py-3 px-4">Grounds / Statutory Issue</th>
                  <th className="py-3 px-4">Hearing Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {upcomingHearings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Scale className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-semibold text-slate-300">No matching hearings in pipeline</p>
                      <p className="text-xs text-slate-500 mt-1">Schedule a statutory personal hearing to populate the docket.</p>
                      <button
                        onClick={() => setActiveTab('schedule')}
                        className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Schedule Personal Hearing
                      </button>
                    </td>
                  </tr>
                ) : (
                  upcomingHearings.map(hearing => {
                    const lease = leases.find(l => l.lease_id === hearing.lease_id);
                    const hDate = new Date(hearing.hearing_date);
                    const isToday = new Date().toDateString() === hDate.toDateString();

                    return (
                      <tr 
                        key={hearing.hearing_id} 
                        className={`hover:bg-slate-800/50 transition-colors ${isToday ? 'bg-emerald-950/20' : ''}`}
                      >
                        {/* Date & Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {isToday && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Hearing is scheduled for today!"></span>
                            )}
                            <div>
                              <span className="font-bold text-slate-200 block text-xs">
                                {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Notice Ref */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-300 text-xs whitespace-nowrap">
                          <button
                            onClick={() => setActiveNoticeDocket(hearing)}
                            className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                            title="Click to view & print statutory notice summons"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {hearing.notice_reference_no}
                          </button>
                          <span className="text-[10px] text-slate-500 block">ID: {hearing.hearing_id}</span>
                        </td>

                        {/* Lease ID & Title */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-200 block">{hearing.lease_id}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{lease?.lease_title || 'N/A'}</span>
                          <span className="text-[10px] text-slate-500">Mineral: {lease?.mineral_name}</span>
                        </td>

                        {/* Lessee / Company */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-200 block leading-tight">{lease?.lessee_name || 'N/A'}</span>
                          <span className="text-[11px] text-slate-400">{lease?.proprietor_representative}</span>
                          <span className="text-[10px] text-emerald-400/90 block">{lease?.district}</span>
                        </td>

                        {/* Grounds */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="font-medium text-slate-200 block text-xs leading-snug">{hearing.hearing_purpose}</span>
                          {hearing.specific_allegations && (
                            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 italic">
                              "{hearing.specific_allegations}"
                            </span>
                          )}
                        </td>

                        {/* Order Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {hearing.order_issued ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Order Issued
                            </span>
                          ) : hearing.hearing_status === 'Heard/Under Deliberation' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/60">
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                              Order Pending
                            </span>
                          ) : hearing.hearing_status === 'Adjourned' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/60">
                              <Clock className="w-3 h-3 text-purple-400" />
                              Adjourned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-700/60">
                              <Clock className="w-3 h-3 text-sky-400" />
                              Upcoming
                            </span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          {/* Issue Order trigger */}
                          <button
                            onClick={() => setActiveIssueOrderHearing(hearing)}
                            className="bg-amber-600/90 hover:bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1"
                            title="Record final quasi-judicial determination and issue written order"
                          >
                            <Gavel className="w-3 h-3" />
                            <span>Issue Order</span>
                          </button>

                          {/* Notice Docket Trigger */}
                          <button
                            onClick={() => setActiveNoticeDocket(hearing)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                            title="View / Print Statutory Hearing Summons"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Adjourn trigger */}
                          <button
                            onClick={() => handleOpenAdjourn(hearing)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition-colors border border-slate-700"
                            title="Adjourn hearing to new date"
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

        {/* View 2: Calendar / Timeline View */}
        {pipelineView === 'timeline' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingHearings.map(hearing => {
                const lease = leases.find(l => l.lease_id === hearing.lease_id);
                const hDate = new Date(hearing.hearing_date);
                const isPast = hDate.getTime() < new Date().getTime();

                return (
                  <div
                    key={hearing.hearing_id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Date & Time pill */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 font-bold text-[10px]">
                            <span>{hDate.toLocaleDateString('en-GB', { day: '2-digit' })}</span>
                            <span className="text-[8px] uppercase">{hDate.toLocaleDateString('en-GB', { month: 'short' })}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-100 text-xs block">
                              {hDate.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPast ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}>
                          {isPast ? 'Order Pending' : 'Scheduled'}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="font-bold text-slate-200 block text-xs">{lease?.lessee_name}</span>
                          <span className="text-[11px] text-emerald-400 font-mono">{hearing.lease_id} • {lease?.mineral_name}</span>
                        </div>

                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Statutory Grounds:</span>
                          <span className="text-slate-200 font-medium line-clamp-2">{hearing.hearing_purpose}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Notice: <strong className="font-mono text-slate-300">{hearing.notice_reference_no}</strong></span>
                          <span>{lease?.district}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveNoticeDocket(hearing)}
                        className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Notice</span>
                      </button>

                      <button
                        onClick={() => setActiveIssueOrderHearing(hearing)}
                        className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm"
                      >
                        <Gavel className="w-3 h-3" />
                        <span>Issue Order</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Inline Adjourn Hearing Dialog */}
      {adjournTargetHearing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-slate-100 text-sm">Adjourn Statutory Hearing</h3>
              </div>
              <button 
                onClick={() => setAdjournTargetHearing(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Adjourn hearing for <strong className="text-white">{adjournTargetHearing.notice_reference_no}</strong> (Lease: {adjournTargetHearing.lease_id}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Statutory Hearing Date & Time *
              </label>
              <input
                type="datetime-local"
                value={newAdjournDate}
                onChange={(e) => setNewAdjournDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Judicial Reason / Ground for Adjournment *
              </label>
              <textarea
                rows={3}
                value={adjournReason}
                onChange={(e) => setAdjournReason(e.target.value)}
                placeholder="e.g. Counsel requested time to produce bank clearance challans"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAdjournTargetHearing(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjourn}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs shadow-md"
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
