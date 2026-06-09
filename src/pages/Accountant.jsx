import React, { useState } from 'react';

export default function Accountant() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail'
  const [activeProject, setActiveProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    sender: '',
    receiver: '',
    description: '',
    fundType: 'Standard Allocation', // e.g., Internal Fund, Emergency
    paymentType: 'Full Payment', // e.g., Installment 1, Final Payment
    document: null
  });

  // Latest created transaction for the invoice view
  const [lastTransaction, setLastTransaction] = useState(null);

  // Mock Database: Projects (Expanded for Pagination)
  const [projects] = useState([
    { id: 1, sno: 'PRJ-001', name: 'Sample Community Hall', block: 'Raipur Block A', totalBudget: 500000, disbursed: 200000 },
    { id: 2, sno: 'PRJ-002', name: 'Primary School Renovation', block: 'Abhanpur', totalBudget: 800000, disbursed: 800000 },
    { id: 3, sno: 'PRJ-003', name: 'Road Construction Ward 45', block: 'Arang', totalBudget: 1200000, disbursed: 600000 },
    { id: 4, sno: 'PRJ-004', name: 'Village Dispensary Unit', block: 'Tilda', totalBudget: 450000, disbursed: 450000 },
    { id: 5, sno: 'PRJ-005', name: 'Panchayat Solar Grid', block: 'Arang', totalBudget: 950000, disbursed: 300000 },
    { id: 6, sno: 'PRJ-006', name: 'Connecting Bridge Phase 1', block: 'Raipur Block A', totalBudget: 2500000, disbursed: 1000000 },
    { id: 7, sno: 'PRJ-007', name: 'Community Water Tank', block: 'Abhanpur', totalBudget: 300000, disbursed: 150000 },
  ]);

  // Mock Database: Transactions mapped by Project ID
  const [transactions, setTransactions] = useState({
    1: [
      { id: 'TRX-9901', date: '2026-05-15', amount: 200000, sender: 'CO Jila Adhyaksh (Central A/C: ****4432)', receiver: 'Janpad Panchayat (A/C: ****8891)', type: 'Installment 1', fundType: 'Standard Allocation', desc: 'Initial mobilization advance.' }
    ]
  });

  // Pagination Logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentData = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Action Handlers
  const handleOpenDetail = (project) => {
    setActiveProject(project);
    setCurrentView('detail');
    setIsFormOpen(false);
    setShowInvoice(false);
  };

  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
    setIsFormOpen(false);
    setShowInvoice(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessTransaction = (e) => {
    e.preventDefault();
    
    // Auto-generate mock account strings based on selection
    const getAccountString = (entity) => {
      if (entity === 'CO Jila Adhyaksh') return `${entity} (Central A/C: ****4432)`;
      if (entity === 'Janpad') return `${entity} (A/C: ****8891)`;
      if (entity === 'Gram Panchayat') return `${entity} (A/C: ****5521)`;
      if (entity === 'Contractor / Engineer Firm') return `${entity} (Firm A/C: ****1109)`;
      return entity;
    };

    const newTrx = {
      id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().split('T')[0],
      amount: parseInt(formData.amount),
      sender: getAccountString(formData.sender),
      receiver: getAccountString(formData.receiver),
      type: formData.paymentType,
      fundType: formData.fundType,
      desc: formData.description
    };

    // Update history
    setTransactions({
      ...transactions,
      [activeProject.id]: [newTrx, ...(transactions[activeProject.id] || [])]
    });

    setLastTransaction(newTrx);
    setIsFormOpen(false);
    setShowInvoice(true); // Show success invoice

    // Reset Form
    setFormData({ amount: '', sender: '', receiver: '', description: '', fundType: 'Standard Allocation', paymentType: 'Full Payment', document: null });
  };

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Financial Ledger Portal</h2>
          <p className="text-sm text-gray-500">Select a project to manage fund transfers and view transaction histories.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Block / Location</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Total Budget</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Total Disbursed</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{proj.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{proj.sno}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{proj.block}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-right">₹{proj.totalBudget.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 text-right">₹{proj.disbursed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleOpenDetail(proj)} className="text-sm font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Manage Funds
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, projects.length)}</span> of <span className="font-medium text-gray-900">{projects.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage} disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 font-medium px-2">Page {currentPage} of {totalPages || 1}</span>
              <button 
                onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DETAIL VIEW ---
  const currentHistory = transactions[activeProject.id] || [];

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6">
      
      {/* Header - Movable, removed sticky classes */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium mb-2 block">← Back to Ledger</button>
          <h2 className="text-xl font-bold text-gray-900">{activeProject.name}</h2>
          <p className="text-sm text-gray-500 font-mono">{activeProject.sno}</p>
        </div>
        <button 
          onClick={() => { setIsFormOpen(true); setShowInvoice(false); }}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm w-full sm:w-auto"
        >
          + Process Transaction
        </button>
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-300 rounded-xl shadow-xl w-full max-w-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-xl">
              <h3 className="font-bold text-gray-900 text-lg">Initiate Fund Transfer</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleProcessTransaction} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-gray-200 bg-gray-50/50 rounded-xl">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Transfer Amount (₹)</label>
                  <input type="number" name="amount" required value={formData.amount} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-gray-500 text-lg font-medium" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Fund Category</label>
                  <select name="fundType" value={formData.fundType} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 bg-white">
                    <option value="Standard Allocation">Standard Allocation</option>
                    <option value="Internal Fund">Internal Department Fund</option>
                    <option value="Emergency Reserve">Emergency Reserve</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">From (Sender)</label>
                  <select name="sender" required value={formData.sender} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 bg-white">
                    <option value="">Select Origin Account</option>
                    <option value="CO Jila Adhyaksh">CO Jila Adhyaksh</option>
                    <option value="Janpad">Janpad</option>
                    <option value="Gram Panchayat">Gram Panchayat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">To (Receiver)</label>
                  <select name="receiver" required value={formData.receiver} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 bg-white">
                    <option value="">Select Destination Account</option>
                    <option value="Janpad">Janpad</option>
                    <option value="Gram Panchayat">Gram Panchayat</option>
                    <option value="Contractor / Engineer Firm">Contractor / Engineer Firm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Payment Type</label>
                  <select name="paymentType" required value={formData.paymentType} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 bg-white">
                    <option value="Full Payment">Full Payment</option>
                    <option value="Installment 1">Installment 1</option>
                    <option value="Installment 2">Installment 2</option>
                    <option value="Final Settlement">Final Settlement</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Supporting Bill / Invoice</label>
                  <input type="file" accept=".pdf,image/*" onChange={(e) => setFormData({...formData, document: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">Transaction Description</label>
                <textarea name="description" required value={formData.description} onChange={handleChange} rows="2" placeholder="Purpose of this transfer..." className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"></textarea>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                  Authorize & Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Invoice View */}
      {showInvoice && lastTransaction && (
        <div className="bg-white border-2 border-gray-900 rounded-xl shadow-lg p-8 animate-in zoom-in-95">
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Payment Invoice</h3>
              <p className="text-sm text-gray-500 mt-1">Official Transfer Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{lastTransaction.id}</p>
              <p className="text-sm text-gray-500">{lastTransaction.date}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Transferred From</p>
              <p className="font-medium text-gray-900">{lastTransaction.sender.split(' (')[0]}</p>
              <p className="text-sm text-gray-500 font-mono mt-1">{lastTransaction.sender.match(/\(([^)]+)\)/)?.[1]}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Transferred To</p>
              <p className="font-medium text-gray-900">{lastTransaction.receiver.split(' (')[0]}</p>
              <p className="text-sm text-gray-500 font-mono mt-1">{lastTransaction.receiver.match(/\(([^)]+)\)/)?.[1]}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="font-medium text-gray-700">Project</span>
              <span className="font-bold text-gray-900">{activeProject.name}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="font-medium text-gray-700">Description</span>
              <span className="text-sm text-gray-600 text-right max-w-xs">{lastTransaction.desc}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <span className="font-medium text-gray-700">Payment Nature</span>
              <div className="text-right">
                <p className="font-medium text-gray-900">{lastTransaction.type}</p>
                <p className="text-xs text-gray-500">{lastTransaction.fundType}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900 uppercase">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900">₹{lastTransaction.amount.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={() => setShowInvoice(false)} className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
            Close Invoice & Return to Ledger
          </button>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">Transaction History Ledger</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">TRX ID / Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Routing Details (From → To)</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Payment Nature</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentHistory.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No transactions recorded.</td></tr>
              ) : (
                currentHistory.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{trx.id}</p>
                      <p className="text-xs text-gray-500 mt-1">{trx.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-gray-400 w-8">OUT:</span>
                          <span className="text-sm font-medium text-gray-800">{trx.sender}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-gray-400 w-8">IN:</span>
                          <span className="text-sm font-medium text-gray-800">{trx.receiver}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{trx.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{trx.fundType}</p>
                      <p className="text-xs text-gray-400 mt-1 italic line-clamp-1 max-w-[200px]">{trx.desc}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-lg text-gray-900">₹{trx.amount.toLocaleString()}</p>
                      <button className="text-[10px] uppercase font-bold text-gray-500 underline mt-2 hover:text-gray-900">View Bill</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}