import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

export default function Scheme() {
  const { isFullAccess } = useOutletContext();
  
  // Security check: Only Full Access admins can view this page
  if (!isFullAccess) return <Navigate to="/dashboard" replace />;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', startDate: '', endDate: '', description: ''
  });

  // Mock Database: Schemes
  const [schemes, setSchemes] = useState([
    { id: 1, name: 'National Health Mission', startDate: '2025-04-01', endDate: '2030-03-31', description: 'Upgrading primary healthcare infrastructure across rural sectors.' },
    { id: 2, name: 'PMGSY (Pradhan Mantri Gram Sadak Yojana)', startDate: '', endDate: '', description: 'Providing good all-weather road connectivity to unconnected villages.' },
    { id: 3, name: 'Jal Jeevan Mission', startDate: '2024-01-01', endDate: '2027-12-31', description: 'Ensuring safe and adequate drinking water through individual household tap connections.' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newScheme = { ...formData, id: Date.now() };
    setSchemes([newScheme, ...schemes]);
    setIsModalOpen(false);
    setFormData({ name: '', startDate: '', endDate: '', description: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Scheme Master</h2>
          <p className="text-sm text-gray-500">Manage government schemes and funding categories.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          + New Scheme
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Scheme Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Description</th>
                <th className="px-6 py-3 font-semibold text-gray-700 w-48">Active Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schemes.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No schemes registered.</td></tr>
              ) : (
                schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 align-top">{s.name}</td>
                    <td className="px-6 py-4 text-gray-600 align-top">{s.description}</td>
                    <td className="px-6 py-4 text-gray-500 align-top">
                      {s.startDate || s.endDate ? (
                        <>
                          <div className="text-xs">Start: {s.startDate || 'N/A'}</div>
                          <div className="text-xs">End: {s.endDate || 'N/A'}</div>
                        </>
                      ) : (
                        <span className="text-xs italic">Continuous / Not Specified</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-900">Add New Scheme</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Scheme Name <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="e.g., Jal Jeevan Mission" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Start Date <span className="text-xs font-normal text-gray-400">(Optional)</span></label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">End Date <span className="text-xs font-normal text-gray-400">(Optional)</span></label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" placeholder="Describe the purpose of this scheme..."></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800">Save Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}