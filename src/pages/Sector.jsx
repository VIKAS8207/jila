import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

export default function Sector() {
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

  // Form State
  const [formData, setFormData] = useState({
    name: '', description: ''
  });

  // Mock Database: Sectors
  const [sectors, setSectors] = useState([
    { id: 1, name: 'Health', description: 'Healthcare facilities, rural dispensaries, and hospitals.' },
    { id: 2, name: 'Infrastructure', description: 'Roads, bridges, community halls, and public parks.' },
    { id: 3, name: 'Education', description: 'Primary schools, high schools, and educational institutes.' },
    { id: 4, name: 'Welfare', description: 'Community development centers and public welfare initiatives.' },
    { id: 5, name: 'Sanitation', description: 'Public toilets, drainage systems, and waste management.' },
    { id: 6, name: 'Agriculture', description: 'Irrigation facilities, seed storage, and farming infrastructure.' },
  ]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredSectors = sectors.filter(sec => {
    const matchesSearch = sec.name.toLowerCase().includes(searchQuery.toLowerCase()) || sec.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredSectors.length / itemsPerPage);
  const currentData = filteredSectors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const newSector = { ...formData, id: Date.now() };
    setSectors([newSector, ...sectors]);
    setView('list');
    setFormData({ name: '', description: '' });
    setCurrentPage(1);
    showToast('New Sector Registered Successfully ✓');
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
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Sector Master</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage project domains and categorization sectors.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('form')}
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Add Sector
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setFormData({ name: '', description: '' }); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            Cancel ✕
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST SECTORS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Search & Summary Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search Sectors by Name or Description..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={inputClass} 
              />
            </div>
            <div className="bg-[#451db3]/5 border border-[#451db3]/10 px-6 py-3 rounded-full text-center shrink-0">
              <span className="text-[10px] text-[#451db3] uppercase font-black tracking-widest mr-2">Total Sectors</span>
              <span className="text-lg font-black text-slate-900">{sectors.length}</span>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-16">S.No</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-1/4">Sector Name</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Description / Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="3" className="px-8 py-12 text-center text-slate-500 font-bold">No sectors match your search.</td></tr>
                  ) : (
                    currentData.map((sec, index) => (
                      <tr key={sec.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-6 py-5 font-bold text-slate-500 align-top">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5 align-top">
                          <p className="font-black text-slate-900 text-sm whitespace-normal">{sec.name}</p>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <p className="text-sm font-medium text-slate-600 whitespace-normal leading-relaxed">{sec.description}</p>
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredSectors.length)}</span> of <span className="text-[#451db3]">{filteredSectors.length}</span>
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
      {/* VIEW: NEW SECTOR FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Register New Sector</h3>
            <p className="text-sm font-medium text-slate-500 mt-2">Define a new project domain category for the system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Sector Name */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sector Name <span className="text-red-500">*</span></label>
              <input 
                type="text" required 
                placeholder="e.g., Health, Infrastructure"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className={inputClass} 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Description / Scope <span className="text-red-500">*</span></label>
              <textarea 
                required 
                rows="4" 
                placeholder="Briefly describe what kind of projects fall under this sector (e.g. 'This is a hospital project...')"
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className={`${inputClass} rounded-3xl resize-none py-4`}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button" 
                onClick={() => { setView('list'); setFormData({ name: '', description: '' }); }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Save Sector to Registry ✓
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}