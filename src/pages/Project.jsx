import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

// --- REUSABLE FILE INPUT ---
const FileInput = ({ label, onChange, disabled, required, accept = "*", placeholder = "Choose Document..." }) => (
  <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative flex items-center">
      <input type="file" accept={accept} onChange={onChange} disabled={disabled} required={required} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white/50 text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20 shadow-sm">
        <span className="truncate">{placeholder}</span>
        <span className="bg-[#451db3]/10 text-[#451db3] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm uppercase">Browse</span>
      </div>
    </div>
  </div>
);

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
const DocStatus = ({ label, available }) => (
  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
    <span className="text-xs font-bold text-slate-700">{label}</span>
    {available ? (
      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Available</span>
    ) : (
      <span className="bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Missing</span>
    )}
  </div>
);

export default function Project() {
  const navigate = useNavigate(); 
  const { userRole } = useOutletContext(); 

  // View States
  const [view, setView] = useState('list'); // 'list' | 'form' | 'details'
  const [activeProject, setActiveProject] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter States
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFinYear, setFilterFinYear] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  // Form State
  const [formData, setFormData] = useState({
    district: 'Bilaspur', workName: '', sector: '', subSector: '', relatedDepartment: '', proposedBy: '', financialYear: '', 
    executingDepartment: '', executingAgency: '', estimatedAmount: '', workPriority: '', remarks: '',
    proposalLetterNo: '', proposalDate: '', duration: '',
    docs: { ts: false, as: false, uc: false, cc: false, geo: false, layout: false, map: false, khasra: false, gpProposal: false, sitePlan: false, additional: false, proposalLetter: false, finalProposal: false }
  });
  const [geoTagData, setGeoTagData] = useState(null);

  // Expanded Mock Data to support all view fields
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-834', workName: 'Sample Community Hall', district: 'Bilaspur', sector: 'Welfare', subSector: 'Community Dev', relatedDepartment: 'Janpad', proposedBy: 'Sarpanch', financialYear: '2025-2026', estimatedAmount: 1500000, executingDepartment: 'RES', executingAgency: 'BuildTech Corp', workPriority: 'High', remarks: 'Needs immediate attention before monsoon.', proposalLetterNo: 'PR-2025-001', proposalDate: '2025-01-15', duration: '120', docs: { ts: true, as: true, uc: false, cc: false, geo: true, proposalLetter: true, map: true } },
    { id: 2, workId: 'WRK-2026-835', workName: 'Primary School Renovation', district: 'Bilaspur', sector: 'Education', subSector: 'Maintenance', relatedDepartment: 'CEO Jila Panchayat', proposedBy: 'MLA', financialYear: '2025-2026', estimatedAmount: 800000, executingDepartment: 'PWD', executingAgency: 'EduBuild Pvt', workPriority: 'Medium', remarks: '', proposalLetterNo: 'PR-2025-089', proposalDate: '2025-02-10', duration: '90', docs: { ts: true, as: true, uc: true, cc: false, geo: true, proposalLetter: true, map: false } },
    { id: 3, workId: 'WRK-2026-836', workName: 'Village Water Tank', district: 'Bilaspur', sector: 'Infrastructure', subSector: 'Water Supply', relatedDepartment: 'Gram Panchayat', proposedBy: 'Gram Panchayat', financialYear: '2026-2027', estimatedAmount: 2200000, executingDepartment: 'PHE', executingAgency: 'AquaFlow Ind', workPriority: 'High', remarks: 'Critical water shortage area.', proposalLetterNo: 'PR-2026-003', proposalDate: '2026-04-05', duration: '180', docs: { ts: false, as: false, uc: false, cc: false, geo: false, proposalLetter: true, map: true } }
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Reset pagination to page 1 whenever a filter changes
  useEffect(() => { setCurrentPage(1); }, [filterDepartment, filterFinYear, filterSector]);

  // 1. Filter Logic
  const filteredProjects = projects.filter(proj => {
    const matchDepartment = filterDepartment === '' || proj.relatedDepartment === filterDepartment;
    const matchFinYear = filterFinYear === '' || proj.financialYear === filterFinYear;
    const matchSector = filterSector === '' || proj.sector === filterSector;
    return matchDepartment && matchFinYear && matchSector;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Dropdown Options
  const uniqueFinYears = [...new Set(projects.map(p => p.financialYear))];
  const uniqueSectors = [...new Set(projects.map(p => p.sector))];
  const uniqueDepartments = [...new Set(projects.map(p => p.relatedDepartment))];
  const proposalAuthorities = ['CEO Jila Panchayat', 'BDO', 'Sarpanch', 'MLA', 'MP', 'Gram Panchayat', 'Janpad'];

  // --- HANDLERS ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, docs: { ...prev.docs, geo: true } }));
      setGeoTagData('Extracting GPS coordinates...');
      setTimeout(() => setGeoTagData('📍 Lat: 22.0796, Long: 82.1391 (LOCKED)'), 1500);
    }
  };

  const handleDocUpload = (docKey, file) => {
    if (file) {
      setFormData(prev => ({ ...prev, docs: { ...prev.docs, [docKey]: true } }));
    }
  };

  const handleViewDetails = (project) => {
    setActiveProject(project);
    setView('details');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.proposedBy) { alert("Please select who proposed this project."); return; }
    if (!formData.docs.geo) { alert("Base Geo-Tag Photo is strictly required to establish the project geofence."); return; }
    
    const newProject = {
      id: Date.now(),
      workId: `WRK-2026-${Math.floor(Math.random() * 900) + 100}`,
      workName: formData.workName,
      district: formData.district,
      sector: formData.sector,
      subSector: formData.subSector,
      relatedDepartment: formData.relatedDepartment,
      proposedBy: formData.proposedBy,
      financialYear: formData.financialYear,
      estimatedAmount: parseFloat(formData.estimatedAmount),
      executingDepartment: formData.executingDepartment,
      executingAgency: formData.executingAgency,
      workPriority: formData.workPriority,
      remarks: formData.remarks,
      proposalLetterNo: formData.proposalLetterNo,
      proposalDate: formData.proposalDate,
      duration: formData.duration,
      docs: formData.docs
    };

    setProjects([newProject, ...projects]);
    setView('list');
    setFormData({ district: 'Bilaspur', workName: '', sector: '', subSector: '', relatedDepartment: '', proposedBy: '', financialYear: '', executingDepartment: '', executingAgency: '', estimatedAmount: '', workPriority: '', remarks: '', proposalLetterNo: '', proposalDate: '', duration: '', docs: { ts: false, as: false, uc: false, cc: false, geo: false, layout: false, map: false, khasra: false, gpProposal: false, sitePlan: false, additional: false, proposalLetter: false, finalProposal: false } });
    setGeoTagData(null);
    setCurrentPage(1);
    showToast('New Project successfully registered and geofenced ✓');
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
          <div className={`px-6 py-4 rounded-full shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <span className="font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-40">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">
            {view === 'list' && 'Project Management'}
            {view === 'form' && 'Initiate New Project'}
            {view === 'details' && 'Project Details View'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {view === 'list' && 'View, filter, and initiate all active projects across departments.'}
            {view === 'form' && 'Enter master details to register a new project into the system.'}
            {view === 'details' && `Comprehensive view for ${activeProject?.workId}`}
          </p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')} 
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + New Project
          </button>
        ) : (
          <button 
            onClick={() => setView('list')} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST PROJECTS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 ml-2">Filters</span>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <CustomDropdown placeholder="All Departments" value={filterDepartment} onChange={setFilterDepartment} options={uniqueDepartments} />
              <CustomDropdown placeholder="All Financial Years" value={filterFinYear} onChange={setFilterFinYear} options={uniqueFinYears} />
              <CustomDropdown placeholder="All Sectors" value={filterSector} onChange={setFilterSector} options={uniqueSectors} />
            </div>
            {(filterDepartment || filterFinYear || filterSector) && (
              <button 
                onClick={() => { setFilterDepartment(''); setFilterFinYear(''); setFilterSector(''); }}
                className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-5 py-3.5 rounded-full transition-all shrink-0 bg-red-50 shadow-sm"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden z-10 relative">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Name</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sector / Sub</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Related Dept</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Fin. Year</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Est. Amount</th>
                    <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="8" className="px-8 py-12 text-center text-slate-500 font-bold">No projects match the selected filters.</td></tr>
                  ) : (
                    currentData.map((proj, index) => (
                      <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-4 font-bold text-slate-500 align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-700 align-middle">{proj.workId}</td>
                        <td className="px-5 py-4 font-bold text-slate-900 align-middle">{proj.workName}</td>
                        <td className="px-5 py-4 align-middle">
                          <p className="font-bold text-slate-700">{proj.sector}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase">{proj.subSector}</p>
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-slate-600 border border-slate-200 group-hover:border-[#451db3]/30 group-hover:text-[#451db3] transition-colors">
                            {proj.relatedDepartment}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700 align-middle">{proj.financialYear}</td>
                        <td className="px-5 py-4 font-black text-[#451db3] align-middle">{formatCurrency(proj.estimatedAmount)}</td>
                        <td className="px-5 py-4 text-center align-middle">
                          <button 
                            onClick={() => handleViewDetails(proj)}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-[#451db3] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
      {/* VIEW: PROJECT DETAILS */}
      {/* ======================================================= */}
      {view === 'details' && activeProject && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-10">
          
          <div className="border-b border-[#451db3]/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#451db3]/5 p-6 rounded-3xl">
            <div>
              <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Project Master File</p>
              <h3 className="text-3xl font-black text-slate-900">{activeProject.workName}</h3>
              <p className="text-sm font-bold text-slate-500 font-mono mt-2">{activeProject.workId} • {activeProject.financialYear}</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-right min-w-[200px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Amount</p>
              <p className="text-3xl font-black text-[#451db3]">{formatCurrency(activeProject.estimatedAmount)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. General Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-6">
              <DetailItem label="District" value={activeProject.district} />
              <DetailItem label="Work Priority" value={activeProject.workPriority} />
              <DetailItem label="Sector" value={activeProject.sector} />
              <DetailItem label="Sub Sector" value={activeProject.subSector} />
              <DetailItem label="Related Dept" value={activeProject.relatedDepartment} />
              <DetailItem label="Proposed By" value={activeProject.proposedBy} />
              <DetailItem label="Proposal Date" value={activeProject.proposalDate} />
              <DetailItem label="Proposal Letter No" value={activeProject.proposalLetterNo} />
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Objective / Remarks</p>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">{activeProject.remarks || <span className="italic text-slate-400">No remarks provided.</span>}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Execution Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <DetailItem label="Executing Department" value={activeProject.executingDepartment} />
              <DetailItem label="Executing Agency" value={activeProject.executingAgency} />
              <DetailItem label="Duration (Days)" value={activeProject.duration} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">3. Documentation & Geofencing Status</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Geofence Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden lg:col-span-1 min-h-[200px]">
                {activeProject.docs?.geo ? (
                  <>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
                    <span className="text-4xl relative z-10 mb-2">📍</span>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">Geofence Active</p>
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
                <DocStatus label="Proposal Letter" available={activeProject.docs?.proposalLetter} />
                <DocStatus label="Technical Sanction (TS)" available={activeProject.docs?.ts} />
                <DocStatus label="Administrative Sanction (AS)" available={activeProject.docs?.as} />
                <DocStatus label="Utility Certificate (UC)" available={activeProject.docs?.uc} />
                <DocStatus label="Completion Certificate (CC)" available={activeProject.docs?.cc} />
                <DocStatus label="Map Document" available={activeProject.docs?.map} />
                <DocStatus label="Layout of Work" available={activeProject.docs?.layout} />
                <DocStatus label="Khasra B1" available={activeProject.docs?.khasra} />
                <DocStatus label="GP Prastav Proposal" available={activeProject.docs?.gpProposal} />
                <DocStatus label="Site Plan" available={activeProject.docs?.sitePlan} />
                <DocStatus label="Final Proposal Doc" available={activeProject.docs?.finalProposal} />
                <DocStatus label="Additional Docs" available={activeProject.docs?.additional} />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button onClick={() => setView('list')} className="px-10 py-4 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all">
              Close Details View
            </button>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: CREATE NEW PROJECT FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Initiate New Project</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Enter all master details, documents, and geofence data to register a new project.</p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-10">
            {/* --- SECTION 1: General Details --- */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. General Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Work / Project Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.workName} onChange={e => setFormData({...formData, workName: e.target.value})} placeholder="e.g. Primary School Renovation" className={inputClass} />
                </div>
                <div className="space-y-1.5 relative z-[60]">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposed By <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Authority" value={formData.proposedBy} onChange={(val) => setFormData({...formData, proposedBy: val})} options={proposalAuthorities} />
                </div>
                
                <div className="space-y-1.5 relative z-50">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Work Priority <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Priority" value={formData.workPriority} onChange={v => handleInputChange('workPriority', v)} options={['High (Immediate)', 'Medium', 'Low (Routine)']} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Estimated Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required placeholder="Total estimated cost" value={formData.estimatedAmount} onChange={e => handleInputChange('estimatedAmount', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">District</label>
                  <input type="text" disabled value={formData.district} className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </div>

                <div className="space-y-1.5 relative z-40">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sector</label>
                  <CustomDropdown placeholder="Select Sector" value={formData.sector} onChange={v => handleInputChange('sector', v)} options={['Health', 'Infrastructure', 'Education', 'Welfare']} />
                </div>
                <div className="space-y-1.5 relative z-30">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sub Sector</label>
                  <CustomDropdown placeholder="Select Sub Sector" value={formData.subSector} onChange={v => handleInputChange('subSector', v)} options={['Creation of Hospital', 'Creation of Park', 'Making of School', 'Road Development']} />
                </div>
                <div className="space-y-1.5 relative z-20">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Related Department</label>
                  <CustomDropdown placeholder="Select Department" value={formData.relatedDepartment} onChange={v => handleInputChange('relatedDepartment', v)} options={['CEO Jila Panchayat', 'Janpad', 'Gram Panchayat', 'PWD']} />
                </div>

                <div className="space-y-1.5 relative z-10">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Financial Year</label>
                  <CustomDropdown placeholder="Select Year" value={formData.financialYear} onChange={v => handleInputChange('financialYear', v)} options={['2025-2026', '2026-2027']} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposal Date</label>
                  <input type="date" value={formData.proposalDate} onChange={e => handleInputChange('proposalDate', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposal Letter No.</label>
                  <input type="text" placeholder="e.g. PR-2026-X" value={formData.proposalLetterNo} onChange={e => handleInputChange('proposalLetterNo', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1.5 mt-6">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Objective / Remarks</label>
                <textarea rows="3" placeholder="Brief description of the work objective..." value={formData.remarks} onChange={e => handleInputChange('remarks', e.target.value)} className={`${inputClass} rounded-2xl resize-none py-4`}></textarea>
              </div>
            </div>

            {/* --- SECTION 2: Execution Details --- */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Execution Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Executing Department</label>
                  <input type="text" required value={formData.executingDepartment} onChange={e => handleInputChange('executingDepartment', e.target.value)} placeholder="e.g. PWD" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Executing Agency</label>
                  <input type="text" required value={formData.executingAgency} onChange={e => handleInputChange('executingAgency', e.target.value)} placeholder="e.g. EduBuild Pvt" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Duration (Days)</label>
                  <input type="number" min="1" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} placeholder="e.g. 180" className={inputClass} />
                </div>
              </div>
            </div>

            {/* --- SECTION 3: Documentation --- */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">3. Documentation Setup</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FileInput label="Proposal Letter" accept=".pdf" onChange={e => handleDocUpload('proposalLetter', e.target.files[0])} />
                <FileInput label="Technical Sanction (TS)" accept=".pdf" onChange={e => handleDocUpload('ts', e.target.files[0])} />
                <FileInput label="Administrative Sanction (AS)" accept=".pdf" onChange={e => handleDocUpload('as', e.target.files[0])} />
                <FileInput label="Utility Certificate (UC)" accept=".pdf" onChange={e => handleDocUpload('uc', e.target.files[0])} />
                <FileInput label="Completion Certificate (CC)" accept=".pdf" onChange={e => handleDocUpload('cc', e.target.files[0])} />
                <FileInput label="Layout of Work Doc" accept=".pdf" onChange={e => handleDocUpload('layout', e.target.files[0])} />
                <FileInput label="Map Document" accept=".pdf" onChange={e => handleDocUpload('map', e.target.files[0])} />
                <FileInput label="Khasra B1 Document" accept=".pdf" onChange={e => handleDocUpload('khasra', e.target.files[0])} />
                <FileInput label="GP Prastav Proposal" accept=".pdf" onChange={e => handleDocUpload('gpProposal', e.target.files[0])} />
                <FileInput label="Site Plan Document" accept=".pdf" onChange={e => handleDocUpload('sitePlan', e.target.files[0])} />
                <FileInput label="Final Proposal Document" accept=".pdf" onChange={e => handleDocUpload('finalProposal', e.target.files[0])} />
                <FileInput label="Additional Documents" accept=".pdf" onChange={e => handleDocUpload('additional', e.target.files[0])} />
              </div>
            </div>

            {/* --- SECTION 4: Geofencing --- */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">4. Strict Location Geofencing</h4>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm">
                <span className="text-4xl text-red-500 mt-1">⚠️</span>
                <div>
                  <h5 className="text-red-700 font-black uppercase tracking-widest mb-2">Crucial Registration Step</h5>
                  <p className="text-sm font-bold text-red-600/80 leading-relaxed">
                    The GPS coordinates captured below will be <span className="text-red-700 font-black border-b border-red-300">permanently registered</span> as the official project site. Without a GPS match in the future, all updates will be blocked by the system.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 md:w-1/2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Initial Site Geo-Tag Photo <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input type="file" accept="image/*" capture="environment" required onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full flex items-center justify-between px-5 py-4 rounded-full border-2 ${formData.docs.geo ? 'border-emerald-400 bg-emerald-50' : 'border-red-200 bg-white'} text-sm font-bold text-slate-500 transition-all shadow-sm`}>
                    <span className={`truncate ${formData.docs.geo ? 'text-emerald-700' : ''}`}>{formData.docs.geo ? `Location Captured Successfully` : 'Tap to Open Camera & Capture Location...'}</span>
                    <span className="text-2xl">{formData.docs.geo ? '✅' : '📸'}</span>
                  </div>
                </div>
                {geoTagData && <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest pl-4 mt-2 animate-pulse">{geoTagData}</p>}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button" 
                onClick={() => setView('list')} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel Creation
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Register & Geofence Project ✓
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}