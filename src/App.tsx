import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer } from './components/ToastContainer';
import { DashboardPage } from './pages/DashboardPage';
import { ScheduleHearingPage } from './pages/ScheduleHearingPage';
import { HearingOrdersLedgerPage } from './pages/HearingOrdersLedgerPage';
import { LeasesDirectoryPage } from './pages/LeasesDirectoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IssueOrderModal } from './components/modals/IssueOrderModal';
import { NoticeDocketModal } from './components/modals/NoticeDocketModal';
import { OrderDocumentModal } from './components/modals/OrderDocumentModal';
import { CauseListModal } from './components/modals/CauseListModal';
import { AddLeaseModal } from './components/modals/AddLeaseModal';

const PortalMainContent: React.FC = () => {
  const { activeTab } = usePortal();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Page Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-12">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'schedule' && <ScheduleHearingPage />}
          {activeTab === 'ledger' && <HearingOrdersLedgerPage />}
          {activeTab === 'leases' && <LeasesDirectoryPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}

          {/* Simple Government Footer */}
          <footer className="no-print border-t border-slate-200 mt-12 py-6 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <img src="assets/punjab_logo.png" alt="" className="w-5 h-5 object-contain" />
              <span>Directorate General of Mines &amp; Minerals, Government of the Punjab</span>
            </div>
            <div>
              <span>Regulated under Punjab Mining Concession Rules 2002</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <IssueOrderModal />
      <NoticeDocketModal />
      <OrderDocumentModal />
      <CauseListModal />
      <AddLeaseModal />

      {/* Toast Notifications */}
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
