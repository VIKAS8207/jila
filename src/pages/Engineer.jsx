import React, { useState, useMemo, useEffect, useRef } from 'react';
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

export default function Engineer() {
  const { isFullAccess } = useOutletContext();
  
  if (!isFullAccess) return <Navigate to="/dashboard" replace />;

  // View & UI States
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [toast, setToast] = useState({ show: false, message: '' });

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Form State (Added 'designation')
  const [formData, setFormData] = useState({
    name: '', dob: '', email: '', type: '', panchayat: '', designation: ''
  });

  // Mock Database: Engineers
  const [engineers, setEngineers] = useState([
    { id: 1, name: 'R. Kumar', designation: 'Engineer', dob: '1985-06-15', email: 'rkumar@example.com', type: 'Civil', panchayat: 'Abhanpur' },
    { id: 2, name: 'S. Singh', designation: 'Sub Engineer', dob: '1990-02-20', email: 'ssingh@example.com', type: 'Mechanical', panchayat: 'Arang' },
    { id: 3, name: 'A. Patel', designation: 'Engineer', dob: '1988-11-05', email: 'apatel@example.com', type: 'Electrical', panchayat: 'Tilda' },
    { id: 4, name: 'V. Sharma', designation: 'Sub Engineer', dob: '1992-08-10', email: 'vsharma@example.com', type: 'Civil', panchayat: 'Abhanpur' },
    { id: 5, name: 'M. Verma', designation: 'Engineer', dob: '1995-03-22', email: 'mverma@example.com', type: 'Civil', panchayat: 'Masturi' },
    { id: 6, name: 'K. Rao', designation: 'Sub Engineer', dob: '1989-12-30', email: 'krao@example.com', type: 'Mechanical', panchayat: 'Bilha' },
  ]);

  // Dynamic stats: Total engineers per Panchayat
  const panchayatStats = useMemo(() => {
    const stats = {};
    engineers.forEach(eng => {
      stats[eng.panchayat] = (stats[eng.panchayat] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]); 
  }, [engineers]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredEngineers = engineers.filter(eng => {
    const matchesSearch = eng.name.toLowerCase().includes(searchQuery.toLowerCase()) || eng.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === '' || eng.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const currentData = filteredEngineers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.designation) {
      alert("Please select a Designation.");
      return;
    }
    const newEngineer = { ...formData, id: Date.now() };
    setEngineers([newEngineer, ...engineers]);
    setView('list');
    setFormData({ name: '', dob: '', email: '', type: '', panchayat: '', designation: '' });
    setCurrentPage(1);
    showToast('New Personnel Registered Successfully ✓');
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
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Engineer Directory</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage technical personnel, specialization, and panchayat deployment.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Add Personnel
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setFormData({ name: '', dob: '', email: '', type: '', panchayat: '', designation: '' }); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            Cancel ✕
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST ENGINEERS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Dynamic Summary Cards */}
          <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] w-full">
            <h3 className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-4">Deployment Statistics</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                <span className="text-[11px] font-black uppercase tracking-widest">Total Active</span>
                <span className="text-2xl font-black">{engineers.length}</span>
              </div>
              <div className="w-px bg-slate-200 h-10 mx-2 hidden sm:block"></div>
              
              {panchayatStats.map(([panchayat, count]) => (
                <div key={panchayat} className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <span className="text-xs font-bold text-slate-600">{panchayat}</span>
                  <span className="text-sm font-black text-[#451db3] bg-[#451db3]/10 border border-[#451db3]/20 w-8 h-8 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by Name or Email..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={inputClass} 
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <CustomDropdown 
                placeholder="All Disciplines"
                value={typeFilter}
                onChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
                options={['Civil', 'Mechanical', 'Electrical']}
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
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Personnel Profile</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Contact Details</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Discipline</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Assigned Post</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No personnel found matching criteria.</td></tr>
                  ) : (
                    currentData.map((eng, index) => (
                      <tr key={eng.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-6 py-5 font-bold text-slate-500">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-start gap-1.5">
                            <p className="font-black text-slate-900 text-sm">{eng.name}</p>
                            <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${
                              eng.designation === 'Engineer' 
                                ? 'bg-[#451db3]/10 text-[#451db3] border-[#451db3]/20' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            }`}>
                              {eng.designation}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-700">{eng.email}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">DOB: {eng.dob}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            eng.type === 'Civil' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            eng.type === 'Mechanical' ? 'bg-slate-100 text-slate-700 border-slate-300' : 
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {eng.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-medium text-slate-600">
                          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                            📍 {eng.panchayat}
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredEngineers.length)}</span> of <span className="text-[#451db3]">{filteredEngineers.length}</span>
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
      {/* VIEW: ADD ENGINEER FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Register Technical Personnel</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Enter official details to induct a new engineer into the master directory.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  placeholder="e.g. S. Kumar"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Date of Birth <span className="text-red-500">*</span></label>
                <input 
                  type="date" required 
                  value={formData.dob} 
                  onChange={e => setFormData({...formData, dob: e.target.value})} 
                  className={inputClass} 
                />
              </div>
            </div>

            {/* Email & Designation Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Official Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" required 
                  placeholder="engineer@govt.in"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className={inputClass} 
                />
              </div>
              <div className="space-y-2 relative z-50">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Designation Tag <span className="text-red-500">*</span></label>
                <CustomDropdown 
                  placeholder="Select Designation"
                  value={formData.designation}
                  onChange={(val) => setFormData({...formData, designation: val})}
                  options={['Engineer', 'Sub Engineer']}
                />
              </div>
            </div>

            {/* Professional Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 relative z-40">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Technical Discipline <span className="text-red-500">*</span></label>
                <CustomDropdown 
                  placeholder="Select Discipline"
                  value={formData.type}
                  onChange={(val) => setFormData({...formData, type: val})}
                  options={['Civil', 'Mechanical', 'Electrical']}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Assign Panchayat (Post) <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  placeholder="e.g. Abhanpur Block A"
                  value={formData.panchayat} 
                  onChange={e => setFormData({...formData, panchayat: e.target.value})} 
                  className={inputClass} 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <button 
                type="button" 
                onClick={() => { setView('list'); setFormData({ name: '', dob: '', email: '', type: '', panchayat: '', designation: '' }); }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel Registration
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Register Personnel ✓
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}