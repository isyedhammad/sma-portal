import React from 'react';
import { usePortal } from '../context/PortalContext';
import {
  CalendarDays,
  FolderKanban,
  Printer,
  Plus,
  Scale,
  BookOpen
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCauseListModalOpen,
    setIsRulesModalOpen,
    openScheduleModal,
    summaryStats
  } = usePortal();

  return (
    <header className="no-print bg-[#01411C] text-white border-b border-[#0A5C36] shadow-md sticky top-0 z-30">
      {/* Top Directorate Identification Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Official Emblem & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0 bg-white/95 p-1 rounded-xl shadow-sm border border-emerald-900/30">
              <img
                src="assets/dgmm_logo.png"
                alt="DGMM Logo"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Fallback if png not found
                  (e.target as HTMLImageElement).src = 'assets/dgmm_logo.jpg';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-200">
                  Government of the Punjab
                </span>
                <span className="text-emerald-400 text-xs">•</span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-200">
                  Directorate General of Mines &amp; Minerals
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>SMA Hearing Management System</span>
              </h1>
              <p className="text-xs text-emerald-200/90 hidden sm:block">
                Small Mines Assistance/Titles (SMA) • Statutory Personal Hearings Portal
              </p>
            </div>
          </div>

          {/* Right Header Controls: Rules PDF + Quick CTAs */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            {/* Rules 2002 PDF Button */}
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/60 transition-all shadow-xs"
              title="View and download Punjab Mining Concession Rules 2002 (PDF)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>Rules 2002 (PDF)</span>
            </button>

            {/* Quick Cause List Print Button */}
            <button
              onClick={() => setIsCauseListModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs"
              title="Generate and print today's Bench Cause List"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-200" />
              <span>Cause List</span>
            </button>

            {/* Primary CTA: Schedule Hearing */}
            <button
              onClick={() => openScheduleModal()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f29] text-slate-950 shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Hearing</span>
            </button>
          </div>

        </div>

        {/* Minimalist 2-Tab Navigation Bar */}
        <div className="mt-4 pt-2.5 border-t border-emerald-800/80 flex items-center justify-between">
          <nav className="flex space-x-2" aria-label="Tabs">
            {/* Tab 1: Scheduled Hearings (Primary Default View) */}
            <button
              onClick={() => setActiveTab('hearings')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'hearings'
                  ? 'bg-white text-[#01411C] shadow-md ring-1 ring-white/80'
                  : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <CalendarDays className={`w-4 h-4 ${activeTab === 'hearings' ? 'text-[#01411C]' : 'text-emerald-300'}`} />
              <span>Scheduled Hearings</span>
              <span
                className={`ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  activeTab === 'hearings'
                    ? 'bg-emerald-100 text-[#01411C]'
                    : 'bg-emerald-900 text-emerald-200'
                }`}
              >
                {summaryStats.activeHearingsCount}
              </span>
            </button>

            {/* Tab 2: Leases Directory (Lightweight Reference Tab) */}
            <button
              onClick={() => setActiveTab('leases')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'leases'
                  ? 'bg-white text-[#01411C] shadow-md ring-1 ring-white/80'
                  : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <FolderKanban className={`w-4 h-4 ${activeTab === 'leases' ? 'text-[#01411C]' : 'text-emerald-300'}`} />
              <span>Leases Directory</span>
              <span
                className={`ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  activeTab === 'leases'
                    ? 'bg-emerald-100 text-[#01411C]'
                    : 'bg-emerald-900 text-emerald-200'
                }`}
              >
                {summaryStats.totalLeases}
              </span>
            </button>
          </nav>

          {/* Quick Date Display */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-200/90 font-medium">
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>Punjab Mining Concession Rules 2002</span>
            <span className="text-emerald-400">•</span>
            <span className="font-semibold text-white">16 Nov 2026</span>
          </div>
        </div>

      </div>
    </header>
  );
};
