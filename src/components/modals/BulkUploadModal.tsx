import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lease } from '../../types';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers
} from 'lucide-react';

export const BulkUploadModal: React.FC = () => {
  const {
    isBulkUploadModalOpen,
    setIsBulkUploadModalOpen,
    addLeasesBulk
  } = usePortal();

  const [parsedLeases, setParsedLeases] = useState<Lease[]>([]);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  if (!isBulkUploadModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setErrorMsg('The CSV file does not contain enough data rows.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

        // Identify column indices
        const leaseNoIdx = headers.findIndex(h => h.includes('id') || h.includes('lease') || h.includes('site') || h.includes('code'));
        const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('name') || h.includes('location'));
        const lesseeIdx = headers.findIndex(h => h.includes('lessee') || h.includes('company') || h.includes('developer'));
        const districtIdx = headers.findIndex(h => h.includes('district') || h.includes('city'));
        const mineralIdx = headers.findIndex(h => h.includes('mineral'));
        const typeIdx = headers.findIndex(h => h.includes('type') || h.includes('mining'));

        const parsed: Lease[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (row.length < 3) continue;

          const leaseNo = (leaseNoIdx !== -1 && row[leaseNoIdx]) ? row[leaseNoIdx] : `SMA-IMP-${i}`;
          const title = (titleIdx !== -1 && row[titleIdx]) ? row[titleIdx] : `Mining Concession ${leaseNo}`;
          const lessee = (lesseeIdx !== -1 && row[lesseeIdx]) ? row[lesseeIdx] : 'Authorized Concession Holder';
          const district = (districtIdx !== -1 && row[districtIdx]) ? row[districtIdx] : 'Attock';
          const mineral = (mineralIdx !== -1 && row[mineralIdx]) ? row[mineralIdx] : 'Limestone';
          const typeVal = (typeIdx !== -1 && row[typeIdx]) ? row[typeIdx] : (title.includes('PL') ? 'PL' : 'ML');

          parsed.push({
            lease_id: leaseNo,
            lease_no: leaseNo,
            lease_title: title,
            lessee_name: lessee,
            district,
            mineral,
            mining_type: typeVal.toUpperCase().includes('PL') ? 'PL' : 'ML',
            status: 'Active'
          });
        }

        if (parsed.length === 0) {
          setErrorMsg('No valid lease records could be parsed. Please check column format.');
        } else {
          setParsedLeases(parsed);
        }
      } catch (err: any) {
        setErrorMsg(`Failed to parse file: ${err?.message || err}`);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (parsedLeases.length === 0) return;
    setIsImporting(true);
    try {
      await addLeasesBulk(parsedLeases);
      setIsBulkUploadModalOpen(false);
      setParsedLeases([]);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#01411C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700">
              <Upload className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Bulk Upload Small Mines Leases (CSV / Excel)
              </h2>
              <p className="text-xs text-emerald-200">
                Import Punjab Mining Cadastre concession records into Directory
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBulkUploadModalOpen(false)}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* File Picker */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-600 transition-colors bg-slate-50">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="bulk-csv-input"
            />
            <label
              htmlFor="bulk-csv-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-700" />
              <div className="font-bold text-slate-800">
                {fileName ? fileName : 'Click to select CSV File (or Drag & Drop)'}
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm">
                Supported columns: Lease ID, Title, Lessee Name, District, Mineral, Type (ML/PL).
              </p>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedLeases.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Preview (First 5 of {parsedLeases.length} records parsed)</span>
                <span className="text-emerald-700 font-semibold">{parsedLeases.length} Ready to Import</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-2">Lease No</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Lessee</th>
                      <th className="p-2">District</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedLeases.slice(0, 5).map((l, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-[#01411C]">{l.lease_no}</td>
                        <td className="p-2 font-medium line-clamp-1">{l.lease_title}</td>
                        <td className="p-2 font-bold">{l.mining_type}</td>
                        <td className="p-2 text-slate-600">{l.lessee_name}</td>
                        <td className="p-2">{l.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsBulkUploadModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedLeases.length === 0 || isImporting}
              onClick={handleImport}
              className="px-5 py-2 bg-[#01411C] hover:bg-[#0A5C36] text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isImporting ? 'Importing...' : `Import ${parsedLeases.length} Leases`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
