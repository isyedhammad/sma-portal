import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, Download, ShieldCheck, QrCode } from 'lucide-react';

export const NoticeDocketModal: React.FC = () => {
  const { activeNoticeDocket, setActiveNoticeDocket, leases } = usePortal();

  if (!activeNoticeDocket) return null;

  const associatedLease = leases.find(l => l.lease_id === activeNoticeDocket.lease_id);
  const hearingDateObj = new Date(activeNoticeDocket.hearing_date);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Action Toolbar (Hidden during Print) */}
        <div className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Statutory Summons Docket | Form SMA-H1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Notice</span>
            </button>
            <button
              onClick={() => setActiveNoticeDocket(null)}
              className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Legal Notice Document */}
        <div className="printable-document p-8 sm:p-12 text-slate-900 font-serif leading-relaxed">
          
          {/* Government Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-slate-900 text-xs">
                GOVT
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-slate-900 font-sans">
              Directorate General of Mines & Minerals
            </h2>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 font-sans">
              Government of the Punjab
            </h3>
            <p className="text-[11px] font-sans text-slate-600 mt-1">
              Office of the Director SMA/T (Licensing Authority) • Poonch House, Multan Road, Lahore
            </p>
          </div>

          {/* Reference & Dispatch Meta */}
          <div className="flex justify-between items-start text-xs font-sans mb-6">
            <div>
              <p><strong className="text-slate-900">Dispatch Ref No:</strong> <span className="font-mono font-bold text-slate-950">{activeNoticeDocket.notice_reference_no}</span></p>
              <p className="mt-1"><strong className="text-slate-900">Case Identifier:</strong> <span className="font-mono text-slate-800">{activeNoticeDocket.hearing_id}</span></p>
            </div>
            <div className="text-right">
              <p><strong className="text-slate-900">Issue Date:</strong> {activeNoticeDocket.notice_issue_date}</p>
              <p className="text-emerald-700 font-bold uppercase text-[10px] mt-1 tracking-wider">BY SPECIAL MESSENGER / URGENT</p>
            </div>
          </div>

          {/* Addressee */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-sans mb-6">
            <p className="font-bold text-slate-900 uppercase tracking-wide">To,</p>
            <p className="font-bold text-slate-950 text-sm mt-0.5">{associatedLease?.lessee_name || 'The Lessee / Authorized Representative'}</p>
            <p className="text-slate-700 mt-0.5">Attn: {associatedLease?.proprietor_representative || 'Proprietor / Managing Partner'}</p>
            <p className="text-slate-600">Contact: {associatedLease?.contact_number || 'N/A'}</p>
            <p className="text-slate-600">Re: Small Mines Agreement ID: <strong className="text-slate-900 font-mono">{activeNoticeDocket.lease_id}</strong> ({associatedLease?.lease_title})</p>
            <p className="text-slate-600">District: {associatedLease?.district}, Punjab</p>
          </div>

          {/* Subject Line */}
          <div className="mb-6 text-center">
            <h4 className="text-xs sm:text-sm font-bold uppercase text-slate-950 border-b border-slate-400 inline-block pb-1">
              SUBJECT: STATUTORY NOTICE FOR PERSONAL HEARING BEFORE THE DIRECTOR SMA/T (LICENSING AUTHORITY)
            </h4>
          </div>

          {/* Body Narrative */}
          <div className="space-y-4 text-xs sm:text-sm text-justify">
            <p>
              WHEREAS, you hold a statutory Small Mines Agreement (SMA) lease titled <strong className="font-bold">"{associatedLease?.lease_title}"</strong> for the extraction of <strong className="font-bold">{associatedLease?.mineral_name}</strong> in District <strong className="font-bold">{associatedLease?.district}</strong>, governed under the Punjab Mining Concession Rules 2002.
            </p>

            <p>
              AND WHEREAS, an official report submitted by the field inspecting staff and technical wing of this Directorate reveals that you have committed serious statutory non-compliance regarding:
            </p>

            <div className="p-3 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-lg font-sans my-3">
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                PRIMARY STATUTORY GROUNDS: {activeNoticeDocket.hearing_purpose}
              </p>
              {activeNoticeDocket.specific_allegations && (
                <p className="text-xs text-slate-800 mt-1 italic">
                  "{activeNoticeDocket.specific_allegations}"
                </p>
              )}
            </div>

            <p>
              NOW THEREFORE, in accordance with the mandatory statutory provisions of Rule 48 & Rule 52 of the Punjab Mining Concession Rules 2002, you are hereby summoned to appear for a <strong className="font-bold">STATUTORY PERSONAL HEARING</strong> before the undersigned as per the following schedule:
            </p>

            {/* Scheduled Venue Box */}
            <div className="border border-slate-300 bg-slate-50/60 rounded-xl p-4 my-4 font-sans text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Hearing Date & Day</span>
                  <span className="font-bold text-slate-950 text-sm">
                    {hearingDateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Fixed Time Slot</span>
                  <span className="font-bold text-slate-950 text-sm">
                    {hearingDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="sm:col-span-2 mt-1">
                  <span className="text-slate-500 uppercase text-[10px] font-bold block">Chamber / Courtroom Venue</span>
                  <span className="font-semibold text-slate-900">
                    {activeNoticeDocket.hearing_venue || "Judicial Chamber of Director SMA/T, Poonch House, Multan Road, Lahore"}
                  </span>
                </div>
              </div>
            </div>

            <p>
              You are directed to appear in person or through an authorized representative/counsel along with all relevant documentary evidence, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-sans text-xs">
              <li>Original copy of Small Mines Agreement lease deed and approved mine layout map.</li>
              <li>Verified treasury payment challans of royalty, surface rent, and cesses up to date.</li>
              <li>Daily mineral extraction logs, weighbridge calibration certificates, and Form-C returns.</li>
              <li>Formal written response/rebuttal to the allegations stated herein.</li>
            </ul>

            <p className="font-semibold text-rose-950 bg-rose-50 p-2.5 rounded border border-rose-200 text-xs font-sans">
              NOTE: In the event of failure to appear on the scheduled date and time, it shall be presumed that you have no defence to offer, and EX-PARTE quasi-judicial determination, including cancellation/revocation of the lease and forfeiture of security deposit under Rule 52, shall be rendered.
            </p>
          </div>

          {/* Signature & Seal Block */}
          <div className="mt-12 pt-6 flex justify-between items-end">
            <div className="text-left font-sans text-[11px] text-slate-600">
              <div className="w-16 h-16 border border-slate-400 rounded-lg flex flex-col items-center justify-center p-1 bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-700" />
                <span className="text-[8px] font-mono">DGM-VERIFY</span>
              </div>
              <p className="mt-1">QR Authenticated Docket</p>
            </div>

            <div className="text-center font-sans">
              <div className="h-10"></div>
              <p className="font-bold text-slate-950 border-t border-slate-900 pt-1 text-xs sm:text-sm">
                (DIRECTOR SMA/T)
              </p>
              <p className="text-xs text-slate-700">Licensing Authority / Quasi-Judicial Bench</p>
              <p className="text-[11px] text-slate-600">Directorate General of Mines & Minerals, Punjab</p>
            </div>
          </div>

          {/* Endorsement list */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] font-sans text-slate-600 leading-tight">
            <p className="font-bold text-slate-800">Copy forwarded for information and necessary action to:</p>
            <ol className="list-decimal pl-4 space-y-0.5 mt-1">
              <li>The Secretary to Government of the Punjab, Mines & Minerals Department, Lahore.</li>
              <li>The Director General, Mines & Minerals Punjab, Lahore.</li>
              <li>The Deputy Commissioner / District Collector, District {associatedLease?.district}.</li>
              <li>The District Mining Officer / Assistant Director Mines, District {associatedLease?.district} (with direction to attend along with original field file).</li>
              <li>Office Record / Master Quasi-Judicial Register.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
