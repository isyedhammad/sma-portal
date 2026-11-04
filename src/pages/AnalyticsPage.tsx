import React, { useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS, PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Gavel, 
  Layers, 
  MapPin, 
  Download, 
  Upload, 
  RotateCcw
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    stats, 
    exportDataJson, 
    importDataJson, 
    resetToDefaults, 
    addToast 
  } = usePortal();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const violationCounts = STATUTORY_VIOLATION_GROUNDS.map(ground => {
    const count = hearings.filter(h => h.hearing_purpose === ground).length;
    return { ground, count };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  const districtStats = PUNJAB_MINING_DISTRICTS.map(district => {
    const districtLeases = leases.filter(l => l.district === district);
    const districtHearings = hearings.filter(h => {
      const l = leases.find(lease => lease.lease_id === h.lease_id);
      return l?.district === district;
    });
    return {
      district,
      leasesCount: districtLeases.length,
      hearingsCount: districtHearings.length,
    };
  }).filter(item => item.leasesCount > 0 || item.hearingsCount > 0)
    .sort((a, b) => b.leasesCount - a.leasesCount);

  const categoryCounts = [
    { label: 'Penalty Imposed', count: hearings.filter(h => h.order_details?.decision_category === 'Penalty Imposed').length, color: 'bg-amber-500' },
    { label: 'Direction Issued', count: hearings.filter(h => h.order_details?.decision_category === 'Direction Issued').length, color: 'bg-blue-500' },
    { label: 'Lease Revoked/Cancelled', count: hearings.filter(h => h.order_details?.decision_category === 'Lease Revoked/Cancelled').length, color: 'bg-rose-500' },
    { label: 'Exonerated / Notice Discharged', count: hearings.filter(h => h.order_details?.decision_category === 'Exonerated/Compliance Accepted').length, color: 'bg-emerald-500' },
    { label: 'Adjourned to New Date', count: hearings.filter(h => h.hearing_status === 'Adjourned').length, color: 'bg-purple-500' },
  ];

  const handleExport = () => {
    const data = exportDataJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMA_DGM_Punjab_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Database Exported',
      message: 'JSON file saved successfully.'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importDataJson(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Compliance Analytics &amp; Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of hearing outcomes, violation types, and district performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Total Hearings
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {hearings.length}
          </p>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            {hearings.filter(h => h.order_issued).length} Concluded With Orders
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Disposal Rate
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {hearings.length > 0 ? ((hearings.filter(h => h.order_issued).length / hearings.length) * 100).toFixed(1) : 0}%
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Orders issued vs pending
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Penalties Assessed
          </span>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            PKR {(stats.totalPenaltiesImposed / 1000000).toFixed(2)}M
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Government treasury fine challans
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Registered Leases
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {leases.length}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Across {districtStats.length} Mining Districts
          </span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Violation grounds */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            Violation Grounds Frequency
          </h3>

          <div className="space-y-3.5">
            {violationCounts.map(item => {
              const percentage = Math.round((item.count / hearings.length) * 100);
              return (
                <div key={item.ground} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{item.ground}</span>
                    <span className="font-bold text-slate-900">{item.count} cases ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#D97706] h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Decision Outcomes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            Decision Outcomes Breakdown
          </h3>

          <div className="space-y-3.5">
            {categoryCounts.map(cat => {
              const percentage = hearings.length > 0 ? Math.round((cat.count / hearings.length) * 100) : 0;
              return (
                <div key={cat.label} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{cat.label}</span>
                    <span className="font-bold text-slate-900">{cat.count} orders ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${cat.color} h-full rounded-full`}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* District footprint */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
            District Distribution of Leases &amp; Hearings
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {districtStats.map(item => (
              <div key={item.district} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="font-bold text-slate-900 block">{item.district}</span>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Leases: <strong className="text-slate-800">{item.leasesCount}</strong></span>
                  <span className="text-slate-500">Hearings: <strong className="text-amber-800">{item.hearingsCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
