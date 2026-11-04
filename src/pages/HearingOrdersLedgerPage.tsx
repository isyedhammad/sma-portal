import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { DecisionCategory, HearingStatus } from '../types';
import { STATUTORY_VIOLATION_GROUNDS, PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  Gavel, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  FileText, 
  Printer, 
  DollarSign, 
  Download,
  Eye,
  Building2,
  Trash2,
  FileCheck2,
  ChevronDown
} from 'lucide-react';

export const HearingOrdersLedgerPage: React.FC = () => {
  const { 
    hearings, 
    leases, 
    stats, 
    setActiveIssueOrderHearing, 
    setActiveNoticeDocket, 
    setActiveOrderDocument,
    deleteHearing,
    setActiveTab
  } = usePortal();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Issued' | 'Pending'>('All');
  const [decisionCategoryFilter, setDecisionCategoryFilter] = useState<string>('All');
  const [violationFilter, setViolationFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Filter application
  const filteredHearings = hearings.filter(h => {
    const lease = leases.find(l => l.lease_id === h.lease_id);

    // Order status filter
    if (orderStatusFilter === 'Issued' && !h.order_issued) return false;
    if (orderStatusFilter === 'Pending' && h.order_issued) return false;

    // Decision category filter
    if (decisionCategoryFilter !== 'All') {
      if (!h.order_details || h.order_details.decision_category !== decisionCategoryFilter) {
        return false;
      }
    }

    // Violation category
    if (violationFilter !== 'All' && h.hearing_purpose !== violationFilter) return false;

    // District
    if (districtFilter !== 'All' && lease?.district !== districtFilter) return false;

    // Date range filter
    if (startDate) {
      if (h.hearing_date.split('T')[0] < startDate) return false;
    }
    if (endDate) {
      if (h.hearing_date.split('T')[0] > endDate) return false;
    }

    // Search query
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Page Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Quasi-Judicial Bench Repository
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Hearing Orders & Quasi-Judicial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Statutory registry of personal hearings issued to Small Mines lessees, records of quasi-judicial bench determinations, penalty challans, and post-hearing formal executive orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Concluded Orders</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {hearings.filter(h => h.order_issued).length} of {hearings.length}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Multi-Parameter Ledger Filtering
            </span>
          </div>
          {(searchQuery || orderStatusFilter !== 'All' || decisionCategoryFilter !== 'All' || violationFilter !== 'All' || districtFilter !== 'All' || startDate || endDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setOrderStatusFilter('All');
                setDecisionCategoryFilter('All');
                setViolationFilter('All');
                setDistrictFilter('All');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Term */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Search Text
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Company, Lease ID, Notice Ref, Order No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Order Status */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Order Status
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="All">All Order States ({hearings.length})</option>
              <option value="Issued">Order Issued ({hearings.filter(h => h.order_issued).length})</option>
              <option value="Pending">Order Pending ({hearings.filter(h => !h.order_issued).length})</option>
            </select>
          </div>

          {/* Decision Category */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Decision Category
            </label>
            <select
              value={decisionCategoryFilter}
              onChange={(e) => setDecisionCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Penalty Imposed">Penalty Imposed</option>
              <option value="Direction Issued">Direction Issued</option>
              <option value="Lease Revoked/Cancelled">Lease Revoked/Cancelled</option>
              <option value="Exonerated/Compliance Accepted">Exonerated/Compliance Accepted</option>
              <option value="Adjourned to New Date">Adjourned to New Date</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              District
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

          {/* Violation Category */}
          <div className="sm:col-span-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              Statutory Violation Grounds
            </label>
            <select
              value={violationFilter}
              onChange={(e) => setViolationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Violation Grounds</option>
              {STATUTORY_VIOLATION_GROUNDS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              From Hearing Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
              To Hearing Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* HEARINGS & ORDERS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{filteredHearings.length}</strong> statutory hearing records
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Green: Order Concluded</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 ml-2"></span>
            <span>Amber: Order Pending</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Hearing Date</th>
                <th className="py-3 px-4">Notice Ref & Case ID</th>
                <th className="py-3 px-4">Lease & Lessee Details</th>
                <th className="py-3 px-4">Statutory Grounds</th>
                <th className="py-3 px-4">Quasi-Judicial Determination</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredHearings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Gavel className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-slate-300">No matching hearing records</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting the filter criteria above.</p>
                  </td>
                </tr>
              ) : (
                filteredHearings.map(hearing => {
                  const lease = leases.find(l => l.lease_id === hearing.lease_id);
                  const hDate = new Date(hearing.hearing_date);
                  const isPast = hDate.getTime() < new Date().getTime();

                  return (
                    <tr 
                      key={hearing.hearing_id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Hearing Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-200 block">
                          {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Notice Ref */}
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <span className="font-bold text-slate-200 block text-xs">{hearing.notice_reference_no}</span>
                        <span className="text-[10px] text-slate-500">Case: {hearing.hearing_id}</span>
                      </td>

                      {/* Lease & Lessee */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-100 block">{lease?.lessee_name || 'N/A'}</span>
                        <span className="font-mono text-[11px] text-emerald-400">{hearing.lease_id} ({lease?.mineral_name})</span>
                        <span className="text-[10px] text-slate-400 block">{lease?.district}</span>
                      </td>

                      {/* Grounds */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-medium text-slate-200 block leading-snug">{hearing.hearing_purpose}</span>
                        {hearing.specific_allegations && (
                          <span className="text-[10px] text-slate-400 line-clamp-1 italic">
                            "{hearing.specific_allegations}"
                          </span>
                        )}
                      </td>

                      {/* Determination / Order Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {hearing.order_issued && hearing.order_details ? (
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                                hearing.order_details.decision_category === 'Penalty Imposed' ? 'bg-amber-950 text-amber-300 border border-amber-700/60' :
                                hearing.order_details.decision_category === 'Lease Revoked/Cancelled' ? 'bg-rose-950 text-rose-300 border border-rose-700/60' :
                                hearing.order_details.decision_category === 'Exonerated/Compliance Accepted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' :
                                'bg-sky-950 text-sky-300 border border-sky-700/60'
                              }`}>
                                {hearing.order_details.decision_category}
                              </span>
                              {hearing.order_details.penalty_amount ? (
                                <span className="text-[10px] font-mono font-bold text-amber-400">
                                  PKR {hearing.order_details.penalty_amount.toLocaleString()}
                                </span>
                              ) : null}
                            </div>
                            <span className="text-[11px] text-slate-300 line-clamp-2 leading-tight font-serif">
                              {hearing.order_details.decision_summary}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                              Order: {hearing.order_details.order_no} ({hearing.order_details.order_date})
                            </span>
                          </div>
                        ) : hearing.hearing_status === 'Adjourned' ? (
                          <div className="text-[11px] text-purple-300 italic">
                            Adjourned: {hearing.adjournment_history?.[0]?.reason || 'Awaiting defence reply'}
                          </div>
                        ) : (
                          <div className="text-slate-500 italic text-xs flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Proceedings underway; order pending</span>
                          </div>
                        )}
                      </td>

                      {/* Order Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hearing.order_issued ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Order Issued
                          </span>
                        ) : isPast ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600/60">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            Under Deliberation
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-700/60">
                            <Clock className="w-3 h-3 text-sky-400" />
                            Scheduled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        {hearing.order_issued ? (
                          <button
                            onClick={() => setActiveOrderDocument(hearing)}
                            className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                            title="View and print certified sealed Executive Order"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Order</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveIssueOrderHearing(hearing)}
                            className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-all"
                            title="Record final determination and issue written order"
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span>Record Order</span>
                          </button>
                        )}

                        <button
                          onClick={() => setActiveNoticeDocket(hearing)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                          title="View / Print Statutory Hearing Summons"
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
