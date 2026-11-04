import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Printer, 
  CalendarPlus, 
  Plus, 
  RotateCcw, 
  Download,
  Building2,
  FileText
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setActiveCauseListModal, 
    setActiveAddLeaseModal, 
    resetToDefaults, 
    exportDataJson, 
    addToast 
  } = usePortal();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { main: 'Summary Dashboard', sub: 'Executive Overview & Upcoming Hearings' };
      case 'schedule':
        return { main: 'Schedule Personal Hearing', sub: 'Issue Statutory Notice & Summons Docket' };
      case 'ledger':
        return { main: 'Hearing Orders & Decisions', sub: 'Post-Hearing Decisions & Penalties Ledger' };
      case 'leases':
        return { main: 'Small Scale Mining Leases', sub: 'Directory of 1,836 Registered Small Scale Mining Concessions' };
      case 'analytics':
        return { main: 'Analytics & Reports', sub: 'Compliance Metrics & Disposal Statistics' };
      default:
        return { main: 'SMA Portal', sub: 'Directorate General of Mines & Minerals' };
    }
  };

  const pageInfo = getPageTitle();

  const handleExport = () => {
    const data = exportDataJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMA_Leases_Hearings_DGM_Punjab_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Database Exported',
      message: 'JSON file saved to your downloads.'
    });
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 h-[70px] flex items-center justify-between px-6 z-20 flex-shrink-0">
      
      {/* Left: Breadcrumbs / Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <span>DGM&amp;M Punjab</span>
          <span>/</span>
          <span className="text-slate-700">Small Mines Assistance/Titles (SMA/T)</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          {pageInfo.main}
        </h2>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        
        {/* Print Cause List */}
        <button
          onClick={() => setActiveCauseListModal(true)}
          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="Print official Cause List for the Director's bench"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Print Cause List</span>
        </button>

        {/* Schedule Hearing Button */}
        <button
          onClick={() => setActiveTab('schedule')}
          className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
          title="Schedule a new statutory personal hearing"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Schedule Hearing</span>
        </button>

        {/* Register Lease Button */}
        <button
          onClick={() => setActiveAddLeaseModal(true)}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="Register a new Small Scale Mining lease"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Add Lease</span>
        </button>

        {/* Utility Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
          <button
            onClick={handleExport}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Download JSON Database"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (window.confirm("Restore default Punjab mining leases and hearings?")) {
                resetToDefaults();
              }
            }}
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to Default Punjab Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
