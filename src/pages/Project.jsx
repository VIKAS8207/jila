import React, { useState, useEffect } from 'react';

export default function Project() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter States
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterScheme, setFilterScheme] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock Data (Expanded to demonstrate pagination)
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: 'Sample Community Hall',
      agreementNo: 'AGR-2026-001',
      dateOfCreation: '2026-06-01',
      dueDate: '2026-12-01',
      sector: 'Welfare', 
      sanctionYear: '2025-2026',
      district: 'Raipur',
      cityTown: 'Raipur',
      gpWard: 'Ward 45',
      totalArea: '1500',
      contractor: 'BuildTech Corp',
      scheme: 'State Grant',
      subEngineer: 'R. Kumar',
      department: 'Janpad' 
    },
    {
      id: 2,
      projectName: 'Primary School Renovation',
      agreementNo: 'AGR-2026-002',
      dateOfCreation: '2026-05-15',
      dueDate: '2026-10-15',
      sector: 'Education',
      sanctionYear: '2025-2026',
      district: 'Raipur',
      cityTown: 'Abhanpur',
      gpWard: 'Ward 12',
      totalArea: '2000',
      contractor: 'EduBuild Pvt',
      scheme: 'Central Fund',
      subEngineer: 'S. Singh',
      department: 'CO Jila Adhyaksh'
    },
    {
      id: 3,
      projectName: 'Village Water Tank',
      agreementNo: 'AGR-2026-003',
      dateOfCreation: '2026-06-10',
      dueDate: '2026-09-30',
      sector: 'Infrastructure',
      sanctionYear: '2026-2027',
      district: 'Raipur',
      cityTown: 'Arang',
      gpWard: 'Ward 3',
      totalArea: '500',
      contractor: 'AquaFlow Ind',
      scheme: 'Jal Jeevan Mission',
      subEngineer: 'A. Patel',
      department: 'Gram Panchayat'
    },
    {
      id: 4,
      projectName: 'Rural Dispensary',
      agreementNo: 'AGR-2026-004',
      dateOfCreation: '2026-04-20',
      dueDate: '2026-11-20',
      sector: 'Health',
      sanctionYear: '2025-2026',
      district: 'Raipur',
      cityTown: 'Tilda',
      gpWard: 'Ward 8',
      totalArea: '1200',
      contractor: 'MediCorp Builders',
      scheme: 'State Grant',
      subEngineer: 'R. Kumar',
      department: 'Janpad'
    },
    {
      id: 5,
      projectName: 'Connecting Road Extension',
      agreementNo: 'AGR-2026-005',
      dateOfCreation: '2026-03-05',
      dueDate: '2026-08-15',
      sector: 'Infrastructure',
      sanctionYear: '2025-2026',
      district: 'Raipur',
      cityTown: 'Abhanpur',
      gpWard: 'Ward 2',
      totalArea: '5000',
      contractor: 'Roadways Ltd',
      scheme: 'PMGSY',
      subEngineer: 'V. Sharma',
      department: 'CO Jila Adhyaksh'
    },
    {
      id: 6,
      projectName: 'Panchayat Solar Lights',
      agreementNo: 'AGR-2026-006',
      dateOfCreation: '2026-06-05',
      dueDate: '2026-07-20',
      sector: 'Infrastructure',
      sanctionYear: '2026-2027',
      district: 'Raipur',
      cityTown: 'Arang',
      gpWard: 'Ward 5',
      totalArea: 'N/A',
      contractor: 'SunPower Co',
      scheme: 'Local Body',
      subEngineer: 'S. Singh',
      department: 'Gram Panchayat'
    }
  ]);

  const [formData, setFormData] = useState({
    projectName: '', agreementNo: '', dateOfCreation: '', dueDate: '',
    sector: '', sanctionYear: '', district: '', cityTown: '',
    gpWard: '', totalArea: '', contractor: '', scheme: '', subEngineer: '', department: ''
  });

  // Reset pagination to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDepartment, filterScheme, filterSector]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = { ...formData, id: Date.now() };
    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({ 
      projectName: '', agreementNo: '', dateOfCreation: '', dueDate: '',
      sector: '', sanctionYear: '', district: '', cityTown: '',
      gpWard: '', totalArea: '', contractor: '', scheme: '', subEngineer: '', department: ''
    });
  };

  // 1. Filter Logic
  const filteredProjects = projects.filter(proj => {
    const matchDepartment = filterDepartment === '' || proj.department === filterDepartment;
    const matchScheme = filterScheme === '' || proj.scheme === filterScheme;
    const matchSector = filterSector === '' || proj.sector === filterSector;
    return matchDepartment && matchScheme && matchSector;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Extract unique values for dropdowns dynamically
  const uniqueSchemes = [...new Set(projects.map(p => p.scheme))];
  const uniqueSectors = [...new Set(projects.map(p => p.sector))];

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 border border-gray-200 rounded-xl shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
          <p className="text-sm text-gray-500">View and manage all active projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shrink-0 shadow-sm"
        >
          + New Project
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
        <span className="text-sm font-bold text-gray-700 shrink-0">Filter By:</span>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <select 
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-gray-50"
          >
            <option value="">All Departments</option>
            <option value="CO Jila Adhyaksh">CO Jila Adhyaksh</option>
            <option value="Janpad">Janpad</option>
            <option value="Gram Panchayat">Gram Panchayat</option>
          </select>

          <select 
            value={filterScheme} 
            onChange={(e) => setFilterScheme(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-gray-50"
          >
            <option value="">All Schemes</option>
            {uniqueSchemes.map((scheme, idx) => (
              <option key={idx} value={scheme}>{scheme}</option>
            ))}
          </select>

          <select 
            value={filterSector} 
            onChange={(e) => setFilterSector(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-gray-50"
          >
            <option value="">All Sectors (Work)</option>
            {uniqueSectors.map((sector, idx) => (
              <option key={idx} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        
        {(filterDepartment || filterScheme || filterSector) && (
          <button 
            onClick={() => { setFilterDepartment(''); setFilterScheme(''); setFilterSector(''); }}
            className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 shrink-0"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Data Table & Pagination Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Scheme</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Sector</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Sub Engineer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No projects match the selected filters.</td>
                </tr>
              ) : (
                currentData.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{proj.projectName}</p>
                      <p className="text-xs text-gray-500 font-mono">{proj.agreementNo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {proj.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{proj.scheme}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.sector}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.dueDate}</td>
                    <td className="px-6 py-4 text-gray-600">{proj.subEngineer}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="font-medium text-gray-900">{filteredProjects.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 font-medium px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Project Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-4xl my-8">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <input type="text" name="projectName" required value={formData.projectName} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Agreement No.</label>
                  <input type="text" name="agreementNo" required value={formData.agreementNo} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

                {/* UPDATED: Department Field (previously Sector) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Initiating Department</label>
                  <select name="department" required value={formData.department} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-white">
                    <option value="">Select Department</option>
                    <option value="CO Jila Adhyaksh">CO Jila Adhyaksh</option>
                    <option value="Janpad">Janpad</option>
                    <option value="Gram Panchayat">Gram Panchayat</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Scheme</label>
                  <select name="scheme" required value={formData.scheme} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-white">
                    <option value="">Select Scheme</option>
                    <option value="State Grant">State Grant</option>
                    <option value="Central Fund">Central Fund</option>
                    <option value="Local Body">Local Body</option>
                    <option value="Jal Jeevan Mission">Jal Jeevan Mission</option>
                    <option value="PMGSY">PMGSY</option>
                  </select>
                </div>

                {/* UPDATED: Sector Field (previously Type of Work) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Sector (Type of Work)</label>
                  <select name="sector" required value={formData.sector} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none bg-white">
                    <option value="">Select Sector</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date of Creation</label>
                    <input type="date" name="dateOfCreation" required value={formData.dateOfCreation} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Sanction Year</label>
                    <input type="text" name="sanctionYear" placeholder="e.g. 2025-2026" required value={formData.sanctionYear} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Area (Sq. Ft.)</label>
                    <input type="number" name="totalArea" required value={formData.totalArea} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">District</label>
                    <input type="text" name="district" required value={formData.district} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">City / Town</label>
                    <input type="text" name="cityTown" required value={formData.cityTown} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                  </div>
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
                  <label className="text-sm font-medium text-gray-700">Sub Engineer Assigned</label>
                  <input type="text" name="subEngineer" required value={formData.subEngineer} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
                </div>

              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
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