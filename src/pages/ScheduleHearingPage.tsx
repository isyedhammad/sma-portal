import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS, PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  CalendarPlus, 
  Search, 
  Lock, 
  MapPin, 
  FileText, 
  Clock, 
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  Layers,
  Building,
  User,
  Compass
} from 'lucide-react';

export const ScheduleHearingPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    scheduleHearing, 
    selectedLeaseForHearing, 
    setSelectedLeaseForHearing,
    setActiveNoticeDocket,
    setActiveTab,
    addToast
  } = usePortal();

  // Selected lease ID
  const [selectedLeaseId, setSelectedLeaseId] = useState<string>(selectedLeaseForHearing?.lease_id || '');
  const [leaseSearchTerm, setLeaseSearchTerm] = useState('');
  const [concessionTypeFilter, setConcessionTypeFilter] = useState<'All' | 'ML' | 'PL'>('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [mineralFilter, setMineralFilter] = useState('All');
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);

  // Hearing form fields
  const [hearingDate, setHearingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(10, 30, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const [noticeDate, setNoticeDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  
  const [noticeRefNo, setNoticeRefNo] = useState<string>(() => {
    const nextNum = hearings.length + 105;
    return `DGM&M/SMA/H-${nextNum}/2026`;
  });

  const [hearingPurpose, setHearingPurpose] = useState<string>(STATUTORY_VIOLATION_GROUNDS[0]);
  const [specificAllegations, setSpecificAllegations] = useState<string>('');
  const [presidingOfficer, setPresidingOfficer] = useState<string>('Director SMA/T - Licensing Authority');
  const [hearingVenue, setHearingVenue] = useState<string>('Director Office, DGM&M Punjab, Poonch House, Multan Road, Lahore');

  // Currently resolved lease
  const selectedLease = leases.find(l => l.lease_id === selectedLeaseId) || null;

  // Mineral types extracted from the entire 1,836-lease dataset
  const mineralsList = useMemo(() => {
    return Array.from(new Set(leases.map(l => l.mineral_name))).sort();
  }, [leases]);

  useEffect(() => {
    if (selectedLeaseForHearing) {
      setSelectedLeaseId(selectedLeaseForHearing.lease_id);
      setLeaseSearchTerm(`${selectedLeaseForHearing.lease_id} — ${selectedLeaseForHearing.lessee_name} (${selectedLeaseForHearing.mineral_name}, ${selectedLeaseForHearing.district})`);
    }
  }, [selectedLeaseForHearing]);

  const handlePurposeChange = (purpose: string) => {
    setHearingPurpose(purpose);
    
    if (purpose === 'Non-payment of royalty dues') {
      setSpecificAllegations(
        `Default in depositing statutory mineral royalty and surface rent for the preceding quarter. Despite preliminary demand notice, outstanding treasury challans have not been verified by the District Mining Officer.`
      );
    } else if (purpose === 'Unauthorized boundary encroachment') {
      setSpecificAllegations(
        `Technical survey and GIS satellite overlay indicate unauthorized excavation outside sanctioned mining grid pillars. Encroachment of approximately 40 meters detected beyond boundary demarcation coordinates.`
      );
    } else if (purpose === 'Failure to submit monthly production returns') {
      setSpecificAllegations(
        `Continuous failure to submit monthly mineral extraction Form-C production logs for the past three consecutive months, violating mandatory reporting provisions under Rule 39 of Punjab Mining Concession Rules 2002.`
      );
    } else if (purpose === 'Illegal subletting / unauthorized excavation outside sanctioned grid') {
      setSpecificAllegations(
        `Inspection by field surveillance team established that lease operations have been unauthorizedly sublet to external third parties without prior written consent and approval of the Licensing Authority.`
      );
    } else if (purpose === 'Non-compliance with Mine Safety & Environmental Regulations') {
      setSpecificAllegations(
        `Failure to maintain mandatory 45-degree quarry slope benches, lack of personal protective equipment for mine workers, and absence of dust suppression water sprinkling systems at the extraction site.`
      );
    } else if (purpose === 'Un-metered extraction & non-installation of weighbridge') {
      setSpecificAllegations(
        `Failure to install digital computerized weighbridge integrated with central DGM&M logistics tracking system at the designated mine exit point.`
      );
    }
  };

  // High-performance filter across all 1,836 Small Scale Mining concessions
  const filteredLeases = useMemo(() => {
    const term = leaseSearchTerm.trim().toLowerCase();
    
    return leases.filter(l => {
      // Concession Type filter (ML vs PL)
      if (concessionTypeFilter !== 'All') {
        const t = (l.mining_type || 'ML').toUpperCase();
        if (t !== concessionTypeFilter) return false;
      }
      // District filter
      if (districtFilter !== 'All' && l.district !== districtFilter) return false;
      // Mineral filter
      if (mineralFilter !== 'All' && l.mineral_name !== mineralFilter) return false;

      if (!term) return true;

      // Match S#, Lease ID, original site code, lessee name, title, mineral, district
      const matchSNo = l.s_no ? l.s_no.toString() === term || `#${l.s_no}` === term : false;
      const matchId = l.lease_id.toLowerCase().includes(term);
      const matchSite = l.site_code ? l.site_code.toLowerCase().includes(term) : false;
      const matchLessee = l.lessee_name.toLowerCase().includes(term);
      const matchTitle = l.lease_title.toLowerCase().includes(term);
      const matchMineral = l.mineral_name.toLowerCase().includes(term);
      const matchDistrict = l.district.toLowerCase().includes(term);

      return matchSNo || matchId || matchSite || matchLessee || matchTitle || matchMineral || matchDistrict;
    });
  }, [leases, leaseSearchTerm, districtFilter, mineralFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLease) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a Small Scale Mining lease from the 1,836 registered concessions.'
      });
      return;
    }

    if (!hearingDate) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please choose the hearing date and time.'
      });
      return;
    }

    const scheduled = scheduleHearing({
      lease_id: selectedLease.lease_id,
      hearing_date: hearingDate,
      notice_issue_date: noticeDate,
      notice_reference_no: noticeRefNo.trim(),
      hearing_purpose: hearingPurpose,
      specific_allegations: specificAllegations.trim(),
      presiding_officer: presidingOfficer.trim(),
      hearing_venue: hearingVenue.trim(),
    });

    setSelectedLeaseForHearing(null);
    setActiveNoticeDocket(scheduled);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Schedule Personal Hearing &amp; Issue Notice
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select from all <strong>1,836 Small Scale Mining concessions</strong> in Punjab to auto-populate concession data and draft notice
          </p>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* STEP 1: LEASE SELECTION (ALL 1836 LEASES SEARCHABLE) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                1. Select Target Small Scale Mining (SSM) Lease
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Total Registry: {leases.length} Concessions
              </span>
            </div>

            {/* Quick Filter Row: District, Mineral & Concession Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Filter by District ({PUNJAB_MINING_DISTRICTS.length} Districts)
                </label>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">All Punjab Districts ({leases.length})</option>
                  {PUNJAB_MINING_DISTRICTS.map(d => {
                    const count = leases.filter(l => l.district === d).length;
                    return (
                      <option key={d} value={d}>{d} ({count})</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Filter by Mineral
                </label>
                <select
                  value={mineralFilter}
                  onChange={(e) => setMineralFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="All">All Mineral Types ({mineralsList.length})</option>
                  {mineralsList.map(m => {
                    const count = leases.filter(l => l.mineral_name === m).length;
                    return (
                      <option key={m} value={m}>{m} ({count})</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Concession Type (ML vs PL)
                </label>
                <select
                  value={concessionTypeFilter}
                  onChange={(e) => setConcessionTypeFilter(e.target.value as 'All' | 'ML' | 'PL')}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
                >
                  <option value="All">All Concessions (ML &amp; PL)</option>
                  <option value="ML">Mining Lease - ML (1,250)</option>
                  <option value="PL">Prospecting License - PL (586)</option>
                </select>
              </div>
            </div>

            {/* Typeahead Search Input */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Search &amp; Select From All 1,836 Small Scale Mining Leases *
                </label>
                <span className="text-[11px] text-slate-500">
                  Matches: <strong className="text-slate-800">{filteredLeases.length}</strong>
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type any S# (1-1836), Site Code, Company Name, Mineral (e.g. Pink Salt, Coal), or District..."
                  value={leaseSearchTerm}
                  onFocus={() => setIsLeaseDropdownOpen(true)}
                  onChange={(e) => {
                    setLeaseSearchTerm(e.target.value);
                    setIsLeaseDropdownOpen(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                {leaseSearchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setLeaseSearchTerm('');
                      setSelectedLeaseId('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* High-Performance Dropdown List */}
              {isLeaseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg max-h-72 overflow-y-auto shadow-xl z-30 divide-y divide-slate-100">
                  <div className="bg-slate-100 px-3 py-1.5 text-[10px] text-slate-500 font-semibold flex items-center justify-between sticky top-0 z-10">
                    <span>Showing first {Math.min(filteredLeases.length, 60)} of {filteredLeases.length} matches</span>
                    <button 
                      type="button" 
                      onClick={() => setIsLeaseDropdownOpen(false)}
                      className="text-slate-600 hover:underline"
                    >
                      Close [×]
                    </button>
                  </div>

                  {filteredLeases.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No matching leases found for your query. Try searching by S# (e.g. 1 to 1836) or district.
                    </div>
                  ) : (
                    filteredLeases.slice(0, 60).map(lease => (
                      <div
                        key={lease.lease_id}
                        onClick={() => {
                          setSelectedLeaseId(lease.lease_id);
                          setLeaseSearchTerm(`${lease.lease_id} — ${lease.site_code || lease.lease_title} (${lease.mineral_name}, ${lease.district})`);
                          setIsLeaseDropdownOpen(false);
                        }}
                        className={`p-2.5 hover:bg-emerald-50/70 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          selectedLeaseId === lease.lease_id ? 'bg-emerald-50 text-emerald-950 font-semibold' : 'text-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {lease.s_no && (
                              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-mono font-bold">
                                #{lease.s_no}
                              </span>
                            )}
                            <span className="font-mono font-bold text-emerald-800">{lease.lease_id}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-900 truncate">{lease.lessee_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {lease.site_code || lease.lease_title} • Mineral: <strong className="text-slate-700">{lease.mineral_name}</strong> • {lease.district} ({lease.area_acreage} Acres)
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {(lease.mining_type || '').toUpperCase() === 'PL' ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-sky-50 text-sky-800 border border-sky-300">
                              Prospecting License (PL)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                              Mining Lease (ML)
                            </span>
                          )}
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                            {lease.lease_status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* AUTO-POPULATED LOCKED CONCESSION DOSSIER */}
            {selectedLease ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Auto-Populated Concession Information (Locked)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                      (selectedLease.mining_type || '').toUpperCase() === 'PL'
                        ? 'bg-sky-50 text-sky-900 border-sky-300'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    }`}>
                      {(selectedLease.mining_type || '').toUpperCase() === 'PL' ? 'Prospecting License (PL)' : 'Mining Lease (ML)'}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-300">
                      Status: {selectedLease.lease_status}
                    </span>
                  </div>
                </div>

                {/* Statutory Classification Callout */}
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Concession Legal Nature</span>
                    <span className="font-bold text-slate-800">
                      {(selectedLease.mining_type || '').toUpperCase() === 'PL' 
                        ? 'Prospecting License (PL) — Governed under Rule 14, Punjab Mining Concession Rules 2002'
                        : 'Mining Lease (ML) — Governed under Rule 29, Punjab Mining Concession Rules 2002'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {(selectedLease.mining_type || '').toUpperCase() === 'PL' 
                      ? 'Exploration, core-drilling, and sampling rights'
                      : 'Commercial extraction, quarrying, and dispatch rights'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Concession Identifier</label>
                    <input type="text" readOnly value={`${selectedLease.lease_id}`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 font-mono font-bold text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Site Name / Concession</label>
                    <input type="text" readOnly value={selectedLease.site_code || selectedLease.lease_title} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs truncate" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Mineral</label>
                    <input type="text" readOnly value={`${selectedLease.mineral_name} (${selectedLease.mining_method || 'Surface Mining'})`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 font-semibold text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">District</label>
                    <input type="text" readOnly value={`${selectedLease.district}, Punjab`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Operating Lessee</label>
                    <input type="text" readOnly value={selectedLease.lessee_name} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs truncate" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Proprietor / Representative</label>
                    <input type="text" readOnly value={selectedLease.proprietor_representative} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs truncate" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Area</label>
                    <input type="text" readOnly value={`${selectedLease.area_acreage} Acres (${selectedLease.area_ha || ''} Hectares)`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">GPS Polygon Coordinates</label>
                    <input type="text" readOnly value={selectedLease.coordinates || 'DEMARCATED GRID PILLARS'} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-600 font-mono text-[11px] truncate" title={selectedLease.coordinates} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-center text-xs text-slate-500">
                Please search and select any of the 1,836 Small Scale Mining concessions above to lock official records.
              </div>
            )}
          </div>

          {/* STEP 2: HEARING DATE & NOTICE REF */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                2. Hearing Schedule &amp; Notice Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hearing Date &amp; Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Dispatch Number *
                </label>
                <input
                  type="text"
                  required
                  value={noticeRefNo}
                  onChange={(e) => setNoticeRefNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Issue Date
                </label>
                <input
                  type="date"
                  value={noticeDate}
                  onChange={(e) => setNoticeDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: GROUNDS & ALLEGATIONS */}
          <div className="space-y-3 pt-2">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                3. Grounds for Hearing &amp; Specific Allegations
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Violation Grounds *
              </label>
              <select
                value={hearingPurpose}
                onChange={(e) => handlePurposeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
              >
                {STATUTORY_VIOLATION_GROUNDS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Statement of Allegations
              </label>
              <textarea
                rows={3}
                value={specificAllegations}
                onChange={(e) => setSpecificAllegations(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Details of royalty default, encroachment measurement, or inspection findings..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Presiding Officer
                </label>
                <input
                  type="text"
                  value={presidingOfficer}
                  onChange={(e) => setPresidingOfficer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hearing Room / Location
                </label>
                <input
                  type="text"
                  value={hearingVenue}
                  onChange={(e) => setHearingVenue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SUBMISSION BAR */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedLeaseId('');
                setLeaseSearchTerm('');
                setSpecificAllegations('');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Register Hearing &amp; Generate Notice Docket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
