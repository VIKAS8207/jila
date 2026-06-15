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
        <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default function FinancialYear() {
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
  const [statusFilter, setStatusFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    yearLabel: '', startDate: '', endDate: '', status: 'Active'
  });

  // Mock Database: Financial Years
  const [financialYears, setFinancialYears] = useState([
    { id: 1, yearLabel: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active' },
    { id: 2, yearLabel: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Active' },
    { id: 3, yearLabel: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', status: 'Inactive' },
    { id: 4, yearLabel: '2023-2024', startDate: '2023-04-01', endDate: '2024-03-31', status: 'Inactive' },
  ]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredYears = financialYears.filter(fy => {
    const matchesSearch = fy.yearLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || fy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredYears.length / itemsPerPage);
  const currentData = filteredYears.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.status) {
      alert("Please select a Status.");
      return;
    }
    const newYear = { ...formData, id: Date.now() };
    setFinancialYears([newYear, ...financialYears]);
    setView('list');
    setFormData({ yearLabel: '', startDate: '', endDate: '', status: 'Active' });
    setCurrentPage(1);
    showToast('New Financial Year Registered Successfully ✓');
  };

  const handleToggleStatus = (id) => {
    setFinancialYears(financialYears.map(fy => {
      if (fy.id === id) {
        return { ...fy, status: fy.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return fy;
    }));
    showToast('Status Updated Successfully!');
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
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Financial Year Master</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage project timelines and active financial accounting periods.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Add Financial Year
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setFormData({ yearLabel: '', startDate: '', endDate: '', status: 'Active' }); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            Cancel ✕
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST FINANCIAL YEARS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by Year (e.g. 2026)..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={inputClass} 
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <CustomDropdown 
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                options={['Active', 'Inactive']}
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
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-1/3">Financial Year</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Operating Period</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No records match your search.</td></tr>
                  ) : (
                    currentData.map((fy, index) => (
                      <tr key={fy.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-6 py-5 font-bold text-slate-500 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="font-black text-slate-900 text-lg">{fy.yearLabel}</p>
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-slate-600">Start: <span className="font-mono text-slate-800">{fy.startDate}</span></span>
                            <span className="text-xs font-bold text-slate-600">End: &nbsp;&nbsp;<span className="font-mono text-slate-800">{fy.endDate}</span></span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center align-middle">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            fy.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {fy.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center align-middle">
                          <button 
                            onClick={() => handleToggleStatus(fy.id)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                              fy.status === 'Active' 
                                ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50' 
                                : 'bg-[#451db3]/10 text-[#451db3] hover:bg-[#451db3] hover:text-white'
                            }`}
                          >
                            {fy.status === 'Active' ? 'Mark Inactive' : 'Set Active'}
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredYears.length)}</span> of <span className="text-[#451db3]">{filteredYears.length}</span>
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
      {/* VIEW: NEW FINANCIAL YEAR FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Register Financial Year</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Define a new accounting and operational period for the system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Year Label & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Financial Year Label <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  placeholder="e.g., 2026-2027"
                  value={formData.yearLabel} 
                  onChange={e => setFormData({...formData, yearLabel: e.target.value})} 
                  className={`${inputClass} font-mono`} 
                />
              </div>
              <div className="space-y-2 relative z-50">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Initial Status <span className="text-red-500">*</span></label>
                <CustomDropdown 
                  placeholder="Select Status"
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val})}
                  options={['Active', 'Inactive']}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-40">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Start Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" required
                  value={formData.startDate} 
                  onChange={e => setFormData({...formData, startDate: e.target.value})} 
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">End Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" required
                  value={formData.endDate} 
                  onChange={e => setFormData({...formData, endDate: e.target.value})} 
                  className={inputClass} 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-30">
              <button 
                type="button" 
                onClick={() => { setView('list'); setFormData({ yearLabel: '', startDate: '', endDate: '', status: 'Active' }); }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Register Financial Year ✓
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}