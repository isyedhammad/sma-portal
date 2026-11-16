import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lease, Hearing } from '../types';
import {
  X,
  Calendar,
  Clock,
  Search,
  Building,
  MapPin,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  History
} from 'lucide-react';

const COMMON_VIOLATIONS = [
  'Non-payment of statutory royalty dues and surface rent',
  'Unauthorized boundary encroachment & mining outside concession demarcations',
  'Failure to submit mandatory monthly production returns under Rule 48',
  'Environmental degradation and unlawful quarrying outside approved plan',
  'Non-renewal of lease concession and unauthorized continuous extraction',
  'Violation of safety standards and absence of certified mine manager',
  'Custom Statutory Ground / Show-Cause Notice'
];

export const ScheduleHearingModal: React.FC = () => {
  const {
    isScheduleModalOpen,
    closeScheduleModal,
    selectedLeaseForSchedule,
    hearingToEdit,
    leases,
    scheduleHearing,
    getLatestHearingForLease,
    addLease
  } = usePortal();

  // Search autocomplete state
  const [leaseSearchQuery, setLeaseSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

  // Quick inline lease creation mode if lease not in directory
  const [isInlineCreateMode, setIsInlineCreateMode] = useState(false);
  const [inlineLeaseData, setInlineLeaseData] = useState({
    lease_no: '',
    lease_title: '',
    lessee_name: '',
    district: 'Attock',
    mineral: 'Limestone',
    mining_type: 'ML' as 'ML' | 'PL'
  });

  // Hearing Form State
  const [hearingDate, setHearingDate] = useState('2026-11-16');
  const [hearingTime, setHearingTime] = useState('10:30 AM');
  const [purposePreset, setPurposePreset] = useState(COMMON_VIOLATIONS[0]);
  const [customPurpose, setCustomPurpose] = useState('');
  const [stage, setStage] = useState('Initial Notice / Show-Cause Reply');
  const [noticeRef, setNoticeRef] = useState('');
  const [presidingOfficer, setPresidingOfficer] = useState('Director SMA/T - Licensing Authority');
  const [hearingVenue, setHearingVenue] = useState('Court Room of Director SMA/T, Poonch House, Multan Road, Lahore');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill state when modal opens
  useEffect(() => {
    if (!isScheduleModalOpen) return;

    if (hearingToEdit) {
      // Edit mode
      const matched = leases.find(l => l.lease_id === hearingToEdit.lease_id);
      setSelectedLease(matched || {
        lease_id: hearingToEdit.lease_id,
        lease_no: hearingToEdit.lease_no,
        lease_title: hearingToEdit.lease_title,
        lessee_name: hearingToEdit.lessee_name,
        district: hearingToEdit.district,
        mineral: hearingToEdit.mineral,
        status: 'Active',
        mining_type: hearingToEdit.lease_title.includes('PL') ? 'PL' : 'ML'
      });
      setLeaseSearchQuery(hearingToEdit.lease_no);
      setHearingDate(hearingToEdit.hearing_date);
      setHearingTime(hearingToEdit.hearing_time || '10:30 AM');
      setCustomPurpose(hearingToEdit.purpose);
      setStage(hearingToEdit.stage || 'Initial Notice / Show-Cause Reply');
      setNoticeRef(hearingToEdit.notice_reference_no || '');
      setPresidingOfficer(hearingToEdit.presiding_officer || 'Director SMA/T - Licensing Authority');
      setHearingVenue(hearingToEdit.hearing_venue || 'Court Room of Director SMA/T, Poonch House, Multan Road, Lahore');
      setRemarks(hearingToEdit.remarks_orders || '');
      setIsInlineCreateMode(false);
    } else if (selectedLeaseForSchedule) {
      // Pre-filled with specific lease
      setSelectedLease(selectedLeaseForSchedule);
      setLeaseSearchQuery(selectedLeaseForSchedule.lease_no);
      setNoticeRef(`DGM&M/SMA/H-${Math.floor(100 + Math.random() * 900)}/2026`);
      setHearingDate('2026-11-16');
      setCustomPurpose(COMMON_VIOLATIONS[0]);
      setIsInlineCreateMode(false);
    } else {
      // Fresh new schedule
      setSelectedLease(null);
      setLeaseSearchQuery('');
      setNoticeRef(`DGM&M/SMA/H-${Math.floor(100 + Math.random() * 900)}/2026`);
      setHearingDate('2026-11-16');
      setCustomPurpose(COMMON_VIOLATIONS[0]);
      setRemarks('');
      setIsInlineCreateMode(false);
    }
  }, [isScheduleModalOpen, selectedLeaseForSchedule, hearingToEdit, leases]);

  // Autocomplete suggestions (max 8)
  const filteredLeaseSuggestions = useMemo(() => {
    if (!leaseSearchQuery.trim() || selectedLease?.lease_no === leaseSearchQuery) {
      return [];
    }
    const q = leaseSearchQuery.toLowerCase();
    return leases
      .filter(
        l =>
          l.lease_no.toLowerCase().includes(q) ||
          l.lease_title.toLowerCase().includes(q) ||
          l.lessee_name.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.mineral.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [leaseSearchQuery, leases, selectedLease]);

  // Recent previous hearing of the selected lease (Context Banner)
  const previousHearing = useMemo(() => {
    if (!selectedLease) return null;
    return getLatestHearingForLease(selectedLease.lease_id);
  }, [selectedLease, getLatestHearingForLease]);

  if (!isScheduleModalOpen) return null;

  const handleSelectLease = (lease: Lease) => {
    setSelectedLease(lease);
    setLeaseSearchQuery(lease.lease_no);
    setIsDropdownOpen(false);
    setIsInlineCreateMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let activeLease = selectedLease;

      // If user filled inline lease details
      if (isInlineCreateMode && !activeLease) {
        activeLease = await addLease({
          lease_id: inlineLeaseData.lease_no,
          lease_no: inlineLeaseData.lease_no,
          lease_title: inlineLeaseData.lease_title || `Mining Concession ${inlineLeaseData.lease_no}`,
          lessee_name: inlineLeaseData.lessee_name || 'Authorized Lessee',
          district: inlineLeaseData.district,
          mineral: inlineLeaseData.mineral,
          mining_type: inlineLeaseData.mining_type,
          status: 'Active'
        });
      }

      if (!activeLease) {
        alert('Please select or register a valid lease before scheduling.');
        setIsSubmitting(false);
        return;
      }

      const finalPurpose = purposePreset === 'Custom Statutory Ground / Show-Cause Notice'
        ? customPurpose
        : customPurpose || purposePreset;

      await scheduleHearing({
        hearing_id: hearingToEdit?.hearing_id,
        lease_id: activeLease.lease_id,
        lease_no: activeLease.lease_no,
        lease_title: activeLease.lease_title,
        lessee_name: activeLease.lessee_name,
        district: activeLease.district,
        mineral: activeLease.mineral,
        hearing_date: hearingDate,
        hearing_time: hearingTime,
        purpose: finalPurpose,
        stage,
        notice_reference_no: noticeRef,
        presiding_officer: presidingOfficer,
        hearing_venue: hearingVenue,
        remarks_orders: remarks,
        hearing_status: hearingToEdit ? hearingToEdit.hearing_status : 'Scheduled'
      });

      closeScheduleModal();
    } catch (err: any) {
      alert(`Error scheduling hearing: ${err?.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#01411C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700">
              <Scale className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {hearingToEdit ? 'Edit Personal Hearing Notice' : 'Schedule Statutory Personal Hearing'}
              </h2>
              <p className="text-xs text-emerald-200">
                Rule 48/56, Punjab Mining Concession Rules 2002 • Office of Director SMA/T
              </p>
            </div>
          </div>

          <button
            onClick={closeScheduleModal}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Lease Selection & Auto-Fill */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Select Lease Concession (Search 1,836 Leases)</span>
              {selectedLease && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLease(null);
                    setLeaseSearchQuery('');
                  }}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  Change Lease
                </button>
              )}
            </label>

            {!selectedLease && !isInlineCreateMode && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Type Lease ID (e.g. SMA-ATT-0001), Title, Lessee, District, or Mineral..."
                  value={leaseSearchQuery}
                  onChange={(e) => {
                    setLeaseSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />

                {/* Suggestions Dropdown */}
                {isDropdownOpen && filteredLeaseSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-56 overflow-y-auto divide-y divide-slate-100">
                    {filteredLeaseSuggestions.map((item) => (
                      <div
                        key={item.lease_id}
                        onClick={() => handleSelectLease(item)}
                        className="p-2.5 hover:bg-emerald-50 cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#01411C]">{item.lease_no}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 rounded text-slate-700">
                            {item.mining_type || 'ML'} • {item.mineral}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 font-medium line-clamp-1">{item.lease_title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.lessee_name} • {item.district}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Register Prompt if not found */}
                {leaseSearchQuery.length >= 2 && filteredLeaseSuggestions.length === 0 && (
                  <div className="p-3 mt-1 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                    <span>Lease "{leaseSearchQuery}" not found in current directory.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInlineCreateMode(true);
                        setInlineLeaseData({
                          lease_no: leaseSearchQuery.toUpperCase(),
                          lease_title: `Mining Concession (${leaseSearchQuery.toUpperCase()})`,
                          lessee_name: '',
                          district: 'Attock',
                          mineral: 'Limestone',
                          mining_type: leaseSearchQuery.includes('PL') ? 'PL' : 'ML'
                        });
                        setIsDropdownOpen(false);
                      }}
                      className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold"
                    >
                      + Quick Register Inline
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Inline Quick Lease Creation Form */}
            {isInlineCreateMode && (
              <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">Quick Inline Lease Registration</span>
                  <button
                    type="button"
                    onClick={() => setIsInlineCreateMode(false)}
                    className="text-slate-500 hover:text-slate-800 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 block">Lease No / Site Code</label>
                    <input
                      type="text"
                      value={inlineLeaseData.lease_no}
                      onChange={(e) => setInlineLeaseData({ ...inlineLeaseData, lease_no: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 block">Concession Type</label>
                    <select
                      value={inlineLeaseData.mining_type}
                      onChange={(e) => setInlineLeaseData({ ...inlineLeaseData, mining_type: e.target.value as 'ML' | 'PL' })}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white font-semibold"
                    >
                      <option value="ML">ML - Mining Lease</option>
                      <option value="PL">PL - Prospecting License</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-700 block">Lessee / Company Name</label>
                  <input
                    type="text"
                    placeholder="M/s Indus Valley Mineral Developers..."
                    value={inlineLeaseData.lessee_name}
                    onChange={(e) => setInlineLeaseData({ ...inlineLeaseData, lessee_name: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 block">District</label>
                    <input
                      type="text"
                      value={inlineLeaseData.district}
                      onChange={(e) => setInlineLeaseData({ ...inlineLeaseData, district: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-slate-700 block">Mineral</label>
                    <input
                      type="text"
                      value={inlineLeaseData.mineral}
                      onChange={(e) => setInlineLeaseData({ ...inlineLeaseData, mineral: e.target.value })}
                      className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Selected Lease Display Card */}
            {selectedLease && (
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="text-[#01411C] font-mono text-sm">{selectedLease.lease_no}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                      {selectedLease.mining_type || 'ML'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedLease.district} • {selectedLease.mineral}
                  </span>
                </div>
                <div className="text-slate-800 font-medium line-clamp-1">{selectedLease.lease_title}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>Lessee: {selectedLease.lessee_name}</span>
                </div>
              </div>
            )}

            {/* Compact Preview Banner of Most Recent Previous Hearing */}
            {selectedLease && (
              <div className="bg-emerald-50/70 rounded-lg border border-emerald-200 p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <History className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Previous Hearing Record Preview</span>
                </div>

                {previousHearing ? (
                  <div className="text-emerald-950 text-[11px] space-y-0.5">
                    <div>
                      Last Hearing Date: <strong className="font-semibold">{previousHearing.hearing_date}</strong> • Stage: <strong className="font-semibold">{previousHearing.stage || 'N/A'}</strong> • Status: <strong className="font-semibold">{previousHearing.hearing_status}</strong>
                    </div>
                    {previousHearing.remarks_orders ? (
                      <div className="italic text-emerald-800 line-clamp-2 bg-white/70 p-1.5 rounded border border-emerald-100 mt-1">
                        "{previousHearing.remarks_orders}"
                      </div>
                    ) : (
                      <div className="text-emerald-700 italic">No previous remarks recorded.</div>
                    )}
                  </div>
                ) : (
                  <div className="text-emerald-800 text-[11px] italic">
                    First statutory personal hearing for this concession (no previous hearings on record).
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Hearing Date, Time & Dispatch Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Hearing Date *
              </label>
              <input
                type="date"
                required
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Hearing Time *
              </label>
              <select
                value={hearingTime}
                onChange={(e) => setHearingTime(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-medium"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Notice Dispatch Ref *
              </label>
              <input
                type="text"
                required
                value={noticeRef}
                onChange={(e) => setNoticeRef(e.target.value)}
                placeholder="DGM&M/SMA/H-104/2026"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>
          </div>

          {/* Section 3: Statutory Grounds & Stage */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Grounds for Hearing / Statutory Violation *
              </label>
              <select
                value={purposePreset}
                onChange={(e) => {
                  setPurposePreset(e.target.value);
                  if (e.target.value !== 'Custom Statutory Ground / Show-Cause Notice') {
                    setCustomPurpose(e.target.value);
                  }
                }}
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              >
                {COMMON_VIOLATIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Detailed Grounds / Operative Allegation
              </label>
              <textarea
                rows={2}
                value={customPurpose}
                onChange={(e) => setCustomPurpose(e.target.value)}
                placeholder="Specify notice details, audit report findings, or specific rule violations..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Stage of Proceeding
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="Initial Notice / Show-Cause Reply">Initial Notice / Show-Cause Reply</option>
                  <option value="Verification of Treasury Challans">Verification of Treasury Challans</option>
                  <option value="DMO Field Survey & Boundary Verification">DMO Field Survey &amp; Boundary Verification</option>
                  <option value="Final Arguments & Submissions">Final Arguments &amp; Submissions</option>
                  <option value="Quasi-Judicial Order Announcement">Quasi-Judicial Order Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Presiding Officer
                </label>
                <input
                  type="text"
                  value={presidingOfficer}
                  onChange={(e) => setPresidingOfficer(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Initial Notes / Remarks */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Initial Bench Notes / Docket Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Notice served through Registered A/D and District Mining Officer. Lessee directed to appear with original treasury receipts..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeScheduleModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#01411C] hover:bg-[#0A5C36] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : hearingToEdit ? 'Save Changes' : 'Register & Schedule Hearing'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
