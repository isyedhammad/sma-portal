import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { CloudConfig } from '../../types';
import { SUPABASE_SQL_SCHEMA } from '../../config/cloudConfig';
import { testCloudConnection } from '../../services/cloudStorage';
import {
  X,
  Cloud,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

export const CloudSettingsModal: React.FC = () => {
  const {
    isCloudSettingsOpen,
    setIsCloudSettingsOpen,
    cloudConfig,
    updateCloudConfig,
    triggerCloudSync,
    cloudSyncStatus,
    lastSyncedAt
  } = usePortal();

  const [formData, setFormData] = useState<CloudConfig>(cloudConfig);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isCloudSettingsOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testCloudConnection(formData);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e?.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCloudConfig(formData);
      setIsCloudSettingsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#01411C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700">
              <Cloud className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Cloud Database Storage &amp; Synchronization
              </h2>
              <p className="text-xs text-emerald-200">
                Centralized PostgreSQL (Supabase) / Firebase Firestore Persistence
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCloudSettingsOpen(false)}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Status Banner */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            cloudSyncStatus === 'synced'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : cloudSyncStatus === 'connecting'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                cloudSyncStatus === 'synced' ? 'bg-emerald-600' : 'bg-slate-400'
              }`}></span>
              <div>
                <span className="font-bold">
                  Status: {cloudSyncStatus === 'synced' ? 'Cloud Synced (Live Supabase)' : 'Central Government Cloud Ledger Active'}
                </span>
                {lastSyncedAt && (
                  <span className="text-[11px] block opacity-80">Last synced at {lastSyncedAt}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={triggerCloudSync}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 rounded shadow-2xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>
          </div>

          {/* Provider Selector */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
              Select Cloud Storage Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'supabase' })}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  formData.provider === 'supabase'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-700 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Supabase (PostgreSQL)</div>
                  <div className="text-[11px] text-slate-500">Relational SQL with tables &amp; foreign keys (Recommended)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, provider: 'firebase' })}
                className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                  formData.provider === 'firebase'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <Server className="w-4 h-4 text-emerald-700 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">Firebase Firestore</div>
                  <div className="text-[11px] text-slate-500">Google Cloud document collections storage</div>
                </div>
              </button>
            </div>
          </div>

          {/* Supabase Configuration Inputs */}
          {formData.provider === 'supabase' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={formData.supabaseUrl}
                  onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Supabase Public / Anon API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={formData.supabaseAnonKey}
                  onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono focus:outline-none focus:border-emerald-700"
                />
              </div>

              {/* SQL Schema Copy Box */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Supabase SQL Schema (leases &amp; hearings tables)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-emerald-200 bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Run this SQL in your Supabase SQL Editor once to set up the relational tables and public RLS policies.
                </p>
              </div>
            </div>
          )}

          {/* Firebase Configuration Inputs */}
          {formData.provider === 'firebase' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Firebase Project ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. dgmm-sma-portal"
                  value={formData.firebaseProjectId}
                  onChange={(e) => setFormData({ ...formData, firebaseProjectId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Firebase Web API Key (Optional)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={formData.firebaseApiKey}
                  onChange={(e) => setFormData({ ...formData, firebaseApiKey: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-900 font-mono focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>
          )}

          {/* Test Connection Banner */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              disabled={testing}
              onClick={handleTest}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-all"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCloudSettingsOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#01411C] hover:bg-[#0A5C36] text-white font-bold rounded-lg shadow-sm transition-all"
              >
                {isSaving ? 'Saving...' : 'Save & Connect Cloud'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
