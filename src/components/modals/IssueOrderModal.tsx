import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { DecisionCategory, LeaseStatus, OrderDetails } from '../../types';
import { 
  X, 
  Gavel, 
  DollarSign, 
  Clock
} from 'lucide-react';

export const IssueOrderModal: React.FC = () => {
  const { 
    activeIssueOrderHearing, 
    setActiveIssueOrderHearing, 
    leases, 
    issueOrder,
    setActiveOrderDocument 
  } = usePortal();

  if (!activeIssueOrderHearing) return null;

  const associatedLease = leases.find(l => l.lease_id === activeIssueOrderHearing.lease_id);

  // Form states
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [decisionCategory, setDecisionCategory] = useState<DecisionCategory>('Penalty Imposed');
  const [penaltyAmount, setPenaltyAmount] = useState<number>(500000);
  const [complianceDeadline, setComplianceDeadline] = useState('15 days from date of issue');
  const [decisionSummary, setDecisionSummary] = useState('');
  const [dispatched, setDispatched] = useState(true);
  const [leaseStatusUpdate, setLeaseStatusUpdate] = useState<LeaseStatus>('Show-Cause Issued');
  const [presidingOfficer, setPresidingOfficer] = useState('Director SMA/T - Licensing Authority');
  const [attendees, setAttendees] = useState('');

  useEffect(() => {
    if (activeIssueOrderHearing) {
      const today = new Date().toISOString().split('T')[0];
      const randomOrderSuffix = Math.floor(1000 + Math.random() * 9000);
      setOrderNo(activeIssueOrderHearing.order_details?.order_no || `DGM&M/SMA/ORD-2026-${randomOrderSuffix}`);
      setOrderDate(activeIssueOrderHearing.order_details?.order_date || today);
      
      const defaultAttendees = associatedLease 
        ? `${associatedLease.proprietor_representative} (Representative for ${associatedLease.lessee_name}), Assistant Director Legal`
        : 'Representative of Lessee, Legal Officer';
      setAttendees(defaultAttendees);

      if (activeIssueOrderHearing.order_details) {
        setDecisionCategory(activeIssueOrderHearing.order_details.decision_category);
        setDecisionSummary(activeIssueOrderHearing.order_details.decision_summary);
        setPenaltyAmount(activeIssueOrderHearing.order_details.penalty_amount || 0);
        setComplianceDeadline(activeIssueOrderHearing.order_details.compliance_deadline || '');
        setDispatched(activeIssueOrderHearing.order_details.dispatched);
      } else {
        setDecisionSummary(
          `Having examined the record, inspection report and submissions, the undersigned finds that the lessee failed to comply with terms regarding "${activeIssueOrderHearing.hearing_purpose}". Accordingly, penalty is imposed under Rule 48. The lessee is directed to deposit the sum in Government Treasury within 15 days.`
        );
      }

      if (associatedLease) {
        setLeaseStatusUpdate(associatedLease.lease_status);
      }
    }
  }, [activeIssueOrderHearing, associatedLease]);

  const handleCategoryChange = (category: DecisionCategory) => {
    setDecisionCategory(category);
    if (category === 'Penalty Imposed') {
      setPenaltyAmount(500000);
      setLeaseStatusUpdate('Show-Cause Issued');
      setDecisionSummary(
        `Having examined the record, a penalty of PKR 500,000 is imposed under Rule 48 of Punjab Mining Concession Rules 2002. Sum must be deposited via National Bank of Pakistan treasury challan within 15 days.`
      );
    } else if (category === 'Lease Revoked/Cancelled') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Suspended');
      setDecisionSummary(
        `Due to repeated non-compliance regarding ${activeIssueOrderHearing.hearing_purpose}, Small Scale Mining (SMA/T) Lease ${activeIssueOrderHearing.lease_id} is hereby CANCELLED with immediate effect. Security deposit stands forfeited to Government of the Punjab.`
      );
    } else if (category === 'Exonerated/Compliance Accepted') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Active');
      setDecisionSummary(
        `The lessee has submitted verified proof of compliance and cleared all statutory dues. The show-cause notice is discharged and the lease restored to active standing.`
      );
    } else if (category === 'Direction Issued') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Show-Cause Issued');
      setDecisionSummary(
        `Lessee is directed under Rule 39 to rectify all deficiencies within ${complianceDeadline} and submit a verified report from the District Mining Officer, failing which cancellation proceedings shall be initiated.`
      );
    } else if (category === 'Adjourned to New Date') {
      setPenaltyAmount(0);
      setDecisionSummary(`Case adjourned for further verification of field survey report.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: OrderDetails = {
      order_no: orderNo,
      order_date: orderDate,
      decision_category: decisionCategory,
      decision_summary: decisionSummary,
      penalty_amount: decisionCategory === 'Penalty Imposed' ? Number(penaltyAmount) : undefined,
      compliance_deadline: complianceDeadline || undefined,
      order_attachment_name: `Order_${orderNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      presiding_officer: presidingOfficer,
      attendees,
      legal_provisions: "Punjab Mining Concession Rules 2002",
      dispatched,
    };

    issueOrder(activeIssueOrderHearing.hearing_id, orderData, leaseStatusUpdate);
    
    const updatedHearing = {
      ...activeIssueOrderHearing,
      hearing_status: 'Decided' as const,
      order_issued: true,
      order_details: orderData
    };

    setActiveIssueOrderHearing(null);
    setActiveOrderDocument(updatedHearing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Record Hearing Determination &amp; Order
              </h3>
              <p className="text-[11px] text-slate-400">Notice Ref: {activeIssueOrderHearing.notice_reference_no}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveIssueOrderHearing(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Info Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>Company: <strong className="text-slate-900">{associatedLease?.lessee_name}</strong></div>
          <div>Lease ID: <strong className="text-slate-900 font-mono">{activeIssueOrderHearing.lease_id}</strong></div>
          <div>District: <strong className="text-slate-900">{associatedLease?.district}</strong></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Dispatch Number *
              </label>
              <input
                type="text"
                required
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Date *
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Decision Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Penalty Imposed', 'Direction Issued', 'Lease Revoked/Cancelled', 'Exonerated/Compliance Accepted', 'Adjourned to New Date'] as DecisionCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`p-2 rounded-lg text-xs font-semibold border text-left transition-all ${
                    decisionCategory === cat
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {decisionCategory === 'Penalty Imposed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Penalty Amount (PKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  required
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-xs text-amber-950 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Payment Deadline
                </label>
                <input
                  type="text"
                  value={complianceDeadline}
                  onChange={(e) => setComplianceDeadline(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Order Remarks / Operative Decision Summary *
            </label>
            <textarea
              required
              rows={4}
              value={decisionSummary}
              onChange={(e) => setDecisionSummary(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Presiding Authority
              </label>
              <input
                type="text"
                value={presidingOfficer}
                onChange={(e) => setPresidingOfficer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attendees Present in Hearing
              </label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Synchronize Lease Status</span>
              <span className="text-[11px] text-slate-500">Update SMA master agreement standing</span>
            </div>
            <select
              value={leaseStatusUpdate}
              onChange={(e) => setLeaseStatusUpdate(e.target.value as LeaseStatus)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold"
            >
              <option value="Active">Active</option>
              <option value="Show-Cause Issued">Show-Cause Issued</option>
              <option value="Suspended">Suspended / Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="dispatchChk"
              checked={dispatched}
              onChange={(e) => setDispatched(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700"
            />
            <label htmlFor="dispatchChk" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark order as signed, recorded, and dispatched to parties
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveIssueOrderHearing(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
            >
              Issue Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
