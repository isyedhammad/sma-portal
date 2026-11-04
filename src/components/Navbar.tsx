import React from 'react';
import { 
  Scale, 
  FileText, 
  CalendarPlus, 
  Gavel, 
  Layers, 
  BarChart3, 
  Printer, 
  CloudCheck, 
  CloudSync, 
  AlertTriangle,
  Download,
  RotateCcw,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    overdueHearings, 
    stats, 
    cloudSyncStatus, 
    lastSyncedAt, 
    triggerCloudSync,
    setActiveCauseListModal,
    resetToDefaults,
    exportDataJson,
    addToast
  } = usePortal();

  const handleExport = () => {
    const data = exportDataJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMA_DGM_Punjab_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Ledger Exported',
      message: 'Official JSON database archive saved to downloads.'
    });
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: Scale,
      badge: overdueHearings.length > 0 ? overdueHearings.length : null,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'schedule',
      label: 'Schedule Hearing & Issue Notice',
      icon: CalendarPlus,
    },
    {
      id: 'ledger',
      label: 'Quasi-Judicial Orders Ledger',
      icon: Gavel,
      badge: stats.pendingOrdersCount > 0 ? stats.pendingOrdersCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'leases',
      label: 'SMA Leases Directory',
      icon: Layers,
      count: stats.totalLeases,
    },
    {
      id: 'analytics',
      label: 'Case Analytics & Reports',
      icon: BarChart3,
    },
  ];

  return (
    <header className="no-print bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Government Executive Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Official Emblem & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-950 border border-emerald-500/40 p-1 flex items-center justify-center shadow-inner relative group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="text-emerald-400 font-bold text-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Government of the Punjab
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Directorate General of Mines & Minerals
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                SMA Licensing & Quasi-Judicial Hearing Management System
              </h1>
            </div>
          </div>

          {/* Presiding Authority Badge & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Presiding Bench Tag */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-semibold text-slate-200 leading-tight">Director SMA/T (Licensing Authority)</p>
                <p className="text-[10px] text-slate-400">Statutory Quasi-Judicial Bench</p>
              </div>
            </div>

            {/* Cloud Sync Status */}
            <button
              onClick={triggerCloudSync}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                cloudSyncStatus === 'syncing' 
                  ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 animate-pulse' 
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500/50 hover:text-emerald-300'
              }`}
              title="Click to trigger cloud synchronization of lease agreements & judicial orders"
            >
              {cloudSyncStatus === 'syncing' ? (
                <CloudSync className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="hidden sm:inline">Cloud Synced</span>
              {lastSyncedAt && <span className="text-[10px] text-slate-400">({lastSyncedAt})</span>}
            </button>

            {/* Print Cause List Quick Action */}
            <button
              onClick={() => setActiveCauseListModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95 border border-emerald-400/30"
              title="Generate and print statutory Cause List for the Director's bench"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Cause List</span>
            </button>

            {/* Backup & Reset utilities */}
            <button
              onClick={handleExport}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              title="Export database archive (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm("Restore initial sample Punjab Small Mines lease & judicial hearing records?")) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
              title="Reset to Punjab DGM&M Seed Dataset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-md font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
