import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS } from '../data/seedData';
import { 
  CalendarPlus, 
  Search, 
  Lock, 
  Building2, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck
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
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);

  // Hearing form fields
  const [hearingDate, setHearingDate] = useState<string>(() => {
    // Default to tomorrow 10:30 AM
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
  const [hearingVenue, setHearingVenue] = useState<string>('Judicial Chamber, DGM&M Punjab, Poonch House, Multan Road, Lahore');

  // Currently resolved lease object
  const selectedLease = leases.find(l => l.lease_id === selectedLeaseId) || null;

  // When selectedLeaseForHearing changes from outside
  useEffect(() => {
    if (selectedLeaseForHearing) {
      setSelectedLeaseId(selectedLeaseForHearing.lease_id);
    }
  }, [selectedLeaseForHearing]);

  // Update allegations template when purpose changes
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

  const filteredLeases = leases.filter(l => 
    l.lease_id.toLowerCase().includes(leaseSearchTerm.toLowerCase()) ||
    l.lessee_name.toLowerCase().includes(leaseSearchTerm.toLowerCase()) ||
    l.lease_title.toLowerCase().includes(leaseSearchTerm.toLowerCase()) ||
    l.mineral_name.toLowerCase().includes(leaseSearchTerm.toLowerCase()) ||
    l.district.toLowerCase().includes(leaseSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLease) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a registered SMA Lease from the directory.'
      });
      return;
    }

    if (!hearingDate) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please specify the statutory hearing date and time.'
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

    // Reset selection and open the official notice docket
    setSelectedLeaseForHearing(null);
    setActiveNoticeDocket(scheduled);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Page Title & Context Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Statutory Show-Cause & Summons Section
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Schedule Personal Hearing & Issue Notice
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Initiate statutory quasi-judicial hearing proceedings against SMA lessees under Rule 48 & 52 of Punjab Mining Concession Rules 2002. Selecting a lease automatically locks official title and licensee details.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="self-start md:self-auto text-xs text-slate-400 hover:text-slate-200 border border-slate-700 bg-slate-950 px-3 py-2 rounded-xl transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* SECTION 1: LEASE SELECTOR & AUTO-POPULATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Select Target Small Mines Agreement (SMA) Lease</span>
              </h3>
              <span className="text-xs text-slate-400">Step 1 of 3</span>
            </div>

            {/* Searchable Lease Typeahead Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Search & Select Lease Agreement *
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type Lease ID (e.g. SMA-ATK-...), Company Name, District, or Mineral..."
                  value={leaseSearchTerm}
                  onFocus={() => setIsLeaseDropdownOpen(true)}
                  onChange={(e) => {
                    setLeaseSearchTerm(e.target.value);
                    setIsLeaseDropdownOpen(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>

              {/* Dropdown Results */}
              {isLeaseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-950 border border-slate-700 rounded-xl max-h-64 overflow-y-auto shadow-2xl z-30 divide-y divide-slate-800/80">
                  {filteredLeases.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No matching SMA leases found in directory.
                    </div>
                  ) : (
                    filteredLeases.map(lease => (
                      <div
                        key={lease.lease_id}
                        onClick={() => {
                          setSelectedLeaseId(lease.lease_id);
                          setLeaseSearchTerm(`${lease.lease_id} — ${lease.lessee_name} (${lease.mineral_name}, ${lease.district})`);
                          setIsLeaseDropdownOpen(false);
                        }}
                        className={`p-3 hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs ${
                          selectedLeaseId === lease.lease_id ? 'bg-emerald-950/40 text-emerald-300' : 'text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">{lease.lease_id}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-semibold text-slate-100">{lease.lessee_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {lease.lease_title} • Mineral: <strong className="text-slate-300">{lease.mineral_name}</strong> ({lease.district})
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          lease.lease_status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                          lease.lease_status === 'Suspended' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                          'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}>
                          {lease.lease_status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* AUTO-POPULATING FIELDS (READ-ONLY LOCKED) */}
            {selectedLease ? (
              <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-inner animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Locked Verified Lease Dossier (Auto-Fetched from Records)
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedLease.lease_status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    Status: {selectedLease.lease_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Lease Reference ID
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedLease.lease_id} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono font-bold cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Lease Title / Mineral
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={`${selectedLease.mineral_name} — ${selectedLease.lease_title}`} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Lessee / Company Name
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedLease.lessee_name} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-semibold cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      District & Jurisdiction
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={`${selectedLease.district}${selectedLease.tehsil ? ` (${selectedLease.tehsil})` : ''}, Punjab`} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Representative / CEO
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedLease.proprietor_representative} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Contact Phone
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedLease.contact_number} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 cursor-not-allowed text-xs font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Sanctioned Acreage
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={`${selectedLease.area_acreage} Acres`} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 cursor-not-allowed text-xs" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      GPS Coordinates
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={selectedLease.coordinates || 'DEMARCATED GRID PILLARS'} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400 cursor-not-allowed text-xs font-mono" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                Please select a lease above to automatically populate and lock official concession records.
              </div>
            )}
          </div>

          {/* SECTION 2: HEARING DATE & TIME */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Statutory Hearing Schedule & Dispatch Reference</span>
              </h3>
              <span className="text-xs text-slate-400">Step 2 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Statutory Hearing Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notice Dispatch Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={noticeRefNo}
                  onChange={(e) => setNoticeRefNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g. DGM&M/SMA/H-108/2026"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Auto-generated statutory dispatch sequence (editable)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notice Issue Date
                </label>
                <input
                  type="date"
                  value={noticeDate}
                  onChange={(e) => setNoticeDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: STATUTORY GROUNDS & VENUE */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Grounds for Hearing & Presiding Chamber</span>
              </h3>
              <span className="text-xs text-slate-400">Step 3 of 3</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Statutory Violation Category / Grounds *</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Under PMR 2002</span>
              </label>
              <select
                value={hearingPurpose}
                onChange={(e) => handlePurposeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
              >
                {STATUTORY_VIOLATION_GROUNDS.map(ground => (
                  <option key={ground} value={ground}>{ground}</option>
                ))}
              </select>
            </div>

            {/* Detailed statement of allegations */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Specific Statement of Allegations & Inspection Extract</span>
                <span className="text-[10px] text-slate-500">Will be quoted verbatim on the Notice Docket</span>
              </label>
              <textarea
                rows={4}
                value={specificAllegations}
                onChange={(e) => setSpecificAllegations(e.target.value)}
                placeholder="Enter specific facts, survey dates, or overdue challan amounts..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-serif"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Presiding Officer / Authority
                </label>
                <input
                  type="text"
                  value={presidingOfficer}
                  onChange={(e) => setPresidingOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hearing Venue / Chamber
                </label>
                <input
                  type="text"
                  value={hearingVenue}
                  onChange={(e) => setHearingVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON BAR */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Validates required fields, commits to judicial calendar, and generates printable Docket</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedLeaseId('');
                  setLeaseSearchTerm('');
                  setSpecificAllegations('');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors w-full sm:w-auto text-center"
              >
                Clear Form
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl transition-all active:scale-95 border border-emerald-400/40 w-full sm:w-auto"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Register Hearing & Generate Notice Docket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
};
