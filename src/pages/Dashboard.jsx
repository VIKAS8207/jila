import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function Dashboard() {
  const { isFullAccess, userRole } = useOutletContext();
  const userName = isFullAccess ? userRole : 'R. Kumar (Sub-Engineer)';

  // --- MOCK DATA: FULL ACCESS (Admins/CO/Janpad) ---
  const adminStats = {
    totalProjects: 124,
    inProgress: 82,
    completed: 35,
    delayed: 7, // Projects that crossed deadlines
    pendingRequests: 12,
    totalFundsPromised: '₹45,00,000',
    totalFundsUtilized: '₹18,50,000'
  };

  const delayedProjects = [
    { id: 1, name: 'Primary School Renovation', village: 'Abhanpur', delay: '14 days' },
    { id: 2, name: 'Community Water Tank', village: 'Tilda', delay: '5 days' }
  ];

  // --- MOCK DATA: LIMITED ACCESS (Engineers) ---
  const engineerStats = {
    assignedProjects: 8,
    completedProjects: 3,
    pendingUpdates: 2, // Needs progress photo/location
    missingDocs: 1 // Needs TS/Patvari upload
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
    return (
      <div className="space-y-6 pb-10">
        
        {/* Welcome Banner */}
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, {userName}. Here is the current status of all schemes.</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</p>
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900">{adminStats.totalProjects}</p>
          </div>
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{adminStats.inProgress}</p>
          </div>
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-400">{adminStats.completed}</p>
          </div>
          <div className="bg-white p-5 border-2 border-gray-900 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">Attention</div>
            <p className="text-sm font-medium text-gray-700 mb-1">Delayed / Crossed Deadline</p>
            <p className="text-3xl font-bold text-gray-900">{adminStats.delayed}</p>
          </div>
        </div>

        {/* Secondary Grid: Financials & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Financial Summary */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Financial Snapshot</h3>
              <Link to="/dashboard/fund-allotment" className="text-sm font-medium text-gray-500 hover:text-gray-900 underline">View Ledger</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Promised</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalFundsPromised}</p>
              </div>
              <div className="bg-white p-4 border border-gray-300 rounded-lg">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Utilized</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalFundsUtilized}</p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Pending Project Requests ({adminStats.pendingRequests})</h4>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="text-sm text-gray-600">Multiple new requests require CO approval.</span>
                <Link to="/dashboard/project-request" className="text-sm font-bold text-gray-900 border border-gray-300 px-3 py-1.5 rounded-md bg-white hover:bg-gray-100">Review</Link>
              </div>
            </div>
          </div>

          {/* Attention Required Panel */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Critical Delays</h3>
            <div className="flex-1 space-y-3">
              {delayedProjects.map(proj => (
                <div key={proj.id} className="p-3 border-l-4 border-gray-900 bg-gray-50 rounded-r-lg shadow-sm">
                  <p className="font-bold text-gray-900 text-sm">{proj.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{proj.village}</span>
                    <span className="text-xs font-bold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">Overdue: {proj.delay}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              View All Delayed Projects
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: LIMITED ACCESS DASHBOARD (Engineers)
  // ==========================================
  return (
    <div className="space-y-6 pb-10">
      
      {/* Welcome Banner */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Engineer Workspace</h2>
          <p className="text-sm text-gray-400 mt-1">Welcome, {userName}. Review your pending field tasks below.</p>
        </div>
      </div>

      {/* Engineer KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">My Projects</p>
          <p className="text-3xl font-bold text-gray-900">{engineerStats.assignedProjects}</p>
        </div>
        <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-3xl font-bold text-gray-500">{engineerStats.completedProjects}</p>
        </div>
        <div className="bg-white p-5 border border-gray-300 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Pending Updates</p>
          <p className="text-3xl font-bold text-gray-900">{engineerStats.pendingUpdates}</p>
        </div>
        <div className="bg-white p-5 border-2 border-gray-900 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Missing Docs</p>
          <p className="text-3xl font-bold text-gray-900">{engineerStats.missingDocs}</p>
        </div>
      </div>

      {/* Action Items List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Action Required</h3>
          <p className="text-sm text-gray-500">Tasks you need to complete to maintain project compliance.</p>
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
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
              >
                Resolve Task →
              </Link>
            </div>
          ))}
          {actionItems.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-medium">All caught up! No pending tasks.</div>
          )}
        </div>
      </div>

    </div>
  );
}