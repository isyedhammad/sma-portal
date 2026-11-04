import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, ShieldAlert, CheckCircle2, QrCode, FileText } from 'lucide-react';

export const OrderDocumentModal: React.FC = () => {
  const { activeOrderDocument, setActiveOrderDocument, leases } = usePortal();

  if (!activeOrderDocument || !activeOrderDocument.order_details) return null;

  const order = activeOrderDocument.order_details;
  const associatedLease = leases.find(l => l.lease_id === activeOrderDocument.lease_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Action Toolbar (Hidden during Print) */}
        <div className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Certified Quasi-Judicial Determination Order | Official Record
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Formal Order</span>
            </button>
            <button
              onClick={() => setActiveOrderDocument(null)}
              className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Quasi-Judicial Order */}
        <div className="printable-document p-8 sm:p-12 text-slate-900 font-serif leading-relaxed">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2 font-sans font-bold text-xs uppercase tracking-widest text-slate-800">
              <span>Before the Licensing Authority / Quasi-Judicial Bench</span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-slate-900 font-sans">
              Directorate General of Mines & Minerals
            </h2>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 font-sans">
              Government of the Punjab, Lahore
            </h3>
            <p className="text-[11px] font-sans text-slate-600 mt-1">
              In the matter of Small Mines Agreement Enforcement Proceedings under Punjab Mining Concession Rules 2002
            </p>
          </div>

          {/* Cause Title & Bench Header */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 font-sans text-xs mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Formal Order No.</span>
                <span className="font-mono font-extrabold text-slate-950 text-sm">{order.order_no}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Order Promulgation Date</span>
                <span className="font-bold text-slate-900 text-sm">
                  {new Date(order.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Presiding Judicial Officer</span>
                <span className="font-bold text-slate-900">{order.presiding_officer || "Director SMA/T - Licensing Authority"}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Case & Notice Reference</span>
                <span className="font-mono text-slate-800">{activeOrderDocument.notice_reference_no}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Parties / Subject Matter:</span>
              <p className="text-slate-900 font-bold mt-0.5">
                Government of the Punjab, through DGM&M vs. {associatedLease?.lessee_name}
              </p>
              <p className="text-slate-600 text-[11px]">
                Re: Lease Agreement ID <span className="font-mono font-bold text-slate-900">{associatedLease?.lease_id}</span> • Mineral: {associatedLease?.mineral_name} • District: {associatedLease?.district}
              </p>
            </div>

            {order.attendees && (
              <div className="mt-2 text-[11px] text-slate-700">
                <strong className="text-slate-900">Present in Bench:</strong> {order.attendees}
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="text-center my-6">
            <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-950 border-b-2 border-slate-800 inline-block pb-1 tracking-wide font-sans">
              QUASI-JUDICIAL DETERMINATION & FINAL ORDER
            </h3>
          </div>

          {/* Order Content */}
          <div className="space-y-4 text-xs sm:text-sm text-justify">
            <p>
              <strong>1. Background:</strong> The instant proceedings arose pursuant to statutory show-cause notice ref. no. <span className="font-mono font-bold">{activeOrderDocument.notice_reference_no}</span> dated {activeOrderDocument.notice_issue_date}, issued against the lessee <span className="font-bold">{associatedLease?.lessee_name}</span> regarding the statutory violation: <em className="font-serif font-bold">"{activeOrderDocument.hearing_purpose}"</em>.
            </p>

            <p>
              <strong>2. Allegations & Inspection Findings:</strong> The technical inspection report submitted by field officers highlighted that: 
              <span className="italic block pl-4 py-1.5 border-l-2 border-slate-400 my-1 font-serif text-slate-800">
                "{activeOrderDocument.specific_allegations || 'The lessee failed to abide by mandatory terms of the Small Mines Agreement and committed violation of the regulatory framework.'}"
              </span>
            </p>

            <p>
              <strong>3. Personal Hearing Proceedings:</strong> Statutory personal hearing was formally held on <span className="font-semibold">{new Date(activeOrderDocument.hearing_date).toLocaleDateString()}</span> in the Judicial Chamber of the Director SMA/T. The representatives of the lessee appeared and submitted their oral arguments as well as written replies.
            </p>

            {/* Operative Ruling Box */}
            <div className="my-5 p-4 rounded-xl border-2 border-slate-900 bg-amber-50/40">
              <div className="flex items-center gap-2 mb-2 font-sans font-extrabold text-xs uppercase tracking-wider text-amber-950 border-b border-amber-300 pb-1">
                <span>DETERMINATION CATEGORY: {order.decision_category.toUpperCase()}</span>
              </div>
              <p className="font-serif text-slate-950 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                {order.decision_summary}
              </p>

              {order.penalty_amount && order.penalty_amount > 0 && (
                <div className="mt-3 p-2.5 bg-white border border-amber-400 rounded-lg font-sans text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-900">Penal Treasury Assessment:</span>
                  <span className="font-mono font-bold text-amber-900 text-sm">PKR {order.penalty_amount.toLocaleString()}</span>
                </div>
              )}

              {order.compliance_deadline && (
                <div className="mt-2 text-xs font-sans text-slate-700">
                  <strong>Statutory Compliance Window:</strong> {order.compliance_deadline}
                </div>
              )}
            </div>

            <p>
              <strong>4. Legal Basis:</strong> This order is promulgated pursuant to powers vested under {order.legal_provisions || "the Punjab Mining Concession Rules 2002 and Punjab Minerals Act"}. Any party aggrieved by this decision may file an appeal before the Secretary to the Government of Punjab, Mines & Minerals Department within 30 days of the receipt of this order.
            </p>
          </div>

          {/* Signature Block & Official Seal */}
          <div className="mt-12 pt-8 flex justify-between items-end border-t border-slate-300">
            <div className="text-left font-sans text-[11px] text-slate-600">
              <div className="w-16 h-16 border-2 border-slate-800 rounded-lg flex flex-col items-center justify-center p-1 bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-900" />
                <span className="text-[8px] font-mono font-bold">CERTIFIED</span>
              </div>
              <p className="mt-1 font-bold text-slate-800">Seal of Licensing Authority</p>
            </div>

            <div className="text-center font-sans">
              <div className="h-12 flex items-center justify-center italic text-slate-400 text-xs">
                [Signed & Sealed Digitally]
              </div>
              <p className="font-extrabold text-slate-950 border-t-2 border-slate-900 pt-1 text-sm tracking-wide">
                (DIRECTOR SMA/T)
              </p>
              <p className="text-xs font-semibold text-slate-800">Licensing Authority / Presiding Officer</p>
              <p className="text-[11px] text-slate-600">Directorate General of Mines & Minerals, Punjab</p>
            </div>
          </div>

          {/* Dispatch Distribution */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] font-sans text-slate-600 leading-tight">
            <p className="font-bold text-slate-800">No. {order.order_no} / DGM&M — Copy forwarded for implementation & record to:</p>
            <ol className="list-decimal pl-4 space-y-0.5 mt-1">
              <li>{associatedLease?.lessee_name} ({associatedLease?.proprietor_representative}), for strict compliance.</li>
              <li>The Secretary, Government of the Punjab, Mines & Minerals Department, Lahore.</li>
              <li>The Director General, Mines & Minerals Punjab, Lahore.</li>
              <li>The Deputy Commissioner / District Collector, {associatedLease?.district}.</li>
              <li>The District Mining Officer, {associatedLease?.district} (with direction to ensure recovery / compliance).</li>
              <li>Master File / Directorate IT Ledger.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
