import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { PUNJAB_MINING_DISTRICTS } from '../../data/seedData';
import { LeaseStatus } from '../../types';
import { X, Plus, Layers } from 'lucide-react';

export const AddLeaseModal: React.FC = () => {
  const { activeAddLeaseModal, setActiveAddLeaseModal, addLease } = usePortal();

  const [leaseId, setLeaseId] = useState('');
  const [leaseTitle, setLeaseTitle] = useState('');
  const [mineralName, setMineralName] = useState('Limestone');
  const [lesseeName, setLesseeName] = useState('');
  const [proprietorRepresentative, setProprietorRepresentative] = useState('');
  const [contactNumber, setContactNumber] = useState('+92 300 ');
  const [district, setDistrict] = useState('Attock');
  const [tehsil, setTehsil] = useState('');
  const [leaseStatus, setLeaseStatus] = useState<LeaseStatus>('Active');
  const [areaAcreage, setAreaAcreage] = useState<number>(50);
  const [grantDate, setGrantDate] = useState('2024-01-01');
  const [expiryDate, setExpiryDate] = useState('2029-01-01');
  const [annualRentPkr, setAnnualRentPkr] = useState<number>(2500000);

  if (!activeAddLeaseModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addLease({
      lease_id: leaseId.trim() || undefined,
      lease_title: leaseTitle.trim(),
      mineral_name: mineralName.trim(),
      lessee_name: lesseeName.trim(),
      proprietor_representative: proprietorRepresentative.trim(),
      contact_number: contactNumber.trim(),
      district,
      tehsil: tehsil.trim() || undefined,
      lease_status: leaseStatus,
      area_acreage: Number(areaAcreage),
      grant_date: grantDate,
      expiry_date: expiryDate,
      annual_rent_pkr: Number(annualRentPkr),
    });

    setActiveAddLeaseModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Add Small Scale Mining (SMA/T) Lease
              </h3>
              <p className="text-[11px] text-slate-400">Directorate General of Mines &amp; Minerals Punjab</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveAddLeaseModal(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lease ID (Auto-assigned if left blank)
              </label>
              <input
                type="text"
                placeholder="e.g. SMA-ATK-2026-0150"
                value={leaseId}
                onChange={(e) => setLeaseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mineral Type *
              </label>
              <input
                type="text"
                required
                value={mineralName}
                onChange={(e) => setMineralName(e.target.value)}
                placeholder="e.g. Limestone, Coal, Silica Sand"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lease Title / Site Name *
            </label>
            <input
              type="text"
              required
              value={leaseTitle}
              onChange={(e) => setLeaseTitle(e.target.value)}
              placeholder="e.g. Ordinary Sand Block No. 14, Ravi Bed"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lessee / Company Name *
              </label>
              <input
                type="text"
                required
                value={lesseeName}
                onChange={(e) => setLesseeName(e.target.value)}
                placeholder="e.g. M/s Indus Valley Mineral Developers"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proprietor / Representative Name *
              </label>
              <input
                type="text"
                required
                value={proprietorRepresentative}
                onChange={(e) => setProprietorRepresentative(e.target.value)}
                placeholder="e.g. Malik Muhammad Tariq"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                {PUNJAB_MINING_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tehsil
              </label>
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                placeholder="e.g. Fateh Jang"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area (Acres) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={areaAcreage}
                onChange={(e) => setAreaAcreage(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status *
              </label>
              <select
                value={leaseStatus}
                onChange={(e) => setLeaseStatus(e.target.value as LeaseStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                <option value="Active">Active</option>
                <option value="Show-Cause Issued">Show-Cause Issued</option>
                <option value="Suspended">Suspended</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Royalty (PKR)
              </label>
              <input
                type="number"
                step="100000"
                value={annualRentPkr}
                onChange={(e) => setAnnualRentPkr(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grant Date
              </label>
              <input
                type="date"
                value={grantDate}
                onChange={(e) => setGrantDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveAddLeaseModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
            >
              Add Lease Record
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
