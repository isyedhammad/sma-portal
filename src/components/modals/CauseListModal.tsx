import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, Calendar, Clock, MapPin } from 'lucide-react';

export const CauseListModal: React.FC = () => {
  const {
    isCauseListModalOpen,
    setIsCauseListModalOpen,
    hearings
  } = usePortal();

  const [filterDate, setFilterDate] = useState<string>('2026-11-16');

  if (!isCauseListModalOpen) return null;

  // Extract unique dates
  const availableDates = Array.from(new Set(hearings.map(h => h.hearing_date))).sort();

  // Filter hearings for cause list
  const causeListHearings = hearings
    .filter(h => filterDate === 'all' ? true : h.hearing_date === filterDate)
    .sort((a, b) => (a.hearing_time || '').localeCompare(b.hearing_time || ''));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Action Header (Hidden during Print) */}
        <div className="no-print bg-[#01411C] px-6 py-3.5 flex items-center justify-between text-white border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold tracking-wide uppercase">
              Official Cause List • Quasi-Judicial Bench Day Sheet
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-emerald-200">Date:</span>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-emerald-950 border border-emerald-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="2026-11-16">Today (16 Nov 2026)</option>
                <option value="all">All Scheduled Dates</option>
                {availableDates.filter(d => d !== '2026-11-16').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#c49f29] text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Cause List</span>
            </button>

            <button
              onClick={() => setIsCauseListModalOpen(false)}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-12 print:p-6 bg-white space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Official Letterhead */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-3">
              <img
                src="assets/punjab_logo.png"
                alt="Punjab Emblem"
                className="w-12 h-12 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <h1 className="text-sm font-extrabold tracking-widest uppercase text-slate-900">
                  DIRECTORATE GENERAL OF MINES &amp; MINERALS
                </h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  GOVERNMENT OF THE PUNJAB
                </h2>
              </div>
              <img
                src="assets/dgmm_logo.png"
                alt="DGMM"
                className="w-12 h-12 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = 'assets/dgmm_logo.jpg'; }}
              />
            </div>

            <div className="pt-2">
              <span className="inline-block bg-slate-900 text-white font-serif text-xs font-bold uppercase tracking-wider px-4 py-1 rounded">
                CAUSE LIST FOR PERSONAL HEARINGS
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Under Punjab Mining Concession Rules 2002 (Small Mines Assistance/Titles)
            </p>
          </div>

          {/* Bench & Day Meta */}
          <div className="grid grid-cols-2 text-xs border border-slate-300 rounded-lg p-3 bg-slate-50/60 gap-y-1">
            <div>
              <span className="font-bold text-slate-700">Presiding Officer: </span>
              <span className="text-slate-900">Director SMA/T (Licensing Authority)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-700">Bench Date: </span>
              <span className="text-slate-900 font-bold">{filterDate === 'all' ? 'All Scheduled Hearings' : filterDate}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Court Venue: </span>
              <span className="text-slate-900">Court Room of Director SMA/T, Poonch House, Multan Road, Lahore</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-700">Total Cases Listed: </span>
              <span className="text-slate-900 font-bold">{causeListHearings.length}</span>
            </div>
          </div>

          {/* Cause List Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-900 uppercase text-[10px]">
                  <th className="p-2.5 w-12 text-center border-r border-slate-200">Sr. #</th>
                  <th className="p-2.5 w-24 border-r border-slate-200">Time</th>
                  <th className="p-2.5 w-32 border-r border-slate-200">Notice Ref</th>
                  <th className="p-2.5 w-36 border-r border-slate-200">Concession No</th>
                  <th className="p-2.5 border-r border-slate-200">Lessee / Mining Company</th>
                  <th className="p-2.5 border-r border-slate-200">Purpose / Grounds</th>
                  <th className="p-2.5 w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {causeListHearings.map((h, idx) => (
                  <tr key={h.hearing_id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                      {h.hearing_time || '10:30 AM'}
                    </td>
                    <td className="p-2.5 font-mono text-slate-700 border-r border-slate-200 text-[10px]">
                      {h.notice_reference_no || 'N/A'}
                    </td>
                    <td className="p-2.5 font-bold text-[#01411C] border-r border-slate-200">
                      <div>{h.lease_no}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{h.district} • {h.mineral}</div>
                    </td>
                    <td className="p-2.5 font-medium text-slate-900 border-r border-slate-200">
                      {h.lessee_name}
                    </td>
                    <td className="p-2.5 text-slate-700 border-r border-slate-200">
                      <div className="font-semibold text-slate-800">{h.purpose}</div>
                      {h.stage && <div className="text-[10px] text-slate-500 italic">Stage: {h.stage}</div>}
                    </td>
                    <td className="p-2.5 text-center font-bold text-[10px]">
                      {h.hearing_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Footer */}
          <div className="pt-10 grid grid-cols-2 text-xs border-t border-slate-200">
            <div>
              <div className="text-slate-600 font-medium">Reader / Court Officer to Director SMA/T</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Directorate General of Mines &amp; Minerals, Punjab</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">Director SMA/T (Licensing Authority)</div>
              <div className="text-[10px] text-slate-500">Presiding Officer • Quasi-Judicial Bench</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
