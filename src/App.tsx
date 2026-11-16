import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { ScheduledHearingsDashboard } from './components/ScheduledHearingsDashboard';
import { LeasesDirectoryView } from './components/LeasesDirectoryView';
import { HearingHistoryDrawer } from './components/HearingHistoryDrawer';
import { ScheduleHearingModal } from './components/ScheduleHearingModal';
import { UpdateOutcomeModal } from './components/UpdateOutcomeModal';
import { CauseListModal } from './components/modals/CauseListModal';
import { AddLeaseModal } from './components/modals/AddLeaseModal';
import { BulkUploadModal } from './components/modals/BulkUploadModal';
import { CloudSettingsModal } from './components/modals/CloudSettingsModal';
import { ToastContainer } from './components/ToastContainer';

const PortalMainContent: React.FC = () => {
  const { activeTab } = usePortal();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      
      {/* Official Government Header & Minimalist 2-Tab Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'hearings' ? (
          <ScheduledHearingsDashboard />
        ) : (
          <LeasesDirectoryView />
        )}
      </main>

      {/* Official Punjab Government Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-5 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img
              src="assets/punjab_logo.png"
              alt="Punjab Emblem"
              className="w-5 h-5 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-semibold text-slate-700">
              Directorate General of Mines &amp; Minerals, Government of the Punjab
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Small Mines Assistance/Titles (SMA)</span>
            <span>•</span>
            <span>Punjab Mining Concession Rules 2002</span>
            <span>•</span>
            <span>Quasi-Judicial Bench System</span>
          </div>
        </div>
      </footer>

      {/* Option A: Right-Side Slide-Out Drawer for Chronological Hearing History */}
      <HearingHistoryDrawer />

      {/* Modals & Dialogs */}
      <ScheduleHearingModal />
      <UpdateOutcomeModal />
      <CauseListModal />
      <AddLeaseModal />
      <BulkUploadModal />
      <CloudSettingsModal />

      {/* Toast Feedback */}
      <ToastContainer />

    </div>
  );
};

export function App() {
  return (
    <PortalProvider>
      <PortalMainContent />
    </PortalProvider>
  );
}

export default App;
