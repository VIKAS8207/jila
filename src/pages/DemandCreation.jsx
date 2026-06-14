import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

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
          isOpen ? 'bg-[#451db3]/10 border-[#451db3] text-[#451db3]' : 'bg-white/50 border-slate-200 text-slate-700 hover:border-[#451db3]/50 focus:ring-2 focus:ring-[#451db3]/20'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
          <ul className="max-h-60 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {options.map((opt, idx) => (
              <li 
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-2.5 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
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

export default function DemandCreation() {
  const { userRole } = useOutletContext(); // Grabs 'Gram Panchayat', 'Janpad', or 'CO Jila Adhyaksh'

  // View States: 'list' -> 'search' -> 'form'
  const [view, setView] = useState('list');
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- MOCK DATA ---
  const [availableProjects] = useState([
    { id: 101, workId: 'WRK-2026-834', name: 'Sample Community Hall', district: 'Bilaspur', startDate: '2026-06-01', endDate: '2026-12-01', estCost: '1500000' },
    { id: 102, workId: 'WRK-2026-835', name: 'Primary School Renovation', district: 'Bilaspur', startDate: '2026-07-15', endDate: '2026-10-15', estCost: '800000' },
    { id: 103, workId: 'WRK-2026-836', name: 'Village Water Tank', district: 'Bilaspur', startDate: '2026-08-01', endDate: '2027-02-01', estCost: '2200000' },
  ]);

  const [demands, setDemands] = useState([
    { id: 1, workId: 'WRK-2026-800', name: 'Road Development Ward 4', amountRequested: '500000', submittedTo: 'Janpad', status: 'Pending' },
    { id: 2, workId: 'WRK-2026-801', name: 'Panchayat Solar Expansion', amountRequested: '250000', submittedTo: 'CEO Jila Panchayat', status: 'Approved' },
    { id: 3, workId: 'WRK-2026-802', name: 'Rural Dispensary Block A', amountRequested: '850000', submittedTo: 'Janpad', status: 'Pending' },
    { id: 4, workId: 'WRK-2026-803', name: 'Connecting Road Bridge', amountRequested: '1200000', submittedTo: 'CEO Jila Panchayat', status: 'Rejected' },
    { id: 5, workId: 'WRK-2026-804', name: 'Primary Health Center', amountRequested: '600000', submittedTo: 'Janpad', status: 'Pending' },
    { id: 6, workId: 'WRK-2026-805', name: 'Community Pond Digging', amountRequested: '150000', submittedTo: 'CEO Jila Panchayat', status: 'Approved' },
  ]);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    startDate: '', endDate: '', estimatedCost: '', requestTo: ''
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(demands.length / itemsPerPage);
  const currentData = demands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // Determine Approval Routing based on Role
  let approvalOptions = [];
  if (userRole === 'Gram Panchayat') {
    approvalOptions = ['Janpad', 'CEO Jila Panchayat'];
  } else if (userRole === 'Janpad') {
    approvalOptions = ['CEO Jila Panchayat'];
  } // If CEO, the array is empty, and we will hide the field.

  // Handlers
  const handleSearchSelect = (project) => {
    setSelectedProject(project);
    setFormData({
      startDate: project.startDate,
      endDate: project.endDate,
      estimatedCost: project.estCost,
      requestTo: ''
    });
    setView('form');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Ensure routing is selected if required
    if (approvalOptions.length > 0 && !formData.requestTo) {
      alert('Please select where you want to send this request.');
      return;
    }

    const newDemand = {
      id: Date.now(),
      workId: selectedProject.workId,
      name: selectedProject.name,
      amountRequested: formData.estimatedCost,
      submittedTo: approvalOptions.length === 0 ? 'Self (CEO)' : formData.requestTo,
      status: 'Submitted'
    };

    setDemands([newDemand, ...demands]);
    setCurrentPage(1); // Reset to page 1 to see the new demand
    showToast('Demand Request Submitted Successfully!');
    setView('list');
    setSelectedProject(null);
    setSearchQuery('');
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-sm";

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Toast Notification (Moved to bottom-10 to avoid header overlay issues) */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
          <div className="bg-white px-6 py-4 rounded-full shadow-2xl border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span className="font-bold text-slate-800">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Demand Creation</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Initiate and track fund demand requests for approved projects.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('search')} 
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Create Demand
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setSelectedProject(null); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            Cancel ✕
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST DEMANDS (WITH PAGINATION) */}
      {/* ======================================================= */}
      {view === 'list' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Project Name</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Est. Cost (₹)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Requested To</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No demands created yet.</td></tr>
                ) : (
                  currentData.map((demand) => (
                    <tr key={demand.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                      <td className="px-6 py-5 font-mono font-bold text-slate-700">{demand.workId}</td>
                      <td className="px-6 py-5 font-bold text-slate-900">{demand.name}</td>
                      <td className="px-6 py-5 font-black text-[#451db3]">₹{parseInt(demand.amountRequested).toLocaleString()}</td>
                      <td className="px-6 py-5 font-medium text-slate-600">{demand.submittedTo}</td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          demand.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' :
                          demand.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {demand.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, demands.length)}</span> of <span className="text-[#451db3]">{demands.length}</span>
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white hover:border-[#451db3] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              >
                Prev
              </button>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#451db3]/10 text-[#451db3] font-black text-xs">
                {currentPage}
              </div>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white hover:border-[#451db3] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: SEARCH PROJECT */}
      {/* ======================================================= */}
      {view === 'search' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500">
          <h3 className="text-xl font-black text-slate-800 mb-2">Search Project</h3>
          <p className="text-sm font-medium text-slate-500 mb-8">Search by Work ID or Project Name to initiate a demand.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-full sm:w-1/3 space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">District</label>
              <input type="text" disabled value="Bilaspur" className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Search Query</label>
              <input 
                type="text" 
                placeholder="Enter Work ID or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-3">
            {availableProjects
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.workId.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(proj => (
              <div key={proj.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-5 rounded-2xl hover:border-[#451db3]/30 hover:shadow-md transition-all gap-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{proj.name}</h4>
                  <p className="text-xs font-black text-[#451db3] font-mono tracking-wider mt-1">{proj.workId}</p>
                </div>
                <button 
                  onClick={() => handleSearchSelect(proj)}
                  className="px-6 py-2.5 rounded-full bg-[#451db3]/10 text-[#451db3] text-xs font-black uppercase tracking-widest hover:bg-[#451db3] hover:text-white transition-all shrink-0"
                >
                  Select Project
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: DEMAND FORM */}
      {/* ======================================================= */}
      {view === 'form' && selectedProject && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-xl font-black text-slate-800">Demand Request Form</h3>
            <div className="mt-4 bg-[#451db3]/5 border border-[#451db3]/20 rounded-2xl p-5">
              <p className="text-xs font-black text-[#451db3] uppercase tracking-widest">Selected Project</p>
              <p className="text-lg font-bold text-slate-800 mt-1">{selectedProject.name} <span className="text-slate-400 font-medium">({selectedProject.workId})</span></p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Start Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" required 
                  value={formData.startDate} 
                  onChange={e => setFormData({...formData, startDate: e.target.value})} 
                  className={inputClass} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">End Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" required 
                  value={formData.endDate} 
                  onChange={e => setFormData({...formData, endDate: e.target.value})} 
                  className={inputClass} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Estimated Total Costing (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" required 
                  value={formData.estimatedCost} 
                  onChange={e => setFormData({...formData, estimatedCost: e.target.value})} 
                  className={inputClass} 
                />
              </div>

              {/* Conditional Routing Dropdown based on Role */}
              {approvalOptions.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Submit Request To <span className="text-red-500">*</span></label>
                  <CustomDropdown 
                    placeholder="Select Approving Authority" 
                    value={formData.requestTo} 
                    onChange={v => setFormData({...formData, requestTo: v})} 
                    options={approvalOptions} 
                  />
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setView('search')} 
                className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Back to Search
              </button>
              
              <button 
                type="submit" 
                className="px-10 py-3.5 rounded-full bg-green-500 text-white text-sm font-bold shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:bg-green-600 hover:-translate-y-0.5 transition-all"
              >
                Submit Demand Request ✓
              </button>
            </div>
          </form>

        </div>
      )}

    </div>
  );
}