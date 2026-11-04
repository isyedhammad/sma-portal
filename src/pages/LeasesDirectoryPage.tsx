import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lease } from '../types';
import { PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  Layers, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle,
  CalendarPlus, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  ShieldAlert
} from 'lucide-react';

export const LeasesDirectoryPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
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

  const mineralsList = Array.from(new Set(leases.map(l => l.mineral_name))).sort();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            SMA Leases Master Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Small Mines Agreement concessions across all Punjab mining districts
          </p>
        </div>

        <button
          onClick={() => setActiveAddLeaseModal(true)}
          className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Lease</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="relative">
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Search Leases
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ID, Company, Mineral..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              District
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All Districts</option>
              {PUNJAB_MINING_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Mineral Type
            </label>
            <select
              value={mineralFilter}
              onChange={(e) => setMineralFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All Minerals</option>
              {mineralsList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
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

      {/* LEASES DATA LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{filteredLeases.length}</strong> leases</span>
          <span className="text-[11px] text-slate-400">Click any row to expand compliance record</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLeases.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              No matching SMA leases found.
            </div>
          ) : (
            filteredLeases.map(lease => {
              const isExpanded = expandedLeaseId === lease.lease_id;
              const linkedHearings = hearings.filter(h => h.lease_id === lease.lease_id);
              const activePendingHearing = linkedHearings.find(h => !h.order_issued && h.hearing_status !== 'Decided');

              return (
                <div key={lease.lease_id} className="transition-colors hover:bg-slate-50/70">
                  
                  {/* Row */}
                  <div 
                    onClick={() => toggleExpand(lease.lease_id)}
                    className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                      <div className="text-slate-400 mt-0.5 md:mt-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-700" /> : <ChevronRight className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {lease.lease_id}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {lease.mineral_name}
                          </span>

                          {activePendingHearing && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              <span>Hearing Pending ({activePendingHearing.notice_reference_no})</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {lease.lease_title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="text-slate-800 font-medium">{lease.lessee_name}</span>
                          <span>•</span>
                          <span>Rep: {lease.proprietor_representative}</span>
                          <span>•</span>
                          <span>{lease.district}</span>
                          <span>•</span>
                          <span>{lease.area_acreage} Acres</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Badge & Schedule Button */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end pl-7 md:pl-0">
                      <div>
                        {lease.lease_status === 'Active' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        )}
                        {lease.lease_status === 'Show-Cause Issued' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Notice Issued
                          </span>
                        )}
                        {lease.lease_status === 'Suspended' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            Suspended
                          </span>
                        )}
                        {lease.lease_status === 'Expired' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Expired
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleForLease(lease);
                        }}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Schedule Hearing</span>
                      </button>
                    </div>

                  </div>

                  {/* Expandable Case History */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 border-t border-slate-200 p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                          <span className="text-slate-800 font-mono font-medium">{lease.contact_number}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Valid Tenure</span>
                          <span className="text-slate-800 font-medium">{lease.grant_date} → {lease.expiry_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">Annual Royalty</span>
                          <span className="text-slate-800 font-bold font-mono">PKR {(lease.annual_rent_pkr || 2500000).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Hearings list */}
                      <div>
                        <h5 className="text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                          Personal Hearings &amp; Notices History ({linkedHearings.length})
                        </h5>

                        {linkedHearings.length === 0 ? (
                          <p className="text-xs text-slate-500 italic bg-white p-3 rounded border border-slate-200">
                            No show-cause notices or personal hearings recorded against this lease.
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            {linkedHearings.map(h => (
                              <div key={h.hearing_id} className="bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between text-xs gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-900">{h.notice_reference_no}</span>
                                    <span>•</span>
                                    <span className="text-slate-600">Date: {new Date(h.hearing_date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-700 mt-0.5">
                                    <strong>Grounds:</strong> {h.hearing_purpose}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    onClick={() => setActiveNoticeDocket(h)}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-xs"
                                  >
                                    Notice
                                  </button>
                                  {h.order_issued && (
                                    <button
                                      onClick={() => setActiveOrderDocument(h)}
                                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold"
                                    >
                                      Order
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
