import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, QrCode } from 'lucide-react';

export const NoticeDocketModal: React.FC = () => {
  const { activeNoticeDocket, setActiveNoticeDocket, leases } = usePortal();

  if (!activeNoticeDocket) return null;

  const associatedLease = leases.find(l => l.lease_id === activeNoticeDocket.lease_id);
  const hearingDateObj = new Date(activeNoticeDocket.hearing_date);

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
              Official Personal Hearing Notice • {activeNoticeDocket.notice_reference_no}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Notice</span>
            </button>
            <button
              onClick={() => setActiveNoticeDocket(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Legal Notice Document */}
        <div className="printable-document p-8 sm:p-12 text-slate-900 font-serif leading-relaxed">
          
          {/* Government Letterhead Header with Real Punjab and DGMM Logos */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
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
              Government of the Punjab
            </h3>
            <p className="text-[11px] font-sans text-slate-600 mt-1">
              Office of the Director SMA/T (Licensing Authority) • Poonch House, Multan Road, Lahore
            </p>
          </div>

          {/* Reference & Dispatch Meta */}
          <div className="flex justify-between items-start text-xs font-sans mb-5">
            <div>
              <p><strong className="text-slate-900">Dispatch Ref:</strong> <span className="font-mono font-bold">{activeNoticeDocket.notice_reference_no}</span></p>
              <p className="mt-0.5"><strong className="text-slate-900">Case ID:</strong> <span className="font-mono text-slate-700">{activeNoticeDocket.hearing_id}</span></p>
            </div>
            <div className="text-right">
              <p><strong className="text-slate-900">Date:</strong> {activeNoticeDocket.notice_issue_date}</p>
              <p className="text-emerald-800 font-bold uppercase text-[10px] mt-0.5">REGISTERED / URGENT</p>
            </div>
          </div>

          {/* Addressee */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-sans mb-5">
            <p className="font-bold text-slate-800 uppercase text-[11px]">To,</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{associatedLease?.lessee_name || 'The Lessee'}</p>
            <p className="text-slate-700">Attn: {associatedLease?.proprietor_representative || 'Proprietor / Representative'}</p>
            <p className="text-slate-600">Re: Lease ID <strong className="text-slate-900 font-mono">{activeNoticeDocket.lease_id}</strong> ({associatedLease?.lease_title})</p>
            <p className="text-slate-600">District {associatedLease?.district}, Punjab</p>
          </div>

          {/* Subject Line */}
          <div className="mb-5 text-center">
            <h4 className="text-xs sm:text-sm font-bold uppercase text-slate-950 border-b border-slate-400 inline-block pb-1 font-sans">
              SUBJECT: NOTICE FOR STATUTORY PERSONAL HEARING BEFORE DIRECTOR SMA/T (LICENSING AUTHORITY)
            </h4>
          </div>

          {/* Body Narrative */}
          <div className="space-y-3.5 text-xs sm:text-sm text-justify">
            <p>
              WHEREAS, you hold a Small Mines Agreement (SMA) lease titled <strong className="font-bold">"{associatedLease?.lease_title}"</strong> for the extraction of <strong className="font-bold">{associatedLease?.mineral_name}</strong> in District <strong className="font-bold">{associatedLease?.district}</strong>, governed under the Punjab Mining Concession Rules 2002.
            </p>

            <p>
              AND WHEREAS, official field reports and departmental scrutiny reveal statutory non-compliance regarding:
            </p>

            <div className="p-3 bg-amber-50 border-l-4 border-amber-600 rounded-r-lg font-sans my-2.5">
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                GROUNDS: {activeNoticeDocket.hearing_purpose}
              </p>
              {activeNoticeDocket.specific_allegations && (
                <p className="text-xs text-slate-800 mt-1 italic">
                  "{activeNoticeDocket.specific_allegations}"
                </p>
              )}
            </div>

            <p>
              NOW THEREFORE, under Rule 48 &amp; 52 of Punjab Mining Concession Rules 2002, you are hereby called upon to appear for a <strong className="font-bold">PERSONAL HEARING</strong> before the undersigned as scheduled below:
            </p>

            {/* Scheduled Venue Box */}
            <div className="border border-slate-300 bg-slate-50 rounded-lg p-3.5 my-3 font-sans text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Hearing Date</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {hearingDateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Time</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {hearingDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="sm:col-span-2 mt-1">
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Venue / Office</span>
                  <span className="font-medium text-slate-800">
                    {activeNoticeDocket.hearing_venue || "Office of Director SMA/T, Directorate General of Mines & Minerals, Poonch House, Multan Road, Lahore"}
                  </span>
                </div>
              </div>
            </div>

            <p>
              Please bring all relevant documentary record including lease deed, original bank payment challans, daily extraction registers, and monthly production returns.
            </p>

            <p className="text-rose-900 bg-rose-50 p-2.5 rounded border border-rose-200 text-xs font-sans">
              <strong>Notice:</strong> In case of non-appearance, proceedings shall be conducted ex-parte and determination rendered on available record under Rule 52.
            </p>
          </div>

          {/* Signature Block */}
          <div className="mt-10 pt-5 flex justify-between items-end">
            <div className="text-left font-sans text-[11px] text-slate-500">
              <QrCode className="w-8 h-8 text-slate-700 mb-1" />
              <p>Official Verification Docket</p>
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
