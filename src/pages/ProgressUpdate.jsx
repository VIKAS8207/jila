import React, { useState, useRef, useEffect } from 'react';
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
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
          <ul className="max-h-60 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <li 
              onClick={() => { onChange(''); setIsOpen(false); }}
              className={`px-5 py-3 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === '' ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
            >
              {placeholder}
            </li>
            {options.map((opt, idx) => (
              <li 
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-5 py-3 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
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

export default function ProgressUpdate() {
  const { isFullAccess } = useOutletContext();
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
  const [locationError, setLocationError] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Formatting Helper
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Mock Database: Projects
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      projectName: 'Sample Community Hall', 
      location: 'Ward 45, Raipur', 
      baseCoords: { lat: 21.2514, lon: 81.6296 }, 
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
      { id: 101, date: '2026-06-08 14:30', location: '21.2514, 81.6296', amountInvested: 50000, fundSource: 'CO Jila Adhyaksh', remark: 'Foundation work completed.', photo: 'true' }
    ]
  });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

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
    
    if (!fundSource) return alert("Please select a Fund Source.");
    if (!location) return alert("Please fetch GPS Coordinates.");

    const [fetchedLat, fetchedLon] = location.split(',').map(coord => parseFloat(coord.trim()));
    const distance = getDistanceInKm(activeProject.baseCoords.lat, activeProject.baseCoords.lon, fetchedLat, fetchedLon);
    
    if (distance > 0.5) {
      setLocationError(true);
      return;
    }

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

    setPhotoRef(null);
    setLocation('');
    setRemark('');
    setAmountInvested('');
    setFundSource('');
    showToast("Progress update and financials logged successfully.");
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-wide">Progress Tracker</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Review project financials and log physical updates.</p>
          </div>
          <div className="bg-[#451db3]/5 border border-[#451db3]/10 px-6 py-3 rounded-2xl text-center min-w-[140px]">
            <p className="text-[10px] text-[#451db3] uppercase font-black tracking-widest">Total Projects</p>
            <p className="text-2xl font-black text-slate-900">{projects.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => handleOpenDetail(proj)}
              className="bg-white/70 backdrop-blur-2xl border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-[#451db3]/30 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-black text-slate-900 text-lg mb-1">{proj.projectName}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">Location: {proj.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Allocated Fund</p>
                    <p className="font-black text-slate-800 text-lg">{formatCurrency(proj.totalAllocated)}</p>
                  </div>
                  <div className="bg-[#451db3]/5 p-4 rounded-2xl border border-[#451db3]/10">
                    <p className="text-[9px] text-[#451db3] uppercase font-black tracking-widest mb-1">Total Spent</p>
                    <p className="font-black text-slate-800 text-lg">{formatCurrency(proj.totalSpent)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 border-t border-slate-100 p-4 px-6 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Last Update</span>
                  <span className="text-xs font-bold text-slate-600">{proj.lastUpdate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block mb-0.5">Last Spent</span>
                  <span className="text-xs font-black text-slate-800">{formatCurrency(proj.lastSpentAmount)}</span>
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
    <div className="max-w-4xl mx-auto pb-10 space-y-8 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
          <div className="bg-white px-6 py-4 rounded-full shadow-2xl border border-green-100 flex items-center gap-3">
            <span className="font-bold text-slate-800">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Geofence Error Overlay */}
      {locationError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black">!</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Location Verification Failed</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              The GPS coordinates fetched do not match the registered base location for <span className="font-bold text-slate-900">"{activeProject.projectName}"</span>.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8 text-left space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected</span>
                <span className="text-xs font-mono font-bold text-slate-700">{activeProject.baseCoords.lat}, {activeProject.baseCoords.lon}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetched</span>
                <span className="text-xs font-mono font-bold text-red-500">{location}</span>
              </div>
            </div>
            <button 
              onClick={() => setLocationError(false)}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition-all"
            >
              Acknowledge & Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-6 sticky top-4 z-50">
        <div>
          <button onClick={handleBack} className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#451db3] transition-colors mb-2 block">← Back to List</button>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">{activeProject.projectName}</h2>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocated</p>
            <p className="font-black text-slate-800">{formatCurrency(activeProject.totalAllocated)}</p>
          </div>
          <div className="w-px bg-slate-200 h-8 self-center"></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest">Remaining</p>
            <p className="font-black text-slate-800">{formatCurrency(activeProject.totalAllocated - activeProject.totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* UPLOAD FORM (Engineers Only) */}
      {!isFullAccess && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Log New Progress Update</h3>
          </div>
          
          <form onSubmit={handleSubmitUpdate} className="p-8 space-y-8">
            
            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Amount Invested (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" required value={amountInvested} onChange={(e) => setAmountInvested(e.target.value)} placeholder="e.g. 50000"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 relative z-50">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Fund Provided From <span className="text-red-500">*</span></label>
                <CustomDropdown 
                  placeholder="Select Source" value={fundSource} onChange={setFundSource}
                  options={['CEO Jila Panchayat', 'Janpad', 'Gram Panchayat', 'Other Department']}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo Capture */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Site Photograph <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input type="file" accept="image/*" capture="environment" required onChange={(e) => setPhotoRef(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full border ${photoRef ? 'border-[#451db3] bg-[#451db3]/5' : 'border-slate-200 bg-white/50'} text-sm font-bold text-slate-500 transition-all shadow-sm`}>
                    <span className={`truncate ${photoRef ? 'text-[#451db3]' : ''}`}>{photoRef ? `Captured: ${photoRef.name}` : 'Upload Image...'}</span>
                    <span className="text-[#451db3] text-lg">📷</span>
                  </div>
                </div>
              </div>

              {/* Location Fetch */}
              <div className="space-y-2">
                <label className="block flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                  <span>GPS Coordinates <span className="text-red-500">*</span></span>
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" value={location} readOnly required placeholder="Lat, Long"
                    className="flex-1 rounded-full border border-slate-200 px-5 py-3.5 text-sm font-mono font-bold bg-slate-50 outline-none text-slate-600 shadow-sm"
                  />
                  <div className="flex gap-2">
                    <button 
                      type="button" onClick={(e) => handleFetchLocation(e, false)} disabled={isFetchingLocation}
                      className="bg-white border border-slate-200 text-slate-600 px-5 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-all"
                    >
                      Real
                    </button>
                    <button 
                      type="button" onClick={(e) => handleFetchLocation(e, true)} disabled={isFetchingLocation}
                      className="bg-slate-900 text-white px-5 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 shadow-sm transition-all"
                    >
                      Match
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Progress & Utilization Remark <span className="text-red-500">*</span></label>
              <textarea 
                value={remark} onChange={(e) => setRemark(e.target.value)} required rows="3" 
                placeholder="Describe the work completed with this funding..."
                className={`${inputClass} rounded-3xl resize-none py-4`}
              ></textarea>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button type="submit" className="w-full md:w-auto px-10 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#451db3] to-[#5b2bd9] rounded-full hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(69,29,179,0.25)]">
                Save & Authenticate Update ✓
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE HISTORY LOG */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10">
        <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b border-slate-100 pb-4 mb-8">Utilization History Ledger</h3>
        
        {currentHistory.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
            No updates recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {currentHistory.map((update) => (
              <div key={update.id} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8">
                
                <div className="w-full md:w-48 h-32 md:h-auto bg-[#451db3]/5 rounded-2xl border border-[#451db3]/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-4xl mb-2">📸</span>
                  <span className="text-[9px] font-black text-[#451db3] uppercase tracking-widest">Geo-Verified</span>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full mr-3">{update.date}</span>
                      <span className="text-xs font-mono font-bold text-slate-600 block sm:inline mt-2 sm:mt-0">📍 {update.location}</span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl font-black text-slate-900">{formatCurrency(update.amountInvested)}</p>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Source: {update.fundSource}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic border-l-2 border-[#451db3] pl-4">
                    "{update.remark}"
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