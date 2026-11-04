import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS, PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  Gavel, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  FileCheck2
} from 'lucide-react';

export const HearingOrdersLedgerPage: React.FC = () => {
  const { 
    hearings, 
    leases, 
    setActiveIssueOrderHearing, 
    setActiveNoticeDocket, 
    setActiveOrderDocument 
  } = usePortal();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Issued' | 'Pending'>('All');
  const [decisionCategoryFilter, setDecisionCategoryFilter] = useState<string>('All');
  const [violationFilter, setViolationFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');

  const filteredHearings = hearings.filter(h => {
    const lease = leases.find(l => l.lease_id === h.lease_id);

    if (orderStatusFilter === 'Issued' && !h.order_issued) return false;
    if (orderStatusFilter === 'Pending' && h.order_issued) return false;

    if (decisionCategoryFilter !== 'All') {
      if (!h.order_details || h.order_details.decision_category !== decisionCategoryFilter) {
        return false;
      }
    }

    if (violationFilter !== 'All' && h.hearing_purpose !== violationFilter) return false;
    if (districtFilter !== 'All' && lease?.district !== districtFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNotice = h.notice_reference_no.toLowerCase().includes(q);
      const matchHearingId = h.hearing_id.toLowerCase().includes(q);
      const matchLeaseId = h.lease_id.toLowerCase().includes(q);
      const matchLessee = lease && lease.lessee_name.toLowerCase().includes(q);
      const matchOrderNo = h.order_details?.order_no.toLowerCase().includes(q);
      const matchPurpose = h.hearing_purpose.toLowerCase().includes(q);
      if (!matchNotice && !matchHearingId && !matchLeaseId && !matchLessee && !matchOrderNo && !matchPurpose) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => new Date(b.hearing_date).getTime() - new Date(a.hearing_date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Hearing Orders &amp; Decisions Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registry of personal hearings, issued written orders, penalties and decisions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-1.5 text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Concluded Orders</span>
            <span className="text-sm font-bold text-[#0A6238]">
              {hearings.filter(h => h.order_issued).length} of {hearings.length} Total
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Hearings</span>
          </div>
          {(searchQuery || orderStatusFilter !== 'All' || decisionCategoryFilter !== 'All' || violationFilter !== 'All' || districtFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setOrderStatusFilter('All');
                setDecisionCategoryFilter('All');
                setViolationFilter('All');
                setDistrictFilter('All');
              }}
              className="text-xs text-amber-700 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          <div className="relative">
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Notice, Company, Lease ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Order Status
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All ({hearings.length})</option>
              <option value="Issued">Order Issued ({hearings.filter(h => h.order_issued).length})</option>
              <option value="Pending">Order Pending ({hearings.filter(h => !h.order_issued).length})</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Decision Category
            </label>
            <select
              value={decisionCategoryFilter}
              onChange={(e) => setDecisionCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Penalty Imposed">Penalty Imposed</option>
              <option value="Direction Issued">Direction Issued</option>
              <option value="Lease Revoked/Cancelled">Lease Revoked/Cancelled</option>
              <option value="Exonerated/Compliance Accepted">Exonerated/Compliance Accepted</option>
              <option value="Adjourned to New Date">Adjourned to New Date</option>
            </select>
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
              Violation Type
            </label>
            <select
              value={violationFilter}
              onChange={(e) => setViolationFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All">All Grounds</option>
              {STATUTORY_VIOLATION_GROUNDS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Found <strong className="text-slate-900">{filteredHearings.length}</strong> hearings
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Order Issued</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Pending Order</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Hearing Date</th>
                <th className="py-3 px-4">Notice Ref</th>
                <th className="py-3 px-4">Lease &amp; Lessee</th>
                <th className="py-3 px-4">Violation Grounds</th>
                <th className="py-3 px-4">Decision / Outcome</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHearings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No matching hearings found.
                  </td>
                </tr>
              ) : (
                filteredHearings.map(hearing => {
                  const lease = leases.find(l => l.lease_id === hearing.lease_id);
                  const hDate = new Date(hearing.hearing_date);

                  return (
                    <tr key={hearing.hearing_id} className="hover:bg-slate-50/80 transition-colors">
                      
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-xs">
                          {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-xs">{hearing.notice_reference_no}</span>
                        <span className="text-[10px] text-slate-400">{hearing.hearing_id}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{lease?.lessee_name || 'N/A'}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{hearing.lease_id} ({lease?.mineral_name})</span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="text-slate-800 font-medium">{hearing.hearing_purpose}</span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        {hearing.order_issued && hearing.order_details ? (
                          <div>
                            <span className="font-semibold text-emerald-800 text-[11px] block">
                              {hearing.order_details.decision_category}
                              {hearing.order_details.penalty_amount ? ` (PKR ${hearing.order_details.penalty_amount.toLocaleString()})` : ''}
                            </span>
                            <span className="text-[11px] text-slate-600 line-clamp-1">
                              {hearing.order_details.decision_summary}
                            </span>
                          </div>
                        ) : hearing.hearing_status === 'Adjourned' ? (
                          <span className="text-purple-700 text-[11px] italic">
                            Adjourned to new date
                          </span>
                        ) : (
                          <span className="text-amber-700 text-[11px] font-medium">
                            Awaiting final order
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {hearing.order_issued ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Order Issued
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Pending Order
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        {hearing.order_issued ? (
                          <button
                            onClick={() => setActiveOrderDocument(hearing)}
                            className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                          >
                            View Order
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveIssueOrderHearing(hearing)}
                            className="bg-[#D97706] hover:bg-[#b45309] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs"
                          >
                            Record Order
                          </button>
                        )}

                        <button
                          onClick={() => setActiveNoticeDocket(hearing)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200"
                          title="View Notice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
