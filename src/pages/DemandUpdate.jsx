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

export default function DemandUpdate() {
  const { userRole } = useOutletContext(); 

  // --- MOCK DATA PERFECTLY ALIGNED FOR ROLES ---
  const [demands, setDemands] = useState([
    { 
      id: 1, workId: 'WRK-2026-800', workName: 'Road Development Ward 4', sector: 'Infrastructure', subSector: 'Road Dev.', 
      relatedDept: 'Gram Panchayat', startDate: '2026-06-01', endDate: '2026-12-01', requestedAmount: '500000', 
      submittedTo: 'Janpad', status: 'Pending', remarks: '',
      sanctionArea: 'Rural', district: 'Bilaspur', coverageDistrict: 'Bilaspur', tahsil: 'Bilha', block: 'Bilha', 
      gramPanchayat: 'Uslapur', villageWard: 'Ward 4', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Community', 
      estimatedAmount: '500000', agency: 'Local Contractors', agencyDept: 'Panchayat Raj'
    },
    { 
      id: 2, workId: 'WRK-2026-801', workName: 'Primary School Renovation', sector: 'Education', subSector: 'Maintenance', 
      relatedDept: 'Gram Panchayat', startDate: '2026-07-15', endDate: '2026-10-15', requestedAmount: '800000', 
      submittedTo: 'CEO Jila Adhyaksh', status: 'Approved', remarks: 'Funds verified and approved.',
      sanctionArea: 'Semi-Urban', district: 'Bilaspur', coverageDistrict: 'Bilaspur', tahsil: 'Takhatpur', block: 'Takhatpur', 
      gramPanchayat: 'Khamhariya', villageWard: 'Ward 12', vidhanSabha: 'Takhatpur Assembly', beneficiaryType: 'Students', 
      estimatedAmount: '800000', agency: 'EduBuild Pvt', agencyDept: 'PWD'
    },
    { 
      id: 3, workId: 'WRK-2026-802', workName: 'Rural Dispensary Block A', sector: 'Health', subSector: 'Hospital Constr.', 
      relatedDept: 'Janpad', startDate: '2026-08-01', endDate: '2027-02-01', requestedAmount: '850000', 
      submittedTo: 'CEO Jila Adhyaksh', status: 'Change and Forward', remarks: 'Please reduce the requested budget to 7L for Phase 1.',
      sanctionArea: 'Rural', district: 'Bilaspur', coverageDistrict: 'Bilaspur', tahsil: 'Kota', block: 'Kota', 
      gramPanchayat: 'Block A Center', villageWard: 'Ward 1', vidhanSabha: 'Kota Assembly', beneficiaryType: 'Public', 
      estimatedAmount: '850000', agency: 'MediCorp Builders', agencyDept: 'Health Dept'
    },
    { 
      id: 4, workId: 'WRK-2026-803', workName: 'Connecting Road Bridge', sector: 'Infrastructure', subSector: 'Bridge Dev.', 
      relatedDept: 'Janpad', startDate: '2026-04-20', endDate: '2026-11-20', requestedAmount: '1200000', 
      submittedTo: 'CEO Jila Adhyaksh', status: 'Pending', remarks: '',
      sanctionArea: 'Rural', district: 'Bilaspur', coverageDistrict: 'Bilaspur', tahsil: 'Bilha', block: 'Bilha', 
      gramPanchayat: 'Bridge Zone', villageWard: 'Ward 8', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Logistics', 
      estimatedAmount: '1200000', agency: 'Roadways Ltd', agencyDept: 'PWD'
    },
    { 
      id: 5, workId: 'WRK-2026-804', workName: 'Community Water Tank', sector: 'Infrastructure', subSector: 'Water Supply', 
      relatedDept: 'Gram Panchayat', startDate: '2026-03-05', endDate: '2026-08-15', requestedAmount: '300000', 
      submittedTo: 'Janpad', status: 'Rejected', remarks: 'Technical sanction documents are invalid.',
      sanctionArea: 'Rural', district: 'Bilaspur', coverageDistrict: 'Bilaspur', tahsil: 'Masturi', block: 'Masturi', 
      gramPanchayat: 'Masturi GP', villageWard: 'Ward 2', vidhanSabha: 'Masturi Assembly', beneficiaryType: 'Village', 
      estimatedAmount: '300000', agency: 'AquaFlow', agencyDept: 'PHE'
    },
  ]);

  // View States
  const [view, setView] = useState('list'); 
  const [selectedDemand, setSelectedDemand] = useState(null);
  
  // Review Form States
  const [actionDecision, setActionDecision] = useState('');
  const [approvalDate, setApprovalDate] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // Modals & Toasts
  const [confirmModal, setConfirmModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const actionOptions = [
    'Forward and Approve',
    'Change and Forward',
    'Forward and Rejected',
    'Objection in Fund Demand'
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- ROLE VERIFICATION LOGIC ---
  const normalizedUserRole = userRole === 'CO Jila Adhyaksh' ? 'CEO Jila Adhyaksh' : userRole;

  const isApprover = (demand) => {
    return demand.submittedTo === normalizedUserRole || (userRole === 'CO Jila Adhyaksh' && demand.submittedTo.includes('CEO'));
  };

  const isCreator = (demand) => {
    return demand.relatedDept === userRole;
  };

  // Filter demands meant for this user (either they created it or are the approver)
  const roleDemands = demands.filter(d => isApprover(d) || isCreator(d));
  
  const filteredDemands = roleDemands.filter(d => {
    const matchesSearch = d.workName.toLowerCase().includes(searchQuery.toLowerCase()) || d.workId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDemands.length / itemsPerPage);
  const currentData = filteredDemands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // --- ACTIONS ---
  const handleReviewClick = (demand) => {
    setSelectedDemand(demand);
    setApprovalDate(new Date().toISOString().split('T')[0]);
    setApprovedAmount(demand.requestedAmount);
    setActionDecision('');
    setRemarks('');
    setView('review');
  };

  const handleActionChange = (val) => {
    setActionDecision(val);
    if (val === 'Forward and Approve') {
      setApprovedAmount(selectedDemand.requestedAmount);
    }
  };

  const processReviewSubmit = (e) => {
    e.preventDefault();
    if (!actionDecision) return alert("Please select an Action Decision.");
    if ((actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand') && !remarks.trim()) {
      return alert("Remarks are mandatory for Rejections and Objections.");
    }
    setConfirmModal(true);
  };

  const confirmAccept = () => {
    let finalStatus = 'Pending';
    let msg = '';
    let msgType = 'success';

    if (actionDecision === 'Forward and Approve' || actionDecision === 'Change and Forward') {
      finalStatus = actionDecision === 'Change and Forward' ? 'Change and Forward' : 'Approved';
      msg = `Demand Actioned: ${actionDecision}. Sent back/Forwarded appropriately.`;
    } else {
      finalStatus = 'Rejected';
      msg = `Demand Returned: ${actionDecision}. Remarks recorded.`;
      msgType = 'error';
    }

    setDemands(demands.map(d => {
      if (d.id === selectedDemand.id) {
        return { 
          ...d, 
          status: finalStatus, 
          approvedAmount: (finalStatus === 'Approved' || finalStatus === 'Change and Forward') ? approvedAmount : '0',
          remarks: remarks 
        };
      }
      return d;
    }));
    
    setConfirmModal(false);
    showToast(msg, msgType);
    setView('list');
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
            <div className="w-16 h-16 bg-[#451db3]/10 text-[#451db3] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Confirm Action</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">
              You are about to execute: <br/><span className="font-bold text-[#451db3] text-lg">{actionDecision}</span>
            </p>
            
            {(actionDecision === 'Forward and Approve' || actionDecision === 'Change and Forward') && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Final Disbursal Amount</p>
                <p className="text-2xl font-black text-slate-900">{formatCurrency(approvedAmount)}</p>
              </div>
            )}

            <div className="flex gap-4 w-full">
              <button onClick={() => setConfirmModal(false)} className="flex-1 py-3.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={confirmAccept} className="flex-1 py-3.5 rounded-full bg-[#451db3] text-white font-bold hover:bg-[#3a1796] shadow-[0_8px_20px_rgba(69,29,179,0.25)] transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Demand Approvals</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review, approve, or track fund demands associated with your department.</p>
        </div>
        {view === 'review' && (
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
                options={['Pending', 'Approved', 'Change and Forward', 'Rejected']}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Name</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sector</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Dept</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Timeline</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="7" className="px-8 py-12 text-center text-slate-500 font-bold">No demand requests found.</td></tr>
                  ) : (
                    currentData.map((demand, index) => (
                      <tr key={demand.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-5 font-bold text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-5 font-mono font-bold text-slate-700">{demand.workId}</td>
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-900">{demand.workName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">Requested: {formatCurrency(demand.requestedAmount)}</p>
                        </td>
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-700">{demand.sector}</p>
                          <p className="text-[10px] font-medium text-slate-500 uppercase">{demand.subSector}</p>
                        </td>
                        <td className="px-5 py-5 font-medium text-slate-600">{demand.relatedDept}</td>
                        <td className="px-5 py-5">
                          <p className="text-[11px] font-bold text-slate-500">Start: {demand.startDate}</p>
                          <p className="text-[11px] font-bold text-slate-500">End: {demand.endDate}</p>
                        </td>
                        
                        <td className="px-5 py-5 text-center flex flex-col items-center justify-center gap-2">
                          
                          {/* 1. APPROVER VIEW (Pending) */}
                          {demand.status === 'Pending' && isApprover(demand) && (
                            <button 
                              onClick={() => handleReviewClick(demand)}
                              className="px-6 py-2.5 rounded-full bg-[#451db3]/10 text-[#451db3] text-[10px] font-black uppercase tracking-widest hover:bg-[#451db3] hover:text-white transition-all shadow-sm w-full"
                            >
                              Review & Approve
                            </button>
                          )}

                          {/* 2. CREATOR VIEW (Pending) */}
                          {demand.status === 'Pending' && !isApprover(demand) && isCreator(demand) && (
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                              Awaiting {demand.submittedTo}
                            </span>
                          )}

                          {/* 3. CREATOR VIEW (Approved) -> Shows Complete */}
                          {demand.status === 'Approved' && isCreator(demand) && (
                            <button 
                              onClick={() => showToast('Redirecting to Completion Process...', 'success')}
                              className="px-6 py-2.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 shadow-[0_4px_10px_rgba(34,197,94,0.3)] transition-all w-full"
                            >
                              Complete ✓
                            </button>
                          )}

                          {/* 4. CREATOR VIEW (Change and Forward) -> Shows Update */}
                          {demand.status === 'Change and Forward' && isCreator(demand) && (
                            <button 
                              onClick={() => showToast('Redirecting to Update Demand Form...', 'success')}
                              className="px-6 py-2.5 rounded-full bg-[#451db3] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#3a1796] shadow-[0_4px_10px_rgba(69,29,179,0.3)] transition-all w-full"
                            >
                              Update Form
                            </button>
                          )}

                          {/* Display Status Pill (Only if action is done or user is not active) */}
                          {demand.status !== 'Pending' && (
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              demand.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' : 
                              demand.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 
                              'bg-[#451db3]/10 text-[#451db3] border-[#451db3]/20'
                            }`}>
                              {demand.status}
                            </span>
                          )}

                          {/* Display Remarks for Rejections or Changes */}
                          {demand.remarks && (demand.status === 'Rejected' || demand.status === 'Change and Forward') && (
                            <p className="text-[10px] text-red-500 font-bold max-w-[150px] truncate" title={demand.remarks}>
                              Note: {demand.remarks}
                            </p>
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
      {/* VIEW: REVIEW & APPROVE FORM */}
      {/* ======================================================= */}
      {view === 'review' && selectedDemand && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500 overflow-visible flex flex-col gap-10">
          
          {/* Top Panel: Detailed Summary */}
          <div className="bg-[#451db3]/5 border border-[#451db3]/10 rounded-3xl p-6 sm:p-8">
            <h3 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">Comprehensive Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Highlighted Banner Spanning Top */}
              <div className="sm:col-span-2 lg:col-span-4 flex flex-col md:flex-row justify-between items-start md:items-end bg-white border-2 border-[#451db3]/20 rounded-2xl p-6 mb-2 shadow-[0_2px_15px_rgba(69,29,179,0.05)]">
                <div className="mb-4 md:mb-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Work Name</p>
                  <p className="font-black text-slate-900 text-xl md:text-2xl mt-0.5">{selectedDemand.workName}</p>
                  <p className="font-mono font-bold text-[#451db3] mt-1">{selectedDemand.workId}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Proposed Estimated Cost</p>
                  <p className="text-3xl md:text-4xl font-black text-slate-900">{formatCurrency(selectedDemand.estimatedAmount)}</p>
                </div>
              </div>

              {/* Grid of Details */}
              <DetailRow label="Sector" value={selectedDemand.sector} />
              <DetailRow label="Sub Sector" value={selectedDemand.subSector} />
              <DetailRow label="Related Department" value={selectedDemand.relatedDept} />
              <DetailRow label="Status of Sanction Area" value={selectedDemand.sanctionArea} />
              
              <DetailRow label="District" value={selectedDemand.district} />
              <DetailRow label="Coverage District" value={selectedDemand.coverageDistrict} />
              <DetailRow label="Tahsil" value={selectedDemand.tahsil} />
              <DetailRow label="Block" value={selectedDemand.block} />

              <DetailRow label="Gram Panchayat" value={selectedDemand.gramPanchayat} />
              <DetailRow label="Village / Ward" value={selectedDemand.villageWard} />
              <DetailRow label="Vidhan Sabha" value={selectedDemand.vidhanSabha} />
              <DetailRow label="Beneficiary Type" value={selectedDemand.beneficiaryType} />

              <DetailRow label="Agency" value={selectedDemand.agency} />
              <DetailRow label="Agency Department" value={selectedDemand.agencyDept} />
            </div>
          </div>

          {/* Bottom Panel: Action Form */}
          <div className="flex flex-col justify-start">
            <h3 className="text-2xl font-black text-slate-800 mb-8 px-2">Process Decision</h3>
            
            <form onSubmit={processReviewSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Decision Dropdown */}
                <div className="space-y-2 relative z-50">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Action Decision <span className="text-red-500">*</span></label>
                  <CustomDropdown 
                    placeholder="Select an Action..."
                    value={actionDecision}
                    onChange={handleActionChange}
                    options={actionOptions}
                  />
                </div>

                {/* Date of Declaration */}
                <div className="space-y-2 relative z-40">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Date of Declaration <span className="text-red-500">*</span></label>
                  <input 
                    type="date" required
                    value={approvalDate}
                    onChange={e => setApprovalDate(e.target.value)}
                    className={inputClass} 
                  />
                </div>
              </div>

              {/* Amount & Remarks Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-30">
                <div className={`space-y-2 transition-opacity duration-300 ${(actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand') ? 'opacity-30 pointer-events-none' : ''}`}>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Approved Amount (₹)</label>
                  <input 
                    type="number" 
                    value={approvedAmount}
                    onChange={e => setApprovedAmount(e.target.value)}
                    disabled={actionDecision === 'Forward and Approve' || actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand'}
                    className={`${inputClass} disabled:bg-slate-50`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                    Remarks / Objections {(actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand') && <span className="text-red-500">*</span>}
                  </label>
                  <textarea 
                    rows="2" 
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    required={(actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand')}
                    placeholder={(actionDecision === 'Forward and Rejected' || actionDecision === 'Objection in Fund Demand') ? "Please provide detailed reasons for rejection/objection..." : "Enter optional remarks..."} 
                    className={`${inputClass} rounded-3xl resize-none py-3`}
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="submit" 
                  className="w-full md:w-auto md:px-16 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all float-right"
                >
                  Confirm & Execute Action ✓
                </button>
                <div className="clear-both"></div>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}

// Small helper component for the Detailed Summary List without Numbers
const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-700 mt-0.5">
      {value || 'N/A'}
    </p>
  </div>
);