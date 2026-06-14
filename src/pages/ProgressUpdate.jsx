import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ProgressUpdate() {
  const { isFullAccess, userRole } = useOutletContext();
  const userName = isFullAccess ? 'System Administrator' : 'R. Kumar (Sub-Engineer)';

  const [currentView, setCurrentView] = useState('list');
  const [activeProject, setActiveProject] = useState(null);

  // Form & Error States
  const [photoRef, setPhotoRef] = useState(null);
  const [location, setLocation] = useState('');
  const [remark, setRemark] = useState('');
  const [amountInvested, setAmountInvested] = useState('');
  const [fundSource, setFundSource] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState(false); // Controls the Error UI

  // Mock Database: Projects (Expanded with Financials & Base Coordinates)
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      projectName: 'Sample Community Hall', 
      location: 'Ward 45, Raipur', 
      baseCoords: { lat: 21.2514, lon: 81.6296 }, // Original Project Coordinates
      totalAllocated: 500000,
      totalSpent: 150000,
      lastSpentAmount: 50000,
      lastUpdate: '2026-06-08' 
    },
    { 
      id: 2, 
      projectName: 'Primary School Renovation', 
      location: 'Bhilai', 
      baseCoords: { lat: 21.1938, lon: 81.3509 },
      totalAllocated: 800000,
      totalSpent: 400000,
      lastSpentAmount: 120000,
      lastUpdate: '2026-06-05' 
    },
    { 
      id: 3, 
      projectName: 'Road Construction', 
      location: 'Naya Raipur', 
      baseCoords: { lat: 21.1610, lon: 81.7865 },
      totalAllocated: 1200000,
      totalSpent: 0,
      lastSpentAmount: 0,
      lastUpdate: 'No updates yet' 
    },
  ]);

  const [updateHistory, setUpdateHistory] = useState({
    1: [
      { id: 101, date: '2026-06-08 14:30', location: '21.2514, 81.6296', amountInvested: 50000, fundSource: 'CO', remark: 'Foundation work completed.', photo: 'true' }
    ]
  });

  const handleOpenDetail = (project) => {
    setActiveProject(project);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setActiveProject(null);
    setCurrentView('list');
    setPhotoRef(null);
    setLocation('');
    setRemark('');
    setAmountInvested('');
    setFundSource('');
    setLocationError(false);
  };

  // Helper: Haversine formula to calculate distance between two coordinates in km
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleFetchLocation = (e, simulateMatch = false) => {
    e.preventDefault();
    setIsFetchingLocation(true);
    
    if (simulateMatch) {
      // For testing: perfectly match the active project's coordinates
      setTimeout(() => {
        setLocation(`${activeProject.baseCoords.lat.toFixed(5)}, ${activeProject.baseCoords.lon.toFixed(5)}`);
        setIsFetchingLocation(false);
      }, 500);
      return;
    }

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
    }
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    
    // VALIDATION: Geofencing Check
    const [fetchedLat, fetchedLon] = location.split(',').map(coord => parseFloat(coord.trim()));
    const distance = getDistanceInKm(activeProject.baseCoords.lat, activeProject.baseCoords.lon, fetchedLat, fetchedLon);
    
    // If distance is greater than 0.5 km (500 meters), throw the error
    if (distance > 0.5) {
      setLocationError(true);
      return;
    }

    // Process Valid Submit
    const newUpdate = {
      id: Date.now(),
      date: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      location: location,
      amountInvested: parseInt(amountInvested),
      fundSource: fundSource,
      remark: remark,
      photo: photoRef ? 'true' : 'false'
    };

    setUpdateHistory({
      ...updateHistory,
      [activeProject.id]: [newUpdate, ...(updateHistory[activeProject.id] || [])]
    });

    // Update the master project totals
    // FIX WAS HERE: Added the missing parenthesis to close the map function '}))'
    setProjects(projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          totalSpent: p.totalSpent + parseInt(amountInvested),
          lastSpentAmount: parseInt(amountInvested),
          lastUpdate: newUpdate.date.split(',')[0]
        };
      }
      return p;
    })); 

    // Reset
    setPhotoRef(null);
    setLocation('');
    setRemark('');
    setAmountInvested('');
    setFundSource('');
    alert("Progress update and financials logged successfully.");
  };


  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
      
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome, {userName}</h2>
            <p className="text-sm text-gray-500">Select a project to review or post an update.</p>
          </div>
          <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg text-center min-w-[120px]">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => handleOpenDetail(proj)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-400 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{proj.projectName}</h3>
                <p className="text-xs text-gray-500 font-mono mb-4">📍 {proj.location}</p>
                
                {/* Financial Summary inside Card */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Allocated Fund</p>
                    <p className="font-bold text-gray-900">₹{proj.totalAllocated.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Spent</p>
                    <p className="font-bold text-gray-900">₹{proj.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-3 px-5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Last Update</span>
                  <span className="text-sm font-medium text-gray-700">{proj.lastUpdate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Last Spent</span>
                  <span className="text-sm font-bold text-gray-800">₹{proj.lastSpentAmount.toLocaleString()}</span>
                </div>
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
    <div className="max-w-3xl mx-auto pb-10 space-y-6 relative">
      
      {/* Geofence Error Overlay */}
      {locationError && (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-20 bg-white/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Location Verification Failed</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              The GPS coordinates you fetched do not match the registered base location for <span className="font-bold text-gray-900">"{activeProject.projectName}"</span>. You must be physically present at the site to submit an update.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6 text-left">
              <p className="text-xs text-gray-500">Expected: {activeProject.baseCoords.lat}, {activeProject.baseCoords.lon}</p>
              <p className="text-xs text-gray-500">Fetched: {location}</p>
            </div>
            <button 
              onClick={() => setLocationError(false)}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Acknowledge & Try Again
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">← Back</button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{activeProject.projectName}</h2>
          <div className="flex gap-4 mt-1">
            <p className="text-xs text-gray-500">Allocated: <span className="font-bold text-gray-800">₹{activeProject.totalAllocated.toLocaleString()}</span></p>
            <p className="text-xs text-gray-500">Remaining: <span className="font-bold text-gray-800">₹{(activeProject.totalAllocated - activeProject.totalSpent).toLocaleString()}</span></p>
          </div>
        </div>
      </div>

      {/* UPLOAD FORM (Engineers Only) */}
      {!isFullAccess && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm">Log New Progress & Finance Update</h3>
          </div>
          
          <form onSubmit={handleSubmitUpdate} className="p-5 space-y-6">
            
            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">Amount Invested (₹)</label>
                <input 
                  type="number" 
                  value={amountInvested}
                  onChange={(e) => setAmountInvested(e.target.value)}
                  required
                  placeholder="e.g. 50000"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">Fund Provided From</label>
                <select 
                  value={fundSource}
                  onChange={(e) => setFundSource(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white"
                >
                  <option value="">Select Source</option>
                  <option value="CO Jila Adhyaksh">CO Jila Adhyaksh</option>
                  <option value="Janpad">Janpad</option>
                  <option value="Gram Panchayat">Gram Panchayat</option>
                  <option value="Other Department">Other Department</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Photo Capture */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block">Site Photograph</label>
                <div className="relative">
                  <input 
                    type="file" accept="image/*" capture="environment" 
                    onChange={(e) => setPhotoRef(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required
                  />
                  <div className={`w-full flex items-center justify-center gap-2 border-2 ${photoRef ? 'border-solid border-gray-900 bg-gray-50' : 'border-dashed border-gray-300 bg-white'} rounded-lg px-4 py-3 text-sm font-medium transition-colors`}>
                    {photoRef ? `📸 Captured (${photoRef.name})` : '📷 Tap to Open Camera'}
                  </div>
                </div>
              </div>

              {/* Location Fetch */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block flex justify-between">
                  GPS Coordinates
                  <span className="text-[10px] text-gray-400 font-normal">Must match site location</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" value={location} readOnly required placeholder="Lat, Long"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none text-gray-600"
                  />
                  {/* Two buttons: one real, one for testing the bypass */}
                  <div className="flex gap-1">
                    <button 
                      type="button" onClick={(e) => handleFetchLocation(e, false)} disabled={isFetchingLocation}
                      className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                      title="Fetches real GPS (Will likely fail geofence)"
                    >
                      📍 Real
                    </button>
                    <button 
                      type="button" onClick={(e) => handleFetchLocation(e, true)} disabled={isFetchingLocation}
                      className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                      title="Forces a match with the project's base coordinates"
                    >
                      Match
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">Progress & Utilization Remark</label>
              <textarea 
                value={remark} onChange={(e) => setRemark(e.target.value)} required rows="3" 
                placeholder="Describe the work completed with this funding..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button type="submit" className="w-full md:w-auto px-8 py-3 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                Save & Authenticate Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE HISTORY LOG */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-lg px-1">Update & Utilization History</h3>
        
        {currentHistory.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm shadow-sm">
            No updates have been recorded for this project yet.
          </div>
        ) : (
          <div className="space-y-4">
            {currentHistory.map((update) => (
              <div key={update.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-5">
                
                <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="text-4xl">🏗️</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <div>
                      <span className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded mr-2">{update.date}</span>
                      <span className="text-xs text-gray-500 font-mono">📍 {update.location}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{update.amountInvested.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">From: {update.fundSource}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
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