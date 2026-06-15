import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ userRole }) {
  // --- MOCK DATA ---
  const adminStats = {
    totalProjects: 117,
    inProgress: 82,
    completed: 35,
    pendingRequests: 12,
    totalFundsPromised: 4500000,
    totalFundsUtilized: 1850000
  };

  const fundPercent = Math.round((adminStats.totalFundsUtilized / adminStats.totalFundsPromised) * 100);
  const pieChartGradient = `conic-gradient(#451db3 0% 30%, #e2e8f0 30% 100%)`;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

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

      {/* Linked Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/dashboard/project" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#451db3]/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#451db3]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Total Projects</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-[#451db3] transition-colors relative z-10">{adminStats.totalProjects}</p>
        </Link>
        
        <Link to="/dashboard/progress" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#451db3]/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">In Progress</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-amber-500 transition-colors relative z-10">{adminStats.inProgress}</p>
        </Link>
        
        <Link to="/dashboard/valuation" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-500/30 hover:-translate-y-1 transition-all relative overflow-hidden block">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Completed Assets</p>
          <p className="text-5xl font-black text-slate-800 group-hover:text-green-500 transition-colors relative z-10">{adminStats.completed}</p>
        </Link>
      </div>

      {/* Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart: Project Status */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
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

        {/* Bar Chart: Financials */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
            <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest">Fund Utilization</h3>
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

      </div>
    </div>
  );
}