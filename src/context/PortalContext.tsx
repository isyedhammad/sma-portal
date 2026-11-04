import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Lease, PersonalHearing, OrderDetails, LeaseStatus, ToastMessage, DecisionCategory } from '../types';
import { INITIAL_LEASES, INITIAL_HEARINGS } from '../data/seedData';

const STORAGE_KEY_LEASES = 'dgm_sma_portal_leases_v3';
const STORAGE_KEY_HEARINGS = 'dgm_sma_portal_hearings_v3';

interface PortalContextType {
  leases: Lease[];
  hearings: PersonalHearing[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeaseForHearing: Lease | null;
  setSelectedLeaseForHearing: (lease: Lease | null) => void;
  
  // Actions
  addLease: (leaseData: Omit<Lease, 'lease_id'> & { lease_id?: string }) => Lease;
  updateLeaseStatus: (lease_id: string, status: LeaseStatus) => void;
  scheduleHearing: (hearingData: Partial<PersonalHearing>) => PersonalHearing;
  updateHearing: (hearing_id: string, updates: Partial<PersonalHearing>) => void;
  issueOrder: (hearing_id: string, orderDetails: OrderDetails, leaseStatusUpdate?: LeaseStatus) => void;
  adjournHearing: (hearing_id: string, newDate: string, reason: string) => void;
  deleteHearing: (hearing_id: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;

  // Cloud sync state
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'local';
  lastSyncedAt: string | null;
  triggerCloudSync: () => Promise<void>;

  // Modal states
  activeNoticeDocket: PersonalHearing | null;
  setActiveNoticeDocket: (h: PersonalHearing | null) => void;
  activeOrderDocument: PersonalHearing | null;
  setActiveOrderDocument: (h: PersonalHearing | null) => void;
  activeIssueOrderHearing: PersonalHearing | null;
  setActiveIssueOrderHearing: (h: PersonalHearing | null) => void;
  activeCauseListModal: boolean;
  setActiveCauseListModal: (open: boolean) => void;
  activeAddLeaseModal: boolean;
  setActiveAddLeaseModal: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Derived metrics
  overdueHearings: PersonalHearing[];
  stats: {
    totalLeases: number;
    activeLeases: number;
    suspendedLeases: number;
    showCauseLeases: number;
    expiredLeases: number;
    upcomingHearingsCount: number;
    pendingOrdersCount: number;
    decidedThisMonthCount: number;
    totalPenaltiesImposed: number;
  };
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leases, setLeases] = useState<Lease[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEASES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading leases from storage", e);
    }
    return INITIAL_LEASES;
  });

  const [hearings, setHearings] = useState<PersonalHearing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HEARINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading hearings from storage", e);
    }
    return INITIAL_HEARINGS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedLeaseForHearing, setSelectedLeaseForHearing] = useState<Lease | null>(null);

  // Cloud sync simulated state
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'local'>('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(new Date().toLocaleTimeString());

  // Modal dialog states
  const [activeNoticeDocket, setActiveNoticeDocket] = useState<PersonalHearing | null>(null);
  const [activeOrderDocument, setActiveOrderDocument] = useState<PersonalHearing | null>(null);
  const [activeIssueOrderHearing, setActiveIssueOrderHearing] = useState<PersonalHearing | null>(null);
  const [activeCauseListModal, setActiveCauseListModal] = useState<boolean>(false);
  const [activeAddLeaseModal, setActiveAddLeaseModal] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEASES, JSON.stringify(leases));
    } catch (e) {
      console.error("Failed to save leases to localStorage", e);
    }
  }, [leases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HEARINGS, JSON.stringify(hearings));
    } catch (e) {
      console.error("Failed to save hearings to localStorage", e);
    }
  }, [hearings]);

  // Cloud sync trigger
  const triggerCloudSync = async () => {
    setCloudSyncStatus('syncing');
    try {
      // Backup data payload to cloud mock endpoint / simulated sync
      await new Promise(res => setTimeout(res, 800));
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString());
      addToast({
        type: 'success',
        title: 'Cloud State Synced',
        message: 'All Small Mines lease records & judicial hearing orders backed up to cloud ledger.'
      });
    } catch {
      setCloudSyncStatus('offline');
      addToast({
        type: 'warning',
        title: 'Offline Sync Mode',
        message: 'Data securely cached in local storage.'
      });
    }
  };

  // Actions
  const addLease = (leaseData: Omit<Lease, 'lease_id'> & { lease_id?: string }): Lease => {
    const districtCode = (leaseData.district || 'LHR').substring(0, 3).toUpperCase();
    const generatedId = leaseData.lease_id || `SMA-${districtCode}-2026-${String(leases.length + 1).padStart(4, '0')}`;
    
    const newLease: Lease = {
      ...leaseData,
      lease_id: generatedId,
    };

    setLeases(prev => [newLease, ...prev]);
    addToast({
      type: 'success',
      title: 'SMA Lease Registered',
      message: `Agreement ID ${newLease.lease_id} successfully added to Master Directory.`
    });
    return newLease;
  };

  const updateLeaseStatus = (lease_id: string, status: LeaseStatus) => {
    setLeases(prev => prev.map(l => l.lease_id === lease_id ? { ...l, lease_status: status } : l));
    addToast({
      type: 'info',
      title: 'Lease Status Updated',
      message: `Lease ${lease_id} status changed to ${status}.`
    });
  };

  const scheduleHearing = (hearingData: Partial<PersonalHearing>): PersonalHearing => {
    const nextNum = hearings.length + 1;
    const generatedHearingId = `PH-2026-${String(nextNum).padStart(4, '0')}`;
    const generatedNoticeRef = hearingData.notice_reference_no || `DGM&M/SMA/H-${100 + nextNum}/2026`;

    const newHearing: PersonalHearing = {
      hearing_id: generatedHearingId,
      lease_id: hearingData.lease_id || '',
      hearing_date: hearingData.hearing_date || new Date().toISOString(),
      notice_issue_date: hearingData.notice_issue_date || new Date().toISOString().split('T')[0],
      notice_reference_no: generatedNoticeRef,
      hearing_purpose: hearingData.hearing_purpose || 'Non-payment of royalty dues',
      specific_allegations: hearingData.specific_allegations || '',
      presiding_officer: hearingData.presiding_officer || 'Director SMA/T - Licensing Authority',
      hearing_venue: hearingData.hearing_venue || 'Judicial Chamber, DGM&M Punjab, Poonch House, Multan Road, Lahore',
      hearing_status: 'Upcoming',
      order_issued: false,
      created_at: new Date().toISOString(),
    };

    setHearings(prev => [newHearing, ...prev]);

    // Update lease status to "Show-Cause Issued" if it's currently active
    if (newHearing.lease_id) {
      setLeases(prev => prev.map(l => {
        if (l.lease_id === newHearing.lease_id && l.lease_status === 'Active') {
          return { ...l, lease_status: 'Show-Cause Issued' };
        }
        return l;
      }));
    }

    addToast({
      type: 'success',
      title: 'Personal Hearing Scheduled',
      message: `Notice Ref: ${newHearing.notice_reference_no} docket generated successfully.`
    });

    return newHearing;
  };

  const updateHearing = (hearing_id: string, updates: Partial<PersonalHearing>) => {
    setHearings(prev => prev.map(h => h.hearing_id === hearing_id ? { ...h, ...updates } : h));
    addToast({
      type: 'info',
      title: 'Hearing Updated',
      message: `Hearing ${hearing_id} record updated.`
    });
  };

  const issueOrder = (hearing_id: string, orderDetails: OrderDetails, leaseStatusUpdate?: LeaseStatus) => {
    setHearings(prev => prev.map(h => {
      if (h.hearing_id === hearing_id) {
        return {
          ...h,
          hearing_status: 'Decided',
          order_issued: true,
          order_details: {
            ...orderDetails,
            dispatched: true,
          }
        };
      }
      return h;
    }));

    // Find the hearing to get lease_id
    const targetHearing = hearings.find(h => h.hearing_id === hearing_id);
    if (targetHearing) {
      let finalStatus: LeaseStatus | undefined = leaseStatusUpdate;
      
      // Automatic intelligent lease status adjustment based on decision category if not explicit
      if (!finalStatus) {
        if (orderDetails.decision_category === 'Lease Revoked/Cancelled') {
          finalStatus = 'Suspended';
        } else if (orderDetails.decision_category === 'Exonerated/Compliance Accepted') {
          finalStatus = 'Active';
        } else if (orderDetails.decision_category === 'Direction Issued' || orderDetails.decision_category === 'Penalty Imposed') {
          finalStatus = 'Show-Cause Issued';
        }
      }

      if (finalStatus) {
        setLeases(prev => prev.map(l => l.lease_id === targetHearing.lease_id ? { ...l, lease_status: finalStatus! } : l));
      }
    }

    addToast({
      type: 'success',
      title: 'Quasi-Judicial Order Issued',
      message: `Formal Order ${orderDetails.order_no} recorded and dispatched.`
    });
  };

  const adjournHearing = (hearing_id: string, newDate: string, reason: string) => {
    setHearings(prev => prev.map(h => {
      if (h.hearing_id === hearing_id) {
        const history = h.adjournment_history || [];
        return {
          ...h,
          hearing_status: 'Adjourned',
          hearing_date: newDate,
          adjournment_history: [
            ...history,
            {
              adjourned_from: h.hearing_date,
              adjourned_to: newDate,
              reason,
              recorded_at: new Date().toISOString()
            }
          ]
        };
      }
      return h;
    }));

    addToast({
      type: 'warning',
      title: 'Hearing Adjourned',
      message: `Case adjourned to ${new Date(newDate).toLocaleDateString()}. Notice issued to parties.`
    });
  };

  const deleteHearing = (hearing_id: string) => {
    setHearings(prev => prev.filter(h => h.hearing_id !== hearing_id));
    addToast({
      type: 'info',
      title: 'Hearing Removed',
      message: `Hearing ${hearing_id} deleted from docket.`
    });
  };

  const resetToDefaults = () => {
    setLeases(INITIAL_LEASES);
    setHearings(INITIAL_HEARINGS);
    localStorage.removeItem(STORAGE_KEY_LEASES);
    localStorage.removeItem(STORAGE_KEY_HEARINGS);
    addToast({
      type: 'info',
      title: 'System Restored',
      message: 'Initial seeded Small Mines Agreement leases & hearings restored.'
    });
  };

  const exportDataJson = () => {
    const backup = {
      exported_at: new Date().toISOString(),
      authority: "Director SMA/T, Directorate General of Mines & Minerals, Punjab",
      leases,
      hearings
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDataJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.leases) && Array.isArray(parsed.hearings)) {
        setLeases(parsed.leases);
        setHearings(parsed.hearings);
        addToast({
          type: 'success',
          title: 'Database Imported',
          message: `Successfully loaded ${parsed.leases.length} leases and ${parsed.hearings.length} hearing records.`
        });
        return true;
      }
      throw new Error("Invalid structure");
    } catch {
      addToast({
        type: 'error',
        title: 'Import Failed',
        message: 'Invalid JSON backup file provided.'
      });
      return false;
    }
  };

  // Overdue calculation (> 7 days since hearing date where order_issued === false)
  const overdueHearings = useMemo(() => {
    const now = new Date().getTime();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    return hearings.filter(h => {
      if (h.order_issued) return false;
      const hDate = new Date(h.hearing_date).getTime();
      return hDate < now && (now - hDate) > SEVEN_DAYS_MS;
    });
  }, [hearings]);

  // Derived stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const activeLeases = leases.filter(l => l.lease_status === 'Active').length;
    const suspendedLeases = leases.filter(l => l.lease_status === 'Suspended').length;
    const showCauseLeases = leases.filter(l => l.lease_status === 'Show-Cause Issued').length;
    const expiredLeases = leases.filter(l => l.lease_status === 'Expired').length;

    const upcomingHearingsCount = hearings.filter(h => {
      const hDate = new Date(h.hearing_date);
      return hDate >= now && !h.order_issued && h.hearing_status !== 'Decided';
    }).length;

    const pendingOrdersCount = hearings.filter(h => {
      const hDate = new Date(h.hearing_date);
      return hDate < now && !h.order_issued;
    }).length;

    const decidedThisMonthCount = hearings.filter(h => {
      if (!h.order_issued || !h.order_details) return false;
      const oDate = new Date(h.order_details.order_date);
      return oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear;
    }).length;

    const totalPenaltiesImposed = hearings.reduce((acc, h) => {
      if (h.order_issued && h.order_details?.penalty_amount) {
        return acc + h.order_details.penalty_amount;
      }
      return acc;
    }, 0);

    return {
      totalLeases: leases.length,
      activeLeases,
      suspendedLeases,
      showCauseLeases,
      expiredLeases,
      upcomingHearingsCount,
      pendingOrdersCount,
      decidedThisMonthCount,
      totalPenaltiesImposed,
    };
  }, [leases, hearings]);

  return (
    <PortalContext.Provider
      value={{
        leases,
        hearings,
        activeTab,
        setActiveTab,
        selectedLeaseForHearing,
        setSelectedLeaseForHearing,
        addLease,
        updateLeaseStatus,
        scheduleHearing,
        updateHearing,
        issueOrder,
        adjournHearing,
        deleteHearing,
        resetToDefaults,
        exportDataJson,
        importDataJson,
        cloudSyncStatus,
        lastSyncedAt,
        triggerCloudSync,
        activeNoticeDocket,
        setActiveNoticeDocket,
        activeOrderDocument,
        setActiveOrderDocument,
        activeIssueOrderHearing,
        setActiveIssueOrderHearing,
        activeCauseListModal,
        setActiveCauseListModal,
        activeAddLeaseModal,
        setActiveAddLeaseModal,
        toasts,
        addToast,
        removeToast,
        overdueHearings,
        stats,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
