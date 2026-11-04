import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer } from 'lucide-react';

export const CauseListModal: React.FC = () => {
  const { activeCauseListModal, setActiveCauseListModal, hearings, leases } = usePortal();

  const [selectedDate, setSelectedDate] = useState<string>('all');

  if (!activeCauseListModal) return null;

  const hearingDates = Array.from(
    new Set(
      hearings
        .filter(h => !h.order_issued && h.hearing_status !== 'Decided')
        .map(h => h.hearing_date.split('T')[0])
    )
  ).sort();

  const filteredHearings = hearings
    .filter(h => {
      const matchStatus = !h.order_issued && h.hearing_status !== 'Decided';
      const matchDate = selectedDate === 'all' ? true : h.hearing_date.startsWith(selectedDate);
      return matchStatus && matchDate;
    })
    .sort((a, b) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Action Header (Hidden during Print) */}
        <div className="no-print bg-slate-900 px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold tracking-wide">
              Director Bench Cause List • Day Sheet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded px-2.5 py-1 focus:outline-none"
            >
              <option value="all">All Dates</option>
              {hearingDates.map(d => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Day Sheet</span>
            </button>

            <button
              onClick={() => setActiveCauseListModal(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cause List Document */}
        <div className="printable-document p-8 sm:p-10 text-slate-900 font-sans">
          
          {/* Header with Logos */}
          <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <img 
                src="assets/punjab_logo.png" 
                alt="Government of the Punjab" 
                className="w-10 h-10 object-contain" 
              />
              <img 
                src="assets/dgmm_logo.png" 
                alt="Directorate General of Mines & Minerals" 
                className="w-10 h-10 object-contain" 
              />
            </div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              Directorate General of Mines &amp; Minerals
            </h2>
            <h3 className="text-xs font-bold uppercase text-slate-700">
              Government of the Punjab, Lahore
            </h3>
            <p className="text-xs font-bold text-slate-800 mt-1 uppercase">
              Daily Cause List • Bench of Director SMA/T (Licensing Authority)
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Venue: Office of Director SMA/T, Poonch House, Multan Road, Lahore • Total Listed: {filteredHearings.length}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-bold">
                  <th className="py-2 px-2 border-r border-slate-400 text-center w-8">Sr.</th>
                  <th className="py-2 px-2 border-r border-slate-400 w-24">Date &amp; Time</th>
                  <th className="py-2 px-2 border-r border-slate-400 w-28">Notice Ref No</th>
                  <th className="py-2 px-2 border-r border-slate-400">Company / Lessee Name</th>
                  <th className="py-2 px-2 border-r border-slate-400">Lease ID &amp; Mineral</th>
                  <th className="py-2 px-2 border-r border-slate-400">Grounds / Matter</th>
                  <th className="py-2 px-2 text-center w-28">Proceedings Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredHearings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500 italic">
                      No hearings scheduled for the selected date.
                    </td>
                  </tr>
                ) : (
                  filteredHearings.map((h, idx) => {
                    const lease = leases.find(l => l.lease_id === h.lease_id);
                    const hDate = new Date(h.hearing_date);
                    return (
                      <tr key={h.hearing_id} className="border-b border-slate-300">
                        <td className="py-2 px-2 border-r border-slate-300 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-300 text-[11px]">
                          <strong className="block">{hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</strong>
                          <span>{hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-300 font-mono text-[11px] font-bold">
                          {h.notice_reference_no}
                        </td>
                        <td className="py-2 px-2 border-r border-slate-300">
                          <p className="font-bold text-slate-900">{lease?.lessee_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-600">Rep: {lease?.proprietor_representative}</p>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-300">
                          <span className="font-mono font-bold block">{h.lease_id}</span>
                          <span className="text-[10px] text-slate-600">{lease?.mineral_name} ({lease?.district})</span>
                        </td>
                        <td className="py-2 px-2 border-r border-slate-300 text-[11px]">
                          {h.hearing_purpose}
                        </td>
                        <td className="py-2 px-2 text-center text-[10px] text-slate-400">
                          <div className="h-7 border border-dashed border-slate-300 rounded flex items-center justify-center">
                            <span>[ Recorded ]</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Signature */}
          <div className="mt-8 pt-4 flex justify-between items-end border-t border-slate-300 text-xs">
            <span className="text-[10px] text-slate-500">
              Departmental Hearing Roster • Rule 48 (PMR 2002)
            </span>

            <div className="text-center">
              <div className="h-8"></div>
              <p className="font-bold text-slate-900 border-t border-slate-900 pt-0.5 text-xs">
                (DIRECTOR SMA/T)
              </p>
              <p className="text-[10px] text-slate-600">Licensing Authority, DGM&amp;M Punjab</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
