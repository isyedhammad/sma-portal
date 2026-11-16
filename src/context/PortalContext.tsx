import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Lease,
  Hearing,
  HearingStatus,
  CloudConfig,
  CloudSyncStatus,
  ToastMessage
} from '../types';
import { INITIAL_LEASES, INITIAL_HEARINGS } from '../data/seedData';
import {
  getStoredCloudConfig,
  saveStoredCloudConfig
} from '../config/cloudConfig';
import {
  initSupabaseClient,
  fetchCloudLeases,
  fetchCloudHearings,
  upsertCloudLease,
  bulkUpsertCloudLeases,
  upsertCloudHearing,
  deleteCloudHearing,
  testCloudConnection
} from '../services/cloudStorage';

const STORAGE_KEY_LEASES = 'dgmm_sma_leases_v5';
const STORAGE_KEY_HEARINGS = 'dgmm_sma_hearings_v5';

interface PortalContextType {
  // Data
  leases: Lease[];
  hearings: Hearing[];
  
  // Navigation
  activeTab: 'hearings' | 'leases';
  setActiveTab: (tab: 'hearings' | 'leases') => void;
  
  // Drawer (Option A: Slide-Out)
  selectedLeaseForDrawer: Lease | null;
  openDrawerForLease: (leaseIdOrNo: string) => void;
  closeDrawer: () => void;

  // Schedule Hearing Modal
  isScheduleModalOpen: boolean;
  selectedLeaseForSchedule: Lease | null;
  hearingToEdit: Hearing | null;
  openScheduleModal: (lease?: Lease | null, hearing?: Hearing | null) => void;
  closeScheduleModal: () => void;

  // Outcome Modal
  isOutcomeModalOpen: boolean;
  selectedHearingForOutcome: Hearing | null;
  openOutcomeModal: (hearing: Hearing) => void;
  closeOutcomeModal: () => void;

  // Other Modals
  isCauseListModalOpen: boolean;
  setIsCauseListModalOpen: (open: boolean) => void;
  isAddLeaseModalOpen: boolean;
  setIsAddLeaseModalOpen: (open: boolean) => void;
  isBulkUploadModalOpen: boolean;
  setIsBulkUploadModalOpen: (open: boolean) => void;
  isCloudSettingsOpen: boolean;
  setIsCloudSettingsOpen: (open: boolean) => void;

  // Cloud State & Persistence
  cloudConfig: CloudConfig;
  cloudSyncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  isCloudConnected: boolean;
  updateCloudConfig: (cfg: CloudConfig) => Promise<boolean>;
  triggerCloudSync: () => Promise<void>;

  // Data Actions
  scheduleHearing: (data: Partial<Hearing>) => Promise<Hearing>;
  updateHearing: (hearing_id: string, updates: Partial<Hearing>) => Promise<void>;
  deleteHearing: (hearing_id: string) => Promise<void>;
  addLease: (data: Partial<Lease>) => Promise<Lease>;
  addLeasesBulk: (data: Lease[]) => Promise<number>;
  
