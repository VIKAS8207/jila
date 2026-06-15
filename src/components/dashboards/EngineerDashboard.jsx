import React from 'react';
import { Link } from 'react-router-dom';

export default function EngineerDashboard({ userRole }) {
  // --- MOCK DATA: LIMITED ACCESS (Engineers) ---
  const engineerStats = {
    assignedProjects: 8,
    completedProjects: 3,
    pendingUpdates: 2,
    missingDocs: 1
  };

  const actionItems = [
    { id: 101, task: 'Fetch GPS Location', project: 'Ward 4 Road Extension', type: 'progress' },
    { id: 102, task: 'Upload Technical Sanction', project: 'New Health Center', type: 'documentation' },
    { id: 103, task: 'Log Fund Utilization', project: 'Panchayat Bhavan Repair', type: 'progress' }
  ];

  // Math for Engineer Charts (3 out of 8 completed = 37.5%)
  const engPieGradient = `conic-gradient(#451db3 0% 37.5%, #e2e8f0 37.5% 100%)`; 

  return (
    <div className="space-y-6 pb-10 relative">

      {/* Welcome Banner */}
      <div className="bg-white/60 backdrop-blur-2xl p-6 border border-slate-100 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Engineer Workspace</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Welcome back, <span className="font-bold text-[#451db3]">{userRole}</span>. Track your active assignments.</p>
        </div>
        <div className="hidden sm:block bg-[#451db3]/5 p-4 rounded-2xl border border-[#451db3]/10 text-right">
          <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest">System Date</p>
          <p className="text-sm font-black text-slate-800">{new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Engineer KPI Cards Linked to Pages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Link to="/dashboard/project" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#451db3]/30 hover:-translate-y-1 transition-all block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Projects</p>
          <p className="text-4xl font-black text-slate-800 group-hover:text-[#451db3] transition-colors">{engineerStats.assignedProjects}</p>
        </Link>
        <Link to="/dashboard/valuation" state={{ userRole }} className="group bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Completed</p>
          <p className="text-4xl font-black text-emerald-500 group-hover:text-emerald-600 transition-colors">{engineerStats.completedProjects}</p>
        </Link>
        <Link to="/dashboard/progress" state={{ userRole }} className="group bg-[#451db3]/5 p-6 rounded-3xl border border-[#451db3]/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-2">Pending Updates</p>
          <p className="text-4xl font-black text-[#451db3] transition-colors">{engineerStats.pendingUpdates}</p>
        </Link>
        <Link to="/dashboard/documentation" state={{ userRole }} className="group bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Missing Docs</p>
          <p className="text-4xl font-black text-red-600 transition-colors">{engineerStats.missingDocs}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Task Pie Chart */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center">
          <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-8 self-start w-full border-b border-[#451db3]/10 pb-3">Task Completion</h3>
          <div className="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center transition-transform hover:scale-105 duration-300" style={{ background: engPieGradient }}>
            <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
              <span className="text-3xl font-black text-slate-800">37%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</span>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest">Required Field Actions</h3>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {actionItems.map(item => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#451db3]/5 transition-colors">
                <div>
                  <p className="font-black text-slate-800 text-base">{item.task}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Project: <span className="font-bold text-[#451db3]">{item.project}</span></p>
                </div>
                <Link 
                  to={`/dashboard/${item.type}`}
                  state={{ userRole }}
                  className="inline-flex justify-center items-center px-6 py-3 bg-white border border-slate-200 shadow-sm text-[10px] uppercase tracking-widest font-black rounded-full text-slate-600 hover:bg-[#451db3] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  Resolve Task →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}