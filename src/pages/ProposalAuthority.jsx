import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

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

export default function ProposalAuthority() {
  const { isFullAccess } = useOutletContext();
  
  // Security check: Only Full Access admins can view this page
  if (!isFullAccess) return <Navigate to="/dashboard" replace />;

  // View States
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [toast, setToast] = useState({ show: false, message: '' });

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', designation: ''
  });

  // Mock Database: Proposal Authorities
  const [authorities, setAuthorities] = useState([
    { id: 1, name: 'Amit Sharma', designation: 'CEO Jila Panchayat', status: 'Active' },
    { id: 2, name: 'Rajesh Kumar', designation: 'BDO (Block Development Officer)', status: 'Active' },
    { id: 3, name: 'Smt. Kavita Devi', designation: 'Sarpanch', status: 'Active' },
    { id: 4, name: 'Vikram Singh', designation: 'MLA', status: 'Active' },
    { id: 5, name: 'Anjali Deshmukh', designation: 'MP', status: 'Inactive' },
    { id: 6, name: 'Sanjay Verma', designation: 'Sub Engineer', status: 'Active' },
  ]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredAuthorities = authorities.filter(auth => {
    const matchesSearch = auth.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesignation = designationFilter === '' || auth.designation === designationFilter;
    return matchesSearch && matchesDesignation;
  });

  const totalPages = Math.ceil(filteredAuthorities.length / itemsPerPage);
  const currentData = filteredAuthorities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Generate unique designations for the filter dropdown
  const uniqueDesignations = [...new Set(authorities.map(a => a.designation))];

  // --- HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.designation) {
      alert("Please select or enter a Designation.");
      return;
    }
    const newAuthority = { ...formData, id: Date.now(), status: 'Active' };
    setAuthorities([newAuthority, ...authorities]);
    setView('list');
    setFormData({ name: '', designation: '' });
    setCurrentPage(1);
    showToast('New Proposal Authority Registered Successfully ✓');
  };

  const handleToggleStatus = (id) => {
    setAuthorities(authorities.map(auth => {
      if (auth.id === id) {
        return { ...auth, status: auth.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return auth;
    }));
    showToast('Authority Status Updated!');
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  return (
    <div className="space-y-6 pb-10 relative w-full">
      
      {/* Toast Notification */}
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
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Proposal Authority Master</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage personnel authorized to propose and initiate projects.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Add Authority
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setFormData({ name: '', designation: '' }); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            Cancel ✕
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST AUTHORITIES */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by Authority Name..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={inputClass} 
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <CustomDropdown 
                placeholder="All Designations"
                value={designationFilter}
                onChange={(val) => { setDesignationFilter(val); setCurrentPage(1); }}
                options={uniqueDesignations}
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
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Authority Name</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Designation</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No authorities match your search.</td></tr>
                  ) : (
                    currentData.map((auth, index) => (
                      <tr key={auth.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-6 py-5 font-bold text-slate-500 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="font-black text-slate-900 text-sm">{auth.name}</p>
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
                            {auth.designation}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center align-middle">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            auth.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {auth.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center align-middle">
                          <button 
                            onClick={() => handleToggleStatus(auth.id)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                              auth.status === 'Active' 
                                ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50' 
                                : 'bg-[#451db3]/10 text-[#451db3] hover:bg-[#451db3] hover:text-white'
                            }`}
                          >
                            {auth.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredAuthorities.length)}</span> of <span className="text-[#451db3]">{filteredAuthorities.length}</span>
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
      {/* VIEW: NEW AUTHORITY FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Register Proposal Authority</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Add a new official who is authorized to propose public projects.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  placeholder="e.g. Smt. Kavita Devi"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={inputClass} 
                />
              </div>

              {/* Designation */}
              <div className="space-y-2 relative z-50">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Designation / Role <span className="text-red-500">*</span></label>
                {/* Using an input list/datalist approach or just CustomDropdown. 
                  Since we need text input capability for unique roles, we'll use standard text input 
                  but users can type standard roles easily. Let's use CustomDropdown but allow free text if needed, 
                  actually, since CustomDropdown is strict, we'll use a standard input with suggestions for simplicity.
                */}
                <input 
                  type="text" required list="designation-suggestions"
                  placeholder="e.g. Sarpanch, MLA, BDO..."
                  value={formData.designation} 
                  onChange={e => setFormData({...formData, designation: e.target.value})} 
                  className={inputClass} 
                />
                <datalist id="designation-suggestions">
                  <option value="CEO Jila Panchayat" />
                  <option value="BDO (Block Development Officer)" />
                  <option value="Sarpanch" />
                  <option value="MLA" />
                  <option value="MP" />
                  <option value="Sub Engineer" />
                  <option value="Executive Engineer" />
                </datalist>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button" 
                onClick={() => { setView('list'); setFormData({ name: '', designation: '' }); }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Register Authority ✓
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}