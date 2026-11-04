import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
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
import { Building2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const PortalMainContent: React.FC = () => {
  const { activeTab } = usePortal();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'schedule' && <ScheduleHearingPage />}
        {activeTab === 'ledger' && <HearingOrdersLedgerPage />}
        {activeTab === 'leases' && <LeasesDirectoryPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
      </main>

      {/* Official Government Executive Footer */}
      <footer className="no-print bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200 text-sm">
                Directorate General of Mines & Minerals • Government of the Punjab
              </p>
              <p className="text-[11px] text-slate-400">
                Poonch House, Multan Road, Lahore, Pakistan • Official Quasi-Judicial Portal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Punjab Mining Concession Rules 2002</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+92 (42) 9921-1400</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>director.sma@punjabmines.gov.pk</span>
            </span>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
          <p>© {new Date().getFullYear()} Directorate General of Mines & Minerals, Punjab. All statutory quasi-judicial dockets and records reserved.</p>
          <p className="font-mono">Portal Version 2.4.0 (Enterprise Quasi-Judicial Build)</p>
        </div>
      </footer>

      {/* Global Modals & Dialogs */}
      <IssueOrderModal />
      <NoticeDocketModal />
      <OrderDocumentModal />
      <CauseListModal />
      <AddLeaseModal />

      {/* Global Toasts */}
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
