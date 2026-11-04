import React from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Gavel, 
  Layers, 
  BarChart3, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, overdueHearings, stats } = usePortal();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Summary Dashboard',
      icon: LayoutDashboard,
      iconColor: '#0A6238',
      iconBg: 'rgba(10, 98, 56, 0.15)',
      badge: 'Live',
      badgeColor: 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200',
    },
    {
      id: 'schedule',
      label: 'Schedule Hearing',
      icon: CalendarPlus,
      iconColor: '#2563EB',
      iconBg: 'rgba(37, 99, 235, 0.12)',
    },
    {
      id: 'ledger',
      label: 'Hearing Orders & Decisions',
      icon: Gavel,
      iconColor: '#D97706',
      iconBg: 'rgba(217, 119, 6, 0.15)',
      badge: stats.pendingOrdersCount > 0 ? `${stats.pendingOrdersCount} Pending` : null,
      badgeColor: 'bg-amber-50 text-amber-800 font-bold border border-amber-200',
    },
    {
      id: 'leases',
      label: 'SMA Leases Directory',
      icon: Layers,
      iconColor: '#059669',
      iconBg: 'rgba(5, 150, 105, 0.15)',
      badge: `${stats.totalLeases}`,
      badgeColor: 'bg-slate-100 text-slate-700 font-bold border border-slate-300',
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      iconColor: '#7C3AED',
      iconBg: 'rgba(124, 58, 237, 0.12)',
    },
  ];

  return (
    <aside className="no-print w-64 md:w-72 bg-[#090E17] text-slate-200 flex flex-col h-screen border-r border-slate-800/80 flex-shrink-0 select-none z-30">
      
      {/* Sidebar Header with Punjab & DGMM Logos */}
      <div className="p-4 bg-[#05080E] border-b border-slate-800/80 flex items-center justify-between min-h-[72px]">
        <div className="flex items-center gap-3">
          
          {/* Logo Crests Row */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <img 
              src="assets/punjab_logo.png" 
              alt="Government of the Punjab" 
              className="w-8 h-8 object-contain drop-shadow" 
            />
            <img 
              src="assets/dgmm_logo.png" 
              alt="Directorate General of Mines & Minerals" 
              className="w-8 h-8 object-contain drop-shadow" 
            />
          </div>

          {/* Branding Text */}
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block leading-tight">
              Govt of the Punjab
            </span>
            <h1 className="text-sm font-bold text-slate-100 leading-tight truncate">
              DG Mines &amp; Minerals
            </h1>
            <span className="text-[10px] text-slate-400 block leading-tight truncate">
              SMA Licensing &amp; Hearings
            </span>
          </div>

        </div>
      </div>

      {/* Navigation Section Label */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          SMA Operations Menu
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span 
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.iconBg, color: item.iconColor }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] rounded-full flex-shrink-0 ml-1.5 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Action Required Quick Callout if overdue hearings exist */}
        {overdueHearings.length > 0 && (
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="mt-4 p-3 bg-rose-950/30 border border-rose-800/50 rounded-xl cursor-pointer hover:bg-rose-950/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{overdueHearings.length} Overdue Decision{overdueHearings.length > 1 ? 's' : ''}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Hearings conducted over 7 days ago require formal order.
            </p>
          </div>
        )}
      </nav>

      {/* User / Presiding Authority Card at Bottom */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#05080E]/70 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-600/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
          DS
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-200 truncate">Director SMA/T</p>
          <p className="text-[10px] text-slate-400 truncate">Licensing Authority</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Online"></span>
      </div>

    </aside>
  );
};
