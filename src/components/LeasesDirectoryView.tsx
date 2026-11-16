import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lease, MiningType } from '../types';
import {
  Search,
  Filter,
  Plus,
  Upload,
  History,
  Calendar,
  Building,
  MapPin,
  Layers,
  ChevronRight,
  Database,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

type LeaseSortField = 'title' | 'site' | 'type' | 'lessee' | 'district' | 'mineral' | 'hearings';
type SortDirection = 'asc' | 'desc';

// Helper function to cleanly extract separate Title and Site
export const getTitleAndSite = (lease: Lease) => {
  const site = lease.site_code || (lease.lease_title.match(/\((.*?)\)/)?.[1] ?? '');
  let title = lease.lease_title;
  if (site && title.includes(`(${site})`)) {
    title = title.replace(`(${site})`, '').trim();
  } else {
    const match = title.match(/^(.*?)\s*\((.*)\)\s*$/);
    if (match && match[1]) {
      title = match[1].trim();
    }
  }
  return {
    title: title || lease.lease_title,
    site: site || '—'
  };
};

export const LeasesDirectoryView: React.FC = () => {
  const {
    leases,
    openDrawerForLease,
    openScheduleModal,
    setIsAddLeaseModalOpen,
    setIsBulkUploadModalOpen,
    getHearingsForLease
  } = usePortal();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | MiningType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedMineral, setSelectedMineral] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Sorting State
  const [sortField, setSortField] = useState<LeaseSortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: LeaseSortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Extract unique districts & minerals
  const { districts, minerals, counts } = useMemo(() => {
    const distSet = new Set<string>();
    const minSet = new Set<string>();
    let mlCount = 0;
    let plCount = 0;

    let coalCount = 0;
    let saltCount = 0;
    let limeCount = 0;
    let sandCount = 0;

    leases.forEach(l => {
      if (l.district) distSet.add(l.district);
      if (l.mineral) {
        minSet.add(l.mineral);
        const mLower = l.mineral.toLowerCase();
        if (mLower.includes('coal')) coalCount++;
        else if (mLower.includes('salt')) saltCount++;
        else if (mLower.includes('limestone')) limeCount++;
        else if (mLower.includes('sand') || mLower.includes('silica')) sandCount++;
      }
      if (l.mining_type === 'PL' || l.lease_title.includes('PL') || l.lease_no.includes('PL')) {
        plCount++;
      } else {
        mlCount++;
      }
    });

    return {
      districts: Array.from(distSet).sort(),
      minerals: Array.from(minSet).sort(),
      counts: { mlCount, plCount, coalCount, saltCount, limeCount, sandCount }
    };
  }, [leases]);

  // Map of lease_id -> hearings count for instant sorting
  const leaseHearingsCountMap = useMemo(() => {
    const map = new Map<string, number>();
    leases.forEach(l => {
      map.set(l.lease_id, getHearingsForLease(l.lease_id).length);
    });
    return map;
  }, [leases, getHearingsForLease]);

  // Filtered & Sorted Leases
  const filteredLeases = useMemo(() => {
    return leases
      .filter(l => {
        // 1. Text Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const { title, site } = getTitleAndSite(l);
          const match =
            title.toLowerCase().includes(q) ||
            site.toLowerCase().includes(q) ||
            l.lease_title.toLowerCase().includes(q) ||
            (l.site_code && l.site_code.toLowerCase().includes(q)) ||
            l.lease_no.toLowerCase().includes(q) ||
            l.lessee_name.toLowerCase().includes(q) ||
            l.district.toLowerCase().includes(q) ||
            l.mineral.toLowerCase().includes(q);
          if (!match) return false;
        }

        // 2. Mining Type (ML vs PL)
        if (selectedType !== 'all') {
          const isPl = l.mining_type === 'PL' || l.lease_title.includes('PL') || l.lease_no.includes('PL');
          if (selectedType === 'PL' && !isPl) return false;
          if (selectedType === 'ML' && isPl) return false;
        }

        // 3. District
        if (selectedDistrict !== 'all' && l.district !== selectedDistrict) {
          return false;
        }

        // 4. Mineral
        if (selectedMineral !== 'all' && l.mineral !== selectedMineral) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'title') {
          const tA = getTitleAndSite(a).title;
          const tB = getTitleAndSite(b).title;
          cmp = tA.localeCompare(tB);
        } else if (sortField === 'site') {
          const sA = getTitleAndSite(a).site;
          const sB = getTitleAndSite(b).site;
          cmp = sA.localeCompare(sB, undefined, { numeric: true });
        } else if (sortField === 'type') {
          const typeA = a.mining_type || (a.lease_title.includes('PL') ? 'PL' : 'ML');
          const typeB = b.mining_type || (b.lease_title.includes('PL') ? 'PL' : 'ML');
          cmp = typeA.localeCompare(typeB);
        } else if (sortField === 'lessee') {
          cmp = a.lessee_name.localeCompare(b.lessee_name);
        } else if (sortField === 'district') {
          cmp = a.district.localeCompare(b.district);
        } else if (sortField === 'mineral') {
          cmp = a.mineral.localeCompare(b.mineral);
        } else if (sortField === 'hearings') {
          const countA = leaseHearingsCountMap.get(a.lease_id) || 0;
          const countB = leaseHearingsCountMap.get(b.lease_id) || 0;
          cmp = countA - countB;
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [
    leases,
    searchTerm,
    selectedType,
    selectedDistrict,
    selectedMineral,
    sortField,
    sortDirection,
    leaseHearingsCountMap
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredLeases.length / pageSize) || 1;
  const paginatedLeases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeases.slice(start, start + pageSize);
  }, [filteredLeases, currentPage, pageSize]);

  // Clickable sorting column header
  const renderSortableHeader = (
    label: string,
    field: LeaseSortField,
    options?: {
      align?: 'left' | 'center' | 'right';
      widthClass?: string;
    }
  ) => {
    const isSorted = sortField === field;
    const align = options?.align || 'left';
    const widthClass = options?.widthClass || '';

    return (
      <th className={`py-3 px-4 ${widthClass} select-none`}>
        <div className={`flex items-center gap-1.5 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <button
            type="button"
            onClick={() => handleSort(field)}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#01411C] uppercase tracking-wider transition-colors cursor-pointer group"
            title={`Click title to arrange / sort by ${label} (${isSorted && sortDirection === 'asc' ? 'Descending' : 'Ascending'})`}
          >
            <span>{label}</span>
            <span className="inline-flex items-center">
              {isSorted ? (
                sortDirection === 'asc' ? (
                  <ArrowUp className="w-3.5 h-3.5 text-[#01411C] stroke-[2.5]" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 text-[#01411C] stroke-[2.5]" />
                )
              ) : (
                <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
              )}
            </span>
          </button>
        </div>
      </th>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 4 Mineral Concessions Showcase with Real User Images */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Pink Salt */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all">
          <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
            <img
              src="assets/minerals/pink_salt.jpg"
              alt="Pink Salt Mines"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Salt Range
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Pink Salt</div>
              <div className="text-[11px] text-slate-500">Khushab, Jhelum, Mianwali</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Concessions:</span>
              <span className="font-bold text-[#01411C]">{counts.saltCount} Active</span>
            </div>
          </div>
        </div>

        {/* Coal */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all">
          <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
            <img
              src="assets/minerals/coal.jpg"
              alt="Coal Mines"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Collieries
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Coal Formations</div>
              <div className="text-[11px] text-slate-500">Chakwal, Mianwali, Makerwal</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Concessions:</span>
              <span className="font-bold text-[#01411C]">{counts.coalCount} Active</span>
            </div>
          </div>
        </div>

        {/* Limestone */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all">
          <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
            <img
              src="assets/minerals/limestone.jpg"
              alt="Limestone Quarry Face"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              Quarry Faces
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Limestone &amp; Latrite</div>
              <div className="text-[11px] text-slate-500">Attock, Rawalpindi, Chakwal</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Concessions:</span>
              <span className="font-bold text-[#01411C]">{counts.limeCount} Active</span>
            </div>
          </div>
        </div>

        {/* Sand */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all">
          <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
            <img
              src="assets/minerals/sand.jpg"
              alt="Ordinary Sand / Silica Sand Quarry"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
              River Beds &amp; Dunes
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Ordinary / Silica Sand</div>
              <div className="text-[11px] text-slate-500">Mianwali, Khushab, Attock</div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Concessions:</span>
              <span className="font-bold text-[#01411C]">{counts.sandCount} Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Bar: Type Switcher + Search + Add Lease + Bulk Upload */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4">
        
        {/* Row 1: Concession Type Tabs & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* ML vs PL Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setSelectedType('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Types ({leases.length})
            </button>

            <button
              onClick={() => { setSelectedType('ML'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'ML'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Mining Leases (ML: {counts.mlCount})</span>
            </button>

            <button
              onClick={() => { setSelectedType('PL'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'PL'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Prospecting Licenses (PL: {counts.plCount})</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Bulk Upload (CSV / Excel)</span>
            </button>

            <button
              onClick={() => setIsAddLeaseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#01411C] hover:bg-[#0A5C36] text-white shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add Lease</span>
            </button>
          </div>

        </div>

        {/* Row 2: Search Input & District / Mineral Dropdowns */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Lease ID, Title, Lessee, District..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-700"
            />
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-700"
            >
              <option value="all">All Districts ({districts.length})</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Mineral Dropdown */}
          <div>
            <select
              value={selectedMineral}
              onChange={(e) => {
                setSelectedMineral(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-700"
            >
              <option value="all">All Minerals ({minerals.length})</option>
              {minerals.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Leases Reference Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        
        {/* Table Subheader */}
        <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Small Scale Mining Concessions Directory
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              (Showing {filteredLeases.length} matching concessions • Sorted by {sortField.toUpperCase()} {sortDirection.toUpperCase()})
            </span>
          </div>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any column header to arrange/sort • Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200">
                {renderSortableHeader('Title', 'title', { widthClass: 'w-48' })}
                {renderSortableHeader('Site', 'site', { widthClass: 'w-64' })}
                {renderSortableHeader('Type', 'type', { align: 'center' })}
                {renderSortableHeader('Lessee / Company', 'lessee')}
                {renderSortableHeader('District', 'district')}
                {renderSortableHeader('Mineral', 'mineral')}
                {renderSortableHeader('Hearings on Record', 'hearings', { align: 'center' })}
                <th className="py-3 px-4 text-right text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedLeases.map((lease) => {
                const hearingsList = getHearingsForLease(lease.lease_id);
                const isPL = lease.mining_type === 'PL' || lease.lease_title.includes('PL') || lease.lease_no.includes('PL');
                const { title, site } = getTitleAndSite(lease);

                return (
                  <tr
                    key={lease.lease_id}
                    onClick={() => openDrawerForLease(lease.lease_id)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Title */}
                    <td className="py-3.5 px-4 font-bold text-[#01411C] group-hover:underline whitespace-nowrap">
                      {title}
                    </td>

                    {/* Site */}
                    <td className="py-3.5 px-4">
                      <span
                        className="font-mono text-xs text-slate-800 bg-slate-100 border border-slate-200/90 px-2.5 py-1 rounded-md inline-block max-w-sm truncate font-medium"
                        title={site}
                      >
                        {site}
                      </span>
                    </td>

                    {/* Mining Type (ML vs PL) */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isPL
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                        title={isPL ? 'Prospecting License' : 'Mining Lease'}
                      >
                        {isPL ? 'PL' : 'ML'}
                      </span>
                    </td>

                    {/* Lessee / Company */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="line-clamp-2 max-w-xs">
                        {lease.lessee_name}
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                        <span>{lease.district}</span>
                      </div>
                    </td>

                    {/* Mineral */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200/80 text-[11px] rounded font-semibold">
                        {lease.mineral}
                      </span>
                    </td>

                    {/* Total Hearings on Record */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDrawerForLease(lease.lease_id);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 ${
                          hearingsList.length > 0
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Click to view chronological timeline in right drawer"
                      >
                        <History className="w-3 h-3" />
                        <span>{hearingsList.length} Hearings</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openScheduleModal(lease)}
                          className="px-2.5 py-1 bg-[#01411C] hover:bg-[#0A5C36] text-white text-[11px] font-bold rounded shadow-xs flex items-center gap-1"
                          title="Schedule a statutory hearing for this lease"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Schedule</span>
                        </button>

                        <button
                          onClick={() => openDrawerForLease(lease.lease_id)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded"
                          title="Inspect Lease Dossier"
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

        {/* Pagination Bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredLeases.length)} of {filteredLeases.length} concessions
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-2 text-slate-700 font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
