import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Printer, Calendar, Filter, FileSpreadsheet } from 'lucide-react';

export const CauseListModal: React.FC = () => {
  const { activeCauseListModal, setActiveCauseListModal, hearings, leases } = usePortal();

  // Filter by date (or show all upcoming)
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  if (!activeCauseListModal) return null;

  // Extract unique dates from hearings
  const hearingDates = Array.from(
    new Set(
      hearings
        .filter(h => !h.order_issued && h.hearing_status !== 'Decided')
        .map(h => h.hearing_date.split('T')[0])
    )
  ).sort();

  // Filter upcoming or pending hearings
  const filteredHearings = hearings
    .filter(h => {
      const matchStatus = !h.order_issued && h.hearing_status !== 'Decided';
      const matchDate = selectedDate === 'all' ? true : h.hearing_date.startsWith(selectedDate);
      
      const lease = leases.find(l => l.lease_id === h.lease_id);
      const matchDistrict = selectedDistrict === 'all' ? true : lease?.district === selectedDistrict;

      return matchStatus && matchDate && matchDistrict;
    })
    .sort((a, b) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Modal Action Header (Hidden when printing) */}
        <div className="no-print bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-slate-100">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quasi-Judicial Bench Cause List Day Sheet
            </span>
          </div>

          {/* Date and District Quick Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="all">All Scheduled Roster Dates</option>
              {hearingDates.map(d => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Day Sheet</span>
            </button>

            <button
              onClick={() => setActiveCauseListModal(false)}
              className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cause List Document */}
        <div className="printable-document p-8 sm:p-10 text-slate-900 font-sans">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-950">
              Directorate General of Mines & Minerals
            </h2>
            <h3 className="text-sm font-bold uppercase text-slate-800">
              Government of the Punjab, Lahore
            </h3>
            <div className="mt-2 inline-block bg-slate-100 px-4 py-1 rounded-full border border-slate-300">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900">
                DAILY CAUSE LIST / STATUTORY HEARING ROSTER
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-2">
              <strong>COURT BENCH:</strong> DIRECTOR SMA/T (LICENSING AUTHORITY) • <strong>VENUE:</strong> JUDICIAL CHAMBER, POONCH HOUSE, LAHORE
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Roster Date: <strong>{selectedDate === 'all' ? 'All Scheduled Sessions' : new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong> • Total Cases Listed: <strong>{filteredHearings.length}</strong>
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 text-slate-900">
                  <th className="py-2.5 px-2 border-r border-slate-400 text-center w-10 font-bold">Sr.</th>
                  <th className="py-2.5 px-2 border-r border-slate-400 w-24 font-bold">Time / Date</th>
                  <th className="py-2.5 px-2 border-r border-slate-400 w-28 font-bold">Case & Notice Ref</th>
                  <th className="py-2.5 px-2 border-r border-slate-400 font-bold">Parties / Lessee Title</th>
                  <th className="py-2.5 px-2 border-r border-slate-400 font-bold">Lease ID & Mineral</th>
                  <th className="py-2.5 px-2 border-r border-slate-400 font-bold">Grounds / Matter</th>
                  <th className="py-2.5 px-2 w-32 text-center font-bold">Bench Order Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredHearings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                      No statutory personal hearings fixed for the selected date criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHearings.map((h, idx) => {
                    const lease = leases.find(l => l.lease_id === h.lease_id);
                    const hDate = new Date(h.hearing_date);
                    return (
                      <tr key={h.hearing_id} className="border-b border-slate-300 hover:bg-slate-50/50">
                        <td className="py-2.5 px-2 border-r border-slate-300 text-center font-bold text-slate-900">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-300 font-mono text-[11px]">
                          <span className="font-bold text-slate-900 block">
                            {hDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-slate-600 text-[10px]">
                            {hDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-300 font-mono text-[11px]">
                          <span className="font-bold text-slate-900 block">{h.hearing_id}</span>
                          <span className="text-[10px] text-slate-600">{h.notice_reference_no}</span>
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-300">
                          <p className="font-bold text-slate-900">{lease?.lessee_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-600">Rep: {lease?.proprietor_representative}</p>
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-300">
                          <span className="font-mono font-bold text-slate-900 block">{h.lease_id}</span>
                          <span className="text-[10px] text-slate-600">{lease?.mineral_name} ({lease?.district})</span>
                        </td>
                        <td className="py-2.5 px-2 border-r border-slate-300 text-[11px] leading-tight">
                          <span className="font-medium text-slate-900 block">{h.hearing_purpose}</span>
                        </td>
                        <td className="py-2.5 px-2 text-center text-[10px] text-slate-400">
                          <div className="h-8 border border-dashed border-slate-300 rounded flex items-center justify-center">
                            <span className="italic">[ Recorded in Bench ]</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Warning & Signature Line */}
          <div className="mt-10 pt-6 flex justify-between items-end border-t border-slate-300 text-xs">
            <div className="text-[10px] text-slate-500 max-w-sm">
              <p>• Case files along with field reports must be placed before the Bench 15 minutes prior to the fixed time slot.</p>
              <p className="mt-1">• No un-authorized proxy appearances allowed without registered power of attorney / wakalatnama.</p>
            </div>

            <div className="text-center">
              <div className="h-10"></div>
              <p className="font-bold text-slate-950 border-t border-slate-900 pt-1">
                (DIRECTOR SMA/T)
              </p>
              <p className="text-[10px] text-slate-600">Licensing Authority, DGM&M Punjab</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
