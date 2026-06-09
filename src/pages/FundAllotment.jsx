import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function FundAllotment() {
  const { isFullAccess, userRole } = useOutletContext();
  
  // Determine specific role categories for granular permissions
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh';
  const isLocalAdmin = userRole === 'Janpad' || userRole === 'Gram Panchayat';
  const isEngineer = !isFullAccess;

  const userName = isEngineer ? 'R. Kumar (Sub-Engineer)' : userRole;

  const [currentView, setCurrentView] = useState('list');
  const [activeProject, setActiveProject] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Forms State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    document: null,
    photo: null,
    remarks: '',
    fundSource: '',
    otherSource: ''
  });

  // Mock Database: Projects (Expanded for Pagination)
  const [projects, setProjects] = useState([
    { id: 1, sno: 'PRJ-001', name: 'Sample Community Hall', promised: 500000, received: 200000, dateReceived: '2026-05-15', estEnd: '2026-12-01', assignedTo: 'R. Kumar', status: 'Active' },
    { id: 2, sno: 'PRJ-002', name: 'Primary School Renovation', promised: 800000, received: 800000, dateReceived: '2026-06-01', estEnd: '2026-10-15', assignedTo: 'S. Singh', status: 'Active' },
    { id: 3, sno: 'PRJ-003', name: 'Road Construction Ward 45', promised: 1200000, received: 600000, dateReceived: '2026-05-20', estEnd: '2027-01-10', assignedTo: 'R. Kumar', status: 'Active' },
    { id: 4, sno: 'PRJ-004', name: 'Village Dispensary Unit', promised: 450000, received: 450000, dateReceived: '2026-04-10', estEnd: '2026-09-30', assignedTo: 'A. Patel', status: 'Completed' },
    { id: 5, sno: 'PRJ-005', name: 'Panchayat Solar Grid', promised: 950000, received: 300000, dateReceived: '2026-06-05', estEnd: '2026-11-20', assignedTo: 'S. Singh', status: 'Active' },
    { id: 6, sno: 'PRJ-006', name: 'Connecting Bridge Phase 1', promised: 2500000, received: 1000000, dateReceived: '2026-03-15', estEnd: '2027-05-01', assignedTo: 'R. Kumar', status: 'Active' },
    { id: 7, sno: 'PRJ-007', name: 'Community Water Tank', promised: 300000, received: 150000, dateReceived: '2026-06-10', estEnd: '2026-08-30', assignedTo: 'A. Patel', status: 'Active' },
  ]);

  // Mock Database: Fund History Logs
  const [history, setHistory] = useState({
    1: [
      { id: 101, date: '2026-05-15', type: 'RECEIVED', amount: 200000, role: 'Janpad', updatedBy: 'Janpad Office 1', remarks: 'Initial fund release from CO', document: 'receipt_01.pdf' },
      { id: 102, date: '2026-06-02', type: 'UTILIZED', amount: 50000, role: 'Sub-Engineer', updatedBy: 'R. Kumar', remarks: 'Foundation materials purchased', source: 'CO', location: '21.2514, 81.6296', photo: 'site_img.jpg', document: 'bill_01.pdf' }
    ]
  });

  // Filter projects for Limited Access (Engineers)
  const displayProjects = isEngineer 
    ? projects.filter(p => p.assignedTo === 'R. Kumar') 
    : projects;

  // Pagination Logic
  const totalPages = Math.ceil(displayProjects.length / itemsPerPage);
  const currentData = displayProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Actions
  const handleOpenDetail = (project) => {
    setActiveProject(project);
    setCurrentView('detail');
    setIsFormOpen(false);
  };

  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
  };

  const handleFetchLocation = (e) => {
    e.preventDefault();
    setIsFetchingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
          setIsFetchingLocation(false);
        },
        () => {
          alert("Location fetch failed.");
          setIsFetchingLocation(false);
        }
      );
    }
  };

  const handleCompleteProject = () => {
    if (window.confirm("Are you sure you want to mark this project as Completed? This will lock further fund updates.")) {
      setProjects(projects.map(p => p.id === activeProject.id ? { ...p, status: 'Completed' } : p));
      setActiveProject({ ...activeProject, status: 'Completed' });
    }
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    
    // Create new log entry
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: isLocalAdmin ? 'RECEIVED' : 'UTILIZED',
      amount: parseInt(formData.amount),
      role: userRole,
      updatedBy: userName,
      remarks: formData.remarks || (isLocalAdmin ? 'Funds received update' : 'Site utilization update'),
      document: formData.document ? formData.document.name : 'attached_doc.pdf',
      ...(isEngineer && {
        source: formData.fundSource === 'Others' ? formData.otherSource : formData.fundSource,
        location: location || 'Not provided',
        photo: formData.photo ? formData.photo.name : 'site_img.jpg'
      })
    };

    // Update History
    setHistory({
      ...history,
      [activeProject.id]: [newLog, ...(history[activeProject.id] || [])]
    });

    // If Janpad/GP is updating received amounts, update the project total
    if (isLocalAdmin) {
      const updatedReceived = activeProject.received + parseInt(formData.amount);
      setProjects(projects.map(p => 
        p.id === activeProject.id ? { ...p, received: updatedReceived, dateReceived: newLog.date } : p
      ));
      setActiveProject({ ...activeProject, received: updatedReceived, dateReceived: newLog.date });
    }

    // Reset Form
    setIsFormOpen(false);
    setFormData({ amount: '', document: null, photo: null, remarks: '', fundSource: '', otherSource: '' });
    setLocation('');
  };


  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
        {/* Banner */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fund Allotment</h2>
            <p className="text-sm text-gray-500">
              {isEngineer ? `Assigned to: ${userName}` : 'Global project fund overview'}
            </p>
          </div>
          <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-center">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{displayProjects.length}</p>
          </div>
        </div>

        {/* Project List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">S.No</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Promised (₹)</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Received (₹)</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Last Received</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Est. End Date</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No projects found.</td></tr>
                ) : (
                  currentData.map((proj) => (
                    <tr 
                      key={proj.id} 
                      onClick={() => handleOpenDetail(proj)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{proj.sno}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{proj.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-right">{proj.promised.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium text-right">{proj.received.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600">{proj.dateReceived}</td>
                      <td className="px-6 py-4 text-gray-600">{proj.estEnd}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          proj.status === 'Completed' ? 'bg-gray-200 text-gray-800 border-gray-300' : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, displayProjects.length)}</span> of <span className="font-medium text-gray-900">{displayProjects.length}</span> results
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
  const currentHistory = history[activeProject.id] || [];
  const isCompleted = activeProject.status === 'Completed';

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6">
      
      {/* Header & Main Details */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium mb-3 block">← Back to List</button>
          <p className="text-xs text-gray-500 font-medium">{activeProject.sno}</p>
          <h2 className="text-xl font-bold text-gray-900">{activeProject.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Estimated End: {activeProject.estEnd}</p>
        </div>

        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
          {isCompleted && (
            <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm font-bold text-gray-700">COMPLETED</span>
          )}
          <div className="flex gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200 w-full sm:w-auto">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total Promised</p>
              <p className="text-lg font-bold text-gray-900">₹{activeProject.promised.toLocaleString()}</p>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Total Received</p>
              <p className="text-lg font-bold text-gray-900">₹{activeProject.received.toLocaleString()}</p>
            </div>
          </div>
          
          {!isCompleted && !isSuperAdmin && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto bg-gray-900 text-white font-bold px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-sm"
            >
              + {isLocalAdmin ? 'Update Received Fund' : 'Log Fund Utilization'}
            </button>
          )}

          {isLocalAdmin && !isCompleted && activeProject.received >= activeProject.promised && (
             <button onClick={handleCompleteProject} className="w-full sm:w-auto mt-2 bg-white border border-gray-900 text-gray-900 font-bold px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
               Mark Project Completed
             </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-900 text-lg">Fund Update & Utilization History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Date & Type</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Updated By</th>
                <th className="px-6 py-3 font-semibold text-gray-700 w-1/3">Remarks & Location</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentHistory.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No fund updates logged yet.</td></tr>
              ) : (
                currentHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{log.date}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${log.type === 'RECEIVED' ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-base">₹{log.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{log.updatedBy}</p>
                      <p className="text-xs text-gray-500">{log.role}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 line-clamp-2">{log.remarks}</p>
                      {log.location && <p className="text-xs text-gray-400 font-mono mt-1">📍 {log.location}</p>}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {log.document && <button className="text-xs font-medium bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded hover:bg-gray-100 transition-colors">📄 Doc</button>}
                      {log.photo && <button className="text-xs font-medium bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded hover:bg-gray-100 transition-colors">📸 Photo</button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Update Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg my-8">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-xl">
              <h3 className="font-bold text-gray-900 text-lg">{isLocalAdmin ? 'Add Received Amount' : 'Log Utilization'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmitUpdate} className="p-6 space-y-5">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Amount (₹) <span className="text-red-500">*</span></label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
              </div>

              {/* Engineer Specific Fields */}
              {isEngineer && (
                <div className="space-y-5 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Fund Received From <span className="text-red-500">*</span></label>
                    <select required value={formData.fundSource} onChange={(e) => setFormData({...formData, fundSource: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white">
                      <option value="">Select Source</option>
                      <option value="CO">CO</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {formData.fundSource === 'Others' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Specify Department <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.otherSource} onChange={(e) => setFormData({...formData, otherSource: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Site Photograph <span className="text-red-500">*</span></label>
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" required />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Location GPS <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input type="text" value={location} readOnly required placeholder="Lat, Long" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none" />
                      <button type="button" onClick={handleFetchLocation} className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors">Fetch</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Remarks / Work Done <span className="text-red-500">*</span></label>
                <textarea required value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} rows="3" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Supporting Document (PDF) <span className="text-red-500">*</span></label>
                <input type="file" accept=".pdf" onChange={(e) => setFormData({...formData, document: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" required />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                  Submit Update
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

    </div>
  );
}