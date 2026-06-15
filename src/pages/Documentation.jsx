import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

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
  const { isFullAccess, userRole } = useOutletContext();
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh'; // Only CO can validate

  const [currentView, setCurrentView] = useState('list'); // 'list', 'upload', 'view', 'validate'
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock Database (Expanded for pagination & validation state)
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-800', projectName: 'Sample Community Hall', ts: true, patvari: true, admin: true, validated: true },
    { id: 2, workId: 'WRK-2026-801', projectName: 'Primary School Renovation', ts: true, patvari: false, admin: false, validated: false },
    { id: 3, workId: 'WRK-2026-802', projectName: 'Road Construction Ward 45', ts: false, patvari: false, admin: false, validated: false },
    { id: 4, workId: 'WRK-2026-803', projectName: 'Village Dispensary Unit', ts: true, patvari: true, admin: true, validated: false }, // All uploaded, waiting for CO
    { id: 5, workId: 'WRK-2026-804', projectName: 'Panchayat Solar Grid', ts: true, patvari: true, admin: false, validated: false },
    { id: 6, workId: 'WRK-2026-805', projectName: 'Connecting Bridge Phase 1', ts: true, patvari: true, admin: true, validated: true },
  ]);

  // Upload Form State
  const [uploadData, setUploadData] = useState({ ts: false, patvari: false, admin: false });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Reset pagination when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  // Handle Search Filtering
  const filteredProjects = projects.filter(proj => 
    proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    proj.workId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Navigation Handlers
  const handleOpenUpload = (project) => { 
    setActiveProject(project); 
    setUploadData({ ts: project.ts, patvari: project.patvari, admin: project.admin });
    setCurrentView('upload'); 
  };
  const handleOpenView = (project) => { setActiveProject(project); setCurrentView('view'); };
  const handleOpenValidate = (project) => { setActiveProject(project); setCurrentView('validate'); };
  const handleBackToList = () => { setActiveProject(null); setCurrentView('list'); };

  // Form Submissions
  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          ts: uploadData.ts,
          patvari: uploadData.patvari,
          admin: uploadData.admin,
          validated: false // Reset validation if new docs are uploaded
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    showToast('Documents uploaded successfully.');
    handleBackToList();
  };

  const handleValidationSubmit = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => 
      p.id === activeProject.id ? { ...p, validated: true } : p
    );
    setProjects(updatedProjects);
    showToast('Documents officially validated.');
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
            <p className="text-sm font-medium text-slate-500 mt-1">Manage, verify, and officially validate technical and administrative files.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              placeholder="Search projects by Name or Work ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={inputClass} 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-16">S.No</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Project Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Docs Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Validation</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No projects match your search.</td></tr>
                ) : (
                  currentData.map((proj, index) => {
                    const allDocsPresent = proj.ts && proj.patvari && proj.admin;
                    
                    return (
                      <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-6 py-5 font-bold text-slate-500 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="font-black text-slate-900">{proj.projectName}</p>
                          <p className="text-[10px] font-bold text-slate-400 font-mono mt-1">{proj.workId}</p>
                          <div className="flex gap-2 mt-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-black tracking-widest ${proj.ts ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-500'}`}>TS</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-black tracking-widest ${proj.patvari ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-500'}`}>B1</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-black tracking-widest ${proj.admin ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-500'}`}>Admin</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-5 text-center align-middle">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${allDocsPresent ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                            {allDocsPresent ? 'Ready for Review' : 'Missing Docs'}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center align-middle">
                          {proj.validated ? (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#451db3]/10 text-[#451db3] border border-[#451db3]/20">
                              Validated ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-slate-400 border border-slate-200 border-dashed">
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right space-x-3 whitespace-nowrap align-middle">
                          <button onClick={() => handleOpenView(proj)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#451db3] transition-colors bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">View</button>
                          
                          {/* Sub-Engineers / Local Admins -> Upload */}
                          {!isFullAccess && !proj.validated && (
                            <button onClick={() => handleOpenUpload(proj)} className="text-[10px] font-black uppercase tracking-widest text-[#451db3] hover:text-white hover:bg-[#451db3] transition-colors bg-[#451db3]/10 border border-[#451db3]/20 px-4 py-2 rounded-full shadow-sm">Upload</button>
                          )}

                          {/* CO -> Validate */}
                          {isSuperAdmin && !proj.validated && allDocsPresent && (
                            <button onClick={() => handleOpenValidate(proj)} className="text-[10px] font-black uppercase tracking-widest text-white hover:-translate-y-0.5 transition-all bg-gradient-to-r from-[#451db3] to-[#5b2bd9] px-5 py-2 rounded-full shadow-md">Validate</button>
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
            <p className="text-sm font-medium text-slate-500 mt-1">For Project: {activeProject.projectName}</p>
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

              <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 md:col-span-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Administrative Sanction</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Official Approval Document</p>
                  </div>
                  {uploadData.admin && <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Uploaded</span>}
                </div>
                <FileInput label="" accept=".pdf" onChange={() => setUploadData({...uploadData, admin: true})} placeholder="Select Admin Sanction Document" />
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
            <p className="text-sm font-medium text-slate-500 mt-1">{activeProject.projectName}</p>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-6">
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Technical Sanction (TS)</span>
            {activeProject.ts ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Patvari B1</span>
            {activeProject.patvari ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
          <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex justify-between items-center">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Administrative Sanction</span>
            {activeProject.admin ? <button className="text-[10px] font-black text-[#451db3] uppercase tracking-widest bg-[#451db3]/10 px-5 py-2.5 rounded-full hover:bg-[#451db3] hover:text-white transition-all shadow-sm">View PDF</button> : <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-4 py-2 rounded-full border border-red-200">Missing</span>}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: VALIDATE VIEW (CO ONLY) ---
  if (currentView === 'validate') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-50">
          <div>
            <button onClick={handleBackToList} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#451db3] transition-colors mb-2 block">← Cancel Validation</button>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">Document Validation</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{activeProject.projectName}</p>
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          <p className="text-sm font-bold text-slate-500 mb-8 border-b border-slate-100 pb-6">Review the submitted documents below. Once confirmed, you can officially validate this project's paperwork.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-3 shadow-sm hover:border-[#451db3]/30 transition-all cursor-pointer">
              <span className="text-4xl text-[#451db3]">📄</span>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Tech Sanction</p>
              <button className="text-[10px] font-black text-slate-500 hover:text-[#451db3] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full mt-2">Preview PDF</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-3 shadow-sm hover:border-[#451db3]/30 transition-all cursor-pointer">
              <span className="text-4xl text-[#451db3]">📄</span>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Patvari B1</p>
              <button className="text-[10px] font-black text-slate-500 hover:text-[#451db3] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full mt-2">Preview PDF</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center flex flex-col items-center justify-center gap-3 shadow-sm hover:border-[#451db3]/30 transition-all cursor-pointer">
              <span className="text-4xl text-[#451db3]">📄</span>
              <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Admin Sanction</p>
              <button className="text-[10px] font-black text-slate-500 hover:text-[#451db3] uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full mt-2">Preview PDF</button>
            </div>
          </div>

          <form onSubmit={handleValidationSubmit} className="bg-[#451db3]/5 p-8 rounded-3xl border border-[#451db3]/10">
            <h4 className="font-black text-[#451db3] uppercase tracking-widest mb-4">Official Sign-off</h4>
            <div className="space-y-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
                  <input type="checkbox" required className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md checked:bg-[#451db3] checked:border-[#451db3] transition-all cursor-pointer" />
                  <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-sm font-bold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                  I confirm that I have reviewed the Technical Sanction, Patvari B1, and Administrative Sanction documents. They are valid, legible, and accurate for this project.
                </span>
              </label>
              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full sm:w-auto px-10 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#451db3] to-[#5b2bd9] rounded-full shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all">
                  Confirm & Validate Documents ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}