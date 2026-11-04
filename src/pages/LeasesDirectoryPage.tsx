import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lease, LeaseStatus } from '../types';
import { PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CalendarPlus, 
  FileText, 
  Gavel, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Phone, 
  User, 
  Calendar,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

export const LeasesDirectoryPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    updateLeaseStatus, 
    setSelectedLeaseForHearing, 
    setActiveTab,
    setActiveAddLeaseModal,
    setActiveNoticeDocket,
    setActiveOrderDocument
  } = usePortal();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [mineralFilter, setMineralFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedLeaseId, setExpandedLeaseId] = useState<string | null>(null);

  // Minerals list
  const mineralsList = Array.from(new Set(leases.map(l => l.mineral_name))).sort();

  // Filter application
  const filteredLeases = leases.filter(lease => {
    if (districtFilter !== 'All' && lease.district !== districtFilter) return false;
    if (mineralFilter !== 'All' && lease.mineral_name !== mineralFilter) return false;
    if (statusFilter !== 'All' && lease.lease_status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = lease.lease_id.toLowerCase().includes(q);
      const matchTitle = lease.lease_title.toLowerCase().includes(q);
      const matchLessee = lease.lessee_name.toLowerCase().includes(q);
      const matchProprietor = lease.proprietor_representative.toLowerCase().includes(q);
      const matchMineral = lease.mineral_name.toLowerCase().includes(q);
      const matchDistrict = lease.district.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchLessee && !matchProprietor && !matchMineral && !matchDistrict) {
        return false;
      }
    }

    return true;
  });

  const toggleExpand = (leaseId: string) => {
    setExpandedLeaseId(prev => prev === leaseId ? null : leaseId);
  };

  const handleScheduleForLease = (lease: Lease) => {
    setSelectedLeaseForHearing(lease);
    setActiveTab('schedule');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Departmental Asset Register
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            SMA Leases Master Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Central repository of Small Mines Agreement concessions across all Punjab mining districts. Monitor agreement standing, statutory show-cause notices, active hearing summon dockets, and historical bench rulings.
          </p>
        </div>

        <button
          onClick={() => setActiveAddLeaseModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 border border-emerald-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Register New SMA Lease</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Search Lease Records
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ID, Company, Mineral, District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* District Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              District Jurisdiction
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Districts</option>
              {PUNJAB_MINING_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Mineral Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Mineral Type
            </label>
            <select
              value={mineralFilter}
              onChange={(e) => setMineralFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Minerals</option>
              {mineralsList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Lease Status Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Agreement Standing
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Show-Cause Issued">Show-Cause Issued</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

        </div>
      </div>

      {/* LEASES DATA GRID */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{filteredLeases.length}</strong> SMA concessions
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Click any lease row to expand its statutory quasi-judicial dossier</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredLeases.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">No matching SMA leases found</p>
              <p className="text-xs text-slate-500 mt-1">Adjust your search or register a new lease agreement.</p>
            </div>
          ) : (
            filteredLeases.map(lease => {
              const isExpanded = expandedLeaseId === lease.lease_id;
              
              // Find all hearings linked to this lease
              const linkedHearings = hearings.filter(h => h.lease_id === lease.lease_id);
              const activePendingHearing = linkedHearings.find(h => !h.order_issued && h.hearing_status !== 'Decided');
              const concludedHearings = linkedHearings.filter(h => h.order_issued);

              return (
                <div key={lease.lease_id} className="transition-colors hover:bg-slate-800/30">
                  
                  {/* Primary Row Summary */}
                  <div 
                    onClick={() => toggleExpand(lease.lease_id)}
                    className="p-4 sm:px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div className="mt-1 sm:mt-0 text-slate-400">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-emerald-400" /> : <ChevronRight className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-slate-100 text-xs sm:text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                            {lease.lease_id}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                            {lease.mineral_name}
                          </span>

                          {/* Active Hearing Pending Badge */}
                          {activePendingHearing && (
                            <span 
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-600 animate-pulse"
                              title="Active Statutory Hearing or Show-Cause Notice in progress against this lease"
                            >
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                              <span>Hearing Active ({activePendingHearing.notice_reference_no})</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                          {lease.lease_title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-slate-300 font-semibold">{lease.lessee_name}</span>
                          <span>•</span>
                          <span>Rep: {lease.proprietor_representative}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {lease.district}
                          </span>
                          <span>•</span>
                          <span>{lease.area_acreage} Acres</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pl-8 lg:pl-0">
                      <div>
                        {lease.lease_status === 'Active' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                        {lease.lease_status === 'Show-Cause Issued' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-600/60 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Show-Cause Issued
                          </span>
                        )}
                        {lease.lease_status === 'Suspended' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700/60 flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" />
                            Suspended
                          </span>
                        )}
                        {lease.lease_status === 'Expired' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleForLease(lease);
                        }}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-600/50 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
                        title="Schedule a statutory personal hearing for this lease"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Issue Hearing</span>
                      </button>
                    </div>

                  </div>

                  {/* EXPANDABLE STATUTORY DOSSIER */}
                  {isExpanded && (
                    <div className="bg-slate-950/90 border-t border-slate-800/80 p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                      
                      {/* Grid Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Coordinates</span>
                          <span className="text-slate-200 font-mono mt-0.5 block">{lease.contact_number}</span>
                          <span className="text-[10px] text-slate-500">Managing Representative</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Lease Tenure</span>
                          <span className="text-slate-200 mt-0.5 block font-mono">
                            {lease.grant_date || 'N/A'} → {lease.expiry_date || 'N/A'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Sanctioned Coordinates</span>
                          <span className="text-slate-200 font-mono mt-0.5 block line-clamp-1" title={lease.coordinates}>
                            {lease.coordinates || 'Boundary Pillar Grid Verified'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Royalty / Assessment</span>
                          <span className="text-emerald-400 font-mono font-bold mt-0.5 block">
                            PKR {(lease.annual_rent_pkr || 2500000).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* STATUTORY ENFORCEMENT & QUASI-JUDICIAL HISTORY */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Gavel className="w-3.5 h-3.5 text-amber-400" />
                            <span>Statutory Proceedings & Quasi-Judicial Ledger History</span>
                          </h5>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {linkedHearings.length} Proceedings Found
                          </span>
                        </div>

                        {linkedHearings.length === 0 ? (
                          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                            No show-cause notices or quasi-judicial personal hearings recorded against this lease agreement. Clean regulatory standing.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {linkedHearings.map(hearing => (
                              <div
                                key={hearing.hearing_id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-200">{hearing.notice_reference_no}</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-300 font-medium">Hearing Date: {new Date(hearing.hearing_date).toLocaleDateString()}</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-400">{hearing.hearing_status}</span>
                                  </div>
                                  <p className="text-slate-400 text-[11px]">
                                    <strong className="text-slate-300">Grounds:</strong> {hearing.hearing_purpose}
                                  </p>
                                  {hearing.order_details && (
                                    <p className="text-amber-300/90 text-[11px] font-serif bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                                      <strong>Quasi-Judicial Determination ({hearing.order_details.decision_category}):</strong> {hearing.order_details.decision_summary}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-auto">
                                  <button
                                    onClick={() => setActiveNoticeDocket(hearing)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                                    title="View Show-Cause Summons Docket"
                                  >
                                    <FileText className="w-3 h-3 text-emerald-400" />
                                    <span>Notice</span>
                                  </button>

                                  {hearing.order_issued && hearing.order_details && (
                                    <button
                                      onClick={() => setActiveOrderDocument(hearing)}
                                      className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-700"
                                      title="View Certified Quasi-Judicial Order"
                                    >
                                      <Gavel className="w-3 h-3" />
                                      <span>View Order</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
