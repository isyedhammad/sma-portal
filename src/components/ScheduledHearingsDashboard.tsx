import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Hearing, HearingStatus } from '../types';
import {
  Search,
  Calendar,
  Filter,
  Plus,
  Printer,
  History,
  Gavel,
  Edit2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

type DateFilterType = 'today' | 'upcoming7' | 'all' | 'custom';

export const ScheduledHearingsDashboard: React.FC = () => {
  const {
    hearings,
    openDrawerForLease,
    openScheduleModal,
    openOutcomeModal,
    setIsCauseListModalOpen,
    summaryStats
  } = usePortal();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customDate, setCustomDate] = useState('2026-11-16');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const TODAY_STR = '2026-11-16'; // Environment base date
  const SEVEN_DAYS_LATER = useMemo(() => {
    const d = new Date(TODAY_STR);
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }, [TODAY_STR]);

  // Filtered hearings
  const filteredHearings = useMemo(() => {
    return hearings.filter(h => {
      // 1. Text Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchSearch =
          h.lease_no.toLowerCase().includes(query) ||
          h.lease_title.toLowerCase().includes(query) ||
          h.lessee_name.toLowerCase().includes(query) ||
          h.district.toLowerCase().includes(query) ||
          h.mineral.toLowerCase().includes(query) ||
          h.purpose.toLowerCase().includes(query) ||
          (h.notice_reference_no && h.notice_reference_no.toLowerCase().includes(query));
        if (!matchSearch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'all' && h.hearing_status !== statusFilter) {
        return false;
      }

      // 3. Date Filter
      if (dateFilter === 'today') {
        return h.hearing_date === TODAY_STR;
      } else if (dateFilter === 'upcoming7') {
        return h.hearing_date >= TODAY_STR && h.hearing_date <= SEVEN_DAYS_LATER;
      } else if (dateFilter === 'custom') {
        return h.hearing_date === customDate;
      }

      return true; // 'all'
    }).sort((a, b) => {
      // Sort upcoming first
      return new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime();
    });
  }, [hearings, searchTerm, statusFilter, dateFilter, customDate, TODAY_STR, SEVEN_DAYS_LATER]);

  const getStatusBadge = (status: HearingStatus) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Scheduled
          </span>
        );
      case 'Adjourned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Adjourned
          </span>
        );
      case 'Order Reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Order Reserved
          </span>
        );
      case 'Disposed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Disposed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateDisplay = (dateStr: string): { day: string; weekday: string; isToday: boolean } => {
    if (!dateStr) {
      return { day: 'N/A', weekday: '', isToday: false };
    }
    const dateObj = new Date(dateStr + 'T00:00:00');
    const isToday = dateStr === TODAY_STR;
    const isValid = !isNaN(dateObj.getTime());
    return {
      day: isValid ? dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : dateStr,
      weekday: isValid ? dateObj.toLocaleDateString('en-GB', { weekday: 'short' }) : '',
      isToday
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Action Bar: Filters + Search + Actions */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4">
        
        {/* Row 1: Date Filter Pills & Primary CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Quick Date Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date Filter:</span>
            </span>

            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'today'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Today ({summaryStats.todayHearingsCount})
            </button>

            <button
              onClick={() => setDateFilter('upcoming7')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'upcoming7'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Upcoming 7 Days ({summaryStats.upcoming7DaysCount})
            </button>

            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateFilter === 'all'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Scheduled ({hearings.length})
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setDateFilter('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  dateFilter === 'custom'
                    ? 'bg-[#01411C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Custom Date
              </button>
              {dateFilter === 'custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 bg-white shadow-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={() => setIsCauseListModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all shadow-xs"
              title="Print formal Cause List for the Director's bench"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / Export Cause List</span>
            </button>

            <button
              onClick={() => openScheduleModal()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-[#01411C] hover:bg-[#0A5C36] text-white shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Schedule Hearing</span>
            </button>
          </div>

        </div>

        {/* Row 2: Search Input & Status Filter */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Instant Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Lease No., Lessee Name, Mineral, District, or Notice Dispatch No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-700"
            >
              <option value="all">All Hearing Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Adjourned">Adjourned</option>
              <option value="Order Reserved">Order Reserved</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Hearings Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        
        {/* Table Header Summary */}
        <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Cause List &amp; Scheduled Personal Hearings
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              ({filteredHearings.length} {filteredHearings.length === 1 ? 'hearing' : 'hearings'} found)
            </span>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any row or "View History" to inspect full lease chronology
          </span>
        </div>

        {/* Table Content */}
        {filteredHearings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">No Scheduled Hearings Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No personal hearings match your current date, status, or search filters.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setStatusFilter('all');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
              >
                Reset Filters
              </button>
              <button
                onClick={() => openScheduleModal()}
                className="px-3 py-1.5 bg-[#01411C] hover:bg-[#0A5C36] text-white text-xs font-bold rounded-lg transition-all"
              >
                + Schedule a Hearing
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-44">Hearing Date &amp; Time</th>
                  <th className="py-3 px-4">Lease Concession</th>
                  <th className="py-3 px-4">Lessee / Company</th>
                  <th className="py-3 px-4">District &amp; Mineral</th>
                  <th className="py-3 px-4">Purpose / Stage</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHearings.map((h) => {
                  const dateInfo = formatDateDisplay(h.hearing_date);
                  const isMiningLease = h.lease_no.includes('ML') || h.lease_title.includes('ML');

                  return (
                    <tr
                      key={h.hearing_id}
                      onClick={() => openDrawerForLease(h.lease_id)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Column 1: Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-md ${dateInfo.isToday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>{dateInfo.day}</span>
                              {dateInfo.isToday && (
                                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                                  Today
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{h.hearing_time || '10:30 AM'} ({dateInfo.weekday})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Lease No & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#01411C] group-hover:underline">
                            {h.lease_no}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${
                              isMiningLease
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }`}
                            title={isMiningLease ? 'Mining Lease (ML)' : 'Prospecting License (PL)'}
                          >
                            {isMiningLease ? 'ML' : 'PL'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 max-w-xs font-medium">
                          {h.lease_title}
                        </div>
                        {h.notice_reference_no && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Ref: {h.notice_reference_no}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Lessee / Company */}
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div className="line-clamp-2 max-w-xs">
                          {h.lessee_name}
                        </div>
                      </td>

                      {/* Column 4: District & Mineral */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                          <span>{h.district}</span>
                        </div>
                        <div className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-medium mt-1">
                          {h.mineral}
                        </div>
                      </td>

                      {/* Column 5: Purpose & Stage */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">
                          {h.purpose}
                        </div>
                        {h.stage && (
                          <div className="text-[11px] text-slate-500 mt-0.5 italic">
                            Stage: {h.stage}
                          </div>
                        )}
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {getStatusBadge(h.hearing_status)}
                      </td>

                      {/* Column 7: Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()} // Prevent row click
                        >
                          {/* View History (Option A Drawer) */}
                          <button
                            onClick={() => openDrawerForLease(h.lease_id)}
                            className="p-1.5 text-slate-600 hover:text-[#01411C] hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View full chronological hearing history for this lease"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Update Outcome */}
                          <button
                            onClick={() => openOutcomeModal(h)}
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Update bench outcome / adjourn / issue order"
                          >
                            <Gavel className="w-4 h-4" />
                          </button>

                          {/* Edit Hearing */}
                          <button
                            onClick={() => openScheduleModal(null, h)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit hearing details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Quick chevron to open drawer */}
                          <button
                            onClick={() => openDrawerForLease(h.lease_id)}
                            className="p-1 text-slate-400 hover:text-slate-600 ml-1"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
