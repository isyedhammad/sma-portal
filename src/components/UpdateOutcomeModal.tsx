import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Hearing, HearingStatus } from '../types';
import {
  X,
  Gavel,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Scale,
  FileCheck,
  Coins
} from 'lucide-react';

export const UpdateOutcomeModal: React.FC = () => {
  const {
    isOutcomeModalOpen,
    closeOutcomeModal,
    selectedHearingForOutcome,
    updateHearing
  } = usePortal();

  const [status, setStatus] = useState<HearingStatus>('Adjourned');
  const [remarks, setRemarks] = useState('');
  
  // Adjournment state
  const [nextDate, setNextDate] = useState('');
  const [nextTime, setNextTime] = useState('10:30 AM');
  const [adjournmentReason, setAdjournmentReason] = useState('');

  // Disposed / Order state
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState('2026-11-16');
  const [decisionCategory, setDecisionCategory] = useState<'Penalty Imposed' | 'Direction Issued' | 'Lease Cancelled' | 'Exonerated/Notice Discharged' | 'Adjourned'>('Direction Issued');
  const [penaltyAmount, setPenaltyAmount] = useState<number | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOutcomeModalOpen || !selectedHearingForOutcome) return;

    setStatus(selectedHearingForOutcome.hearing_status);
    setRemarks(selectedHearingForOutcome.remarks_orders || '');
    setNextDate(selectedHearingForOutcome.next_hearing_date || '2026-11-30');
    setNextTime(selectedHearingForOutcome.next_hearing_time || '10:30 AM');
    setAdjournmentReason(selectedHearingForOutcome.adjournment_reason || 'To allow submission of verified treasury challans.');
    setOrderNo(selectedHearingForOutcome.order_no || `DGM&M/SMA/ORD-${Math.floor(100 + Math.random() * 900)}/2026`);
    setOrderDate(selectedHearingForOutcome.order_date || '2026-11-16');
    setDecisionCategory((selectedHearingForOutcome.decision_category as any) || 'Direction Issued');
    setPenaltyAmount(selectedHearingForOutcome.penalty_amount || '');
  }, [isOutcomeModalOpen, selectedHearingForOutcome]);

  if (!isOutcomeModalOpen || !selectedHearingForOutcome) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates: Partial<Hearing> = {
        hearing_status: status,
        remarks_orders: remarks
      };

      if (status === 'Adjourned') {
        updates.next_hearing_date = nextDate;
        updates.next_hearing_time = nextTime;
        updates.adjournment_reason = adjournmentReason;
      } else if (status === 'Disposed') {
        updates.order_no = orderNo;
        updates.order_date = orderDate;
        updates.decision_category = decisionCategory;
        updates.penalty_amount = penaltyAmount ? Number(penaltyAmount) : undefined;
      }

      await updateHearing(selectedHearingForOutcome.hearing_id, updates);
      closeOutcomeModal();
    } catch (err: any) {
      alert(`Error updating hearing outcome: ${err?.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#01411C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700">
              <Gavel className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Update Hearing Bench Outcome &amp; Orders
              </h2>
              <p className="text-xs text-emerald-200">
                {selectedHearingForOutcome.lease_no} • Notice Ref: {selectedHearingForOutcome.notice_reference_no || 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={closeOutcomeModal}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target Hearing Summary */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span>{selectedHearingForOutcome.lessee_name}</span>
              <span className="text-[#01411C] font-mono">{selectedHearingForOutcome.hearing_date}</span>
            </div>
            <div className="text-slate-600 line-clamp-1">{selectedHearingForOutcome.purpose}</div>
          </div>

          {/* Outcome Category Select Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Select Bench Ruling / Disposition *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Scheduled', 'Adjourned', 'Order Reserved', 'Disposed'] as HearingStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border text-center ${
                    status === st
                      ? st === 'Disposed'
                        ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-500/30'
                        : st === 'Adjourned'
                        ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-500/30'
                        : st === 'Order Reserved'
                        ? 'bg-purple-700 text-white border-purple-800 ring-2 ring-purple-500/30'
                        : 'bg-blue-700 text-white border-blue-800 ring-2 ring-blue-500/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Proceedings & Bench Remarks Textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Proceedings &amp; Operative Remarks *
            </label>
            <textarea
              rows={3}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Record attendance of parties, arguments presented, deposit of challans, or bench findings..."
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          {/* Conditional Fields: Adjourned */}
          {status === 'Adjourned' && (
            <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 space-y-3 text-xs">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                Adjournment Scheduling
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Next Hearing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Next Hearing Time
                  </label>
                  <input
                    type="text"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Reason for Adjournment / Order of Direction
                </label>
                <input
                  type="text"
                  value={adjournmentReason}
                  onChange={(e) => setAdjournmentReason(e.target.value)}
                  placeholder="e.g. Granted 14 days for treasury reconciliation with DMO."
                  className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields: Disposed / Final Order */}
          {status === 'Disposed' && (
            <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 space-y-3 text-xs">
              <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Formal Order Details
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Order Dispatch Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Order Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Operative Decision
                  </label>
                  <select
                    value={decisionCategory}
                    onChange={(e) => setDecisionCategory(e.target.value as any)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white font-semibold"
                  >
                    <option value="Direction Issued">Direction Issued</option>
                    <option value="Penalty Imposed">Penalty Imposed</option>
                    <option value="Lease Cancelled">Lease Cancelled</option>
                    <option value="Exonerated/Notice Discharged">Exonerated / Notice Discharged</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Penalty Amount (PKR if any)
                  </label>
                  <input
                    type="number"
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0"
                    className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeOutcomeModal}
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
              <span>{isSubmitting ? 'Saving...' : 'Save & Record Ruling'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
