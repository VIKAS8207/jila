import React, { useState } from 'react';

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: 'Sample Community Hall',
      agreementNo: 'AGR-2026-001',
      dateOfCreation: '2026-06-01',
      dueDate: '2026-12-01',
      typeOfWork: 'Welfare',
      sanctionYear: '2025-2026',
      district: 'Raipur',
      cityTown: 'Raipur',
      gpWard: 'Ward 45',
      totalArea: '1500',
      contractor: 'BuildTech Corp',
      scheme: 'State Grant',
      subEngineer: 'R. Kumar'
    }
  ]);

  const [formData, setFormData] = useState({
    projectName: '', agreementNo: '', dateOfCreation: '', dueDate: '',
    typeOfWork: '', sanctionYear: '', district: '', cityTown: '',
    gpWard: '', totalArea: '', contractor: '', scheme: '', subEngineer: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { ...formData, id: Date.now() };
    setProjects([newProject, ...projects]);
    setIsModalOpen(false); // Close modal
    setFormData({ // Reset form
      projectName: '', agreementNo: '', dateOfCreation: '', dueDate: '',
      typeOfWork: '', sanctionYear: '', district: '', cityTown: '',
      gpWard: '', totalArea: '', contractor: '', scheme: '', subEngineer: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
          <p className="text-sm text-gray-500">View and manage all active projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Project
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Agreement No.</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Contractor</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Sub Engineer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No projects found. Create one to get started.</td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{proj.projectName}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.agreementNo}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.typeOfWork}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.dueDate}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.contractor}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.subEngineer}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-4xl my-8">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <input type="text" name="projectName" required value={formData.projectName} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Agreement No.</label>
                  <input type="text" name="agreementNo" required value={formData.agreementNo} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date of Creation</label>
                  <input type="date" name="dateOfCreation" required value={formData.dateOfCreation} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Type of Work</label>
                  <select name="typeOfWork" required value={formData.typeOfWork} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-white">
                    <option value="">Select Type</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Scheme</label>
                  <select name="scheme" required value={formData.scheme} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-white">
                    <option value="">Select Scheme</option>
                    <option value="State Grant">State Grant</option>
                    <option value="Central Fund">Central Fund</option>
                    <option value="Local Body">Local Body</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Sanction Year</label>
                  <input type="text" name="sanctionYear" placeholder="e.g. 2025-2026" required value={formData.sanctionYear} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Total Area (Sq. Ft.)</label>
                  <input type="number" name="totalArea" required value={formData.totalArea} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">District</label>
                  <input type="text" name="district" required value={formData.district} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">City / Town</label>
                  <input type="text" name="cityTown" required value={formData.cityTown} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">GP / Ward Name</label>
                  <input type="text" name="gpWard" required value={formData.gpWard} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Name of Contractor</label>
                  <input type="text" name="contractor" required value={formData.contractor} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Sub Engineer</label>
                  <input type="text" name="subEngineer" required value={formData.subEngineer} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}