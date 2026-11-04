import React, { useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { STATUTORY_VIOLATION_GROUNDS, PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Gavel, 
  Layers, 
  MapPin, 
  DollarSign 
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

  // Group hearings by violation grounds
  const violationCounts = STATUTORY_VIOLATION_GROUNDS.map(ground => {
    const count = hearings.filter(h => h.hearing_purpose === ground).length;
    return { ground, count };
  }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  // Group leases & hearings by district
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

  // Decisions category counts
  const categoryCounts = [
    { label: 'Penalty Imposed', count: hearings.filter(h => h.order_details?.decision_category === 'Penalty Imposed').length, color: 'bg-amber-500' },
    { label: 'Direction Issued', count: hearings.filter(h => h.order_details?.decision_category === 'Direction Issued').length, color: 'bg-sky-500' },
    { label: 'Lease Revoked/Cancelled', count: hearings.filter(h => h.order_details?.decision_category === 'Lease Revoked/Cancelled').length, color: 'bg-rose-500' },
    { label: 'Exonerated/Accepted', count: hearings.filter(h => h.order_details?.decision_category === 'Exonerated/Compliance Accepted').length, color: 'bg-emerald-500' },
    { label: 'Adjourned to New Date', count: hearings.filter(h => h.hearing_status === 'Adjourned').length, color: 'bg-purple-500' },
  ];

  const handleExport = () => {
    const data = exportDataJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMA_Licensing_DGM_Punjab_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Database Exported',
      message: 'Full SMA lease and quasi-judicial hearings database saved.'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Executive Analytics & Performance Roster
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Quasi-Judicial Performance & Compliance Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Statutory disposal metrics, pattern of regulatory violations, penal assessment distributions, and district-wide Small Mines concession footprints.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Ledger</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Restore JSON</span>
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

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Quasi-Judicial Proceedings
          </span>
          <p className="text-3xl font-extrabold text-slate-100 mt-2 font-mono">
            {hearings.length}
          </p>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{hearings.filter(h => h.order_issued).length} Concluded With Written Orders</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Disposal Efficiency Rate
          </span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
            {hearings.length > 0 ? ((hearings.filter(h => h.order_issued).length / hearings.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Prompt quasi-judicial disposals
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Penalties Imposed
          </span>
          <p className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
            PKR {(stats.totalPenaltiesImposed / 1000000).toFixed(2)}M
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Assessed to Provincial Treasury
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Concession Coverage
          </span>
          <p className="text-3xl font-extrabold text-sky-400 mt-2 font-mono">
            {leases.reduce((acc, l) => acc + l.area_acreage, 0).toFixed(0)} <span className="text-sm font-sans font-normal text-slate-400">Acres</span>
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Across {districtStats.length} Mining Districts
          </p>
        </div>
      </div>

      {/* CHARTS / VISUAL BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Breakdown by Statutory Violation Grounds */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Statutory Violation Grounds Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">PMR 2002 Cases</span>
          </div>

          <div className="space-y-4">
            {violationCounts.map(item => {
              const percentage = Math.round((item.count / hearings.length) * 100);
              return (
                <div key={item.ground} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium line-clamp-1">{item.ground}</span>
                    <span className="font-mono font-bold text-slate-200">{item.count} cases ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Quasi-Judicial Order Outcome Categories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Gavel className="w-4 h-4 text-emerald-400" />
              <span>Quasi-Judicial Bench Order Outcomes</span>
            </h3>
            <span className="text-xs text-slate-400">Determinations</span>
          </div>

          <div className="space-y-4">
            {categoryCounts.map(cat => {
              const percentage = hearings.length > 0 ? Math.round((cat.count / hearings.length) * 100) : 0;
              return (
                <div key={cat.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.label}</span>
                    <span className="font-mono font-bold text-slate-200">{cat.count} orders ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className={`${cat.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: District Distribution Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>District Concessions & Statutory Hearings Footprint</span>
            </h3>
            <span className="text-xs text-slate-400">Provincial Jurisdiction</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {districtStats.map(item => (
              <div 
                key={item.district}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between"
              >
                <div>
                  <span className="font-bold text-slate-200 text-xs block">{item.district}</span>
                  <span className="text-[10px] text-slate-500">Punjab Mining Division</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block">Leases</span>
                    <span className="font-mono font-bold text-emerald-400">{item.leasesCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-slate-500 block">Hearings</span>
                    <span className="font-mono font-bold text-amber-400">{item.hearingsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
