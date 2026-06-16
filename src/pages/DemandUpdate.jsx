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
          isOpen ? 'bg-[#451db3]/10 border-[#451db3] text-[#451db3]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#451db3]/50 focus:ring-2 focus:ring-[#451db3]/20 shadow-sm'
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
    <p className={`text-sm ${highlight ? 'font-black text-[#451db3]' : 'font-bold text-slate-800'}`}>
      {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
    </p>
  </div>
);

export default function DemandUpdate() {
  const { userRole } = useOutletContext(); 

  // Security check: Gram Panchayat cannot verify demands
  if (userRole === 'Gram Panchayat') {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2">Gram Panchayat users do not have verification access.</p>
      </div>
    );
  }

  // --- MOCK DATA ---
  const [demands, setDemands] = useState([
    { 
      id: 1, workId: 'WRK-2026-800', workName: 'Road Development Ward 4', sector: 'Infrastructure', subSector: 'Road Dev.', financialYear: '2026-2027', 
      relatedDept: 'Gram Panchayat', startDate: '2026-06-01', endDate: '2026-12-01', requestedAmount: '500000', 
      submittedTo: 'Janpad', status: 'Pending Verification', remarks: '',
      sanctionArea: 'Rural', district: 'Bilaspur', workLevel: 'Gram Panchayat', coverageDistrict: 'Bilaspur', area: 'Ward 4', 
      tahsil: 'Bilha', block: 'Bilha', gramPanchayat: 'Uslapur', villageWard: 'Ward 4', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Community', 
      docs: { ts: true, uc: false, cc: false, geo: true }
    },
    { 
      id: 2, workId: 'WRK-2026-801', workName: 'Primary School Renovation', sector: 'Education', subSector: 'Maintenance', financialYear: '2026-2027',
      relatedDept: 'Gram Panchayat', startDate: '2026-07-15', endDate: '2026-10-15', requestedAmount: '800000', 
      submittedTo: 'CEO Jila Panchayat', status: 'Approved', remarks: 'Funds verified and approved.',
      sanctionArea: 'Semi-Urban', district: 'Bilaspur', workLevel: 'Janpad', coverageDistrict: 'Bilaspur', area: 'Block B', 
      tahsil: 'Takhatpur', block: 'Takhatpur', gramPanchayat: 'Khamhariya', villageWard: 'Ward 12', vidhanSabha: 'Takhatpur Assembly', beneficiaryType: 'Students', 
      docs: { ts: true, uc: true, cc: false, geo: true }
    },
    { 
      id: 3, workId: 'WRK-2026-802', workName: 'Rural Dispensary Block A', sector: 'Health', subSector: 'Hospital Constr.', financialYear: '2025-2026',
      relatedDept: 'Janpad', startDate: '2026-08-01', endDate: '2027-02-01', requestedAmount: '850000', 
      submittedTo: 'CEO Jila Panchayat', status: 'Pending Verification', remarks: '',
      sanctionArea: 'Rural', district: 'Bilaspur', workLevel: 'Janpad', coverageDistrict: 'Bilaspur', area: 'Block A', 
      tahsil: 'Kota', block: 'Kota', gramPanchayat: 'Block A Center', villageWard: 'Ward 1', vidhanSabha: 'Kota Assembly', beneficiaryType: 'Health', 
      docs: { ts: true, uc: false, cc: false, geo: true }
    },
  ]);

  // View States
  const [view, setView] = useState('list'); 
  const [selectedDemand, setSelectedDemand] = useState(null);
  
  // Verification Form States
  const [actionDecision, setActionDecision] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [forwardDept, setForwardDept] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // Modals & Toasts
  const [confirmModal, setConfirmModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFinYear, setFilterFinYear] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const actionOptions = [
    'Change and Forward',
    'Forward for Approval',
    'Forward for Rejection',
    'Object in Fund Demand'
  ];

  const forwardingDepartments = ['CEO Jila Panchayat', 'State Directorate', 'Finance Dept'];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- ROLE VERIFICATION LOGIC ---
  const normalizedUserRole = userRole === 'CO Jila Adhyaksh' ? 'CEO Jila Panchayat' : userRole;
  
  // Demands routed to this user
  const roleDemands = demands.filter(d => d.submittedTo === normalizedUserRole || (userRole === 'CO Jila Adhyaksh' && d.submittedTo.includes('CEO')));
  
  // Extract unique filter options from the specific role demands
  const uniqueFinYears = [...new Set(roleDemands.map(p => p.financialYear))];
  const uniqueSectors = [...new Set(roleDemands.map(p => p.sector))];
  const uniqueDepartments = [...new Set(roleDemands.map(p => p.relatedDept))];

  // Filtering Logic
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterDepartment, filterFinYear, filterSector]);

  const filteredDemands = roleDemands.filter(d => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = d.workName.toLowerCase().includes(searchLower) || d.workId.toLowerCase().includes(searchLower);
    const matchesDept = filterDepartment === '' || d.relatedDept === filterDepartment;
    const matchesFinYear = filterFinYear === '' || d.financialYear === filterFinYear;
    const matchesSector = filterSector === '' || d.sector === filterSector;
    
    return matchesSearch && matchesDept && matchesFinYear && matchesSector;
  });

  const totalPages = Math.ceil(filteredDemands.length / itemsPerPage);
  const currentData = filteredDemands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- ACTIONS ---
  const handleVerifyClick = (demand) => {
    setSelectedDemand(demand);
    setActionDecision('');
    setApprovedAmount('');
    setForwardDept('');
    setRemarks('');
    setView('verify');
  };

  const processVerificationSubmit = (e) => {
    e.preventDefault();
    if (!actionDecision) return alert("Please select an Action Decision.");
    
    // Validation constraints based on selection
    if ((actionDecision === 'Change and Forward' || actionDecision === 'Object in Fund Demand') && !approvedAmount) {
      return alert("Please specify the amount you are willing to approve or suggest.");
    }
    if (actionDecision === 'Forward for Approval' && !forwardDept) {
      return alert("Please select the Department to forward to.");
    }
    if ((actionDecision === 'Forward for Rejection' || actionDecision === 'Object in Fund Demand') && !remarks.trim()) {
      return alert("Remarks are strictly mandatory for Rejections and Objections.");
    }

    setConfirmModal(true);
  };

  const confirmVerification = () => {
    let finalStatus = 'Pending Verification';
    let msg = '';
    let msgType = 'success';

    if (actionDecision === 'Change and Forward') {
      finalStatus = 'Change and Forward';
      msg = `Demand updated and forwarded. Amount set to ${formatCurrency(approvedAmount)}.`;
    } else if (actionDecision === 'Forward for Approval') {
      finalStatus = 'Forwarded';
      msg = `Demand successfully forwarded to ${forwardDept}.`;
    } else if (actionDecision === 'Forward for Rejection') {
      finalStatus = 'Rejected';
      msg = `Demand rejected. Remarks recorded.`;
      msgType = 'error';
    } else if (actionDecision === 'Object in Fund Demand') {
      finalStatus = 'Objection Raised';
      msg = `Objection raised for Demand. Returned to creator.`;
      msgType = 'error';
    }

    setDemands(demands.map(d => {
      if (d.id === selectedDemand.id) {
        return { 
          ...d, 
          status: finalStatus, 
          remarks: remarks,
          approvedAmount: approvedAmount || null,
          submittedTo: forwardDept || d.submittedTo
        };
      }
      return d;
    }));
    
    setConfirmModal(false);
    showToast(msg, msgType);
    setView('list');
    setSelectedDemand(null);
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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${actionDecision.includes('Reject') || actionDecision.includes('Object') ? 'bg-red-50 text-red-500' : 'bg-[#451db3]/10 text-[#451db3]'}`}>
              <span className="text-3xl font-black">!</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Confirm Execution</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              You are about to execute: <br/><span className="font-bold text-[#451db3] text-lg">{actionDecision}</span>
            </p>
            
            <div className="flex gap-4 w-full">
              <button onClick={() => setConfirmModal(false)} className="flex-1 py-3.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={confirmVerification} className={`flex-1 py-3.5 rounded-full text-white font-bold transition-all shadow-md ${actionDecision.includes('Reject') || actionDecision.includes('Object') ? 'bg-red-500 hover:bg-red-600' : 'bg-[#451db3] hover:bg-[#3a1796]'}`}>Confirm Action</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4 sticky top-4 z-40">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">
            {view === 'list' && 'Demand Verification'}
            {view === 'verify' && 'Verify Demand Details'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {view === 'list' && 'Review and process fund demands assigned to your department.'}
            {view === 'verify' && `Comprehensive review and action for ${selectedDemand?.workId}`}
          </p>
        </div>
        {view === 'verify' && (
          <button onClick={() => setView('list')} className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors">
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST DEMANDS */}
      {/* ======================================================= */}
      {view === 'list' && (
        <>
          {/* Top Search & Filter Bar */}
          <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 ml-2 hidden md:block">Filters</span>
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
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
            <div className="overflow-x-auto pb-6">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest w-12">S.No</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Status of Sanction Area</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">District</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Level</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Coverage Dist.</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Area</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Tehsil</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Block</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Gram Panchayat</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Village/Ward</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Vidhan Sabha</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Est. Amount (₹)</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="14" className="px-8 py-12 text-center text-slate-500 font-bold">No demands pending your verification.</td></tr>
                  ) : (
                    currentData.map((demand, index) => (
                      <tr key={demand.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-5 font-bold text-slate-500 align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.sanctionArea}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.district}</td>
                        <td className="px-5 py-5 font-bold text-slate-800 align-middle">{demand.workLevel}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.coverageDistrict}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.area}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.tahsil}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.block}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.gramPanchayat}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.villageWard}</td>
                        <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.vidhanSabha}</td>
                        <td className="px-5 py-5 font-black text-[#451db3] text-right align-middle">{formatCurrency(demand.requestedAmount)}</td>
                        <td className="px-5 py-5 text-center align-middle">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            demand.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' : 
                            demand.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 
                            demand.status === 'Pending Verification' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                            'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>
                            {demand.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-center align-middle">
                          {demand.status === 'Pending Verification' ? (
                            <button 
                              onClick={() => handleVerifyClick(demand)}
                              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-[10px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-md whitespace-nowrap"
                            >
                              Verify
                            </button>
                          ) : (
                            <span className="text-slate-300 font-bold text-xl">-</span>
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
                Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredDemands.length)}</span> of <span className="text-[#451db3]">{filteredDemands.length}</span>
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
      {/* VIEW: VERIFY DETAILS & ACTION FORM */}
      {/* ======================================================= */}
      {view === 'verify' && selectedDemand && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 flex flex-col gap-10">
          
          <div className="bg-[#451db3]/5 border border-[#451db3]/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Comprehensive Demand Review</h3>
            
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col md:flex-row justify-between items-start md:items-end bg-white border-2 border-[#451db3]/20 rounded-2xl p-6 mb-8 shadow-[0_2px_15px_rgba(69,29,179,0.05)]">
              <div className="mb-4 md:mb-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Name</p>
                <p className="font-black text-slate-900 text-xl md:text-2xl mt-0.5">{selectedDemand.workName}</p>
                <p className="font-mono font-bold text-[#451db3] mt-1">{selectedDemand.workId}</p>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Demand Amount Requested</p>
                <p className="text-3xl md:text-4xl font-black text-slate-900">{formatCurrency(selectedDemand.requestedAmount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <DetailItem label="Tehsil" value={selectedDemand.tahsil} />
              <DetailItem label="Vidhan Sabha" value={selectedDemand.vidhanSabha} />
              <DetailItem label="Beneficiary Type" value={selectedDemand.beneficiaryType} />
              <DetailItem label="Start Date" value={selectedDemand.startDate} />
              <DetailItem label="End Date" value={selectedDemand.endDate} />
              <DetailItem label="Submitted By Dept" value={selectedDemand.relatedDept} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Attached Documentation & Geofence</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden lg:col-span-1 min-h-[200px]">
                {selectedDemand.docs?.geo ? (
                  <>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
                    <span className="text-4xl relative z-10 mb-2">📍</span>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">Current Site Geo-Tag Photo *</p>
                    <p className="text-[10px] font-bold text-emerald-600 font-mono mt-2 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 relative z-10 shadow-sm">Verified Match (Lat: 22.07, Long: 82.13)</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl text-slate-300 mb-2">🚫</span>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Geo-Tag Registered</p>
                  </>
                )}
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Technical Sanction (TS)</span>
                  {selectedDemand.docs?.ts ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">Missing</span>}
                </div>
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Utility Certificate (UC)</span>
                  {selectedDemand.docs?.uc ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">Missing</span>}
                </div>
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Completion Certificate (CC)</span>
                  {selectedDemand.docs?.cc ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">Missing</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-8 bg-white border border-slate-100 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-black text-slate-800 mb-2 px-2">Verification Action</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 px-2">Select an outcome to process this fund demand request.</p>
            
            <form onSubmit={processVerificationSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 relative z-50">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Verification Action <span className="text-red-500">*</span></label>
                  <CustomDropdown 
                    placeholder="Select Verification Outcome..."
                    value={actionDecision}
                    onChange={setActionDecision}
                    options={actionOptions}
                  />
                </div>
                
                {/* Conditionally Render Forward Department Select */}
                {actionDecision === 'Forward for Approval' && (
                  <div className="space-y-2 relative z-40 animate-in fade-in">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Select Department to Forward To <span className="text-red-500">*</span></label>
                    <CustomDropdown 
                      placeholder="Select Department..."
                      value={forwardDept}
                      onChange={setForwardDept}
                      options={forwardingDepartments}
                    />
                  </div>
                )}
              </div>

              {/* Amount Row: Only show if changing or objecting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`space-y-2 transition-all duration-300 ${(actionDecision === 'Change and Forward' || actionDecision === 'Object in Fund Demand') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden absolute pointer-events-none'}`}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Approved / Suggested Amount (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={approvedAmount}
                    onChange={e => setApprovedAmount(e.target.value)}
                    required={(actionDecision === 'Change and Forward' || actionDecision === 'Object in Fund Demand')}
                    placeholder="Enter amount ready to give..." 
                    className={inputClass} 
                  />
                </div>
              </div>

              {/* Remarks Box: Mandatory for rejection/objection */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                  Remarks / Objections {(actionDecision === 'Forward for Rejection' || actionDecision === 'Object in Fund Demand') && <span className="text-red-500">*</span>}
                </label>
                <textarea 
                  rows="3" 
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  required={(actionDecision === 'Forward for Rejection' || actionDecision === 'Object in Fund Demand')}
                  placeholder={(actionDecision === 'Forward for Rejection' || actionDecision === 'Object in Fund Demand') ? "Mandatory: Please specify reasons for rejection or objection..." : "Enter optional processing remarks..."} 
                  className={`${inputClass} rounded-3xl resize-none py-4`}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  type="button" 
                  onClick={() => setView('list')} 
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto md:px-16 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  Confirm & Execute Action ✓
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}