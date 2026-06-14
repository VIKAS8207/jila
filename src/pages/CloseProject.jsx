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
        <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
          <ul className="max-h-60 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <li 
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`px-4 py-3 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === '' ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
            >
              {placeholder}
            </li>
            {options.map((opt, idx) => (
              <li 
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-3 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
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
const FileInput = ({ label, onChange, disabled, required }) => (
  <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative flex items-center">
      <input type="file" onChange={onChange} disabled={disabled} required={required} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <span className="truncate">Choose Document...</span>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm">BROWSE</span>
      </div>
    </div>
  </div>
);

export default function CloseProject() {
  const { userRole } = useOutletContext(); 

  // --- MOCK DATA ---
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-800', workName: 'Road Development Ward 4', sector: 'Infrastructure', department: 'Gram Panchayat', receivedAmount: '500000', status: 'Pending Closure' },
    { id: 2, workId: 'WRK-2026-804', workName: 'Primary Health Center', sector: 'Health', department: 'Janpad', receivedAmount: '600000', status: 'Asset' },
    { id: 3, workId: 'WRK-2026-801', workName: 'Panchayat Solar Expansion', sector: 'Infrastructure', department: 'CEO Jila Panchayat', receivedAmount: '250000', status: 'Pending Closure' },
  ]);

  // View States
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    coverageArea: '',
    amountUsed: '',
    remarks: '',
    ucDoc: null,
    ccDoc: null,
    geoPhoto: null
  });
  
  const [geoTagData, setGeoTagData] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- PAGINATION LOGIC ---
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.workName.toLowerCase().includes(searchQuery.toLowerCase()) || p.workId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- ACTIONS ---
  const handleCloseClick = (project) => {
    setSelectedProject(project);
    setFormData({ coverageArea: '', amountUsed: '', remarks: '', ucDoc: null, ccDoc: null, geoPhoto: null });
    setGeoTagData(null);
    setView('form');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, geoPhoto: file });
      setGeoTagData('Extracting GPS coordinates...');
      setTimeout(() => setGeoTagData('📍 Lat: 22.0796, Long: 82.1391 (Verified)'), 1500);
    }
  };

  const processClosureSubmit = (e) => {
    e.preventDefault();

    if (parseFloat(formData.amountUsed) > parseFloat(selectedProject.receivedAmount)) {
      alert("Amount used cannot exceed the total received amount.");
      return;
    }

    setProjects(projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, status: 'Asset' }; // Change status to Asset
      }
      return p;
    }));
    
    showToast('Project Successfully Closed and Moved to Asset Register!', 'success');
    setView('list');
    setSelectedProject(null);
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Project Closure & Asset Register</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Finalize completed projects, upload utility certificates, and convert them to official assets.</p>
        </div>
        {view === 'form' && (
          <button onClick={() => setView('list')} className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors">
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
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by Work ID or Project Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 outline-none shadow-sm transition-all" 
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <CustomDropdown 
                placeholder="All Statuses"
                value={statusFilter}
                onChange={setStatusFilter}
                options={['Pending Closure', 'Asset']}
              />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Name</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sector / Dept</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Received Amount</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="7" className="px-8 py-12 text-center text-slate-500 font-bold">No projects available for closure.</td></tr>
                  ) : (
                    currentData.map((proj, index) => (
                      <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-5 font-bold text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-5 font-mono font-bold text-slate-700">{proj.workId}</td>
                        <td className="px-5 py-5 font-bold text-slate-900">{proj.workName}</td>
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-700">{proj.sector}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase">{proj.department}</p>
                        </td>
                        <td className="px-5 py-5 font-black text-slate-800 text-right">{formatCurrency(proj.receivedAmount)}</td>
                        <td className="px-5 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            proj.status === 'Asset' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-center">
                          {proj.status === 'Pending Closure' ? (
                            <button 
                              onClick={() => handleCloseClick(proj)}
                              className="px-6 py-2.5 rounded-full bg-[#451db3] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#3a1796] shadow-[0_4px_10px_rgba(69,29,179,0.2)] hover:-translate-y-0.5 transition-all"
                            >
                              Close Project
                            </button>
                          ) : (
                            <span className="text-slate-300 font-bold text-lg">-</span>
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
      {/* VIEW: PROJECT CLOSURE FORM */}
      {/* ======================================================= */}
      {view === 'form' && selectedProject && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500 overflow-visible">
          
          {/* Highlighted Banner Spanning Top */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white border-2 border-[#451db3]/20 rounded-2xl p-6 mb-8 shadow-[0_2px_15px_rgba(69,29,179,0.05)]">
            <div className="mb-4 md:mb-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Closing Project</p>
              <p className="font-black text-slate-900 text-xl md:text-2xl mt-0.5">{selectedProject.workName}</p>
              <p className="font-mono font-bold text-[#451db3] mt-1">{selectedProject.workId}</p>
            </div>
            <div className="md:text-right bg-green-50 border border-green-100 rounded-xl px-5 py-3">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Total Received Amount</p>
              <p className="text-3xl md:text-4xl font-black text-slate-900">{formatCurrency(selectedProject.receivedAmount)}</p>
            </div>
          </div>

          <form onSubmit={processClosureSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coverage Area Detail */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Coverage Area Detail <span className="text-red-500">*</span></label>
                <input 
                  type="text" required placeholder="e.g. Ward 4 & 5 Radius"
                  value={formData.coverageArea}
                  onChange={e => setFormData({...formData, coverageArea: e.target.value})}
                  className={inputClass} 
                />
              </div>

              {/* Amount Used */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Total Amount Utilized (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" required placeholder="Enter total utilized amount"
                  value={formData.amountUsed}
                  onChange={e => setFormData({...formData, amountUsed: e.target.value})}
                  className={inputClass} 
                />
              </div>

              {/* UC Document */}
              <FileInput 
                label="Utility Certificate (UC)" required={true} 
                onChange={e => setFormData({...formData, ucDoc: e.target.files[0]})} 
              />

              {/* Complete Certificate Document */}
              <FileInput 
                label="Completion Certificate (CC)" required={true} 
                onChange={e => setFormData({...formData, ccDoc: e.target.files[0]})} 
              />

              {/* Geo-tag Photo */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Geo-Tag Photo of Asset <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input type="file" accept="image/*" required onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                    <span className="truncate">Upload Image...</span>
                    <span className="text-[#451db3] text-lg">📷</span>
                  </div>
                </div>
                {geoTagData && <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest pl-4 mt-2 animate-pulse">{geoTagData}</p>}
              </div>

            </div>

            {/* Remarks / Fund Utilization Details */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                Fund Utilization Remarks <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows="3" required
                value={formData.remarks}
                onChange={e => setFormData({...formData, remarks: e.target.value})}
                placeholder="Explain precisely where and how the funds were utilized..." 
                className={`${inputClass} rounded-3xl resize-none py-4`}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setView('list')} 
                className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel
              </button>
              
              <button 
                type="submit" 
                className="px-10 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all"
              >
                Complete & Move to Asset ✓
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}