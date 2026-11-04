import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS } from '../data/seedData';
import { 
  CalendarPlus, 
  Search, 
  Lock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight
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

  const selectedLease = leases.find(l => l.lease_id === selectedLeaseId) || null;

  useEffect(() => {
    if (selectedLeaseForHearing) {
      setSelectedLeaseId(selectedLeaseForHearing.lease_id);
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
        message: 'Please select a registered SMA Lease from the list.'
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Schedule Personal Hearing &amp; Issue Notice
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an SMA lease to auto-populate concession information and generate a formal notice
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
          
          {/* STEP 1: LEASE SELECTION */}
          <div className="space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                1. Select Target SMA Lease
              </h3>
            </div>

            {/* Typeahead Search Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Search Lease by Number, Company Name, Mineral or District *
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. SMA-ATK-..., M/s Indus Valley, Limestone..."
                  value={leaseSearchTerm}
                  onFocus={() => setIsLeaseDropdownOpen(true)}
                  onChange={(e) => {
                    setLeaseSearchTerm(e.target.value);
                    setIsLeaseDropdownOpen(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {isLeaseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg max-h-56 overflow-y-auto shadow-lg z-30 divide-y divide-slate-100">
                  {filteredLeases.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs">
                      No matching SMA leases found.
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
                        className={`p-2.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                          selectedLeaseId === lease.lease_id ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-800">{lease.lease_id}</span>
                            <span>•</span>
                            <span className="font-medium">{lease.lessee_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {lease.lease_title} ({lease.mineral_name}, {lease.district})
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold">
                          {lease.lease_status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* AUTO-POPULATED LOCKED FIELDS */}
            {selectedLease ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Auto-Populated Lease Information (Read-Only)</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-300">
                    Status: {selectedLease.lease_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Lease ID</label>
                    <input type="text" readOnly value={selectedLease.lease_id} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 font-mono font-bold text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Mineral &amp; Title</label>
                    <input type="text" readOnly value={`${selectedLease.mineral_name} - ${selectedLease.lease_title}`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs truncate" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Lessee / Company</label>
                    <input type="text" readOnly value={selectedLease.lessee_name} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 font-semibold text-xs truncate" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">District / Location</label>
                    <input type="text" readOnly value={`${selectedLease.district}, Punjab`} className="w-full bg-white border border-slate-300 rounded p-1.5 text-slate-800 text-xs" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-center text-xs text-slate-500">
                Please select a lease above to lock concession records.
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
