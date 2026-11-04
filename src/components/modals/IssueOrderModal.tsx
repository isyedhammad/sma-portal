import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { DecisionCategory, LeaseStatus, OrderDetails } from '../../types';
import { 
  X, 
  Gavel, 
  Calendar, 
  FileText, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Send
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
  const [complianceDeadline, setComplianceDeadline] = useState('15 days from dispatch');
  const [decisionSummary, setDecisionSummary] = useState('');
  const [dispatched, setDispatched] = useState(true);
  const [leaseStatusUpdate, setLeaseStatusUpdate] = useState<LeaseStatus>('Show-Cause Issued');
  const [presidingOfficer, setPresidingOfficer] = useState('Director SMA/T - Licensing Authority');
  const [attendees, setAttendees] = useState('');
  const [legalProvisions, setLegalProvisions] = useState('Rule 48 & 52 of Punjab Mining Concession Rules 2002');

  // Initialize values when modal opens
  useEffect(() => {
    if (activeIssueOrderHearing) {
      const today = new Date().toISOString().split('T')[0];
      const randomOrderSuffix = Math.floor(1000 + Math.random() * 9000);
      setOrderNo(activeIssueOrderHearing.order_details?.order_no || `DGM&M/SMA/ORD-2026-${randomOrderSuffix}`);
      setOrderDate(activeIssueOrderHearing.order_details?.order_date || today);
      
      const defaultAttendees = associatedLease 
        ? `${associatedLease.proprietor_representative} (Representative/CEO for ${associatedLease.lessee_name}), Assistant Director Legal (DGM&M)`
        : 'Authorized Representative of Lessee, Legal Advisor DGM&M';
      setAttendees(defaultAttendees);

      if (activeIssueOrderHearing.order_details) {
        setDecisionCategory(activeIssueOrderHearing.order_details.decision_category);
        setDecisionSummary(activeIssueOrderHearing.order_details.decision_summary);
        setPenaltyAmount(activeIssueOrderHearing.order_details.penalty_amount || 0);
        setComplianceDeadline(activeIssueOrderHearing.order_details.compliance_deadline || '');
        setDispatched(activeIssueOrderHearing.order_details.dispatched);
      } else {
        // Pre-fill a sensible operative summary based on hearing purpose
        setDecisionSummary(
          `Having examined the record, inspection reports, and defence submissions, the Competent Authority (Director SMA/T) finds that the lessee failed to comply with statutory terms regarding "${activeIssueOrderHearing.hearing_purpose}". Accordingly, a financial penalty is imposed under Rule 48. The lessee is directed to deposit the sum in Government Treasury within the stipulated timeline.`
        );
      }

      // Sync lease status suggestion
      if (associatedLease) {
        setLeaseStatusUpdate(associatedLease.lease_status);
      }
    }
  }, [activeIssueOrderHearing, associatedLease]);

  // Adjust default summary and suggested status when decision category changes
  const handleCategoryChange = (category: DecisionCategory) => {
    setDecisionCategory(category);
    if (category === 'Penalty Imposed') {
      setPenaltyAmount(500000);
      setLeaseStatusUpdate('Show-Cause Issued');
      setDecisionSummary(
        `Having examined the factual record and defence plea, a formal penalty of PKR 500,000 is imposed under Rule 48 of Punjab Mining Concession Rules 2002. Sum must be deposited via National Bank of Pakistan treasury challan within 15 days.`
      );
    } else if (category === 'Lease Revoked/Cancelled') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Suspended');
      setDecisionSummary(
        `Due to persistent and un-rectified statutory violations regarding ${activeIssueOrderHearing.hearing_purpose}, Small Mines Agreement Lease ${activeIssueOrderHearing.lease_id} stands REVOKED AND CANCELLED with immediate effect. Security deposit stands forfeited to the Government of Punjab.`
      );
    } else if (category === 'Exonerated/Compliance Accepted') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Active');
      setDecisionSummary(
        `The lessee has produced certified clearance documents and treasury challans proving full satisfaction of statutory dues/boundary norms. Show-cause notice is hereby discharged and the lease restored to active standing unconditionally.`
      );
    } else if (category === 'Direction Issued') {
      setPenaltyAmount(0);
      setLeaseStatusUpdate('Show-Cause Issued');
      setDecisionSummary(
        `A stern formal direction is issued under Rule 39. Lessee is given a final cure period of ${complianceDeadline} to rectify all deficiencies and submit verification report attested by the District Mining Officer, failing which cancellation proceedings shall follow.`
      );
    } else if (category === 'Adjourned to New Date') {
      setPenaltyAmount(0);
      setDecisionSummary(`Case adjourned for further scrutiny of joint boundary survey report.`);
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
      order_attachment_name: `Quasi_Judicial_Order_${orderNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      presiding_officer: presidingOfficer,
      attendees,
      legal_provisions: legalProvisions,
      dispatched,
    };

    issueOrder(activeIssueOrderHearing.hearing_id, orderData, leaseStatusUpdate);
    
    // Automatically open the signed order document view for convenience
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Quasi-Judicial Bench
                </span>
                <span className="text-xs text-slate-400">
                  Case ID: {activeIssueOrderHearing.hearing_id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                Record & Issue Post-Hearing Determination
              </h3>
            </div>
          </div>
          <button 
            onClick={() => setActiveIssueOrderHearing(null)}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Info Banner */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400">Lessee / Company: </span>
            <span className="font-semibold text-slate-200">{associatedLease?.lessee_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">Lease ID & Mineral: </span>
            <span className="font-semibold text-emerald-400">{activeIssueOrderHearing.lease_id} ({associatedLease?.mineral_name})</span>
          </div>
          <div>
            <span className="text-slate-400">District: </span>
            <span className="font-semibold text-slate-200">{associatedLease?.district}</span>
          </div>
          <div>
            <span className="text-slate-400">Hearing Date: </span>
            <span className="font-semibold text-slate-200">
              {new Date(activeIssueOrderHearing.hearing_date).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Order Details & Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official Order Dispatch Number *
              </label>
              <input
                type="text"
                required
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Order Date *
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Decision Category Tabs / Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Quasi-Judicial Determination Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Penalty Imposed', 'Direction Issued', 'Lease Revoked/Cancelled', 'Exonerated/Compliance Accepted', 'Adjourned to New Date'] as DecisionCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-all flex flex-col justify-between ${
                    decisionCategory === cat
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {cat === 'Penalty Imposed' && 'Fine & treasury challan'}
                    {cat === 'Direction Issued' && 'Time-bound compliance'}
                    {cat === 'Lease Revoked/Cancelled' && 'Immediate cancellation'}
                    {cat === 'Exonerated/Compliance Accepted' && 'Dismiss notice'}
                    {cat === 'Adjourned to New Date' && 'Reschedule hearing'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Options: Penalty Amount & Compliance Deadline */}
          {decisionCategory === 'Penalty Imposed' && (
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center gap-1.5">
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
                  className="w-full bg-slate-950 border border-amber-700/60 rounded-lg px-3 py-2 text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  PKR {penaltyAmount.toLocaleString()} (Rupees {penaltyAmount >= 100000 ? `${(penaltyAmount/100000).toFixed(2)} Lakh` : ''})
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Deposit Timeline *
                </label>
                <input
                  type="text"
                  value={complianceDeadline}
                  onChange={(e) => setComplianceDeadline(e.target.value)}
                  placeholder="e.g. 15 days from dispatch"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {decisionCategory === 'Direction Issued' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
              <label className="block text-xs font-semibold text-sky-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Compliance Deadline for Lessee *
              </label>
              <input
                type="text"
                value={complianceDeadline}
                onChange={(e) => setComplianceDeadline(e.target.value)}
                placeholder="e.g. 14 days from date of dispatch"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* Operative Part / Judgment Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Executive Order Determination / Operative Part *</span>
              <span className="text-[10px] text-slate-500">Official judicial determination record</span>
            </label>
            <textarea
              required
              rows={4}
              value={decisionSummary}
              onChange={(e) => setDecisionSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed font-serif"
            />
          </div>

          {/* Attendees & Authority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Presiding Authority
              </label>
              <input
                type="text"
                value={presidingOfficer}
                onChange={(e) => setPresidingOfficer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Parties Present / Attendees
              </label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Associated Lease Status Sync */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-200">Synchronize SMA Lease Master Status</p>
              <p className="text-[11px] text-slate-400">Update agreement state based on this final quasi-judicial determination</p>
            </div>
            <select
              value={leaseStatusUpdate}
              onChange={(e) => setLeaseStatusUpdate(e.target.value as LeaseStatus)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Active">Active (Exonerated / In Good Standing)</option>
              <option value="Show-Cause Issued">Show-Cause Issued (Under Penalty / Notice)</option>
              <option value="Suspended">Suspended / Cancelled (Operations Sealed)</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Formal Dispatch Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
            <input
              type="checkbox"
              id="dispatchedToggle"
              checked={dispatched}
              onChange={(e) => setDispatched(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700 cursor-pointer"
            />
            <label htmlFor="dispatchedToggle" className="text-xs text-slate-200 font-medium cursor-pointer">
              Mark formal Quasi-Judicial Order as sealed, signed, and dispatched to all parties
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveIssueOrderHearing(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all active:scale-95"
            >
              <Gavel className="w-4 h-4" />
              <span>Issue & Seal Executive Order</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
