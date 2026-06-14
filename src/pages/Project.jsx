import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Project() {
  const navigate = useNavigate(); 
  const { userRole } = useOutletContext(); 

  // Filter States
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterFinYear, setFilterFinYear] = useState('');
  const [filterSector, setFilterSector] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Updated Mock Data with the new 10 fields
  const [projects, setProjects] = useState([
    { id: 1, workId: 'WRK-2026-834', workName: 'Sample Community Hall', sector: 'Welfare', subSector: 'Community Dev', relatedDepartment: 'Janpad', proposedBy: 'Sarpanch', financialYear: '2025-2026', executingDepartment: 'RES', executingAgency: 'BuildTech Corp' },
    { id: 2, workId: 'WRK-2026-835', workName: 'Primary School Renovation', sector: 'Education', subSector: 'Maintenance', relatedDepartment: 'CEO Jila Panchayat', proposedBy: 'MLA', financialYear: '2025-2026', executingDepartment: 'PWD', executingAgency: 'EduBuild Pvt' },
    { id: 3, workId: 'WRK-2026-836', workName: 'Village Water Tank', sector: 'Infrastructure', subSector: 'Water Supply', relatedDepartment: 'Gram Panchayat', proposedBy: 'Panchayat', financialYear: '2026-2027', executingDepartment: 'PHE', executingAgency: 'AquaFlow Ind' },
    { id: 4, workId: 'WRK-2026-837', workName: 'Rural Dispensary', sector: 'Health', subSector: 'Hospital Constr.', relatedDepartment: 'Janpad', proposedBy: 'Health Min.', financialYear: '2025-2026', executingDepartment: 'CGMSC', executingAgency: 'MediCorp Builders' },
    { id: 5, workId: 'WRK-2026-838', workName: 'Connecting Road Ext.', sector: 'Infrastructure', subSector: 'Road Dev.', relatedDepartment: 'CEO Jila Panchayat', proposedBy: 'MP', financialYear: '2025-2026', executingDepartment: 'PWD', executingAgency: 'Roadways Ltd' },
    { id: 6, workId: 'WRK-2026-839', workName: 'Panchayat Solar Lights', sector: 'Infrastructure', subSector: 'Energy', relatedDepartment: 'Gram Panchayat', proposedBy: 'Sarpanch', financialYear: '2026-2027', executingDepartment: 'CREDA', executingAgency: 'SunPower Co' }
  ]);

  // Reset pagination to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDepartment, filterFinYear, filterSector]);

  // 1. Filter Logic
  const filteredProjects = projects.filter(proj => {
    const matchDepartment = filterDepartment === '' || proj.relatedDepartment === filterDepartment;
    const matchFinYear = filterFinYear === '' || proj.financialYear === filterFinYear;
    const matchSector = filterSector === '' || proj.sector === filterSector;
    return matchDepartment && matchFinYear && matchSector;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentData = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  // Extract unique values for dropdowns dynamically
  const uniqueFinYears = [...new Set(projects.map(p => p.financialYear))];
  const uniqueSectors = [...new Set(projects.map(p => p.sector))];
  const uniqueDepartments = [...new Set(projects.map(p => p.relatedDepartment))];

  // ==========================================
  // CUSTOM DROPDOWN COMPONENT
  // ==========================================
  const CustomDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative w-full" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
            isOpen ? 'bg-[#451db3]/10 text-[#451db3] border-transparent shadow-inner' : 'bg-white text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(69,29,179,0.08)]'
          }`}
        >
          <span className="truncate">{value || placeholder}</span>
          <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
            <ul className="max-h-60 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <li 
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={`px-4 py-2.5 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === '' ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
              >
                {placeholder}
              </li>
              {options.map((opt, idx) => (
                <li 
                  key={idx}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`px-4 py-2.5 my-1 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
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

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Project Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">View and manage all active projects across departments.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/project/create', { state: { userRole } })} 
          className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
        >
          + New Project
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/60 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex flex-col md:flex-row gap-5 items-start md:items-center z-20 relative">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 ml-2">Filters</span>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <CustomDropdown 
            placeholder="All Departments"
            value={filterDepartment}
            onChange={setFilterDepartment}
            options={uniqueDepartments}
          />
          <CustomDropdown 
            placeholder="All Financial Years"
            value={filterFinYear}
            onChange={setFilterFinYear}
            options={uniqueFinYears}
          />
          <CustomDropdown 
            placeholder="All Sectors (Work)"
            value={filterSector}
            onChange={setFilterSector}
            options={uniqueSectors}
          />
        </div>
        
        {(filterDepartment || filterFinYear || filterSector) && (
          <button 
            onClick={() => { setFilterDepartment(''); setFilterFinYear(''); setFilterSector(''); }}
            className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-4 py-2.5 rounded-full transition-all shrink-0 bg-red-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Data Table & Pagination Container */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden z-10 relative">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            {/* Primary Color 50% opacity shade for Header */}
            <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
              <tr>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work ID</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Name</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sector</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Sub Sector</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Related Dept</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Proposed By</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Fin. Year</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Exec. Dept</th>
                <th className="px-5 py-4 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Exec. Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-8 py-12 text-center text-slate-500 font-bold">No projects match the selected filters.</td>
                </tr>
              ) : (
                currentData.map((proj, index) => (
                  <tr key={proj.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                    <td className="px-5 py-4 font-bold text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-700">{proj.workId}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{proj.workName}</td>
                    <td className="px-5 py-4 font-medium text-slate-600">{proj.sector}</td>
                    <td className="px-5 py-4 font-medium text-slate-600">{proj.subSector}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-slate-600 border border-slate-200 group-hover:border-[#451db3]/30 group-hover:text-[#451db3] transition-colors">
                        {proj.relatedDepartment}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">{proj.proposedBy}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{proj.financialYear}</td>
                    <td className="px-5 py-4 font-medium text-slate-600">{proj.executingDepartment}</td>
                    <td className="px-5 py-4 font-medium text-slate-600">{proj.executingAgency}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="text-[#451db3]">{filteredProjects.length}</span>
          </p>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white hover:border-[#451db3] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              Prev
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#451db3]/10 text-[#451db3] font-black text-xs">
              {currentPage}
            </div>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white hover:border-[#451db3] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}