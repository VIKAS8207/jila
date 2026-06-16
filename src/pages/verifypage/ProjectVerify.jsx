import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

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

// --- REUSABLE DETAIL POINT ---
const DetailItem = ({ label, value, highlight = false }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm ${highlight ? 'font-black text-[#451db3]' : 'font-bold text-slate-800'}`}>
      {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
    </p>
  </div>
);

// --- REUSABLE DOC STATUS ITEM ---
const DocStatus = ({ label, available, required = false }) => (
  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
    <span className="text-xs font-bold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</span>
    {available ? (
      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Available ✓</span>
    ) : (
      <span className="bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Missing ✕</span>
    )}
  </div>
);

export default function ProjectVerify() {
  const { userRole } = useOutletContext(); 

  // View States
  const [view, setView] = useState('list'); // 'list' | 'review'
  const [activeProject, setActiveProject] = useState(null);
  
  // Verification States
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, actionType: '' });

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFinYear, setFilterFinYear] = useState('');
  const [filterSector, setFilterSector] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  // Mock Database: Projects pending CEO Verification (Expanded with requested details)
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-901', workName: 'Sector 4 Water Purification', district: 'Bilaspur', sector: 'Infrastructure', subSector: 'Water Supply', relatedDepartment: 'Janpad', proposedBy: 'Janpad', financialYear: '2026-2027', estCost: 1500000, executingDepartment: 'PHE', executingAgency: 'AquaFlow Ind', workPriority: 'High', remarks: 'Critical water shortage reported.', proposalLetterNo: 'PR-2026-045', proposalDate: '2026-05-10', duration: '180', status: 'Pending Verification', docs: { proposalLetter: true, ts: true, as: true, uc: false, cc: false, layout: true, map: true, khasra: false, gpProposal: false, sitePlan: true, finalProposal: false, additional: false, geo: true } },
    { id: 2, workId: 'WRK-2026-902', workName: 'Rural High School Addition', district: 'Bilaspur', sector: 'Education', subSector: 'Construction', relatedDepartment: 'Gram Panchayat', proposedBy: 'Gram Panchayat', financialYear: '2026-2027', estCost: 2800000, executingDepartment: 'PWD', executingAgency: 'EduBuild Pvt', workPriority: 'Medium', remarks: 'Adding 4 new classrooms.', proposalLetterNo: 'PR-2026-112', proposalDate: '2026-06-01', duration: '240', status: 'Pending Verification', docs: { proposalLetter: true, ts: true, as: false, uc: false, cc: false, layout: true, map: false, khasra: true, gpProposal: true, sitePlan: false, finalProposal: true, additional: true, geo: true } },
    { id: 3, workId: 'WRK-2026-903', workName: 'Community Dispensary Block C', district: 'Bilaspur', sector: 'Health', subSector: 'Medical', relatedDepartment: 'Janpad', proposedBy: 'Janpad', financialYear: '2025-2026', estCost: 950000, executingDepartment: 'CGMSC', executingAgency: 'MediCorp Builders', workPriority: 'High', remarks: 'Sanctioned for immediate release.', proposalLetterNo: 'PR-2025-88', proposalDate: '2025-11-20', duration: '90', status: 'Approved', docs: { proposalLetter: true, ts: true, as: true, uc: true, cc: true, layout: false, map: true, khasra: false, gpProposal: true, sitePlan: true, finalProposal: true, additional: false, geo: true } },
    { id: 4, workId: 'WRK-2026-904', workName: 'Panchayat Connecting Road', district: 'Bilaspur', sector: 'Infrastructure', subSector: 'Roads', relatedDepartment: 'Gram Panchayat', proposedBy: 'Gram Panchayat', financialYear: '2026-2027', estCost: 3200000, executingDepartment: 'PWD', executingAgency: 'Roadways Ltd', workPriority: 'Medium', remarks: 'Budget exceeds district phase limits. Reduce scope.', proposalLetterNo: 'PR-2026-002', proposalDate: '2026-01-15', duration: '300', status: 'Rejected', docs: { proposalLetter: true, ts: false, as: false, uc: false, cc: false, layout: false, map: false, khasra: true, gpProposal: false, sitePlan: false, finalProposal: false, additional: false, geo: true } },
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartment, filterFinYear, filterSector]);

  const filteredProjects = projects.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = p.workName.toLowerCase().includes(searchLower) || p.workId.toLowerCase().includes(searchLower);
    const matchesDept = filterDepartment === '' || p.relatedDepartment === filterDepartment;
    const matchesFinYear = filterFinYear === '' || p.financialYear === filterFinYear;
    const matchesSector = filterSector === '' || p.sector === filterSector;
    
    return matchesSearch && matchesDept && matchesFinYear && matchesSector;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Dropdown Extraction
  const uniqueFinYears = [...new Set(projects.map(p => p.financialYear))];
  const uniqueSectors = [...new Set(projects.map(p => p.sector))];
  const uniqueDepartments = [...new Set(projects.map(p => p.relatedDepartment))];

  // --- ACTIONS ---
  const handleOpenReview = (project) => {
    setActiveProject(project);
    setRemarks('');
    setView('review');
  };

  const handleActionClick = (actionType) => {
    if (actionType === 'Rejected' && !remarks.trim()) {
      alert("Remarks are mandatory when rejecting a project.");
      return;
    }
    setConfirmModal({ show: true, actionType });
  };

  const executeVerification = () => {
    const { actionType } = confirmModal;
    
    setProjects(projects.map(p => 
      p.id === activeProject.id ? { ...p, status: actionType, remarks: remarks } : p
    ));

    setConfirmModal({ show: false, actionType: '' });
    showToast(`Project ${actionType} Successfully!`, actionType === 'Approved' ? 'success' : 'error');
    setView('list');
    setActiveProject(null);
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  return (
    <div className="space-y-6 pb-10 relative w-full">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
          <div className={`px-6 py-4 rounded-full shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.actionType === 'Approved' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
              <span className="text-3xl font-black">!</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Confirm Decision</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              You are about to officially mark this project as: <br/><span className={`font-black text-lg ${confirmModal.actionType === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{confirmModal.actionType}</span>
            </p>
            
            <div className="flex gap-4 w-full">
              <button onClick={() => setConfirmModal({ show: false, actionType: '' })} className="flex-1 py-3.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={executeVerification} className={`flex-1 py-3.5 rounded-full text-white font-bold transition-all shadow-md ${confirmModal.actionType === 'Approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-40">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Project Verification Hub</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review full proposal details to approve or reject new projects.</p>
        </div>
        {view === 'review' && (
          <button 
            onClick={() => setView('list')} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST PENDING PROJECTS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 ml-2 hidden md:block">Search & Filters</span>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <input 
                type="text" 
                placeholder="Search Work ID or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass} 
              />
              <CustomDropdown placeholder="All Departments" value={filterDepartment} onChange={setFilterDepartment} options={uniqueDepartments} />
              <CustomDropdown placeholder="All Financial Years" value={filterFinYear} onChange={setFilterFinYear} options={uniqueFinYears} />
              <CustomDropdown placeholder="All Sectors" value={filterSector} onChange={setFilterSector} options={uniqueSectors} />
            </div>

            {(searchQuery || filterDepartment || filterFinYear || filterSector) && (
              <button 
                onClick={() => { setSearchQuery(''); setFilterDepartment(''); setFilterFinYear(''); setFilterSector(''); }}
                className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-5 py-3.5 rounded-full transition-all shrink-0 bg-red-50 shadow-sm"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-12">S.No</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Name</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sector</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sub Sector</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Related Dept</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Est. Cost (₹)</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Source of Proposal</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Fin. Year</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Exec. Dept</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="11" className="px-8 py-12 text-center text-slate-500 font-bold">No projects match your search.</td></tr>
                  ) : (
                    currentData.map((proj, index) => (
                      <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-5 py-5 font-bold text-slate-500 align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-5 font-mono font-bold text-slate-700 align-middle">{proj.workId}</td>
                        <td className="px-5 py-5 font-black text-slate-900 text-sm align-middle">{proj.workName}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{proj.sector}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{proj.subSector}</td>
                        <td className="px-5 py-5 align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-slate-600 border border-slate-200 group-hover:border-[#451db3]/30 group-hover:text-[#451db3] transition-colors">
                            {proj.relatedDepartment}
                          </span>
                        </td>
                        <td className="px-5 py-5 font-black text-[#451db3] text-sm align-middle">{formatCurrency(proj.estCost)}</td>
                        <td className="px-5 py-5 font-bold text-slate-700 align-middle">{proj.proposedBy}</td>
                        <td className="px-5 py-5 font-bold text-slate-700 align-middle">{proj.financialYear}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{proj.executingDepartment}</td>
                        <td className="px-5 py-5 text-center align-middle">
                          {proj.status === 'Pending Verification' ? (
                            <button 
                              onClick={() => handleOpenReview(proj)}
                              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-[10px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-md whitespace-nowrap"
                            >
                              Review
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenReview(proj)}
                              className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-[#451db3] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm whitespace-nowrap"
                            >
                              View Details
                            </button>
                          )}
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="text-[#451db3]">{filteredProjects.length}</span>
              </p>
              <div className="flex items-center gap-3">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white disabled:opacity-50 transition-all shadow-sm">Prev</button>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#451db3]/10 text-[#451db3] font-black text-xs">{currentPage}</div>
                <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white disabled:opacity-50 transition-all shadow-sm">Next</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================================================= */}
      {/* VIEW: COMPREHENSIVE REVIEW & VERIFY DETAILS */}
      {/* ======================================================= */}
      {view === 'review' && activeProject && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-10">
          
          <div className="border-b border-[#451db3]/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#451db3]/5 p-6 rounded-3xl">
            <div>
              <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Proposal Review Master</p>
              <h3 className="text-3xl font-black text-slate-900">{activeProject.workName}</h3>
              <p className="text-sm font-bold text-slate-500 font-mono mt-2">{activeProject.workId}</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-right min-w-[200px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Amount</p>
              <p className="text-3xl font-black text-[#451db3]">{formatCurrency(activeProject.estCost)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DetailItem label="Proposed By *" value={activeProject.proposedBy} />
            <DetailItem label="Work Priority *" value={activeProject.workPriority} />
            <DetailItem label="District (Auto)" value={activeProject.district} />
            <DetailItem label="Sector" value={activeProject.sector} />
            <DetailItem label="Sub Sector" value={activeProject.subSector} />
            <DetailItem label="Related Department" value={activeProject.relatedDepartment} />
            <DetailItem label="Financial Year" value={activeProject.financialYear} />
            <DetailItem label="Proposal Date" value={activeProject.proposalDate} />
            <DetailItem label="Proposal Letter No." value={activeProject.proposalLetterNo} />
            <DetailItem label="Executing Department *" value={activeProject.executingDepartment} />
            <DetailItem label="Executing Agency *" value={activeProject.executingAgency} />
            <DetailItem label="Duration (Days)" value={activeProject.duration} />
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Objective / Remarks Provided</p>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">{activeProject.remarks || <span className="italic text-slate-400">No original remarks provided.</span>}</p>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Documentation & Geofencing Status</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Geofence Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden lg:col-span-1 min-h-[200px]">
                {activeProject.docs?.geo ? (
                  <>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
                    <span className="text-4xl relative z-10 mb-2">📍</span>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">Initial Site Geo-Tag Photo *</p>
                    <p className="text-[10px] font-bold text-emerald-600 font-mono mt-2 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 relative z-10 shadow-sm">Lat: 22.0796, Long: 82.1391</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl text-slate-300 mb-2">🚫</span>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Geo-Tag Registered</p>
                  </>
                )}
              </div>

              {/* Documentation List */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DocStatus label="Proposal Letter" required={true} available={activeProject.docs?.proposalLetter} />
                <DocStatus label="Technical Sanction (TS)" required={true} available={activeProject.docs?.ts} />
                <DocStatus label="Administrative Sanction (AS)" available={activeProject.docs?.as} />
                <DocStatus label="Utility Certificate (UC)" available={activeProject.docs?.uc} />
                <DocStatus label="Completion Certificate (CC)" available={activeProject.docs?.cc} />
                <DocStatus label="Layout of Work Doc" available={activeProject.docs?.layout} />
                <DocStatus label="Map Document" available={activeProject.docs?.map} />
                <DocStatus label="Khasra B1 Document" available={activeProject.docs?.khasra} />
                <DocStatus label="GP Prastav Proposal" available={activeProject.docs?.gpProposal} />
                <DocStatus label="Site Plan Document" available={activeProject.docs?.sitePlan} />
                <DocStatus label="Final Proposal Document" available={activeProject.docs?.finalProposal} />
                <DocStatus label="Additional Documents" available={activeProject.docs?.additional} />
              </div>
            </div>
          </div>

          {/* Section 4: Final CEO Verification Action */}
          {activeProject.status === 'Pending Verification' && (
            <div className="space-y-8 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] mt-12">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Official Verification Action</h4>
              
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Executive Remarks / Justification <span className="text-red-500">*</span></label>
                <textarea 
                  rows="4" 
                  placeholder="Enter mandatory remarks for approval or rejection (e.g. Budget approved for phase 1...)"
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                  className={`${inputClass} rounded-3xl resize-none py-4`}
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => handleActionClick('Rejected')}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                >
                  Reject Proposal ✕
                </button>
                <button 
                  type="button" 
                  onClick={() => handleActionClick('Approved')}
                  className="w-full sm:w-auto px-12 py-4 rounded-full bg-emerald-500 text-white text-sm font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
                >
                  Approve Project ✓
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}