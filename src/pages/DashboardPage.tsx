import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lease } from '../types';
import { PUNJAB_MINING_DISTRICTS } from '../data/seedData';
import { 
  Layers, 
  Search, 
  CalendarPlus, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Filter,
  Printer,
  Plus,
  Clock,
  Gavel,
  ExternalLink,
  ShieldCheck,
  Compass,
  Pickaxe
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    leases, 
    hearings, 
    stats, 
    setSelectedLeaseForHearing, 
    setActiveTab,
    setActiveAddLeaseModal,
    setActiveCauseListModal,
    setActiveIssueOrderHearing,
    setActiveNoticeDocket
  } = usePortal();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedMineral, setSelectedMineral] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState<'All' | 'ML' | 'PL'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Selected lease modal for quick dossier preview
  const [previewLease, setPreviewLease] = useState<Lease | null>(null);

  // Exact ML and PL counts across the authentic 1,836 concessions
  const mlCount = useMemo(() => 
    leases.filter(l => (l.mining_type || 'ML').toUpperCase() === 'ML').length,
    [leases]
  );

  const plCount = useMemo(() => 
    leases.filter(l => (l.mining_type || '').toUpperCase() === 'PL').length,
    [leases]
  );

  // Dynamic mineral counts from actual 1,836 leases data
  const pinkSaltCount = useMemo(() => 
    leases.filter(l => l.mineral_name.toLowerCase().includes('salt')).length,
    [leases]
  );

  const coalCount = useMemo(() => 
    leases.filter(l => l.mineral_name.toLowerCase().includes('coal')).length,
    [leases]
  );

  const limestoneCount = useMemo(() => 
    leases.filter(l => l.mineral_name.toLowerCase().includes('limestone') || l.mineral_name.toLowerCase().includes('stone')).length,
    [leases]
  );

  const sandCount = useMemo(() => 
    leases.filter(l => l.mineral_name.toLowerCase().includes('sand')).length,
    [leases]
  );

  // 4 Featured Mineral Cards using the exact 4 pictures uploaded by user
  const mineralCards = [
    {
      id: 'pink_salt',
      name: 'Pink Salt',
      district: 'Jhelum & Khushab',
      image: 'assets/minerals/pink_salt.jpg',
      count: pinkSaltCount,
      filterKey: 'salt',
      tag: 'Salt Range Formations'
    },
    {
      id: 'coal',
      name: 'Coal',
      district: 'Chakwal & Mianwali',
      image: 'assets/minerals/coal.jpg',
      count: coalCount,
      filterKey: 'coal',
      tag: 'Colliery Deposits'
    },
    {
      id: 'limestone',
      name: 'Limestone & Stone',
      district: 'Attock, Rawalpindi & Chakwal',
      image: 'assets/minerals/limestone.jpg',
      count: limestoneCount,
      filterKey: 'limestone',
      tag: 'Quarry Face Extraction'
    },
    {
      id: 'sand',
      name: 'Sand & Silica Sand',
      district: 'Mianwali, D.G. Khan & Khushab',
      image: 'assets/minerals/sand.jpg',
      count: sandCount,
      filterKey: 'sand',
      tag: 'Riverbed & Silica Grids'
    }
  ];

  // Handle clicking a mineral card
  const handleMineralCardClick = (filterKey: string) => {
    if (selectedMineral.toLowerCase() === filterKey.toLowerCase()) {
      setSelectedMineral('All');
    } else {
      setSelectedMineral(filterKey);
    }
    setCurrentPage(1);
  };

  // Filtered Leases
  const filteredLeases = useMemo(() => {
    return leases.filter(lease => {
      // Concession Type Filter: ML vs PL
      if (selectedType !== 'All') {
        const type = (lease.mining_type || 'ML').toUpperCase();
        if (type !== selectedType) return false;
      }

      if (selectedDistrict !== 'All' && lease.district !== selectedDistrict) {
        return false;
      }

      if (selectedMineral !== 'All') {
        const mineralLower = lease.mineral_name.toLowerCase();
        if (!mineralLower.includes(selectedMineral.toLowerCase())) {
          return false;
        }
      }

      if (selectedStatus !== 'All' && lease.lease_status !== selectedStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = lease.lease_id.toLowerCase().includes(q);
        const matchTitle = lease.lease_title.toLowerCase().includes(q);
        const matchLessee = lease.lessee_name.toLowerCase().includes(q);
        const matchMineral = lease.mineral_name.toLowerCase().includes(q);
        const matchDistrict = lease.district.toLowerCase().includes(q);
        return matchId || matchTitle || matchLessee || matchMineral || matchDistrict;
      }

      return true;
    });
  }, [leases, selectedType, selectedDistrict, selectedMineral, selectedStatus, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeases.length / pageSize) || 1;
  const paginatedLeases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeases.slice(start, start + pageSize);
  }, [filteredLeases, currentPage, pageSize]);

  const handleScheduleForLease = (lease: Lease) => {
    setSelectedLeaseForHearing(lease);
    setActiveTab('schedule');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* EXECUTIVE HERO BANNER */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-gradient-to-r from-[#070B12] via-[#0D1826] to-[#082819] text-white">
        <div className="p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/30">
                Licensing Authority • DGM&amp;M Punjab
              </span>
              <span className="text-xs text-slate-300 hidden sm:inline">
                Small Mines Assistance/Titles (SMA/T)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Small Scale Mining Concessions &amp; Licensing
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Official Directorate General of Mines &amp; Minerals database monitoring all <strong>{leases.length} Small Scale Mining concessions</strong> across 10 Punjab mining districts under the Punjab Mining Concession Rules 2002.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>{mlCount.toLocaleString()}</strong> Mining Leases (ML)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span><strong>{plCount.toLocaleString()}</strong> Prospecting Licenses (PL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>10</strong> Mining Districts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => setActiveAddLeaseModal(true)}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Concession</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center justify-center gap-2 bg-[#0A6238] hover:bg-[#084e2c] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all border border-emerald-400/40"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Schedule Hearing</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATUTORY CONCESSION CLASSIFICATION CARDS: MINING LEASE (ML) & PROSPECTING LICENSE (PL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Mining Lease (ML) */}
        <div 
          onClick={() => {
            setSelectedType(selectedType === 'ML' ? 'All' : 'ML');
            setCurrentPage(1);
          }}
          className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer ${
            selectedType === 'ML' ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ML
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Mining Lease (ML)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Exclusive statutory rights granted for commercial mineral extraction, production, and marketing.
              </p>
              <p className="text-[11px] font-semibold text-emerald-800">
                Regulated under Rule 29, Punjab Mining Concession Rules 2002
              </p>
            </div>

            <div className="text-right flex-shrink-0 ml-4">
              <span className="text-3xl font-extrabold text-emerald-800 block">
                {mlCount.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {((mlCount / leases.length) * 100).toFixed(1)}% of total
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {selectedType === 'ML' ? 'Currently Filtering Leases Table' : 'Click to filter table to Mining Leases'}
            </span>
            <span className="font-bold text-emerald-700">
              {selectedType === 'ML' ? 'Clear Filter ✕' : 'View All ML →'}
            </span>
          </div>
        </div>

        {/* Card 2: Prospecting License (PL) */}
        <div 
          onClick={() => {
            setSelectedType(selectedType === 'PL' ? 'All' : 'PL');
            setCurrentPage(1);
          }}
          className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer ${
            selectedType === 'PL' ? 'border-sky-600 ring-2 ring-sky-500/30 bg-sky-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-sky-100 text-sky-900 border border-sky-300">
                  PL
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Prospecting License (PL)
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Statutory authorization to explore, core-drill, sample, and establish commercial mineral viability.
              </p>
              <p className="text-[11px] font-semibold text-sky-800">
                Regulated under Rule 14, Punjab Mining Concession Rules 2002
              </p>
            </div>

            <div className="text-right flex-shrink-0 ml-4">
              <span className="text-3xl font-extrabold text-sky-800 block">
                {plCount.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {((plCount / leases.length) * 100).toFixed(1)}% of total
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {selectedType === 'PL' ? 'Currently Filtering Leases Table' : 'Click to filter table to Prospecting Licenses'}
            </span>
            <span className="font-bold text-sky-700">
              {selectedType === 'PL' ? 'Clear Filter ✕' : 'View All PL →'}
            </span>
          </div>
        </div>

      </div>

      {/* 4 FEATURED MINERAL CARDS (USING USER'S 4 PICTURES) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0A6238]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Major Small Scale Minerals of Punjab
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any mineral to filter the concessions table below
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mineralCards.map((card) => {
            const isSelected = selectedMineral.toLowerCase() === card.filterKey.toLowerCase();
            return (
              <div
                key={card.id}
                onClick={() => handleMineralCardClick(card.filterKey)}
                className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Photo Frame using User's Image */}
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                  
                  <span className="absolute bottom-2 left-2.5 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                    {card.tag}
                  </span>

                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Filtered Active
                    </span>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {card.name}
                    </h4>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {card.count} Concessions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {card.district}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-slate-600">
                    <span>{isSelected ? 'Clear Filter' : 'Filter Concessions'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 CORE STATUTORY KPI SUMMARY CARDS (BASED ONLY ON REAL LEASES DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total SSM Leases */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total SSM Concessions
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalLeases}
            </span>
            <span className="text-xs text-slate-500 font-medium">concessions</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ML: <strong className="text-slate-800">{mlCount}</strong></span>
            <span>PL: <strong className="text-slate-800">{plCount}</strong></span>
          </div>
        </div>

        {/* KPI 2: Active Mining Leases */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Concessions
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.activeLeases}
            </span>
            <span className="text-xs text-emerald-700 font-medium">in operation</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Operational Standing</span>
            <span className="font-semibold text-slate-800">
              {((stats.activeLeases / stats.totalLeases) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* KPI 3: Show-Cause Issued */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Show-Cause Issued
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.showCauseLeases}
            </span>
            <span className="text-xs text-amber-700 font-medium">under notice</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Subject to Compliance</span>
            <span className="font-semibold text-amber-700">Notice Served</span>
          </div>
        </div>

        {/* KPI 4: Suspended / Expired */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Suspended / Expired
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.suspendedLeases + stats.expiredLeases}
            </span>
            <span className="text-xs text-rose-700 font-medium">non-active</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Suspended: {stats.suspendedLeases}</span>
            <span>Expired: {stats.expiredLeases}</span>
          </div>
        </div>

      </div>

      {/* PROMINENT SMALL SCALE MINING LEASES DATA GRID */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0A6238]" />
                <span>Small Scale Mining Concessions Registry</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                  {filteredLeases.length} of {leases.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Small Mines Assistance/Titles (SMA/T) concessions — Mining Leases (ML) and Prospecting Licenses (PL) across Punjab
              </p>
            </div>

            {/* Quick Segmented Toggle for ML vs PL */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => { setSelectedType('All'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedType === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Concessions ({leases.length})
              </button>

              <button
                onClick={() => { setSelectedType('ML'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedType === 'ML' ? 'bg-[#0A6238] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Mining Lease - ML ({mlCount})</span>
              </button>

              <button
                onClick={() => { setSelectedType('PL'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  selectedType === 'PL' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-300"></span>
                <span>Prospecting License - PL ({plCount})</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, company, title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Districts ({leases.length})</option>
              {PUNJAB_MINING_DISTRICTS.map(d => {
                const count = leases.filter(l => l.district === d).length;
                return (
                  <option key={d} value={d}>{d} ({count})</option>
                );
              })}
            </select>

            {/* Mineral Filter */}
            <select
              value={selectedMineral}
              onChange={(e) => {
                setSelectedMineral(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Minerals</option>
              <option value="salt">Pink Salt ({pinkSaltCount})</option>
              <option value="coal">Coal ({coalCount})</option>
              <option value="limestone">Limestone &amp; Stone ({limestoneCount})</option>
              <option value="sand">Sand &amp; Silica Sand ({sandCount})</option>
              <option value="gypsum">Gypsum</option>
              <option value="fireclay">Fireclay</option>
              <option value="iron">Iron Ore</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active ({stats.activeLeases})</option>
              <option value="Show-Cause Issued">Show-Cause Issued ({stats.showCauseLeases})</option>
              <option value="Suspended">Suspended ({stats.suspendedLeases})</option>
              <option value="Expired">Expired ({stats.expiredLeases})</option>
            </select>
          </div>
        </div>

        {/* Leases Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Lease Identifier</th>
                <th className="py-3 px-4">Concession Type</th>
                <th className="py-3 px-4">Concession Title</th>
                <th className="py-3 px-4">Mineral</th>
                <th className="py-3 px-4">Lessee / Company</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Area (Acres)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold">No Small Scale Mining concessions match your search filters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing the search query or changing district/mineral filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeases.map((lease) => {
                  const isPL = (lease.mining_type || '').toUpperCase() === 'PL';
                  return (
                    <tr key={lease.lease_id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Lease ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{lease.lease_id}</span>
                          {lease.s_no && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              #{lease.s_no}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Concession Type: Mining Lease (ML) vs Prospecting License (PL) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isPL ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                            <span>Prospecting License (PL)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>Mining Lease (ML)</span>
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4 max-w-xs font-semibold text-slate-800">
                        <div className="truncate" title={lease.lease_title}>
                          {lease.lease_title}
                        </div>
                        {lease.site_code && lease.site_code !== lease.lease_title && (
                          <div className="text-[10px] text-slate-400 truncate font-mono">
                            {lease.site_code}
                          </div>
                        )}
                      </td>

                      {/* Mineral */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {lease.mineral_name}
                        </span>
                      </td>

                      {/* Lessee Name */}
                      <td className="py-3 px-4 max-w-xs text-slate-700">
                        <div className="truncate font-medium" title={lease.lessee_name}>
                          {lease.lessee_name}
                        </div>
                        {lease.proprietor_representative && (
                          <div className="text-[10px] text-slate-400 truncate">
                            Rep: {lease.proprietor_representative}
                          </div>
                        )}
                      </td>

                      {/* District */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                        {lease.district}
                      </td>

                      {/* Area Acreage */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700">
                        {lease.area_acreage ? `${lease.area_acreage.toLocaleString()} acres` : '—'}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          lease.lease_status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          lease.lease_status === 'Show-Cause Issued' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lease.lease_status === 'Active' ? 'bg-emerald-600' :
                            lease.lease_status === 'Show-Cause Issued' ? 'bg-amber-600' :
                            'bg-rose-600'
                          }`}></span>
                          {lease.lease_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewLease(lease)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-xs font-semibold border border-slate-200 transition-colors"
                            title="View Concession Details"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleScheduleForLease(lease)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-bold border border-emerald-300 transition-colors"
                            title="Schedule statutory personal hearing against this concession"
                          >
                            Schedule Hearing
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">
              {filteredLeases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span> to <span className="font-bold text-slate-900">
              {Math.min(currentPage * pageSize, filteredLeases.length)}
            </span> of <span className="font-bold text-slate-900">{filteredLeases.length}</span> concessions
            {selectedType !== 'All' && (
              <span className="ml-1 text-slate-500 font-semibold">
                (Filtered by {selectedType === 'ML' ? 'Mining Lease - ML' : 'Prospecting License - PL'})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* STATUTORY HEARINGS STATUS SECTION (NO ASSUMED DATA) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0A6238]" />
              <span>Statutory Personal Hearings</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                {hearings.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory personal hearings issued to Small Scale Mining lessees by the Director SMA/T
            </p>
          </div>

          <button
            onClick={() => setActiveTab('schedule')}
            className="flex items-center gap-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Schedule Personal Hearing</span>
          </button>
        </div>

        {hearings.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-bold text-slate-800">No Personal Hearings Scheduled Yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                Zero assumed data recorded. As the Licensing Authority (Director SMA/T), you can schedule an official statutory personal hearing against any Mining Lease (ML) or Prospecting License (PL) by clicking below.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('schedule')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0A6238] font-bold rounded-lg text-xs border border-emerald-300 transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Issue New Personal Hearing Notice</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 pt-3">
            {hearings.map(h => {
              const lease = leases.find(l => l.lease_id === h.lease_id);
              const isPL = (lease?.mining_type || '').toUpperCase() === 'PL';
              return (
                <div key={h.hearing_id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{h.notice_reference_no}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">{lease?.lessee_name}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        isPL ? 'bg-sky-50 text-sky-800 border border-sky-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isPL ? 'Prospecting License (PL)' : 'Mining Lease (ML)'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Concession: <span className="font-mono font-semibold">{h.lease_id}</span> • Matter: <strong>{h.hearing_purpose}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">
                      {new Date(h.hearing_date).toLocaleDateString()} {new Date(h.hearing_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => setActiveNoticeDocket(h)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                    >
                      Notice Docket
                    </button>
                    {!h.order_issued && (
                      <button
                        onClick={() => setActiveIssueOrderHearing(h)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs"
                      >
                        Record Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK CONCESSION DOSSIER PREVIEW MODAL */}
      {previewLease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                  (previewLease.mining_type || '').toUpperCase() === 'PL' ? 'bg-sky-600' : 'bg-emerald-600'
                }`}>
                  {(previewLease.mining_type || '').toUpperCase() === 'PL' ? 'PL' : 'ML'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">{previewLease.lease_id}</h3>
                  <p className="text-[11px] text-slate-400">
                    {(previewLease.mining_type || '').toUpperCase() === 'PL' 
                      ? 'Prospecting License (PL) Concession Dossier' 
                      : 'Mining Lease (ML) Concession Dossier'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewLease(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Concession Title</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{previewLease.lease_title}</p>
              </div>

              {/* Concession Classification Box */}
              <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Statutory Concession Classification</span>
                  <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded text-xs font-bold ${
                    (previewLease.mining_type || '').toUpperCase() === 'PL'
                      ? 'bg-sky-100 text-sky-900 border border-sky-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {(previewLease.mining_type || '').toUpperCase() === 'PL' 
                      ? 'Prospecting License (PL)' 
                      : 'Mining Lease (ML)'}
                  </span>
                </div>
                <div className="text-right max-w-xs">
                  <span className="text-[11px] text-slate-600 font-medium block">
                    {(previewLease.mining_type || '').toUpperCase() === 'PL' 
                      ? 'Rule 14 (PMR 2002) — Exploration & Sampling' 
                      : 'Rule 29 (PMR 2002) — Commercial Extraction'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Mineral</span>
                  <span className="font-bold text-slate-800">{previewLease.mineral_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">District Jurisdiction</span>
                  <span className="font-bold text-slate-800">{previewLease.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Lessee / Firm</span>
                  <span className="font-bold text-slate-800">{previewLease.lessee_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Current Status</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${
                    previewLease.lease_status === 'Active' ? 'text-emerald-700' :
                    previewLease.lease_status === 'Show-Cause Issued' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {previewLease.lease_status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Sanctioned Area</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {previewLease.area_acreage ? `${previewLease.area_acreage} Acres` : 'Standard Grid Block'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold text-[10px] uppercase block">Mining Method</span>
                  <span className="font-bold text-slate-800">{previewLease.mining_method || 'Surface Mining'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setPreviewLease(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleScheduleForLease(previewLease);
                    setPreviewLease(null);
                  }}
                  className="px-4 py-1.5 bg-[#0A6238] hover:bg-[#084e2c] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Schedule Personal Hearing</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
