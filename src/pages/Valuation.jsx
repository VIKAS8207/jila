import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Valuation() {
  const { isFullAccess, userRole } = useOutletContext();
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh';
  const isLocalAdmin = userRole === 'Janpad' || userRole === 'Gram Panchayat';
  const isEngineer = !isFullAccess;

  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'validate', 'asset'
  const [activeProject, setActiveProject] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Valuation Form State
  const [formData, setFormData] = useState({
    estimatedCost: '',
    schemeFundUsed: '',
    ownFundUsed: '',
    mbNumber: '',
    inspectionDate: '',
    remarks: '',
    valuationDoc: null,
    assetPhoto: null
  });

  // Mock Database: Projects & Valuation States
  const [projects, setProjects] = useState([
    { 
      id: 1, sno: 'PRJ-001', name: 'Sample Community Hall', village: 'Ward 45', 
      status: 'Ready for Valuation', // Ready for Engineer/GP to submit
      valuationData: null 
    },
    { 
      id: 2, sno: 'PRJ-002', name: 'Primary School Renovation', village: 'Abhanpur', 
      status: 'Pending Valuation', // Submitted, waiting for CO
      valuationData: {
        estimatedCost: 800000, schemeFundUsed: 750000, ownFundUsed: 50000,
        mbNumber: 'MB-2026-441', inspectionDate: '2026-06-05', remarks: 'Work completed as per specifications.',
        submittedBy: 'S. Singh (Sub-Engineer)'
      } 
    },
    { 
      id: 3, sno: 'PRJ-003', name: 'Road Construction Ward 45', village: 'Arang', 
      status: 'Completed Asset', // Validated by CO
      valuationData: {
        estimatedCost: 1200000, schemeFundUsed: 1200000, ownFundUsed: 0,
        mbNumber: 'MB-2026-112', inspectionDate: '2026-05-20', remarks: 'Final road layering done and verified.',
        submittedBy: 'R. Kumar (Sub-Engineer)', validatedBy: 'CO Jila Adhyaksh', validationDate: '2026-05-25'
      } 
    },
    { 
      id: 4, sno: 'PRJ-004', name: 'Village Dispensary Unit', village: 'Tilda', 
      status: 'Ready for Valuation', 
      valuationData: null 
    },
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentData = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Actions
  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
    setFormData({ estimatedCost: '', schemeFundUsed: '', ownFundUsed: '', mbNumber: '', inspectionDate: '', remarks: '', valuationDoc: null, assetPhoto: null });
  };

  const handleOpenAction = (project) => {
    setActiveProject(project);
    if (project.status === 'Ready for Valuation' && !isSuperAdmin) setCurrentView('form');
    else if (project.status === 'Pending Valuation' && isSuperAdmin) setCurrentView('validate');
    else if (project.status === 'Completed Asset') setCurrentView('asset');
    else setCurrentView('view_only'); // Fallback for viewing pending without action rights
  };

  const handleSubmitValuation = (e) => {
    e.preventDefault();
    const valData = {
      ...formData,
      submittedBy: isEngineer ? 'R. Kumar (Sub-Engineer)' : userRole,
    };
    
    setProjects(projects.map(p => 
      p.id === activeProject.id ? { ...p, status: 'Pending Valuation', valuationData: valData } : p
    ));
    alert("Valuation submitted to CO for final approval.");
    handleBack();
  };

  const handleValidateAsset = () => {
    if (window.confirm("Are you sure you want to validate this valuation? This will officially register the project as a Completed Asset.")) {
      const updatedValData = {
        ...activeProject.valuationData,
        validatedBy: userRole,
        validationDate: new Date().toISOString().split('T')[0]
      };

      setProjects(projects.map(p => 
        p.id === activeProject.id ? { ...p, status: 'Completed Asset', valuationData: updatedValData } : p
      ));
      alert("Asset Validated Successfully!");
      handleBack();
    }
  };

  // Status Styling
  const getStatusBadge = (status) => {
    if (status === 'Completed Asset') return 'bg-gray-900 text-white border-transparent';
    if (status === 'Pending Valuation') return 'bg-white text-gray-800 border-gray-400 border-dashed';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    const completedCount = projects.filter(p => p.status === 'Completed Asset').length;
    const pendingCount = projects.filter(p => p.status === 'Pending Valuation').length;

    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Project Valuation & Capitalization</h2>
            <p className="text-sm text-gray-500">Submit final measurement bills and validate completed assets.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto overflow-x-auto">
            <div className="bg-white px-4 py-2 border-2 border-gray-900 rounded-lg text-center shrink-0">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total Assets</p>
              <p className="text-xl font-bold text-gray-900">{completedCount}</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-center shrink-0">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Village / Block</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{proj.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{proj.sno}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{proj.village}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(proj.status)}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenAction(proj)} className="text-sm font-bold text-gray-900 underline underline-offset-2 hover:text-gray-600">
                        {proj.status === 'Completed Asset' ? 'View Asset' : isSuperAdmin ? 'Review' : 'Process'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 hidden sm:block">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, projects.length)}</span> of <span className="font-medium text-gray-900">{projects.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: FORM VIEW (Engineers / GP / Janpad submitting valuation) ---
  if (currentView === 'form') {
    return (
      <div className="max-w-4xl mx-auto pb-10 space-y-6">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div>
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium block mb-1">← Cancel</button>
            <h2 className="text-lg font-bold text-gray-900">Submit Final Valuation</h2>
          </div>
          <p className="text-xs text-gray-500 font-mono hidden sm:block">{activeProject.sno}</p>
        </div>

        <form onSubmit={handleSubmitValuation} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-900">{activeProject.name}</h3>
            <p className="text-sm text-gray-500">Provide the final financial and physical measurements for capitalization.</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Financial Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Financial Accounting</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Schedule of Rates (SOR)</label>
                  <input type="number" required value={formData.estimatedCost} onChange={e => setFormData({...formData, estimatedCost: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Estimated Cost (Target) ₹</label>
                  <input type="number" required value={formData.estimatedCost} onChange={e => setFormData({...formData, estimatedCost: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Fund Provided by CO ₹</label>
                  <input type="number" required value={formData.schemeFundUsed} onChange={e => setFormData({...formData, schemeFundUsed: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Fund from Own A/C (GP/Janpad) ₹</label>
                  <input type="number" required value={formData.ownFundUsed} onChange={e => setFormData({...formData, ownFundUsed: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Wage vs. Material Ratio</label>
                  <input type="number" required value={formData.ownFundUsed} onChange={e => setFormData({...formData, ownFundUsed: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Technical & Physical Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Measurement Book (MB) Ref No.</label>
                  <input type="text" required value={formData.mbNumber} onChange={e => setFormData({...formData, mbNumber: e.target.value})} placeholder="e.g. MB-2026-XX" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Date of Final Inspection</label>
                  <input type="date" required value={formData.inspectionDate} onChange={e => setFormData({...formData, inspectionDate: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Upload Mulyankan Praman Patra (PDF)</label>
                  <input type="file" required accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Upload Final Asset Photo</label>
                  <input type="file" required accept="image/*" capture="environment" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Utilization Certificate (UC)</label>
                  <input type="file" required accept="image/*" capture="environment" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Completion Certificate (CC)</label>
                  <input type="file" required accept="image/*" capture="environment" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Financial Sign-off</label>
                  <input type="file" required accept="image/*" capture="environment" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Final Remarks / Declarations</label>
              <textarea required value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} rows="3" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"></textarea>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
              Submit for CO Validation
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: VALIDATE VIEW (CO ONLY) & ASSET VIEW (Everyone) ---
  if (currentView === 'validate' || currentView === 'asset' || currentView === 'view_only') {
    const vData = activeProject.valuationData;
    const isCompleted = activeProject.status === 'Completed Asset';

    return (
      <div className="max-w-4xl mx-auto pb-10 space-y-6">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between sticky top-0 z-10">
          <div>
            <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium block mb-1">← Back</button>
            <h2 className="text-lg font-bold text-gray-900">{isCompleted ? 'Asset Capitalization Certificate' : 'Valuation Review'}</h2>
          </div>
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(activeProject.status)}`}>
            {activeProject.status}
          </span>
        </div>

        {vData ? (
          <div className="bg-white border-2 border-gray-900 rounded-xl shadow-lg p-6 sm:p-10 animate-in zoom-in-95">
            {/* Certificate Header */}
            <div className="text-center border-b-2 border-gray-100 pb-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Valuation Certificate</h1>
              <p className="text-gray-500 mt-2 font-medium">Measurement & Financial Verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Project Particulars</p>
                <p className="font-bold text-gray-900 text-lg">{activeProject.name}</p>
                <p className="text-sm text-gray-600 font-mono mt-1">{activeProject.sno} • {activeProject.village}</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Technical Reference</p>
                <p className="font-bold text-gray-900 font-mono">{vData.mbNumber}</p>
                <p className="text-sm text-gray-600 mt-1">Inspected: {vData.inspectionDate}</p>
              </div>
            </div>

            {/* Financial Ledger Block */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Financial Accounting</h4>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Estimated Target Cost</span>
                <span className="text-gray-900 font-bold">₹{parseInt(vData.estimatedCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Funds Sourced from CO / Scheme</span>
                <span className="text-gray-900 font-bold">₹{parseInt(vData.schemeFundUsed).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Funds Sourced from Own Account (GP)</span>
                <span className="text-gray-900 font-bold">₹{parseInt(vData.ownFundUsed).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 uppercase">Total Capitalized Value</span>
                <span className="text-2xl font-bold text-gray-900">₹{(parseInt(vData.schemeFundUsed) + parseInt(vData.ownFundUsed)).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-2">📄</span>
                <p className="text-xs font-bold text-gray-900">View MB Document</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl mb-2">📸</span>
                <p className="text-xs font-bold text-gray-900">View Asset Photo</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-sm font-bold text-gray-900">{vData.submittedBy}</p>
                <p className="text-xs text-gray-500 uppercase mt-1">Submitted By</p>
              </div>
              <div>
                {isCompleted ? (
                  <>
                    <p className="text-sm font-bold text-gray-900">{vData.validatedBy}</p>
                    <p className="text-xs text-gray-500 uppercase mt-1">Validated On: {vData.validationDate}</p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-orange-600 italic">Pending CO Signature</p>
                )}
              </div>
            </div>

            {/* Validation Action (CO Only) */}
            {currentView === 'validate' && isSuperAdmin && (
              <div className="mt-10 pt-6 border-t border-gray-900 flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-4 text-center">By clicking below, you officially validate these measurements and register this project as a finalized government asset.</p>
                <button onClick={handleValidateAsset} className="w-full sm:w-auto px-10 py-3 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                  Approve & Capitalize Asset
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-10 border border-gray-200 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">Valuation data has not been submitted yet.</p>
          </div>
        )}
      </div>
    );
  }
}