  // Helper queries
  getHearingsForLease: (lease_id: string) => Hearing[];
  getLatestHearingForLease: (lease_id: string) => Hearing | undefined;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Quick Metrics
  summaryStats: {
    totalLeases: number;
    mlCount: number;
    plCount: number;
    activeHearingsCount: number;
    todayHearingsCount: number;
    upcoming7DaysCount: number;
  };
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cloud config
  const [cloudConfig, setCloudConfigState] = useState<CloudConfig>(() => getStoredCloudConfig());
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('local_ready');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Leases state (Local cache fallback with seedData)
  const [leases, setLeases] = useState<Lease[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEASES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading cached leases:', e);
    }
    return INITIAL_LEASES;
  });

  // Hearings state (Local cache fallback with seedData)
  const [hearings, setHearings] = useState<Hearing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HEARINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading cached hearings:', e);
    }
    return INITIAL_HEARINGS;
  });

  // Navigation tab: 'hearings' (default) or 'leases'
  const [activeTab, setActiveTab] = useState<'hearings' | 'leases'>('hearings');

  // Drawer state
  const [selectedLeaseForDrawer, setSelectedLeaseForDrawer] = useState<Lease | null>(null);

  // Modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedLeaseForSchedule, setSelectedLeaseForSchedule] = useState<Lease | null>(null);
  const [hearingToEdit, setHearingToEdit] = useState<Hearing | null>(null);

  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [selectedHearingForOutcome, setSelectedHearingForOutcome] = useState<Hearing | null>(null);

  const [isCauseListModalOpen, setIsCauseListModalOpen] = useState(false);
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isCloudSettingsOpen, setIsCloudSettingsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage as secondary backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEASES, JSON.stringify(leases));
    } catch (e) {
      console.error('Failed caching leases:', e);
    }
  }, [leases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HEARINGS, JSON.stringify(hearings));
    } catch (e) {
      console.error('Failed caching hearings:', e);
    }
  }, [hearings]);

  // Cloud client initialization & fetch on load
  const isCloudConnected = useMemo(() => {
    return Boolean(
      (cloudConfig.provider === 'supabase' && cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey) ||
      (cloudConfig.provider === 'firebase' && cloudConfig.firebaseProjectId)
    );
  }, [cloudConfig]);

  const loadFromCloud = useCallback(async (config: CloudConfig) => {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      setCloudSyncStatus('local_ready');
      return;
    }

    setCloudSyncStatus('connecting');
    try {
      initSupabaseClient(config);
      const [cloudLeases, cloudHearings] = await Promise.all([
        fetchCloudLeases(),
        fetchCloudHearings()
      ]);

      if (cloudLeases && cloudLeases.length > 0) {
        setLeases(cloudLeases);
      }
      if (cloudHearings && cloudHearings.length > 0) {
        setHearings(cloudHearings);
      }

      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error connecting to cloud:', err);
      setCloudSyncStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isCloudConnected) {
      loadFromCloud(cloudConfig);
    } else {
      setCloudSyncStatus('local_ready');
    }
  }, [isCloudConnected, cloudConfig, loadFromCloud]);

  // Update Cloud Config
  const updateCloudConfig = async (newCfg: CloudConfig): Promise<boolean> => {
    saveStoredCloudConfig(newCfg);
    setCloudConfigState(newCfg);
    const testResult = await testCloudConnection(newCfg);
    if (testResult.success) {
      addToast({
        type: 'success',
        title: 'Cloud Connected',
        message: testResult.message
      });
      await loadFromCloud(newCfg);
      return true;
    } else {
      addToast({
        type: 'warning',
        title: 'Cloud Configuration Note',
        message: testResult.message
      });
      return false;
    }
  };

  const triggerCloudSync = async () => {
    if (!isCloudConnected) {
      setIsCloudSettingsOpen(true);
      return;
    }
    setCloudSyncStatus('connecting');
    try {
      // Upsert current local data into cloud
      await bulkUpsertCloudLeases(leases);
      for (const h of hearings) {
        await upsertCloudHearing(h);
      }
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      addToast({
        type: 'success',
        title: 'Cloud Synced',
        message: 'All SMA leases and hearing records synced with cloud database.'
      });
    } catch (err: any) {
      setCloudSyncStatus('error');
      addToast({
        type: 'error',
        title: 'Sync Failed',
        message: err?.message || 'Could not complete cloud synchronization.'
      });
    }
  };

  // Drawer handlers
  const openDrawerForLease = useCallback((leaseIdOrNo: string) => {
    const target = leases.find(
      l => l.lease_id === leaseIdOrNo || l.lease_no === leaseIdOrNo
    );
    if (target) {
      setSelectedLeaseForDrawer(target);
    } else {
      // In case lease is not found in directory, construct minimal object
      const fallbackHearing = hearings.find(h => h.lease_id === leaseIdOrNo || h.lease_no === leaseIdOrNo);
      if (fallbackHearing) {
        setSelectedLeaseForDrawer({
          lease_id: fallbackHearing.lease_id,
          lease_no: fallbackHearing.lease_no,
          lease_title: fallbackHearing.lease_title,
          lessee_name: fallbackHearing.lessee_name,
          district: fallbackHearing.district,
          mineral: fallbackHearing.mineral,
          status: 'Active',
          mining_type: fallbackHearing.lease_title.includes('PL') ? 'PL' : 'ML'
        });
      }
    }
  }, [leases, hearings]);

  const closeDrawer = useCallback(() => {
    setSelectedLeaseForDrawer(null);
  }, []);

  // Modal helpers
  const openScheduleModal = useCallback((lease?: Lease | null, hearing?: Hearing | null) => {
    setSelectedLeaseForSchedule(lease || null);
    setHearingToEdit(hearing || null);
    setIsScheduleModalOpen(true);
  }, []);

  const closeScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(false);
    setSelectedLeaseForSchedule(null);
    setHearingToEdit(null);
  }, []);

  const openOutcomeModal = useCallback((hearing: Hearing) => {
    setSelectedHearingForOutcome(hearing);
    setIsOutcomeModalOpen(true);
  }, []);

  const closeOutcomeModal = useCallback(() => {
    setIsOutcomeModalOpen(false);
    setSelectedHearingForOutcome(null);
  }, []);

  // Helper queries
  const getHearingsForLease = useCallback((lease_id: string): Hearing[] => {
    return hearings
      .filter(h => h.lease_id === lease_id || h.lease_no === lease_id)
      .sort((a, b) => new Date(b.hearing_date).getTime() - new Date(a.hearing_date).getTime());
  }, [hearings]);

  const getLatestHearingForLease = useCallback((lease_id: string): Hearing | undefined => {
    const list = getHearingsForLease(lease_id);
    return list[0];
  }, [getHearingsForLease]);

  // Schedule new hearing (or update if editing)
  const scheduleHearing = async (data: Partial<Hearing>): Promise<Hearing> => {
    const isEdit = Boolean(data.hearing_id && hearings.some(h => h.hearing_id === data.hearing_id));
    
    let hearingRecord: Hearing;
    if (isEdit) {
      hearingRecord = {
        ...hearings.find(h => h.hearing_id === data.hearing_id)!,
        ...data,
        updated_at: new Date().toISOString()
      };
      setHearings(prev => prev.map(h => h.hearing_id === hearingRecord.hearing_id ? hearingRecord : h));
      addToast({
        type: 'success',
        title: 'Hearing Updated',
        message: `Notice ${hearingRecord.notice_reference_no || hearingRecord.hearing_id} updated successfully.`
      });
    } else {
      const newId = `PH-2026-${String(hearings.length + 101).padStart(4, '0')}`;
      hearingRecord = {
        hearing_id: newId,
        lease_id: data.lease_id || 'SMA-GEN',
        lease_no: data.lease_no || data.lease_id || 'SMA-GEN',
        lease_title: data.lease_title || 'Mining Concession',
        lessee_name: data.lessee_name || 'Authorized Lessee',
        district: data.district || 'Punjab',
        mineral: data.mineral || 'Ordinary Mineral',
        hearing_date: data.hearing_date || new Date().toISOString().split('T')[0],
        hearing_time: data.hearing_time || '10:30 AM',
        purpose: data.purpose || 'Statutory personal hearing under Punjab Mining Concession Rules 2002',
        stage: data.stage || 'Initial Show-Cause Reply',
        remarks_orders: data.remarks_orders || '',
        hearing_status: (data.hearing_status as HearingStatus) || 'Scheduled',
        presiding_officer: data.presiding_officer || 'Director SMA/T - Licensing Authority',
        hearing_venue: data.hearing_venue || 'Court Room of Director SMA/T, Poonch House, Multan Road, Lahore',
        notice_reference_no: data.notice_reference_no || `DGM&M/SMA/H-${String(hearings.length + 105).padStart(3, '0')}/2026`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setHearings(prev => [hearingRecord, ...prev]);
      addToast({
        type: 'success',
        title: 'Hearing Scheduled',
        message: `Personal hearing registered for ${hearingRecord.lease_no} on ${hearingRecord.hearing_date}.`
      });
    }

    // Upsert to Cloud Database if configured
    if (isCloudConnected) {
      upsertCloudHearing(hearingRecord).catch(err => console.warn('Cloud sync error for hearing:', err));
    }

    return hearingRecord;
  };

  // Update hearing (e.g. outcome, remarks, next date, order)
  const updateHearing = async (hearing_id: string, updates: Partial<Hearing>): Promise<void> => {
    let updatedHearing: Hearing | null = null;

    setHearings(prev => {
      return prev.map(h => {
        if (h.hearing_id === hearing_id) {
          const updated: Hearing = {
            ...h,
            ...updates,
            updated_at: new Date().toISOString()
          };
          updatedHearing = updated;
          return updated;
        }
        return h;
      });
    });

    if (updatedHearing) {
      const finalHearing: Hearing = updatedHearing;
      if (isCloudConnected) {
        upsertCloudHearing(finalHearing).catch(err => console.warn('Cloud sync error for hearing update:', err));
      }
      addToast({
        type: 'success',
        title: 'Quasi-Judicial Record Updated',
        message: `Proceedings recorded for ${finalHearing.lease_no} (${finalHearing.hearing_status}).`
      });
    }
  };

  // Delete hearing
  const deleteHearing = async (hearing_id: string): Promise<void> => {
    setHearings(prev => prev.filter(h => h.hearing_id !== hearing_id));
    if (isCloudConnected) {
      deleteCloudHearing(hearing_id).catch(err => console.warn('Cloud delete error:', err));
    }
    addToast({
      type: 'info',
      title: 'Hearing Removed',
      message: `Hearing ${hearing_id} was removed from the active schedule.`
    });
  };

  // Add a single lease
  const addLease = async (data: Partial<Lease>): Promise<Lease> => {
    const newId = data.lease_id || `SMA-CUSTOM-${Date.now().toString().slice(-4)}`;
    const newLease: Lease = {
      lease_id: newId,
      lease_no: data.lease_no || newId,
      lease_title: data.lease_title || `Mining Concession ${newId}`,
      lessee_name: data.lessee_name || 'Authorized Lessee',
      district: data.district || 'Punjab',
      mineral: data.mineral || 'Ordinary Mineral',
      status: data.status || 'Active',
      mining_type: data.mining_type || (data.lease_title?.includes('PL') ? 'PL' : 'ML'),
      area_acreage: data.area_acreage || 100,
      proprietor_representative: data.proprietor_representative || 'Authorized Representative',
      contact_number: data.contact_number || '+92 300 0000000',
      grant_date: data.grant_date || new Date().toISOString().split('T')[0],
      expiry_date: data.expiry_date || '2030-01-01',
      annual_rent_pkr: data.annual_rent_pkr || 2500000,
      created_at: new Date().toISOString()
    };

    setLeases(prev => [newLease, ...prev]);

    if (isCloudConnected) {
      upsertCloudLease(newLease).catch(err => console.warn('Cloud sync error for lease:', err));
    }

    addToast({
      type: 'success',
      title: 'Lease Concession Added',
      message: `${newLease.lease_no} (${newLease.mining_type}) registered in Directory.`
    });

    return newLease;
  };

  // Bulk add leases (CSV / Excel)
  const addLeasesBulk = async (newLeases: Lease[]): Promise<number> => {
    if (!newLeases || newLeases.length === 0) return 0;
    
    // Merge without duplicates by lease_id
    const existingIds = new Set(leases.map(l => l.lease_id));
    const toAdd = newLeases.filter(l => !existingIds.has(l.lease_id));
    
    setLeases(prev => [...toAdd, ...prev]);

    if (isCloudConnected && toAdd.length > 0) {
      bulkUpsertCloudLeases(toAdd).catch(err => console.warn('Cloud bulk sync error:', err));
    }

    addToast({
      type: 'success',
      title: 'Bulk Import Successful',
      message: `Imported ${toAdd.length} new lease records into directory.`
    });

    return toAdd.length;
  };

  // Summary Metrics for Badges
  const summaryStats = useMemo(() => {
    const todayStr = '2026-11-16'; // Environment current date
    const sevenDaysLater = new Date(new Date(todayStr).getTime() + 7 * 86400000).toISOString().split('T')[0];

    const mlCount = leases.filter(l => l.mining_type === 'ML').length;
    const plCount = leases.filter(l => l.mining_type === 'PL').length;

    const activeHearings = hearings.filter(h => h.hearing_status === 'Scheduled' || h.hearing_status === 'Adjourned');
    const todayHearings = hearings.filter(h => h.hearing_date === todayStr);
    const upcoming7Days = hearings.filter(h => h.hearing_date >= todayStr && h.hearing_date <= sevenDaysLater);

    return {
      totalLeases: leases.length,
      mlCount,
      plCount,
      activeHearingsCount: activeHearings.length,
      todayHearingsCount: todayHearings.length,
      upcoming7DaysCount: upcoming7Days.length
    };
  }, [leases, hearings]);

  return (
    <PortalContext.Provider
      value={{
        leases,
        hearings,
        activeTab,
        setActiveTab,
        selectedLeaseForDrawer,
        openDrawerForLease,
        closeDrawer,
        isScheduleModalOpen,
        selectedLeaseForSchedule,
        hearingToEdit,
        openScheduleModal,
        closeScheduleModal,
        isOutcomeModalOpen,
        selectedHearingForOutcome,
        openOutcomeModal,
        closeOutcomeModal,
        isCauseListModalOpen,
        setIsCauseListModalOpen,
        isAddLeaseModalOpen,
        setIsAddLeaseModalOpen,
        isBulkUploadModalOpen,
        setIsBulkUploadModalOpen,
        isCloudSettingsOpen,
        setIsCloudSettingsOpen,
        cloudConfig,
        cloudSyncStatus,
        lastSyncedAt,
        isCloudConnected,
        updateCloudConfig,
        triggerCloudSync,
        scheduleHearing,
        updateHearing,
        deleteHearing,
        addLease,
        addLeasesBulk,
        getHearingsForLease,
        getLatestHearingForLease,
        toasts,
        addToast,
        removeToast,
        summaryStats
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
