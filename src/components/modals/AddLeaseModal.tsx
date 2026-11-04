import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { PUNJAB_MINING_DISTRICTS } from '../../data/seedData';
import { LeaseStatus } from '../../types';
import { X, Plus, Layers, MapPin, Building, Phone, Calendar } from 'lucide-react';

export const AddLeaseModal: React.FC = () => {
  const { activeAddLeaseModal, setActiveAddLeaseModal, addLease } = usePortal();

  const [leaseId, setLeaseId] = useState('');
  const [leaseTitle, setLeaseTitle] = useState('');
  const [mineralName, setMineralName] = useState('Limestone');
  const [lesseeName, setLesseeName] = useState('');
  const [proprietorRepresentative, setProprietorRepresentative] = useState('');
  const [contactNumber, setContactNumber] = useState('+92 3');
  const [district, setDistrict] = useState('Attock');
  const [tehsil, setTehsil] = useState('');
  const [leaseStatus, setLeaseStatus] = useState<LeaseStatus>('Active');
  const [areaAcreage, setAreaAcreage] = useState<number>(50);
  const [coordinates, setCoordinates] = useState('');
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
      coordinates: coordinates.trim() || undefined,
      grant_date: grantDate,
      expiry_date: expiryDate,
      annual_rent_pkr: Number(annualRentPkr),
    });

    setActiveAddLeaseModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Register New Small Mines Agreement (SMA) Lease
              </h3>
              <p className="text-xs text-slate-400">Master Directorate Concession Registry</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveAddLeaseModal(false)}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lease ID / Reference Number (Auto-assigned if blank)
              </label>
              <input
                type="text"
                placeholder="e.g. SMA-ATK-2026-0150"
                value={leaseId}
                onChange={(e) => setLeaseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mineral Type *
              </label>
              <input
                type="text"
                required
                value={mineralName}
                onChange={(e) => setMineralName(e.target.value)}
                placeholder="e.g. Limestone, Coal, Silica Sand"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lease Title / Site Description *
            </label>
            <input
              type="text"
              required
              value={leaseTitle}
              onChange={(e) => setLeaseTitle(e.target.value)}
              placeholder="e.g. Ordinary Sand Block No. 14, Ravi Bed Sector 3"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lessee / Company Name *
              </label>
              <input
                type="text"
                required
                value={lesseeName}
                onChange={(e) => setLesseeName(e.target.value)}
                placeholder="e.g. M/s Indus Valley Mineral Developers"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proprietor / Representative Name *
              </label>
              <input
                type="text"
                required
                value={proprietorRepresentative}
                onChange={(e) => setProprietorRepresentative(e.target.value)}
                placeholder="e.g. Malik Muhammad Tariq Awan"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {PUNJAB_MINING_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tehsil
              </label>
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                placeholder="e.g. Fateh Jang"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Area Acreage *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={areaAcreage}
                onChange={(e) => setAreaAcreage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Status *
              </label>
              <select
                value={leaseStatus}
                onChange={(e) => setLeaseStatus(e.target.value as LeaseStatus)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Active">Active</option>
                <option value="Show-Cause Issued">Show-Cause Issued</option>
                <option value="Suspended">Suspended</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Annual Royalty / Bid (PKR)
              </label>
              <input
                type="number"
                step="100000"
                value={annualRentPkr}
                onChange={(e) => setAnnualRentPkr(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Grant Date
              </label>
              <input
                type="date"
                value={grantDate}
                onChange={(e) => setGrantDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pillar Coordinates (GPS)
              </label>
              <input
                type="text"
                placeholder="e.g. 72.4308° E, 33.7265° N"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveAddLeaseModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register Lease in Directory</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
