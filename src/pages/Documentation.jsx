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

export default function Documentation() {
  const { userRole } = useOutletContext();
  
  const isEngineerRole = userRole === 'Engineer' || userRole === 'Sub-Engineer';

  const [currentView, setCurrentView] = useState('list'); // 'list', 'upload', 'view'
  const [activeProject, setActiveProject] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFinYear, setFilterFinYear] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock Database 
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-800', projectName: 'Sample Community Hall', relatedDepartment: 'Janpad', financialYear: '2025-2026', sector: 'Welfare', docs: { ts: true, patvari: true, admin: true, other: false } },
    { id: 2, workId: 'WRK-2026-801', projectName: 'Primary School Renovation', relatedDepartment: 'CEO Jila Panchayat', financialYear: '2025-2026', sector: 'Education', docs: { ts: true, patvari: false, admin: false, other: true } },
    { id: 3, workId: 'WRK-2026-802', projectName: 'Road Construction Ward 45', relatedDepartment: 'Gram Panchayat', financialYear: '2026-2027', sector: 'Infrastructure', docs: { ts: false, patvari: false, admin: false, other: false } },
    { id: 4, workId: 'WRK-2026-803', projectName: 'Village Dispensary Unit', relatedDepartment: 'Janpad', financialYear: '2025-2026', sector: 'Health', docs: { ts: true, patvari: true, admin: true, other: true } },
    { id: 5, workId: 'WRK-2026-804', projectName: 'Panchayat Solar Grid', relatedDepartment: 'Gram Panchayat', financialYear: '2026-2027', sector: 'Infrastructure', docs: { ts: true, patvari: true, admin: false, other: false } },
  ]);

  // Upload Form State
  const [uploadData, setUploadData] = useState({ ts: false, patvari: false, admin: false, other: false });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Reset pagination when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterDepartment, filterFinYear, filterSector]);

  // Handle Search Filtering
  const filteredProjects = projects.filter(proj => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = proj.projectName.toLowerCase().includes(searchLower) || proj.workId.toLowerCase().includes(searchLower);
    const matchDept = filterDepartment === '' || proj.relatedDepartment === filterDepartment;
    const matchFinYear = filterFinYear === '' || proj.financialYear === filterFinYear;
    const matchSector = filterSector === '' || proj.sector === filterSector;
    
    return matchSearch && matchDept && matchFinYear && matchSector;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Dropdown Extraction
  const uniqueFinYears = [...new Set(projects.map(p => p.financialYear))];
  const uniqueSectors = [...new Set(projects.map(p => p.sector))];
  const uniqueDepartments = [...new Set(projects.map(p => p.relatedDepartment))];

  // Navigation Handlers
  const handleOpenUpload = (project) => { 
    setActiveProject(project); 
    setUploadData({ ts: project.docs.ts, patvari: project.docs.patvari, admin: project.docs.admin, other: project.docs.other });
    setCurrentView('upload'); 
  };
  const handleOpenView = (project) => { setActiveProject(project); setCurrentView('view'); };
  const handleBackToList = () => { setActiveProject(null); setCurrentView('list'); };

  // Form Submissions
  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          docs: {
            ts: uploadData.ts,
            patvari: uploadData.patvari,
            admin: uploadData.admin,
            other: uploadData.other
          }
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    showToast('Documents uploaded successfully.');
    handleBackToList();
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
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

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">Documentation Control</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage, verify, and track technical and administrative files.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
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

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                <tr>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-12">S.No</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Project Name</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Tech Sanction</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">B1 Patvari</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Admin Sanction</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Other Doc</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr><td colSpan="8" className="px-8 py-12 text-center text-slate-500 font-bold">No projects match your search.</td></tr>
                ) : (
                  currentData.map((proj, index) => {
                    // Helper to render download button or dash
                    const renderDocCell = (hasDoc) => (
                      <td className="px-5 py-5 text-center align-middle">
                        {hasDoc ? (
                          <button onClick={() => showToast('Downloading document...', 'success')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                            Download
                          </button>
                        ) : (
                          <span className="text-slate-300 font-bold text-lg">-</span>
                        )}
                      </td>
                    );

                    return (
                      <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-5 font-bold text-slate-500 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-5 py-5 align-middle">
                          <p className="font-black text-slate-900">{proj.projectName}</p>
                        </td>
                        <td className="px-5 py-5 font-mono font-bold text-slate-700 align-middle">{proj.workId}</td>
                        
                        {renderDocCell(proj.docs.ts)}
                        {renderDocCell(proj.docs.patvari)}
                        {renderDocCell(proj.docs.admin)}
                        {renderDocCell(proj.docs.other)}

                        <td className="px-5 py-5 text-center align-middle space-x-3 whitespace-nowrap">
                          {isEngineerRole ? (
                            <button 
                              onClick={() => handleOpenUpload(proj)} 
                              className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white hover:-translate-y-0.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md"
                            >
                              Upload Docs
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenView(proj)} 
                              className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-[#451db3] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
      </div>
    );
  }

  // --- RENDER: UPLOAD VIEW ---
  if (currentView === 'upload') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-50">
          <div>
            <button onClick={handleBackToList} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#451db3] transition-colors mb-2 block">← Cancel Upload</button>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Upload Documents</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">For Project: <span className="font-bold text-[#451db3]">{activeProject.projectName}</span></p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          <form onSubmit={handleFileUploadSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Technical Sanction (TS)</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Required PDF Document</p>
                  </div>
                  {uploadData.ts && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>}
                </div>
                <FileInput label="" accept=".pdf" onChange={() => setUploadData({...uploadData, ts: true})} placeholder="Select TS Document" />
              </div>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Patvari B1</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Land Record PDF</p>
                  </div>
                  {uploadData.patvari && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>}
                </div>
                <FileInput label="" accept=".pdf" onChange={() => setUploadData({...uploadData, patvari: true})} placeholder="Select B1 Document" />
              </div>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Administrative Sanction</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Official Approval Document</p>
                  </div>
                  {uploadData.admin && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>}
                </div>
                <FileInput label="" accept=".pdf" onChange={() => setUploadData({...uploadData, admin: true})} placeholder="Select Admin Sanction Document" />
              </div>

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Other Document</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Additional Required Files</p>
                  </div>
                  {uploadData.other && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>}
                </div>
                <FileInput label="" accept=".pdf" onChange={() => setUploadData({...uploadData, other: true})} placeholder="Select Other Document" />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button type="submit" className="w-full sm:w-auto px-12 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#451db3] to-[#5b2bd9] rounded-full hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(69,29,179,0.25)]">
                Save & Update Documents ✓
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: VIEW VIEW ---
  if (currentView === 'view') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-50">
          <div>
            <button onClick={handleBackToList} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#451db3] transition-colors mb-2 block">← Back to List</button>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Document Viewer</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Viewing files for: <span className="font-bold text-[#451db3]">{activeProject.projectName}</span></p>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-6">
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Technical Sanction (TS)</span>
            {activeProject.docs.ts ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Patvari B1</span>
            {activeProject.docs.patvari ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Administrative Sanction</span>
            {activeProject.docs.admin ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Other Document</span>
            {activeProject.docs.other ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
        </div>
      </div>
    );
  }
}