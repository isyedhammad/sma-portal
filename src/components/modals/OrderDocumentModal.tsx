import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, QrCode } from 'lucide-react';

export const OrderDocumentModal: React.FC = () => {
  const { activeOrderDocument, setActiveOrderDocument, leases } = usePortal();

  if (!activeOrderDocument || !activeOrderDocument.order_details) return null;

  const order = activeOrderDocument.order_details;
  const associatedLease = leases.find(l => l.lease_id === activeOrderDocument.lease_id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Action Toolbar (Hidden during Print) */}
        <div className="no-print bg-slate-900 px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold tracking-wide">
              Certified Written Order • {order.order_no}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order</span>
            </button>
            <button
              onClick={() => setActiveOrderDocument(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Legal Order Document */}
        <div className="printable-document p-8 sm:p-12 text-slate-900 font-serif leading-relaxed">
          
          {/* Header with Official Punjab and DGMM Logos */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img 
                src="assets/punjab_logo.png" 
                alt="Government of the Punjab" 
                className="w-12 h-12 object-contain" 
              />
              <img 
                src="assets/dgmm_logo.png" 
                alt="Directorate General of Mines & Minerals" 
                className="w-12 h-12 object-contain" 
              />
            </div>
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900 font-sans">
              Directorate General of Mines &amp; Minerals
            </h2>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-800 font-sans">
              Government of the Punjab, Lahore
            </h3>
            <p className="text-[11px] font-sans text-slate-600 mt-0.5">
              Office of the Director SMA/T (Licensing Authority) • Poonch House, Multan Road, Lahore
            </p>
          </div>

          {/* Reference Block */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5 font-sans text-xs mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Order Dispatch No.</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{order.order_no}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Date of Order</span>
                <span className="font-bold text-slate-900 text-sm">
                  {new Date(order.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Authority</span>
                <span className="font-medium text-slate-800">{order.presiding_officer || "Director SMA/T - Licensing Authority"}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-500 font-bold uppercase text-[10px] block">Notice Reference</span>
                <span className="font-mono text-slate-700">{activeOrderDocument.notice_reference_no}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-200">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Subject Matter:</span>
              <p className="text-slate-900 font-bold">
                M/s {associatedLease?.lessee_name} • Concession: {associatedLease?.lease_id} [{(associatedLease?.mining_type || '').toUpperCase() === 'PL' ? 'Prospecting License (PL)' : 'Mining Lease (ML)'}] ({associatedLease?.mineral_name}, {associatedLease?.district})
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-5">
            <h3 className="text-xs sm:text-sm font-bold uppercase text-slate-900 border-b border-slate-800 inline-block pb-1 font-sans">
              FINAL DETERMINATION &amp; ORDER
            </h3>
          </div>

          {/* Order Details Body */}
          <div className="space-y-3.5 text-xs sm:text-sm text-justify">
            <p>
              <strong>1. Background:</strong> Proceedings were initiated against the lessee vide show-cause notice <span className="font-mono font-semibold">{activeOrderDocument.notice_reference_no}</span> dated {activeOrderDocument.notice_issue_date} on grounds of: <strong className="font-sans">"{activeOrderDocument.hearing_purpose}"</strong>.
            </p>

            <p>
              <strong>2. Hearing Proceedings:</strong> A personal hearing was held on <span className="font-semibold">{new Date(activeOrderDocument.hearing_date).toLocaleDateString()}</span> in this office. The representative of the lessee appeared and submitted defense arguments.
            </p>

            {/* Operative Decision Box */}
            <div className="my-4 p-4 rounded-lg border-2 border-slate-800 bg-amber-50/50">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-2 font-sans">
                DECISION: {order.decision_category.toUpperCase()}
              </div>
              <p className="font-serif text-slate-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {order.decision_summary}
              </p>

              {order.penalty_amount && order.penalty_amount > 0 ? (
                <div className="mt-3 p-2 bg-white border border-amber-300 rounded font-sans text-xs flex items-center justify-between font-bold">
                  <span>Assessed Penalty:</span>
                  <span className="text-amber-900 font-mono text-sm">PKR {order.penalty_amount.toLocaleString()}</span>
                </div>
              ) : null}

              {order.compliance_deadline && (
                <p className="mt-2 text-xs font-sans text-slate-600">
                  <strong>Compliance Window:</strong> {order.compliance_deadline}
                </p>
              )}
            </div>

            <p>
              <strong>3. Right to Appeal:</strong> If aggrieved by this decision, the lessee may file an appeal before the Secretary to Government of the Punjab, Mines &amp; Minerals Department within 30 days under Rule 60 of Punjab Mining Concession Rules 2002.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-10 pt-6 flex justify-between items-end border-t border-slate-300">
            <div className="text-left font-sans text-[11px] text-slate-500">
              <QrCode className="w-8 h-8 text-slate-700 mb-1" />
              <p>Certified Genuine Copy</p>
            </div>

            <div className="text-center font-sans">
              <div className="h-10"></div>
              <p className="font-bold text-slate-900 border-t border-slate-900 pt-1 text-xs sm:text-sm">
                (DIRECTOR SMA/T)
              </p>
              <p className="text-xs text-slate-700">Licensing Authority</p>
              <p className="text-[11px] text-slate-500">Directorate General of Mines &amp; Minerals, Punjab</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
