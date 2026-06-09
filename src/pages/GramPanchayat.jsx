import React, { useState, useMemo } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';

export default function GramPanchayat() {
  const { isFullAccess } = useOutletContext();
  
  // Security check: Only Full Access admins can view this page
  if (!isFullAccess) return <Navigate to="/dashboard" replace />;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', dob: '', email: '', type: '', panchayat: ''
  });

  // Mock Database: Gram Panchayat Members/Data
  const [engineers, setEngineers] = useState([
    { id: 1, name: 'R. Kumar', dob: '1985-06-15', email: 'rkumar@example.com', type: 'Civil', panchayat: 'Abhanpur' },
    { id: 2, name: 'S. Singh', dob: '1990-02-20', email: 'ssingh@example.com', type: 'Mechanical', panchayat: 'Arang' },
    { id: 3, name: 'A. Patel', dob: '1988-11-05', email: 'apatel@example.com', type: 'Electrical', panchayat: 'Tilda' },
    { id: 4, name: 'V. Sharma', dob: '1992-08-10', email: 'vsharma@example.com', type: 'Civil', panchayat: 'Abhanpur' },
  ]);

  // Calculate dynamic stats: Total per Panchayat
  const panchayatStats = useMemo(() => {
    const stats = {};
    engineers.forEach(eng => {
      stats[eng.panchayat] = (stats[eng.panchayat] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [engineers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEngineer = { ...formData, id: Date.now() };
    setEngineers([newEngineer, ...engineers]);
    setIsModalOpen(false);
    setFormData({ name: '', dob: '', email: '', type: '', panchayat: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gram Panchayat Master</h2>
          <p className="text-sm text-gray-500">Manage Gram Panchayat personnel and assignments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          + Add Gram Panchayat
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Deployment Statistics</h3>
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-800 flex items-center gap-3 shadow-sm">
            <span className="text-sm font-medium">Total Records</span>
            <span className="text-lg font-bold">{engineers.length}</span>
          </div>
          <div className="w-px bg-gray-200 mx-2 hidden sm:block"></div>
          {panchayatStats.map(([panchayat, count]) => (
            <div key={panchayat} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3">
              <span className="text-sm font-medium">{panchayat}</span>
              <span className="text-sm font-bold bg-white border border-gray-200 px-2 rounded">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Contact / DOB</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Specialization</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Assigned Gram</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {engineers.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No records added yet.</td></tr>
              ) : (
                engineers.map((eng) => (
                  <tr key={eng.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{eng.name}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{eng.email}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">DOB: {eng.dob}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border bg-white ${
                        eng.type === 'Civil' ? 'text-gray-800 border-gray-300' :
                        eng.type === 'Mechanical' ? 'text-gray-600 border-gray-200' : 'text-gray-500 border-gray-200'
                      }`}>
                        {eng.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">📍 {eng.panchayat}</td>
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
              <h3 className="text-lg font-bold text-gray-900">Register New Gram Panchayat</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Discipline</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 bg-white">
                    <option value="">Select Type</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Assign Gram</label>
                  <input type="text" required value={formData.panchayat} onChange={e => setFormData({...formData, panchayat: e.target.value})} placeholder="e.g. Abhanpur" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}