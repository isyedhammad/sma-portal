import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Hearing, HearingStatus } from '../types';
import {
  X,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Scale,
  FileText,
  Gavel,
  Edit3,
  Check,
  AlertCircle,
  Building,
  Coins,
  ArrowRight,
  Trash2
} from 'lucide-react';

export const HearingHistoryDrawer: React.FC = () => {
  const {
    selectedLeaseForDrawer,
    closeDrawer,
    getHearingsForLease,
    openScheduleModal,
    openOutcomeModal,
    updateHearing,
    deleteHearing
  } = usePortal();

  // Track which hearing is currently being edited inline
  const [editingHearingId, setEditingHearingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Hearing>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDrawer]);

  if (!selectedLeaseForDrawer) return null;

  const leaseHearings = getHearingsForLease(selectedLeaseForDrawer.lease_id);
  const isMiningLease = selectedLeaseForDrawer.mining_type === 'ML' || selectedLeaseForDrawer.lease_no.includes('ML');

  const startInlineEdit = (hearing: Hearing) => {
    setEditingHearingId(hearing.hearing_id);
    setEditFormData({
      remarks_orders: hearing.remarks_orders || '',
      hearing_status: hearing.hearing_status,
      order_no: hearing.order_no || '',
      order_date: hearing.order_date || '',
      decision_category: hearing.decision_category || 'Direction Issued',
      penalty_amount: hearing.penalty_amount || 0,
      next_hearing_date: hearing.next_hearing_date || '',
      adjournment_reason: hearing.adjournment_reason || ''
    });
  };

  const cancelInlineEdit = () => {
    setEditingHearingId(null);
    setEditFormData({});
  };

  const handleSaveInlineEdit = async (hearingId: string) => {
    setIsSaving(true);
    try {
      await updateHearing(hearingId, editFormData);
      setEditingHearingId(null);
      setEditFormData({});
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: HearingStatus) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Scheduled
          </span>
        );
      case 'Adjourned':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Adjourned
          </span>
        );
      case 'Order Reserved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            Order Reserved
          </span>
        );
      case 'Disposed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Disposed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="bg-[#01411C] text-white px-6 py-5 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                    Chronological Hearing Dossier
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isMiningLease
                        ? 'bg-blue-900 text-blue-200 border border-blue-700'
                        : 'bg-purple-900 text-purple-200 border border-purple-700'
                    }`}
                  >
                    {isMiningLease ? 'Mining Lease (ML)' : 'Prospecting License (PL)'}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                  {selectedLeaseForDrawer.lease_title}
                </h2>
                {selectedLeaseForDrawer.site_code && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-emerald-300 uppercase font-semibold">Site:</span>
                    <span className="font-mono text-xs text-white bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 font-semibold">
                      {selectedLeaseForDrawer.site_code}
                    </span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={closeDrawer}
                className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
                title="Close Drawer (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lease Meta Grid */}
            <div className="mt-4 pt-3 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-emerald-100">
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-medium">Lessee / Company</span>
                <span className="font-semibold text-white line-clamp-1">
                  {selectedLeaseForDrawer.lessee_name}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-medium">District &amp; Mineral</span>
                <span className="font-semibold text-white">
                  {selectedLeaseForDrawer.district} • {selectedLeaseForDrawer.mineral}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-medium">Concession Status</span>
                <span className="font-semibold text-white">
                  {selectedLeaseForDrawer.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Quick Action Button: Schedule Next Hearing */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-emerald-200 font-medium">
                Total Hearings on Record: <strong className="text-white">{leaseHearings.length}</strong>
              </span>

              <button
                onClick={() => {
                  openScheduleModal(selectedLeaseForDrawer);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f29] text-slate-950 shadow-sm transition-all transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Schedule Next Hearing</span>
              </button>
            </div>

          </div>

          {/* Drawer Body: Chronological Timeline */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
            
            {leaseHearings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200 my-8">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Hearing Records on File</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No statutory personal hearings have been conducted or scheduled for this concession yet.
                </p>
                <button
                  onClick={() => openScheduleModal(selectedLeaseForDrawer)}
                  className="mt-4 px-4 py-2 bg-[#01411C] hover:bg-[#0A5C36] text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule First Statutory Hearing</span>
                </button>
              </div>
            ) : (
              <div className="relative border-l-2 border-emerald-600/40 ml-4 pl-6 space-y-6">
                
                {leaseHearings.map((h, idx) => {
                  const isBeingEdited = editingHearingId === h.hearing_id;
                  const isLatest = idx === 0;

                  return (
                    <div key={h.hearing_id} className="relative group">
                      
                      {/* Timeline Dot Indicator */}
                      <span
                        className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ring-2 ring-emerald-600 ${
                          h.hearing_status === 'Disposed'
                            ? 'bg-emerald-600'
                            : h.hearing_status === 'Adjourned'
                            ? 'bg-amber-500'
                            : h.hearing_status === 'Order Reserved'
                            ? 'bg-purple-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                      </span>

                      {/* Hearing Card */}
                      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3 hover:border-emerald-500/50 transition-colors">
                        
                        {/* Top Card Bar */}
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                                {h.hearing_date}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {h.hearing_time || '10:30 AM'}
                              </span>
                              {isLatest && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                                  Latest
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              ID: {h.hearing_id} • Notice: {h.notice_reference_no || 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {getStatusBadge(h.hearing_status)}
                            
                            {!isBeingEdited ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startInlineEdit(h)}
                                  className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                  title="Edit remarks or order inline"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Are you sure you want to permanently delete hearing ${h.hearing_id} (${h.hearing_date}) from cloud records?`)) {
                                      await deleteHearing(h.hearing_id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Delete / cancel this hearing record from cloud"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Purpose & Stage */}
                        <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                          <div className="text-xs font-semibold text-slate-800">
                            {h.purpose}
                          </div>
                          {h.stage && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Stage: <span className="font-medium text-slate-700">{h.stage}</span>
                            </div>
                          )}
                        </div>

                        {/* Proceedings / Remarks / Orders Display or Inline Edit Form */}
                        {isBeingEdited ? (
                          <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 space-y-3">
                            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                              <span>Inline Edit Hearing Proceedings</span>
                              <span className="text-[10px] text-amber-700">Changes update cloud record</span>
                            </div>

                            {/* Status Selector */}
                            <div>
                              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                                Hearing Status
                              </label>
                              <select
                                value={editFormData.hearing_status}
                                onChange={(e) => setEditFormData({ ...editFormData, hearing_status: e.target.value as HearingStatus })}
                                className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white text-slate-800"
                              >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Adjourned">Adjourned</option>
                                <option value="Order Reserved">Order Reserved</option>
                                <option value="Disposed">Disposed</option>
                              </select>
                            </div>

                            {/* Remarks Textarea */}
                            <div>
                              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                                Bench Proceedings &amp; Operative Remarks
                              </label>
                              <textarea
                                rows={3}
                                value={editFormData.remarks_orders}
                                onChange={(e) => setEditFormData({ ...editFormData, remarks_orders: e.target.value })}
                                placeholder="Enter hearing notes, appearance of counsel, submission of challans..."
                                className="w-full text-xs border border-slate-300 rounded p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                              />
                            </div>

                            {/* Adjournment fields if Adjourned */}
                            {editFormData.hearing_status === 'Adjourned' && (
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-700 block">Next Hearing Date</label>
                                  <input
                                    type="date"
                                    value={editFormData.next_hearing_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, next_hearing_date: e.target.value })}
                                    className="w-full text-xs border border-slate-300 rounded p-1 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-700 block">Adjournment Grounds</label>
                                  <input
                                    type="text"
                                    value={editFormData.adjournment_reason}
                                    onChange={(e) => setEditFormData({ ...editFormData, adjournment_reason: e.target.value })}
                                    placeholder="e.g. Deposit of treasury dues"
                                    className="w-full text-xs border border-slate-300 rounded p-1 bg-white"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Order fields if Disposed */}
                            {editFormData.hearing_status === 'Disposed' && (
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60">
                                <div>
                                  <label className="text-[10px] font-medium text-slate-700 block">Order Dispatch No.</label>
                                  <input
                                    type="text"
                                    value={editFormData.order_no}
                                    onChange={(e) => setEditFormData({ ...editFormData, order_no: e.target.value })}
                                    placeholder="DGM&M/SMA/ORD-2026-..."
                                    className="w-full text-xs border border-slate-300 rounded p-1 bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-medium text-slate-700 block">Penalty Amount (PKR)</label>
                                  <input
                                    type="number"
                                    value={editFormData.penalty_amount || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, penalty_amount: Number(e.target.value) })}
                                    placeholder="0"
                                    className="w-full text-xs border border-slate-300 rounded p-1 bg-white"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={cancelInlineEdit}
                                className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() => handleSaveInlineEdit(h.hearing_id)}
                                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* Recorded Remarks */}
                            {h.remarks_orders ? (
                              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                                <span className="font-semibold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                                  Bench Remarks &amp; Recorded Findings:
                                </span>
                                {h.remarks_orders}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">
                                No proceedings or remarks recorded yet. Click the edit icon to enter bench notes.
                              </div>
                            )}

                            {/* Adjournment Detail Box */}
                            {h.hearing_status === 'Adjourned' && h.next_hearing_date && (
                              <div className="mt-2.5 flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                                <div>
                                  <span className="font-bold text-amber-900 block">
                                    Adjourned To: {h.next_hearing_date} ({h.next_hearing_time || '10:30 AM'})
                                  </span>
                                  {h.adjournment_reason && (
                                    <span className="text-amber-800 text-[11px]">
                                      Grounds: {h.adjournment_reason}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Disposed / Formal Order Detail Box */}
                            {h.order_no && (
                              <div className="mt-2.5 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                                <div className="flex items-center justify-between text-emerald-900 font-bold">
                                  <span>Formal Order: {h.order_no}</span>
                                  <span>{h.order_date || h.hearing_date}</span>
                                </div>
                                {h.decision_category && (
                                  <div className="text-emerald-800 text-[11px]">
                                    Decision: <strong className="font-bold">{h.decision_category}</strong>
                                    {h.penalty_amount ? ` • Penalty: PKR ${h.penalty_amount.toLocaleString()}` : ''}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Presiding Bench Info */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{h.presiding_officer || 'Licensing Authority'}</span>
                          <span>Lahore Bench</span>
                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
            <span>Official DGMM Hearing Record</span>
            <button
              onClick={closeDrawer}
              className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-medium"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
