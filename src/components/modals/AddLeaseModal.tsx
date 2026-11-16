import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lease, MiningType, LeaseStatus } from '../../types';
import {
  X,
  Plus,
  Building,
  MapPin,
  Scale,
  CheckCircle2
} from 'lucide-react';

export const AddLeaseModal: React.FC = () => {
  const {
    isAddLeaseModalOpen,
    setIsAddLeaseModalOpen,
    addLease
  } = usePortal();

  const [leaseNo, setLeaseNo] = useState('');
  const [leaseTitle, setLeaseTitle] = useState('');
  const [siteCode, setSiteCode] = useState('');
  const [lesseeName, setLesseeName] = useState('');
  const [miningType, setMiningType] = useState<MiningType>('ML');
  const [district, setDistrict] = useState('Attock');
  const [mineral, setMineral] = useState('Limestone');
  const [status, setStatus] = useState<LeaseStatus>('Active');
  const [areaAcreage, setAreaAcreage] = useState<number>(50);
  const [grantDate, setGrantDate] = useState('2024-01-01');
  const [expiryDate, setExpiryDate] = useState('2029-01-01');
  const [contactNumber, setContactNumber] = useState('+92 300 0000000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddLeaseModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const generatedId = leaseNo.trim() || `SMA-${district.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const formattedTitle = siteCode.trim() ? `${leaseTitle.trim()} (${siteCode.trim()})` : leaseTitle.trim();
      await addLease({
        lease_id: generatedId,
        lease_no: generatedId,
        lease_title: formattedTitle,
        site_code: siteCode.trim() || leaseTitle.trim(),
        lessee_name: lesseeName.trim(),
        mining_type: miningType,
        district,
        mineral,
        status,
        area_acreage: Number(areaAcreage),
        grant_date: grantDate,
        expiry_date: expiryDate,
        contact_number: contactNumber.trim()
      });
      setIsAddLeaseModalOpen(false);
      // Reset
      setLeaseNo('');
      setLeaseTitle('');
      setSiteCode('');
      setLesseeName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#01411C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700">
              <Plus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Add Small Mines Concession
              </h2>
              <p className="text-xs text-emerald-200">
                Register Mining Lease (ML) or Prospecting License (PL)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddLeaseModalOpen(false)}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Concession Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Limestone Concession"
                value={leaseTitle}
                onChange={(e) => setLeaseTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Site / Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hassanabdal 13-D or Bolianwal"
                value={siteCode}
                onChange={(e) => setSiteCode(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Concession Category *
              </label>
              <select
                value={miningType}
                onChange={(e) => setMiningType(e.target.value as MiningType)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800 font-bold"
              >
                <option value="ML">ML - Mining Lease</option>
                <option value="PL">PL - Prospecting License</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Concession File No (Optional)
              </label>
              <input
                type="text"
                placeholder="Auto-generated if left blank"
                value={leaseNo}
                onChange={(e) => setLeaseNo(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800 font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Lessee / Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. M/s Margalla Mining &amp; Mineral Developers"
              value={lesseeName}
              onChange={(e) => setLesseeName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                District *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mineral *
              </label>
              <input
                type="text"
                required
                value={mineral}
                onChange={(e) => setMineral(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Area (Acres)
              </label>
              <input
                type="number"
                value={areaAcreage}
                onChange={(e) => setAreaAcreage(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Grant Date
              </label>
              <input
                type="date"
                value={grantDate}
                onChange={(e) => setGrantDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddLeaseModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#01411C] hover:bg-[#0A5C36] text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Save & Register Lease'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
