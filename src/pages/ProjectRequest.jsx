import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ProjectRequest() {
  const { userRole } = useOutletContext();
  
  // Role definitions based on your layers
  const isSuperAdmin = userRole === 'CO Jila Adhyaksh'; // Layer 2 (Approver)
  const isLocalAdmin = userRole === 'Janpad' || userRole === 'Gram Panchayat'; // Layer 1 (Requester)

  // View States
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'detail'
  const [activeRequest, setActiveRequest] = useState(null);
  const [coActionState, setCoActionState] = useState(''); // 'approve' or 'reject'
  const [rejectRemark, setRejectRemark] = useState('');

  // Form State for New Request
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '', scheme: '', startDate: '', endDate: '', requiredFund: '',
    typeOfWork: '', district: '', village: '', location: '', photo: null
  });

  // Mock Database: Project Requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      projectName: 'New Primary Health Center',
      scheme: 'National Health Mission',
      startDate: '2026-08-01',
      endDate: '2027-02-01',
      requiredFund: 1500000,
      typeOfWork: 'Health Care Infra',
      district: 'Raipur',
      village: 'Abhanpur',
      location: '21.0531, 81.7485',
      status: 'Pending',
      nearbyExists: true, // System flag for CO
      remark: ''
    },
    {
      id: 2,
      projectName: 'Village Road Extension',
      scheme: 'PMGSY',
      startDate: '2026-07-15',
      endDate: '2026-11-30',
      requiredFund: 800000,
      typeOfWork: 'Transport',
      district: 'Raipur',
      village: 'Arang',
      location: '21.1942, 81.9682',
      status: 'Rejected',
      nearbyExists: false,
      remark: 'Limited fund currently available.'
    },
    {
      id: 3,
      projectName: 'Community Water Tank',
      scheme: 'Jal Jeevan Mission',
      startDate: '2026-06-20',
      endDate: '2026-09-20',
      requiredFund: 450000,
      typeOfWork: 'Welfare',
      district: 'Raipur',
      village: 'Tilda',
      location: '21.5583, 81.7915',
      status: 'Approved',
      nearbyExists: false,
      remark: 'Approved for Q3 disbursement.'
    }
  ]);

  // Actions
  const handleOpenDetail = (req) => {
    setActiveRequest(req);
    setCurrentView('detail');
    setCoActionState('');
    setRejectRemark('');
  };

  const handleBack = () => {
    setActiveRequest(null);
    setCurrentView('list');
  };

  const handleFetchLocation = (e) => {
    e.preventDefault();
    setIsFetchingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData({ ...formData, location: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` });
          setIsFetchingLocation(false);
        },
        () => {
          alert("Could not fetch location.");
          setIsFetchingLocation(false);
        }
      );
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const newRequest = {
      ...formData,
      id: Date.now(),
      status: 'Pending',
      nearbyExists: Math.random() > 0.7, // Randomly simulate nearby project flag for demo
      remark: ''
    };
    setRequests([newRequest, ...requests]);
    setCurrentView('list');
    setFormData({ projectName: '', scheme: '', startDate: '', endDate: '', requiredFund: '', typeOfWork: '', district: '', village: '', location: '', photo: null });
  };

  const handleCoDecision = (e) => {
    e.preventDefault();
    const updatedStatus = coActionState === 'approve' ? 'Approved' : 'Rejected';
    const finalRemark = coActionState === 'approve' ? 'Approved by CO' : rejectRemark;

    setRequests(requests.map(req => 
      req.id === activeRequest.id ? { ...req, status: updatedStatus, remark: finalRemark } : req
    ));
    
    // Update local state to reflect immediately in the UI
    setActiveRequest({ ...activeRequest, status: updatedStatus, remark: finalRemark });
    setCoActionState('');
  };

  // Status Badge Styling (Strict White/Grey)
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'bg-gray-900 text-white border-transparent';
      case 'Rejected': return 'bg-white text-gray-700 border-gray-400 border-dashed';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };


  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6 pb-10">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Project Requests</h2>
            <p className="text-sm text-gray-500">
              {isSuperAdmin ? 'Review and approve pending project proposals.' : 'Submit and track your infrastructure proposals.'}
            </p>
          </div>
          {isLocalAdmin && (
            <button 
              onClick={() => setCurrentView('form')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              + New Request
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Required (₹)</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-700 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No requests found.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{req.projectName}</p>
                        <p className="text-xs text-gray-500">{req.village}, {req.district}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{req.typeOfWork}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium text-right">{parseInt(req.requiredFund).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleOpenDetail(req)} className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2">
                          View
                        </button>
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

  // --- RENDER: FORM VIEW (Local Admin Only) ---
  if (currentView === 'form') {
    return (
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-10">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900">Initiate Project Request</h3>
          <button onClick={handleBack} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Cancel</button>
        </div>
        
        <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Project Name</label>
              <input type="text" required value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Scheme</label>
              <input type="text" required value={formData.scheme} onChange={e => setFormData({...formData, scheme: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Required Fund (₹)</label>
              <input type="number" required value={formData.requiredFund} onChange={e => setFormData({...formData, requiredFund: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Type of Work</label>
              <select required value={formData.typeOfWork} onChange={e => setFormData({...formData, typeOfWork: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white">
                <option value="">Select Type</option>
                <option value="Health Care Infra">Health Care Infra</option>
                <option value="Education">Education</option>
                <option value="Transport/Bridge">Transport / Bridge</option>
                <option value="Welfare">Welfare</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">District</label>
              <input type="text" required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Village / Town</label>
              <input type="text" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Site Location (GPS)</label>
              <div className="flex gap-2">
                <input type="text" readOnly required value={formData.location} placeholder="Lat, Long" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50 outline-none" />
                <button type="button" onClick={handleFetchLocation} className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">Fetch</button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Site Image</label>
              <input type="file" required accept="image/*" capture="environment" onChange={e => setFormData({...formData, photo: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button type="submit" className="w-full sm:w-auto bg-gray-900 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: DETAIL VIEW ---
  const isPending = activeRequest.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between sticky top-0 z-10">
        <button onClick={handleBack} className="text-gray-500 hover:text-gray-900 text-sm font-medium">← Back to List</button>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(activeRequest.status)}`}>
          {activeRequest.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeRequest.projectName}</h2>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div><p className="text-xs text-gray-500">Scheme</p><p className="font-medium text-gray-900">{activeRequest.scheme}</p></div>
              <div><p className="text-xs text-gray-500">Type of Work</p><p className="font-medium text-gray-900">{activeRequest.typeOfWork}</p></div>
              <div><p className="text-xs text-gray-500">Duration</p><p className="font-medium text-gray-900">{activeRequest.startDate} to {activeRequest.endDate}</p></div>
              <div><p className="text-xs text-gray-500">Required Fund</p><p className="font-bold text-gray-900 text-lg">₹{parseInt(activeRequest.requiredFund).toLocaleString()}</p></div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{activeRequest.village}, {activeRequest.district}</p>
                <p className="text-xs text-gray-400 font-mono mt-1">GPS: {activeRequest.location}</p>
              </div>
              <div className="flex justify-end">
                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-2xl mb-1">📸</span>
                  <span className="text-[10px] font-medium uppercase">Site Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback/Remark Box (Visible to Local Admin if not pending) */}
          {(!isPending && activeRequest.remark) && (
            <div className={`p-5 border rounded-xl ${activeRequest.status === 'Approved' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 border-dashed'}`}>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Decision Remark (CO)</h4>
              <p className="text-gray-700">{activeRequest.remark}</p>
            </div>
          )}
        </div>

        {/* Action Panel (Super Admin / CO Only) */}
        {isSuperAdmin && isPending && (
          <div className="space-y-4">
            
            {/* System Proximity Warning */}
            {activeRequest.nearbyExists && (
              <div className="bg-gray-50 border-l-4 border-gray-800 p-4 rounded-r-xl shadow-sm">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">⚠️ System Alert</p>
                <p className="text-sm text-gray-600">A similar project already exists within a 5km radius of these GPS coordinates.</p>
              </div>
            )}

            <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Official Decision</h3>
              
              {!coActionState ? (
                <div className="flex flex-col gap-3">
                  <button onClick={() => setCoActionState('approve')} className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
                    Approve Request
                  </button>
                  <button onClick={() => setCoActionState('reject')} className="w-full bg-white text-gray-900 border border-gray-300 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    Reject Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCoDecision} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                    Confirming: {coActionState === 'approve' ? 'Approval' : 'Rejection'}
                  </p>
                  
                  {coActionState === 'reject' && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">Reason for Rejection</label>
                      <select required value={rejectRemark} onChange={e => setRejectRemark(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white">
                        <option value="">Select Reason</option>
                        <option value="Already project exists nearby">Already project exists nearby</option>
                        <option value="Limited funds available">Limited funds available</option>
                        <option value="Consider for next fiscal year">Consider for next fiscal year</option>
                        <option value="Invalid documentation/location">Invalid documentation/location</option>
                      </select>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setCoActionState('')} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800">Confirm</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}