import React, { useState, useRef, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

// --- REUSABLE CUSTOM DROPDOWN ---
const CustomDropdown = ({ options, value, onChange, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full text-sm font-bold transition-all duration-200 border ${
          isOpen ? 'bg-[#451db3]/10 border-[#451db3] text-[#451db3] shadow-inner' : 'bg-white border-slate-200 text-slate-700 hover:border-[#451db3]/50 focus:ring-2 focus:ring-[#451db3]/20 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
          <ul className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <li 
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors rounded-none ${value === '' ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
            >
              {placeholder}
            </li>
            {options.map((opt, idx) => (
              <li 
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors rounded-none ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard(props) {
  // Grab the context so we can safely fall back if props weren't passed
  const context = useOutletContext() || {};
  const userRole = props.userRole || context.userRole || 'CEO Jila Panchayat'; 

  // Role Boolean Checks using the exact strings from your new config
  const isGramPanchayat = userRole === 'Gram Panchayat';
  const isHigherAdmin = ['CEO Jila Panchayat', 'Jila Panchayat', 'Janpad', 'CO Jila Adhyaksh'].includes(userRole);

  // --- MOCK DATA ---
  const adminStats = {
    totalProjects: 117,
    inProgress: 82,
    completed: 35,
    pendingRequests: 12,
    totalFundsPromised: 4500000,
    totalFundsUtilized: 1850000
  };

  // Mock data specifically for Gram Panchayat progress graph
  const gpProjectsProgress = [
    { name: 'Ward 4 Road Extension', progress: 85 },
    { name: 'Panchayat Solar Grid', progress: 60 },
    { name: 'Community Pond Cleaning', progress: 35 },
    { name: 'Primary School Repair', progress: 15 }
  ];

  const fundPercent = Math.round((adminStats.totalFundsUtilized / adminStats.totalFundsPromised) * 100);
  const pieChartGradient = `conic-gradient(#451db3 0% 30%, #e2e8f0 30% 100%)`;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // --- DASHBOARD FILTER STATES ---
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterGP, setFilterGP] = useState('');
  const [filterScheme, setFilterScheme] = useState('');
  const [filterSector, setFilterSector] = useState('');

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Welcome Banner */}
      <div className="bg-white/60 backdrop-blur-2xl p-6 border border-slate-100 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Command Center</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Welcome back, <span className="font-bold text-[#451db3]">{userRole}</span>. Here is your operational overview.</p>
        </div>
        <div className="hidden sm:block bg-[#451db3]/5 p-4 rounded-2xl border border-[#451db3]/10 text-right">
          <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest">System Date</p>
          <p className="text-sm font-black text-slate-800">{new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Global Filter Bar - Dynamic based on Role */}
      <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col lg:flex-row gap-5 items-start lg:items-center z-20 relative">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 ml-2 hidden lg:block">Dashboard Filters</span>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Higher Admins see District & GP filters */}
          {isHigherAdmin && (
            <>
              <CustomDropdown 
                placeholder="All Districts"
                value={filterDistrict}
                onChange={setFilterDistrict}
                options={['Bilaspur', 'Raipur', 'Durg']}
              />
              <CustomDropdown 
                placeholder="All Gram Panchayats"
                value={filterGP}
                onChange={setFilterGP}
                options={['Abhanpur', 'Arang', 'Tilda', 'Masturi']}
              />
            </>
          )}

          {/* Gram Panchayat sees their district by default (disabled) */}
          {isGramPanchayat && (
            <div className="w-full">
              <input type="text" disabled value="Bilaspur (Auto)" className="w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 opacity-60 cursor-not-allowed shadow-[0_2px_10px_rgba(0,0,0,0.03)]" />
            </div>
          )}

          {/* Everyone sees Scheme & Sector filters */}
          <CustomDropdown 
            placeholder="All Schemes"
            value={filterScheme}
            onChange={setFilterScheme}
            options={['National Health Mission', 'PMGSY', 'Jal Jeevan Mission']}
          />
          <CustomDropdown 
            placeholder="All Sectors"
            value={filterSector}
            onChange={setFilterSector}
            options={['Health', 'Infrastructure', 'Education']}
          />
        </div>
        
        {(filterDistrict || filterGP || filterScheme || filterSector) && (
          <button 
            onClick={() => { setFilterDistrict(''); setFilterGP(''); setFilterScheme(''); setFilterSector(''); }}
            className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-5 py-3.5 rounded-full transition-all shrink-0 bg-red-50 shadow-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Linked Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/dashboard/project" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-[#451db3]/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#451db3]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Projects</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-[#451db3] transition-colors relative z-10">{adminStats.totalProjects}</p>
        </Link>
        
        <Link to="/dashboard/progress" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">In Progress</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-amber-500 transition-colors relative z-10">{adminStats.inProgress}</p>
        </Link>
        
        <Link to="/dashboard/valuation" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-green-500/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Completed Assets</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-green-500 transition-colors relative z-10">{adminStats.completed}</p>
        </Link>
      </div>

      {/* Charts & Graphs Section */}
      <div className={`grid grid-cols-1 ${isHigherAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        
        {/* Pie Chart: Project Status (Visible to all) */}
        <div className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col items-center w-full ${!isHigherAdmin ? 'max-w-md mx-auto' : ''}`}>
          <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-8 self-start w-full border-b border-[#451db3]/10 pb-3">Status Distribution</h3>
          <div className="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center transition-transform hover:scale-105 duration-300" style={{ background: pieChartGradient }}>
            <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
              <span className="text-3xl font-black text-slate-800">{adminStats.totalProjects}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex gap-6 mt-8 w-full justify-center">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#451db3]"></div><span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Completed</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200"></div><span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Active</span></div>
          </div>
        </div>

        {/* Bar Chart: Financials (Visible ONLY to Higher Admins) */}
        {isHigherAdmin && (
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest">Overall Fund Utilization</h3>
              <Link to="/dashboard/fund-allotment" state={{ userRole }} className="text-[10px] font-black text-slate-400 hover:text-[#451db3] uppercase tracking-widest transition-colors">View Ledger →</Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-10">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Promised Funds</span>
                  <span className="text-2xl font-black text-slate-800">{formatCurrency(adminStats.totalFundsPromised)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden shadow-inner">
                  <div className="bg-slate-300 h-full rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black text-[#451db3] uppercase tracking-widest">Funds Utilized</span>
                  <span className="text-2xl font-black text-[#451db3]">{formatCurrency(adminStats.totalFundsUtilized)} <span className="text-sm text-slate-400">({fundPercent}%)</span></span>
                </div>
                <div className="w-full bg-[#451db3]/10 rounded-full h-5 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] h-full rounded-full relative transition-all duration-1000" style={{ width: `${fundPercent}%` }}>
                     <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Progress Graph (Visible ONLY to Gram Panchayat) */}
        {isGramPanchayat && (
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest">Project Progress Overview</h3>
              <Link to="/dashboard/progress" state={{ userRole }} className="text-[10px] font-black text-slate-400 hover:text-[#451db3] uppercase tracking-widest transition-colors">Update Progress →</Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
              {gpProjectsProgress.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">{proj.name}</span>
                    <span className="text-sm font-black text-[#451db3]">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-[#451db3]/10 rounded-full h-3.5 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] h-full rounded-full relative transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}