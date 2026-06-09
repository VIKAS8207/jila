import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

export default function Dashboard() {
  const { isFullAccess, userRole } = useOutletContext();
  const userName = isFullAccess ? userRole : 'R. Kumar (Sub-Engineer)';

  // --- MODAL STATE ---
  const [modalState, setModalState] = useState({ isOpen: false, title: '', data: [] });

  const openModal = (title, data) => setModalState({ isOpen: true, title, data });
  const closeModal = () => setModalState({ isOpen: false, title: '', data: [] });

  // --- MOCK DATA: FULL ACCESS (Admins/CO/Janpad) ---
  const adminStats = {
    totalProjects: 124,
    inProgress: 82,
    completed: 35,
    delayed: 7,
    pendingRequests: 12,
    totalFundsPromised: 4500000,
    totalFundsUtilized: 1850000
  };

  // Detailed lists for the Modals
  const projectLists = {
    total: Array.from({ length: 5 }, (_, i) => ({ id: i, name: `Project ${i+1}`, village: 'Raipur Block', status: 'Active' })),
    inProgress: [
      { id: 101, name: 'Panchayat Bhavan Repair', village: 'Arang', status: 'On Track' },
      { id: 102, name: 'Connecting Road Phase 2', village: 'Tilda', status: 'Material Pending' },
    ],
    completed: [
      { id: 201, name: 'Village Solar Grid', village: 'Abhanpur', status: 'Capitalized' },
      { id: 202, name: 'Primary Health Center', village: 'Raipur', status: 'Capitalized' },
    ],
    delayed: [
      { id: 301, name: 'Primary School Renovation', village: 'Abhanpur', status: 'Overdue 14 days' },
      { id: 302, name: 'Community Water Tank', village: 'Tilda', status: 'Overdue 5 days' }
    ]
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
  // SHARED COMPONENT: MODAL
  // ==========================================
  const ProjectModal = () => {
    if (!modalState.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060b19]/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
          <div className="bg-gray-50 border-b border-gray-200 p-5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{modalState.title} Projects</h3>
              <p className="text-sm text-gray-500">Detailed view of selected category</p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
          </div>
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Project Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modalState.data.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-6 text-gray-500">No projects found.</td></tr>
                ) : (
                  modalState.data.map(proj => (
                    <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-bold text-gray-900">{proj.name}</td>
                      <td className="px-4 py-4 text-gray-600">{proj.village}</td>
                      <td className="px-4 py-4 text-right">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-gray-200">
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button onClick={closeModal} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors">Close</button>
          </div>
        </div>
      </div>
    );
  };


  // ==========================================
  // RENDER: FULL ACCESS DASHBOARD (Admins)
  // ==========================================
  if (isFullAccess) {
    // Math for Admin Charts
    const fundPercent = Math.round((adminStats.totalFundsUtilized / adminStats.totalFundsPromised) * 100);
    // Conic gradient mapping: Completed (Green) 28%, Delayed (Red) 6%, In Progress (Blue) 66%
    const pieChartGradient = `conic-gradient(#10b981 0% 28%, #ef4444 28% 34%, #3b82f6 34% 100%)`;

    return (
      <div className="space-y-6 pb-10 relative">
        <ProjectModal />
        
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

        {/* Interactive Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div onClick={() => openModal('Total', projectLists.total)} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Projects</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{adminStats.totalProjects}</p>
          </div>
          <div onClick={() => openModal('In Progress', projectLists.inProgress)} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-blue-500 transition-colors">{adminStats.inProgress}</p>
          </div>
          <div onClick={() => openModal('Completed', projectLists.completed)} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
            <p className="text-4xl font-black text-gray-900 group-hover:text-green-500 transition-colors">{adminStats.completed}</p>
          </div>
          <div onClick={() => openModal('Delayed', projectLists.delayed)} className="group bg-white p-5 rounded-2xl border-2 border-red-50 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)] hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Alert</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">Delayed</p>
            <p className="text-4xl font-black text-red-500">{adminStats.delayed}</p>
          </div>
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
            <div className="flex gap-4 mt-6 w-full justify-center">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-gray-600">Active</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs font-bold text-gray-600">Done</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs font-bold text-gray-600">Delayed</span></div>
            </div>
          </div>

          {/* Bar Chart: Financials */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Fund Utilization</h3>
              <Link to="/dashboard/fund-allotment" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">View Ledger →</Link>
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
      <ProjectModal />

      {/* Welcome Banner */}
      <div className="bg-white/95 backdrop-blur-md p-6 border border-white/40 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Engineer Workspace</h2>
          <p className="text-sm text-gray-600 mt-1">Welcome, <span className="font-bold">{userName}</span>. Track your active assignments.</p>
        </div>
      </div>

      {/* Engineer KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">My Projects</p>
          <p className="text-4xl font-black text-gray-900">{engineerStats.assignedProjects}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
          <p className="text-4xl font-black text-green-500">{engineerStats.completedProjects}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Pending Updates</p>
          <p className="text-4xl font-black text-blue-700">{engineerStats.pendingUpdates}</p>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.1)]">
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Missing Docs</p>
          <p className="text-4xl font-black text-red-600">{engineerStats.missingDocs}</p>
        </div>
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