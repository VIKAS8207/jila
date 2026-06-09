import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Documentation() {
  const { isFullAccess, userRole } = useOutletContext();
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh'; // Only CO can validate

  const [currentView, setCurrentView] = useState('list'); // 'list', 'upload', 'view', 'validate'
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock Database (Expanded for pagination & validation state)
  const [projects, setProjects] = useState([
    { id: 1, projectName: 'Sample Community Hall', ts: true, patvari: true, admin: true, validated: true },
    { id: 2, projectName: 'Primary School Renovation', ts: true, patvari: false, admin: false, validated: false },
    { id: 3, projectName: 'Road Construction Ward 45', ts: false, patvari: false, admin: false, validated: false },
    { id: 4, projectName: 'Village Dispensary Unit', ts: true, patvari: true, admin: true, validated: false }, // All uploaded, waiting for CO
    { id: 5, projectName: 'Panchayat Solar Grid', ts: true, patvari: true, admin: false, validated: false },
    { id: 6, projectName: 'Connecting Bridge Phase 1', ts: true, patvari: true, admin: true, validated: true },
  ]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle Search Filtering
  const filteredProjects = projects.filter(proj => 
    proj.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Navigation Handlers
  const handleOpenUpload = (project) => { setActiveProject(project); setCurrentView('upload'); };
  const handleOpenView = (project) => { setActiveProject(project); setCurrentView('view'); };
  const handleOpenValidate = (project) => { setActiveProject(project); setCurrentView('validate'); };
  const handleBackToList = () => { setActiveProject(null); setCurrentView('list'); };

  // Form Submissions
  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          ts: e.target.ts.checked || p.ts,
          patvari: e.target.patvari.checked || p.patvari,
          admin: e.target.admin.checked || p.admin,
          validated: false // Reset validation if new docs are uploaded
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    handleBackToList();
  };

  const handleValidationSubmit = (e) => {
    e.preventDefault();
    const updatedProjects = projects.map(p => 
      p.id === activeProject.id ? { ...p, validated: true } : p
    );
    setProjects(updatedProjects);
    handleBackToList();
  };


  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 border border-gray-200 rounded-xl shadow-sm gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Documentation Control</h2>
            <p className="text-sm text-gray-500">Manage technical and administrative files.</p>
          </div>
          <div className="w-full sm:w-auto relative">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Docs Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Validation</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No projects match your search.</td></tr>
                ) : (
                  currentData.map((proj) => {
                    const allDocsPresent = proj.ts && proj.patvari && proj.admin;
                    
                    return (
                      <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{proj.projectName}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${proj.ts ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-red-50 border-red-100 text-red-500'}`}>TS</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${proj.patvari ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-red-50 border-red-100 text-red-500'}`}>B1</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${proj.admin ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-red-50 border-red-100 text-red-500'}`}>Admin</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${allDocsPresent ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-white text-gray-500 border-gray-200 border-dashed'}`}>
                            {allDocsPresent ? 'All Uploaded' : 'Missing Docs'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {proj.validated ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-900 text-white border border-gray-900">
                              Validated ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                              Pending Review
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                          <button onClick={() => handleOpenView(proj)} className="text-sm font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-300 underline-offset-2">View</button>
                          
                          {/* Sub-Engineers / Local Admins -> Upload */}
                          {!isFullAccess && !proj.validated && (
                            <button onClick={() => handleOpenUpload(proj)} className="text-sm font-medium text-gray-900 hover:text-gray-600 underline decoration-gray-300 underline-offset-2">Upload</button>
                          )}

                          {/* CO -> Validate */}
                          {isSuperAdmin && !proj.validated && allDocsPresent && (
                            <button onClick={() => handleOpenValidate(proj)} className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors">Validate</button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 hidden sm:block">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="font-medium text-gray-900">{filteredProjects.length}</span> results
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">Previous</button>
              <span className="text-sm text-gray-700 font-medium px-2 sm:hidden">Page {currentPage} / {totalPages || 1}</span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: UPLOAD VIEW ---
  if (currentView === 'upload') {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upload Documents</h3>
            <p className="text-sm text-gray-500 mt-1">{activeProject.projectName}</p>
          </div>
          <button onClick={handleBackToList} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back</button>
        </div>
        
        <form onSubmit={handleFileUploadSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div><p className="font-medium text-gray-900">Technical Sanction (TS)</p><p className="text-xs text-gray-500">Upload PDF only</p></div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {activeProject.ts && <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">Uploaded</span>}
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="ts" defaultChecked={activeProject.ts} className="w-4 h-4 accent-gray-900" /><span className="text-sm text-gray-600">Simulate</span></label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div><p className="font-medium text-gray-900">Patvari B1</p><p className="text-xs text-gray-500">Land record document</p></div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {activeProject.patvari && <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">Uploaded</span>}
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="patvari" defaultChecked={activeProject.patvari} className="w-4 h-4 accent-gray-900" /><span className="text-sm text-gray-600">Simulate</span></label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div><p className="font-medium text-gray-900">Administrative Sanction</p><p className="text-xs text-gray-500">Official approval</p></div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {activeProject.admin && <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded">Uploaded</span>}
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="admin" defaultChecked={activeProject.admin} className="w-4 h-4 accent-gray-900" /><span className="text-sm text-gray-600">Simulate</span></label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={handleBackToList} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800">Save Documents</button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: VIEW VIEW ---
  if (currentView === 'view') {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Document Viewer</h3>
            <p className="text-sm text-gray-500 mt-1">{activeProject.projectName}</p>
          </div>
          <button onClick={handleBackToList} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back</button>
        </div>
        
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Technical Sanction (TS)</span>
            {activeProject.ts ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Patvari B1</span>
            {activeProject.patvari ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Administrative Sanction</span>
            {activeProject.admin ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: VALIDATE VIEW (CO ONLY) ---
  if (currentView === 'validate') {
    return (
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="p-5 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Document Validation</h3>
            <p className="text-sm text-gray-500 mt-1">{activeProject.projectName}</p>
          </div>
          <button onClick={handleBackToList} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back</button>
        </div>
        
        <div className="p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-6">Review the submitted documents below. Once confirmed, you can officially validate this project's paperwork.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📄</span>
              <p className="font-bold text-gray-900 text-sm">Tech Sanction</p>
              <button className="text-xs text-gray-500 hover:text-gray-900 underline">Preview</button>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📄</span>
              <p className="font-bold text-gray-900 text-sm">Patvari B1</p>
              <button className="text-xs text-gray-500 hover:text-gray-900 underline">Preview</button>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📄</span>
              <p className="font-bold text-gray-900 text-sm">Admin Sanction</p>
              <button className="text-xs text-gray-500 hover:text-gray-900 underline">Preview</button>
            </div>
          </div>

          <form onSubmit={handleValidationSubmit} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Official Sign-off</h4>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-5 h-5 accent-gray-900 shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I confirm that I have reviewed the Technical Sanction, Patvari B1, and Administrative Sanction documents. They are valid, legible, and accurate for this project.
                </span>
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                  Confirm & Validate Documents
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}