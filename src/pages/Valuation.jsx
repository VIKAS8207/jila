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
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
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

export default function Valuation() {
  const { isFullAccess, userRole } = useOutletContext();
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh';
  const isLocalAdmin = userRole === 'Janpad' || userRole === 'Gram Panchayat';
  const isEngineer = !isFullAccess;

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'validate', 'asset'
  const [activeProject, setActiveProject] = useState(null);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [geoTagData, setGeoTagData] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Valuation Form State (Expanded with all requested documents)
  const [formData, setFormData] = useState({
    estimatedCost: '', schemeFundUsed: '', ownFundUsed: '', wageMaterialRatio: '', mbNumber: '', inspectionDate: '', remarks: '',
    valuationDoc: null, geoPhoto: null, ccDoc: null, ucDoc: null, 
    adminSanctionDoc: null, techSanctionDoc: null, additionalAmountLetter: null
  });

  // Mock Database
  const [projects, setProjects] = useState([
    { 
      id: 1, sno: 'PRJ-2026-001', name: 'Sample Community Hall', village: 'Ward 45', 
      status: 'Ready for Valuation', valuationData: null 
    },
    { 
      id: 2, sno: 'PRJ-2026-002', name: 'Primary School Renovation', village: 'Abhanpur', 
      status: 'Pending Valuation', 
      valuationData: {
        estimatedCost: 800000, schemeFundUsed: 750000, ownFundUsed: 50000,
        mbNumber: 'MB-2026-441', inspectionDate: '2026-06-05', remarks: 'Work completed as per specifications.',
        submittedBy: 'S. Singh (Sub-Engineer)'
      } 
    },
    { 
      id: 3, sno: 'PRJ-2026-003', name: 'Road Construction Ward 45', village: 'Arang', 
      status: 'Completed Asset', 
      valuationData: {
        estimatedCost: 1200000, schemeFundUsed: 1200000, ownFundUsed: 0,
        mbNumber: 'MB-2026-112', inspectionDate: '2026-05-20', remarks: 'Final road layering done and verified.',
        submittedBy: 'R. Kumar (Sub-Engineer)', validatedBy: 'CEO Jila Panchayat', validationDate: '2026-05-25'
      } 
    },
    { 
      id: 4, sno: 'PRJ-2026-004', name: 'Village Dispensary Unit', village: 'Tilda', 
      status: 'Ready for Valuation', valuationData: null 
    },
  ]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Pagination Logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentData = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Actions
  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
    setFormData({ estimatedCost: '', schemeFundUsed: '', ownFundUsed: '', wageMaterialRatio: '', mbNumber: '', inspectionDate: '', remarks: '', valuationDoc: null, geoPhoto: null, ccDoc: null, ucDoc: null, adminSanctionDoc: null, techSanctionDoc: null, additionalAmountLetter: null });
    setGeoTagData(null);
  };

  const handleOpenAction = (project) => {
    setActiveProject(project);
    if (project.status === 'Ready for Valuation' && !isSuperAdmin) setCurrentView('form');
    else if (project.status === 'Pending Valuation' && isSuperAdmin) setCurrentView('validate');
    else if (project.status === 'Completed Asset') setCurrentView('asset');
    else setCurrentView('view_only');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, geoPhoto: file });
      setGeoTagData('Extracting GPS coordinates...');
      setTimeout(() => setGeoTagData('📍 Lat: 22.0796, Long: 82.1391 (Verified)'), 1500);
    }
  };

  const handleSubmitValuation = (e) => {
    e.preventDefault();
    const valData = {
      ...formData,
      submittedBy: isEngineer ? 'R. Kumar (Sub-Engineer)' : userRole,
    };
    
    setProjects(projects.map(p => p.id === activeProject.id ? { ...p, status: 'Pending Valuation', valuationData: valData } : p));
    showToast("Valuation submitted to Approving Authority successfully.");
    handleBack();
  };

  const handleValidateAsset = () => {
    if (window.confirm("Confirm validation? This permanently registers the project as a Completed Asset.")) {
      const updatedValData = {
        ...activeProject.valuationData,
        validatedBy: userRole,
        validationDate: new Date().toISOString().split('T')[0]
      };

      setProjects(projects.map(p => p.id === activeProject.id ? { ...p, status: 'Completed Asset', valuationData: updatedValData } : p));
      showToast("Asset Validated Successfully!", "success");
      handleBack();
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed Asset') return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (status === 'Pending Valuation') return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-[#451db3]/10 text-[#451db3] border-[#451db3]/20';
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    const completedCount = projects.filter(p => p.status === 'Completed Asset').length;
    const pendingCount = projects.filter(p => p.status === 'Pending Valuation').length;

    return (
      <div className="space-y-6 pb-10 relative">
        {toast.show && (
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
            <div className={`px-6 py-4 rounded-full shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              <span className="font-bold">{toast.message}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">Valuation & Capitalization</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Submit final bills, verify documentation, and validate assets.</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="bg-white px-6 py-3 border-2 border-[#451db3]/20 rounded-2xl text-center shadow-sm flex-1 sm:flex-none">
              <p className="text-[10px] text-[#451db3] uppercase font-black tracking-widest">Total Assets</p>
              <p className="text-2xl font-black text-slate-900">{completedCount}</p>
            </div>
            <div className="bg-amber-50 px-6 py-3 border border-amber-200 rounded-2xl text-center shadow-sm flex-1 sm:flex-none">
              <p className="text-[10px] text-amber-600 uppercase font-black tracking-widest">Pending Review</p>
              <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Project Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Village / Block</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{proj.name}</p>
                      <p className="text-[11px] font-mono font-bold text-slate-400 mt-1">{proj.sno}</p>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-600">{proj.village}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(proj.status)}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => handleOpenAction(proj)} className="px-6 py-2.5 rounded-full bg-[#451db3]/10 text-[#451db3] text-[10px] font-black uppercase tracking-widest hover:bg-[#451db3] hover:text-white transition-all shadow-sm">
                        {proj.status === 'Completed Asset' ? 'View Asset' : isSuperAdmin ? 'Review & Validate' : 'Submit Valuation'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, projects.length)}</span> of <span className="text-[#451db3]">{projects.length}</span>
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

  // --- RENDER: FORM VIEW (Engineers / GP / Janpad submitting valuation) ---
  if (currentView === 'form') {
    return (
      <div className="max-w-5xl mx-auto pb-10 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">Submit Final Valuation</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Provide measurement bills and required documentation for {activeProject.name}.</p>
          </div>
          <button onClick={handleBack} className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors">
            Cancel ✕
          </button>
        </div>

        <form onSubmit={handleSubmitValuation} className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-visible animate-in fade-in slide-in-from-bottom-4">
          
          <div className="p-8 space-y-10">
            {/* Financial Breakdown */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. Financial Accounting</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Estimated Cost (Target) ₹ <span className="text-red-500">*</span></label>
                  <input type="number" required value={formData.estimatedCost} onChange={e => setFormData({...formData, estimatedCost: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Fund Provided by CO ₹ <span className="text-red-500">*</span></label>
                  <input type="number" required value={formData.schemeFundUsed} onChange={e => setFormData({...formData, schemeFundUsed: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Own Fund Used (GP/Janpad) ₹ <span className="text-red-500">*</span></label>
                  <input type="number" required value={formData.ownFundUsed} onChange={e => setFormData({...formData, ownFundUsed: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Wage vs. Material Ratio <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. 60:40" value={formData.wageMaterialRatio} onChange={e => setFormData({...formData, wageMaterialRatio: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Technical & Physical Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Measurement Book (MB) Ref No. <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. MB-2026-XX" value={formData.mbNumber} onChange={e => setFormData({...formData, mbNumber: e.target.value})} className={`${inputClass} font-mono`} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Date of Final Inspection <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.inspectionDate} onChange={e => setFormData({...formData, inspectionDate: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Comprehensive Document Uploads */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">3. Document Uploads</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <FileInput 
                  label="Mulyankan Praman Patra (Valuation Doc)" required={true} accept=".pdf" 
                  onChange={e => setFormData({...formData, valuationDoc: e.target.files[0]})} 
                />
                
                <FileInput 
                  label="Completed Certificate (CC)" required={true} accept=".pdf,.jpeg,.png" 
                  onChange={e => setFormData({...formData, ccDoc: e.target.files[0]})} 
                />

                <FileInput 
                  label="Utilization Certificate (UC) - If Pending" required={false} accept=".pdf,.jpeg,.png" 
                  onChange={e => setFormData({...formData, ucDoc: e.target.files[0]})} 
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Asset Photo (Geo-Tagged) <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input type="file" accept="image/*" capture="environment" required onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white/50 text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20 shadow-sm">
                      <span className="truncate">Upload Image...</span>
                      <span className="text-[#451db3] text-lg">📷</span>
                    </div>
                  </div>
                  {geoTagData && <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest pl-4 mt-2 animate-pulse">{geoTagData}</p>}
                </div>

                <FileInput 
                  label="Admin Sanction (Re-Upload)" required={true} accept=".pdf,.jpeg,.png" 
                  onChange={e => setFormData({...formData, adminSanctionDoc: e.target.files[0]})} 
                />

                <FileInput 
                  label="Technical Sanction (Re-Upload)" required={true} accept=".pdf,.jpeg,.png" 
                  onChange={e => setFormData({...formData, techSanctionDoc: e.target.files[0]})} 
                />

                <FileInput 
                  label="Additional Amount Recommendation Letter" required={false} accept=".pdf,.jpeg,.png" 
                  onChange={e => setFormData({...formData, additionalAmountLetter: e.target.files[0]})} 
                />

              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Final Remarks / Declarations <span className="text-red-500">*</span></label>
              <textarea required value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} rows="3" className={`${inputClass} rounded-3xl resize-none py-4`}></textarea>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-12 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#451db3] to-[#5b2bd9] rounded-full hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(69,29,179,0.25)]">
              Submit Valuation to CO ✓
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: VALIDATE VIEW (CO ONLY) & ASSET VIEW (Everyone) ---
  if (currentView === 'validate' || currentView === 'asset' || currentView === 'view_only') {
    const vData = activeProject.valuationData;
    const isCompleted = activeProject.status === 'Completed Asset';

    return (
      <div className="max-w-5xl mx-auto pb-10 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-50">
          <div>
            <button onClick={handleBack} className="text-slate-400 hover:text-[#451db3] text-sm font-bold mb-2 block transition-colors">← Back to List</button>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">{isCompleted ? 'Asset Capitalization Certificate' : 'Valuation Review'}</h2>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(activeProject.status)}`}>
            {activeProject.status}
          </span>
        </div>

        {vData ? (
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Certificate Header */}
            <div className="text-center border-b-2 border-[#451db3]/10 pb-8 mb-10">
              <h1 className="text-3xl font-black text-[#451db3] uppercase tracking-widest">Valuation Certificate</h1>
              <p className="text-slate-500 mt-2 font-bold tracking-wider text-sm uppercase">Measurement & Financial Verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Particulars</p>
                <p className="font-black text-slate-900 text-2xl">{activeProject.name}</p>
                <p className="text-sm font-bold text-slate-500 font-mono mt-2">{activeProject.sno} • {activeProject.village}</p>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Technical Reference</p>
                <p className="font-black text-[#451db3] text-xl font-mono">{vData.mbNumber}</p>
                <p className="text-sm font-bold text-slate-500 mt-2">Inspected: {vData.inspectionDate}</p>
              </div>
            </div>

            {/* Financial Ledger Block */}
            <div className="bg-[#451db3]/5 rounded-3xl border border-[#451db3]/10 p-8 mb-10">
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Financial Accounting Summary</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-sm">Estimated Target Cost</span>
                  <span className="text-slate-900 font-black">{formatCurrency(vData.estimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-sm">Funds Sourced from CO / Scheme</span>
                  <span className="text-slate-900 font-black">{formatCurrency(vData.schemeFundUsed)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#451db3]/10 pb-6">
                  <span className="text-slate-600 font-bold text-sm">Funds Sourced from Own Account (GP)</span>
                  <span className="text-slate-900 font-black">{formatCurrency(vData.ownFundUsed)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-[#451db3] uppercase tracking-widest">Total Capitalized Value</span>
                  <span className="text-3xl font-black text-slate-900">{formatCurrency(parseInt(vData.schemeFundUsed) + parseInt(vData.ownFundUsed))}</span>
                </div>
              </div>
            </div>

            {/* Document Verification Grid */}
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-3">Attached Verifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white hover:border-[#451db3]/30 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl mb-3">📄</span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">MB Doc</p>
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white hover:border-[#451db3]/30 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl mb-3">📍</span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Geo Photo</p>
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white hover:border-[#451db3]/30 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl mb-3">✅</span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">CC Doc</p>
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white hover:border-[#451db3]/30 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl mb-3">🏛️</span>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Admin Sanction</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-10 text-center">
              <div>
                <p className="text-lg font-black text-slate-900">{vData.submittedBy}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Submitted By</p>
              </div>
              <div>
                {isCompleted ? (
                  <>
                    <p className="text-lg font-black text-green-600">{vData.validatedBy}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Validated On: {vData.validationDate}</p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-amber-500 italic mt-2">Pending CO Signature</p>
                )}
              </div>
            </div>

            {/* Validation Action (CO Only) */}
            {currentView === 'validate' && isSuperAdmin && (
              <div className="mt-12 pt-8 border-t-2 border-[#451db3]/20 flex flex-col items-center bg-[#451db3]/5 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-8 sm:p-12 rounded-b-3xl">
                <p className="text-sm font-bold text-[#451db3] mb-6 text-center max-w-lg">By clicking below, you officially validate these measurements and register this project as a finalized government asset.</p>
                <button onClick={handleValidateAsset} className="w-full sm:w-auto px-12 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#451db3] to-[#5b2bd9] rounded-full hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(69,29,179,0.25)]">
                  Approve & Capitalize Asset ✓
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-2xl p-12 rounded-3xl shadow-sm text-center border border-slate-100">
            <p className="text-slate-400 font-bold tracking-widest uppercase">Valuation data has not been submitted yet.</p>
          </div>
        )}
      </div>
    );
  }
}