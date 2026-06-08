import React, { useState } from 'react';
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

  // Mock Database: Projects
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      sno: 'PRJ-001', 
      name: 'Sample Community Hall', 
      promised: 500000, 
      received: 200000, 
      dateReceived: '2026-05-15', 
      estEnd: '2026-12-01', 
      assignedTo: 'R. Kumar',
      status: 'Active'
    },
    { 
      id: 2, 
      sno: 'PRJ-002', 
      name: 'Primary School Renovation', 
      promised: 800000, 
      received: 800000, 
      dateReceived: '2026-06-01', 
      estEnd: '2026-10-15', 
      assignedTo: 'S. Singh',
      status: 'Active'
    },
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
                {displayProjects.map((proj) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DETAIL VIEW ---
  const currentHistory = history[activeProject.id] || [];
  const isCompleted = activeProject.status === 'Completed';

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-6 flex flex-col lg:flex-row gap-6">
      
      {/* Left Column: Details & History */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4">
          <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium self-start">← Back to List</button>
          
          <div className="flex justify-between items-start border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">{activeProject.sno}</p>
              <h2 className="text-xl font-bold text-gray-900">{activeProject.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Estimated End: {activeProject.estEnd}</p>
            </div>
            {isCompleted && (
              <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm font-bold text-gray-700">COMPLETED</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Promised</p>
              <p className="text-lg font-bold text-gray-900">₹{activeProject.promised.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Received</p>
              <p className="text-lg font-bold text-gray-900">₹{activeProject.received.toLocaleString()}</p>
            </div>
          </div>

          {/* Complete Button (Only Local Admins can mark complete) */}
          {isLocalAdmin && !isCompleted && activeProject.received >= activeProject.promised && (
             <button onClick={handleCompleteProject} className="w-full mt-2 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
               Mark Project as Completed
             </button>
          )}
        </div>

        {/* History Log */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Fund Update History</h3>
          
          {currentHistory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No fund updates logged yet.</p>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {currentHistory.map((log) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {log.type === 'RECEIVED' ? '↓' : '↑'}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${log.type === 'RECEIVED' ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-600'}`}>{log.type}</span>
                      <span className="text-xs text-gray-400">{log.date}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">₹{log.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1"><span className="font-semibold text-gray-700">{log.updatedBy}</span> ({log.role})</p>
                    <p className="text-sm text-gray-700 mt-2">{log.remarks}</p>
                    
                    {/* Engineer Specific Info */}
                    {log.location && <p className="text-xs text-gray-400 mt-2">📍 {log.location}</p>}
                    
                    <div className="mt-3 flex gap-2">
                      {log.document && <button className="text-xs font-medium bg-gray-50 border border-gray-200 px-2 py-1 rounded hover:bg-gray-100">📄 View Doc</button>}
                      {log.photo && <button className="text-xs font-medium bg-gray-50 border border-gray-200 px-2 py-1 rounded hover:bg-gray-100">📸 View Site</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Update Form Actions */}
      {/* Hidden if Project Completed or user is Super Admin (CO only views) */}
      {!isCompleted && !isSuperAdmin && (
        <div className="w-full lg:w-96 shrink-0">
          {!isFormOpen ? (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              + {isLocalAdmin ? 'Update Received Fund' : 'Log Fund Utilization'}
            </button>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-sm">{isLocalAdmin ? 'Add Received Amount' : 'Log Utilization'}</h3>
                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              
              <form onSubmit={handleSubmitUpdate} className="p-5 space-y-4">
                
                {/* Common Field: Amount */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>

                {/* Engineer Specific Fields */}
                {isEngineer && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Fund Received From</label>
                      <select required value={formData.fundSource} onChange={(e) => setFormData({...formData, fundSource: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white">
                        <option value="">Select Source</option>
                        <option value="CO">CO</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    {formData.fundSource === 'Others' && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Specify Department</label>
                        <input type="text" required value={formData.otherSource} onChange={(e) => setFormData({...formData, otherSource: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">Site Photograph</label>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => setFormData({...formData, photo: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" required />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 block">Location</label>
                      <div className="flex gap-2">
                        <input type="text" value={location} readOnly required placeholder="Lat, Long" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none" />
                        <button type="button" onClick={handleFetchLocation} className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300">Fetch</button>
                      </div>
                    </div>
                  </>
                )}

                {/* Common Field: Remarks */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Remarks / Work Done</label>
                  <textarea required value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} rows="2" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"></textarea>
                </div>

                {/* Common Field: Document */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 block">Supporting Document (PDF)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setFormData({...formData, document: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" required />
                </div>

                <button type="submit" className="w-full mt-4 bg-gray-900 text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  Submit Update
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
