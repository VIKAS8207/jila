import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ProgressUpdate() {
  const { isFullAccess, userRole } = useOutletContext();
  
  // Simulate the logged-in user's name based on role
  const userName = isFullAccess ? 'System Administrator' : 'R. Kumar (Sub-Engineer)';

  // View state: 'list' or 'detail'
  const [currentView, setCurrentView] = useState('list');
  const [activeProject, setActiveProject] = useState(null);

  // Form State
  const [photoRef, setPhotoRef] = useState(null);
  const [location, setLocation] = useState('');
  const [remark, setRemark] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Mock Database: Projects
  const [projects] = useState([
    { id: 1, projectName: 'Sample Community Hall', location: 'Ward 45, Raipur', lastUpdate: '2026-06-08' },
    { id: 2, projectName: 'Primary School Renovation', location: 'Bhilai', lastUpdate: '2026-06-05' },
    { id: 3, projectName: 'Road Construction', location: 'Naya Raipur', lastUpdate: 'No updates yet' },
  ]);

  // Mock Database: Updates history mapped by Project ID
  const [updateHistory, setUpdateHistory] = useState({
    1: [
      { id: 101, date: '2026-06-08 14:30', location: '21.2514° N, 81.6296° E', remark: 'Foundation work completed.', photo: 'true' }
    ]
  });

  // Action Handlers
  const handleOpenDetail = (project) => {
    setActiveProject(project);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
    // Reset form
    setPhotoRef(null);
    setLocation('');
    setRemark('');
  };

  const handleFetchLocation = (e) => {
    e.preventDefault();
    setIsFetchingLocation(true);
    
    // Use HTML5 Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
          setIsFetchingLocation(false);
        },
        (error) => {
          alert("Could not fetch location. Please ensure location services are enabled.");
          setIsFetchingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsFetchingLocation(false);
    }
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const newUpdate = {
      id: Date.now(),
      date: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      location: location || 'Location not provided',
      remark: remark,
      photo: photoRef ? 'true' : 'false' // Simulating photo upload
    };

    setUpdateHistory({
      ...updateHistory,
      [activeProject.id]: [newUpdate, ...(updateHistory[activeProject.id] || [])]
    });

    // Reset form fields
    setPhotoRef(null);
    setLocation('');
    setRemark('');
  };

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
        {/* User Stats Banner */}
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome, {userName}</h2>
            <p className="text-sm text-gray-500">{isFullAccess ? 'Viewing all active projects in the system.' : 'Here are the projects assigned to you.'}</p>
          </div>
          <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-center min-w-[120px]">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>

        {/* Project Cards (Mobile Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => handleOpenDetail(proj)}
              className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{proj.projectName}</h3>
                <p className="text-sm text-gray-500 mb-4">{proj.location}</p>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-xs text-gray-400">Last Update:</span>
                <span className="text-sm font-medium text-gray-700">{proj.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER: DETAIL & UPLOAD VIEW ---
  const currentHistory = updateHistory[activeProject.id] || [];

  return (
    <div className="max-w-3xl mx-auto pb-10 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          ← Back
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{activeProject.projectName}</h2>
          <p className="text-xs text-gray-500">{activeProject.location}</p>
        </div>
      </div>

      {/* UPLOAD FORM: Only visible to Limited Access (Sub-Engineers) */}
      {!isFullAccess && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm">Add New Progress Update</h3>
          </div>
          <form onSubmit={handleSubmitUpdate} className="p-5 space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Photo Capture */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Site Photograph</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" // Opens back camera on mobile
                    onChange={(e) => setPhotoRef(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`w-full flex items-center justify-center gap-2 border-2 ${photoRef ? 'border-solid border-gray-900 bg-gray-50' : 'border-dashed border-gray-300 bg-white'} rounded-lg px-4 py-3 text-sm font-medium transition-colors`}>
                    {photoRef ? `📸 Image Captured (${photoRef.name})` : '📷 Tap to Open Camera'}
                  </div>
                </div>
              </div>

              {/* Location Fetch */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">GPS Coordinates</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={location} 
                    readOnly 
                    required
                    placeholder="Lat, Long"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none text-gray-600"
                  />
                  <button 
                    type="button" 
                    onClick={handleFetchLocation}
                    disabled={isFetchingLocation}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isFetchingLocation ? 'Locating...' : '📍 Fetch'}
                  </button>
                </div>
              </div>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Progress Remark</label>
              <textarea 
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
                rows="3" 
                placeholder="Describe the current status of the work..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button type="submit" className="w-full md:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                Save & Upload
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE HISTORY LOG */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg px-1">Update History</h3>
        
        {currentHistory.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm shadow-sm">
            No updates have been recorded for this project yet.
          </div>
        ) : (
          <div className="space-y-4">
            {currentHistory.map((update) => (
              <div key={update.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-5">
                
                {/* Simulated Image Box */}
                <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="text-4xl">🏗️</span>
                </div>
                
                {/* Update Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{update.date}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-flex items-center gap-1">
                      📍 {update.location}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed pt-1">
                    {update.remark}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
