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

export default function Accountant() {
  const { userRole } = useOutletContext(); 

  // --- MOCK DATA: DEMANDS AWAITING PAYMENT ---
  const [demands, setDemands] = useState([
    { id: 1, workId: 'WRK-2026-800', workName: 'Road Development Ward 4', approvedBy: 'Janpad', destination: 'Gram Panchayat (Uslapur)', amount: 500000, installment: '1st Installment', status: 'Pending' },
    { id: 2, workId: 'WRK-2026-801', workName: 'Panchayat Solar Expansion', approvedBy: 'CEO Jila Panchayat', destination: 'SunPower Co.', amount: 250000, installment: '1st Installment', status: 'Pending' },
    { id: 3, workId: 'WRK-2026-800', workName: 'Road Development Ward 4', approvedBy: 'Janpad', destination: 'Gram Panchayat (Uslapur)', amount: 200000, installment: '2nd Installment', status: 'Pending' }, // Notice same Work ID to simulate 2nd installment
    { id: 4, workId: 'WRK-2026-802', workName: 'Rural Dispensary Block A', approvedBy: 'CEO Jila Panchayat', destination: 'MediCorp Builders', amount: 850000, installment: 'Final Payment', status: 'Paid' },
  ]);

  // --- MOCK DATA: SAVED BANK DETAILS (Auto-fill for 2nd/3rd installments) ---
  const [savedBankDetails, setSavedBankDetails] = useState({
    'WRK-2026-802': { senderBank: 'SBI Zila Parishad', senderAcc: '30291188321', receiverBank: 'HDFC MediCorp', receiverAcc: '5010029384' }
  });

  // States
  const [view, setView] = useState('list'); // 'list' | 'paymentForm'
  const [activeDemand, setActiveDemand] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({ senderBank: '', senderAcc: '', receiverBank: '', receiverAcc: '' });
  
  const [confirmModal, setConfirmModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- FILTERING & PAGINATION ---
  const filteredDemands = demands.filter(d => {
    const matchesSearch = d.workName.toLowerCase().includes(searchQuery.toLowerCase()) || d.workId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDemands.length / itemsPerPage);
  const currentData = filteredDemands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  // --- ACTIONS ---
  const handleInitiatePayment = (demand) => {
    setActiveDemand(demand);
    
    // Auto-fill logic if bank details for this project exist
    if (savedBankDetails[demand.workId]) {
      setPaymentForm(savedBankDetails[demand.workId]);
    } else {
      setPaymentForm({ senderBank: '', senderAcc: '', receiverBank: '', receiverAcc: '' });
    }
    setView('paymentForm');
  };

  const handleReviewPayment = (e) => {
    e.preventDefault();
    setConfirmModal(true); // Open the final confirmation popup
  };

  const executePayment = () => {
    // 1. Update the demand status to 'Paid'
    setDemands(demands.map(d => d.id === activeDemand.id ? { ...d, status: 'Paid' } : d));
    
    // 2. Save/Update the bank details for future installments of this project
    setSavedBankDetails({
      ...savedBankDetails,
      [activeDemand.workId]: paymentForm
    });

    setConfirmModal(false);
    showToast('Payment Processed & Disbursed Successfully!', 'success');
    setView('list');
    setActiveDemand(null);
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  return (
    <div className="space-y-6 pb-10 relative">
      
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

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 p-8">
            <div className="w-16 h-16 bg-[#451db3]/10 text-[#451db3] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">Confirm Disbursement</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 text-center">Please verify the routing details before finalizing the transaction.</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Amount</span>
                <span className="text-xl font-black text-[#451db3]">{formatCurrency(activeDemand.amount)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From (Sender)</p>
                  <p className="font-bold text-slate-800 text-sm mt-1">{paymentForm.senderBank}</p>
                  <p className="font-mono text-xs text-slate-500">{paymentForm.senderAcc}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To (Receiver)</p>
                  <p className="font-bold text-slate-800 text-sm mt-1">{paymentForm.receiverBank}</p>
                  <p className="font-mono text-xs text-slate-500">{paymentForm.receiverAcc}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button onClick={() => setConfirmModal(false)} className="flex-1 py-3.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Edit Details</button>
              <button onClick={executePayment} className="flex-1 py-3.5 rounded-full bg-[#451db3] text-white font-bold hover:bg-[#3a1796] shadow-[0_8px_20px_rgba(69,29,179,0.25)] transition-all">Proceed to Pay ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Financial Disbursal</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review approved demands and securely process fund transfers.</p>
        </div>
        {view === 'paymentForm' && (
          <button onClick={() => setView('list')} className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors">
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST PENDING / PAID DEMANDS */}
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
                options={['Pending', 'Paid']}
              />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                  <tr>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Project Details</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Approved By</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Destination</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Installment</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Amount</th>
                    <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.length === 0 ? (
                    <tr><td colSpan="7" className="px-8 py-12 text-center text-slate-500 font-bold">No demands match your filters.</td></tr>
                  ) : (
                    currentData.map((demand, index) => (
                      <tr key={demand.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                        <td className="px-5 py-5 font-bold text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-900">{demand.workName}</p>
                          <p className="text-[11px] font-mono font-bold text-[#451db3] mt-1">{demand.workId}</p>
                        </td>
                        <td className="px-5 py-5 font-bold text-slate-600">{demand.approvedBy}</td>
                        <td className="px-5 py-5 font-bold text-slate-700">{demand.destination}</td>
                        <td className="px-5 py-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                            {demand.installment}
                          </span>
                        </td>
                        <td className="px-5 py-5 font-black text-slate-900 text-right">{formatCurrency(demand.amount)}</td>
                        <td className="px-5 py-5 text-center">
                          {demand.status === 'Pending' ? (
                            <button 
                              onClick={() => handleInitiatePayment(demand)}
                              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-[11px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-[0_4px_10px_rgba(69,29,179,0.2)]"
                            >
                              Process Payment
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-200">
                              Paid ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
      {/* VIEW: PAYMENT FORM */}
      {/* ======================================================= */}
      {view === 'paymentForm' && activeDemand && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500 overflow-visible flex flex-col gap-10">
          
          {/* Top Panel: Demand Summary */}
          <div className="bg-[#451db3]/5 border border-[#451db3]/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-bold text-[#451db3] uppercase tracking-widest mb-1">Approved For Disbursement</p>
              <h3 className="text-2xl font-black text-slate-900">{activeDemand.workName}</h3>
              <p className="font-mono font-bold text-slate-500 mt-1">{activeDemand.workId} | {activeDemand.installment}</p>
            </div>
            <div className="bg-white border-2 border-[#451db3]/20 rounded-2xl p-5 shadow-sm min-w-[200px] text-right">
              <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Total Amount Due</p>
              <p className="text-3xl font-black text-slate-900">{formatCurrency(activeDemand.amount)}</p>
            </div>
          </div>

          {/* Bottom Panel: Banking Details Form */}
          <div className="flex flex-col justify-start">
            <div className="mb-8 px-2 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Banking & Routing Details</h3>
              {savedBankDetails[activeDemand.workId] && (
                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                  Auto-filled from previous installment ✓
                </span>
              )}
            </div>
            
            <form onSubmit={handleReviewPayment} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* SENDER DETAILS */}
                <div className="space-y-6 bg-slate-50/50 border border-slate-100 p-6 rounded-3xl">
                  <h4 className="text-sm font-black text-[#451db3] uppercase tracking-widest border-b border-slate-200 pb-2">Sender Information (Source)</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sender Bank Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required placeholder="e.g. SBI Zila Parishad"
                      value={paymentForm.senderBank}
                      onChange={e => setPaymentForm({...paymentForm, senderBank: e.target.value})}
                      className={inputClass} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sender Account Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required placeholder="Account No."
                      value={paymentForm.senderAcc}
                      onChange={e => setPaymentForm({...paymentForm, senderAcc: e.target.value})}
                      className={inputClass} 
                    />
                  </div>
                </div>

                {/* RECEIVER DETAILS */}
                <div className="space-y-6 bg-slate-50/50 border border-slate-100 p-6 rounded-3xl">
                  <h4 className="text-sm font-black text-[#451db3] uppercase tracking-widest border-b border-slate-200 pb-2">Receiver Information (Destination)</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Receiver Bank Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required placeholder="e.g. HDFC Gram Panchayat"
                      value={paymentForm.receiverBank}
                      onChange={e => setPaymentForm({...paymentForm, receiverBank: e.target.value})}
                      className={inputClass} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Receiver Account Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required placeholder="Account No."
                      value={paymentForm.receiverAcc}
                      onChange={e => setPaymentForm({...paymentForm, receiverAcc: e.target.value})}
                      className={inputClass} 
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 max-w-sm">Please verify account numbers carefully. Disbursals cannot be reversed automatically.</p>
                <button 
                  type="submit" 
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  Review Details & Proceed
                </button>
              </div>

            </form>
          </div>

        </div>
      )}

    </div>
  );
}