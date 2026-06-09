import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function Dashboard() {
  const { isFullAccess, userRole } = useOutletContext();
  const userName = isFullAccess ? userRole : 'R. Kumar (Sub-Engineer)';

  // --- MOCK DATA: FULL ACCESS (Admins/CO/Janpad) ---
  const adminStats = {
    totalProjects: 117, // Adjusted total (82 + 35)
    inProgress: 82,
    completed: 35,
    pendingRequests: 12,
    totalFundsPromised: 4500000,
    totalFundsUtilized: 1850000
  };

  // --- MOCK DATA: LIMITED ACCESS (Engineers) ---
  const engineerStats = {
    assignedProjects: 8,
    completedProjects: 3,
    pendingUpdates: 2,
    missingDocs: 1
  };

  const actionItems = [
    { id: 101, task: 'Fetch GPS Location', project: 'Road Extension Ward 4', type: 'progress' },
    { id: 102, task: 'Upload Technical Sanction', project: 'New Health Center', type: 'documentation' },
    { id: 103, task: 'Log Fund Utilization', project: 'Panchayat Bhavan Repair', type: 'fund-allotment' }
  ];

  // ==========================================
  // RENDER: FULL ACCESS DASHBOARD (Admins)
  // ==========================================
  if (isFullAccess) {
    // Math for Admin Charts
    const fundPercent = Math.round((adminStats.totalFundsUtilized / adminStats.totalFundsPromised) * 100);
    // Conic gradient mapping: Completed (Green) 30%, In Progress (Blue) 70%
    const pieChartGradient = `conic-gradient(#10b981 0% 30%, #3b82f6 30% 100%)`;

    return (
      <div className="space-y-6 pb-10 relative">
        
        {/* Welcome Banner */}
        <div className="bg-white/95 backdrop-blur-md p-6 border border-white/40 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Welcome back, <span className="font-bold">{userName}</span>. Current scheme analytics.</p>
          </div>
          <div className="text-right hidden sm:block bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Date</p>
            <p className="text-sm font-bold text-blue-900">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Linked Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/dashboard/project" state={{ userRole }} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden block">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Projects</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{adminStats.totalProjects}</p>
          </Link>
          
          <Link to="/dashboard/progress" state={{ userRole }} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden block">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-blue-500 transition-colors">{adminStats.inProgress}</p>
          </Link>
          
          <Link to="/dashboard/valuation" state={{ userRole }} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden block">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed Assets</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-green-500 transition-colors">{adminStats.completed}</p>
          </Link>
        </div>

        {/* Charts & Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pie Chart: Project Status */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 self-start w-full border-b border-gray-100 pb-2">Status Distribution</h3>
            <div className="relative w-48 h-48 rounded-full shadow-inner flex items-center justify-center" style={{ background: pieChartGradient }}>
              {/* Inner cutout for Donut chart look */}
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]">
                <span className="text-2xl font-black text-gray-900">{adminStats.totalProjects}</span>
              </div>
            </div>
            <div className="flex gap-6 mt-6 w-full justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-gray-600">Active</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs font-bold text-gray-600">Done</span></div>
            </div>
          </div>

          {/* Bar Chart: Financials */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Fund Utilization</h3>
              <Link to="/dashboard/fund-allotment" state={{ userRole }} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">View Ledger →</Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-500">Total Promised Funds</span>
                  <span className="font-black text-gray-900">₹45,00,000</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div className="bg-gray-300 h-4 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-blue-600">Funds Utilized</span>
                  <span className="font-black text-blue-600">₹18,50,000 ({fundPercent}%)</span>
                </div>
                <div className="w-full bg-blue-50 rounded-full h-4 overflow-hidden shadow-inner border border-blue-100">
                  {/* Dynamic CSS Bar */}
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full relative" style={{ width: `${fundPercent}%` }}>
                     <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 skew-x-12 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // RENDER: LIMITED ACCESS DASHBOARD (Engineers)
  // ==========================================
  
  // Math for Engineer Charts
  const engPieGradient = `conic-gradient(#10b981 0% 37.5%, #e5e7eb 37.5% 100%)`; // 3 of 8 completed
  
  return (
    <div className="space-y-6 pb-10 relative">

      {/* Welcome Banner */}
      <div className="bg-white/95 backdrop-blur-md p-6 border border-white/40 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Engineer Workspace</h2>
          <p className="text-sm text-gray-600 mt-1">Welcome, <span className="font-bold">{userName}</span>. Track your active assignments.</p>
        </div>
      </div>

      {/* Engineer KPI Cards Linked to Pages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Link to="/dashboard/project" state={{ userRole }} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">My Projects</p>
          <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{engineerStats.assignedProjects}</p>
        </Link>
        <Link to="/dashboard/valuation" state={{ userRole }} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
          <p className="text-4xl font-black text-green-500 group-hover:text-green-600 transition-colors">{engineerStats.completedProjects}</p>
        </Link>
        <Link to="/dashboard/progress" state={{ userRole }} className="group bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Pending Updates</p>
          <p className="text-4xl font-black text-blue-700 group-hover:text-blue-900 transition-colors">{engineerStats.pendingUpdates}</p>
        </Link>
        <Link to="/dashboard/documentation" state={{ userRole }} className="group bg-red-50 p-5 rounded-2xl border border-red-100 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all block">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Missing Docs</p>
          <p className="text-4xl font-black text-red-600 group-hover:text-red-800 transition-colors">{engineerStats.missingDocs}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Task Pie Chart */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col items-center">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 self-start w-full border-b border-gray-100 pb-2">Task Completion</h3>
          <div className="relative w-40 h-40 rounded-full shadow-inner flex items-center justify-center" style={{ background: engPieGradient }}>
            <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]">
              <span className="text-xl font-black text-gray-900">37%</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Done</span>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Required Field Actions</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {actionItems.map(item => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-900 text-base">{item.task}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Project: <span className="font-medium text-gray-700">{item.project}</span></p>
                </div>
                <Link 
                  to={`/dashboard/${item.type}`}
                  state={{ userRole }}
                  className="inline-flex justify-center items-center px-5 py-2.5 bg-gray-900 shadow-md text-sm font-bold rounded-lg text-white hover:bg-blue-600 transition-colors"
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