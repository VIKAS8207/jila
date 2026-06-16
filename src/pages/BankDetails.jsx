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

// --- REUSABLE DETAIL POINT ---
const DetailItem = ({ label, value, highlight = false }) => (
  <div className="space-y-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm ${highlight ? 'font-black text-[#451db3] font-mono tracking-wider' : 'font-bold text-slate-800'}`}>
      {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
    </p>
  </div>
);

export default function BankDetails() {
  const { isFullAccess } = useOutletContext();
  
  // Security check: Only Full Access admins can view this page
  if (!isFullAccess) return <Navigate to="/dashboard" replace />;

  // View States
  const [view, setView] = useState('list'); // 'list' | 'form' | 'details'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [activeRecord, setActiveRecord] = useState(null);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: null, roleCategory: '', entityName: '', bankName: '', branch: '', accountNo: '', ifscCode: ''
  });

  // Mock Dependencies: Existing users/entities mapped by role
  const existingEntities = {
    'CEO Jila Panchayat': ['Amit Sharma (CEO)', 'Rajeev Verma (Acting CEO)'],
    'Jila Panchayat': ['Bilaspur ZP Headquarters', 'Raipur ZP Main Branch'],
    'Janpad': ['Bilaspur Janpad', 'Kota Janpad', 'Takhatpur Janpad', 'Bilha Janpad'],
    'Gram Panchayat': ['Abhanpur GP', 'Arang GP', 'Tilda GP', 'Masturi GP', 'Khamhariya GP']
  };

  const roleCategories = Object.keys(existingEntities);

  // Dynamic dropdown options for the second dropdown based on the selected Role
  const availableEntities = formData.roleCategory ? existingEntities[formData.roleCategory] : [];

  // Mock Database: Registered Bank Details
  const [bankRecords, setBankRecords] = useState([
    { id: 1, roleCategory: 'Gram Panchayat', entityName: 'Masturi GP', bankName: 'State Bank of India', branch: 'Masturi Main', accountNo: '320011223344', ifscCode: 'SBIN0001234' },
    { id: 2, roleCategory: 'Janpad', entityName: 'Kota Janpad', bankName: 'HDFC Bank', branch: 'Kota City', accountNo: '5010022334455', ifscCode: 'HDFC0004567' },
    { id: 3, roleCategory: 'CEO Jila Panchayat', entityName: 'Amit Sharma (CEO)', bankName: 'Punjab National Bank', branch: 'Bilaspur Central', accountNo: '01234567890123', ifscCode: 'PUNB0007890' },
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredRecords = bankRecords.filter(record => {
    const matchesSearch = record.entityName.toLowerCase().includes(searchQuery.toLowerCase()) || record.accountNo.includes(searchQuery);
    const matchesRole = roleFilter === '' || record.roleCategory === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentData = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- HANDLERS ---
  const handleRoleChange = (selectedRole) => {
    // Reset the entity name if the role category changes
    setFormData({ ...formData, roleCategory: selectedRole, entityName: '' });
  };

  const handleView = (record) => {
    setActiveRecord(record);
    setView('details');
  };

  const handleEdit = (record) => {
    setFormData(record);
    setView('form');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete these bank details?")) {
      setBankRecords(bankRecords.filter(r => r.id !== id));
      showToast('Bank details deleted successfully.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.roleCategory || !formData.entityName) {
      alert("Please select both a Category and an Existing User/Entity.");
      return;
    }
    
    if (formData.id) {
      // Update existing record
      setBankRecords(bankRecords.map(r => r.id === formData.id ? formData : r));
      showToast('Bank Details Updated Successfully ✓');
    } else {
      // Create new record
      const newRecord = { ...formData, id: Date.now() };
      setBankRecords([newRecord, ...bankRecords]);
      showToast('Bank Details Registered Successfully ✓');
    }

    setView('list');
    setFormData({ id: null, roleCategory: '', entityName: '', bankName: '', branch: '', accountNo: '', ifscCode: '' });
    setCurrentPage(1);
  };

  // Utility to mask account numbers for list view
  const maskAccountNo = (accNo) => {
    if (!accNo || accNo.length < 4) return accNo;
    return `********${accNo.slice(-4)}`;
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-40">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">
            {view === 'list' && 'Bank Details Master'}
            {view === 'form' && (formData.id ? 'Edit Bank Details' : 'Register Bank Details')}
            {view === 'details' && 'Financial Credentials View'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {view === 'list' && 'Manage financial routing credentials for registered entities and users.'}
            {view === 'form' && 'Map verified financial credentials to an existing system entity.'}
            {view === 'details' && `Detailed banking information for ${activeRecord?.entityName}`}
          </p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => { setFormData({ id: null, roleCategory: '', entityName: '', bankName: '', branch: '', accountNo: '', ifscCode: '' }); setView('form'); }}
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Add Bank Details
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setFormData({ id: null, roleCategory: '', entityName: '', bankName: '', branch: '', accountNo: '', ifscCode: '' }); setActiveRecord(null); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST BANK RECORDS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative w-full">
            <div className="flex-1 w-full relative">
              <input 
                type="text" 
                placeholder="Search by Entity Name or Account Number..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={inputClass} 
              />
            </div>
            <div className="w-full md:w-64 shrink-0">
              <CustomDropdown 
                placeholder="All Categories"
                value={roleFilter}
                onChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}
                options={roleCategories}
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
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Entity Profile</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Bank & Branch</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Account Info</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-bold">No banking records found.</td></tr>
                  ) : (
                    currentData.map((record, index) => (
                      <tr key={record.id} className="hover:bg-[#451db3]/5 transition-colors group">
                        <td className="px-6 py-5 font-bold text-slate-500 align-middle">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="font-black text-slate-900 text-sm">{record.entityName}</p>
                          <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border-slate-200">
                            {record.roleCategory}
                          </span>
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="text-sm font-bold text-[#451db3]">{record.bankName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Br: {record.branch}</p>
                        </td>
                        <td className="px-6 py-5 align-middle">
                          <p className="font-mono font-black text-slate-800 text-sm tracking-widest">{maskAccountNo(record.accountNo)}</p>
                          <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">IFSC: {record.ifscCode}</p>
                        </td>
                        <td className="px-6 py-5 align-middle text-right space-x-2">
                          <button 
                            onClick={() => handleView(record)}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-[#451db3] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleEdit(record)}
                            className="bg-white border border-slate-200 text-amber-500 hover:text-white hover:bg-amber-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="bg-white border border-slate-200 text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            Delete
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> of <span className="text-[#451db3]">{filteredRecords.length}</span>
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
      {/* VIEW: ADD/EDIT BANK DETAILS FORM */}
      {/* ======================================================= */}
      {view === 'form' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Target Selection Row */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. Select Target Entity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 relative z-50">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Administrative Level / Role <span className="text-red-500">*</span></label>
                  <CustomDropdown 
                    placeholder="Select Level"
                    value={formData.roleCategory}
                    onChange={handleRoleChange}
                    options={roleCategories}
                  />
                </div>
                
                <div className="space-y-2 relative z-40">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Existing Registered User / Body <span className="text-red-500">*</span></label>
                  <CustomDropdown 
                    placeholder={formData.roleCategory ? "Select Existing Profile" : "Select Level First"}
                    value={formData.entityName}
                    onChange={(val) => setFormData({...formData, entityName: val})}
                    options={availableEntities}
                    disabled={!formData.roleCategory || availableEntities.length === 0}
                  />
                </div>
              </div>
            </div>

            {/* Financial Details Row */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Financial Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Bank Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required 
                    placeholder="e.g. State Bank of India"
                    value={formData.bankName} 
                    onChange={e => setFormData({...formData, bankName: e.target.value})} 
                    className={inputClass} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Branch Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required 
                    placeholder="e.g. Bilaspur Main Branch"
                    value={formData.branch} 
                    onChange={e => setFormData({...formData, branch: e.target.value})} 
                    className={inputClass} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Account Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required 
                    placeholder="Enter valid account number"
                    value={formData.accountNo} 
                    onChange={e => setFormData({...formData, accountNo: e.target.value.replace(/\D/g, '')})} 
                    className={`${inputClass} font-mono tracking-widest`} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">IFSC Code <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required 
                    placeholder="e.g. SBIN0001234"
                    value={formData.ifscCode} 
                    onChange={e => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})} 
                    className={`${inputClass} font-mono uppercase tracking-widest`} 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <button 
                type="button" 
                onClick={() => { setView('list'); setFormData({ id: null, roleCategory: '', entityName: '', bankName: '', branch: '', accountNo: '', ifscCode: '' }); }} 
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                ← Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
              >
                {formData.id ? 'Update Bank Details ✓' : 'Save Bank Details ✓'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: DETAILS (VIEW ONLY) */}
      {/* ======================================================= */}
      {view === 'details' && activeRecord && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-[#451db3]/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#451db3]/5 p-6 rounded-3xl">
            <div>
              <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Entity Profile</p>
              <h3 className="text-3xl font-black text-slate-900">{activeRecord.entityName}</h3>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-[#451db3] border border-[#451db3]/20 shadow-sm">
                Role: {activeRecord.roleCategory}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Financial Routing Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <DetailItem label="Bank Name" value={activeRecord.bankName} />
              <DetailItem label="Branch Location" value={activeRecord.branch} />
              <DetailItem label="Account Number" value={activeRecord.accountNo} highlight={true} />
              <DetailItem label="IFSC Code" value={activeRecord.ifscCode} highlight={true} />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button onClick={() => { setView('list'); setActiveRecord(null); }} className="px-10 py-4 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all">
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}