import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

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
              className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors rounded-none ${value === '' ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
            >
              {placeholder}
            </li>
            {options.map((opt, idx) => (
              <li 
                key={idx}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors rounded-none ${value === opt ? 'bg-[#451db3] text-white' : 'text-slate-600 hover:bg-[#451db3]/10 hover:text-[#451db3]'}`}
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

// --- REUSABLE FILE INPUT ---
const FileInput = ({ label, onChange, disabled, required, accept = "*", placeholder = "Choose Document..." }) => (
  <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative flex items-center">
      <input type="file" accept={accept} onChange={onChange} disabled={disabled} required={required} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white/50 text-sm font-bold transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20 shadow-sm ${placeholder.includes('Existing') ? 'text-[#451db3]' : 'text-slate-500'}`}>
        <span className="truncate">{placeholder}</span>
        <span className="bg-[#451db3]/10 text-[#451db3] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-sm uppercase">Browse</span>
      </div>
    </div>
  </div>
);

// --- REUSABLE DETAIL ITEM ---
const DetailItem = ({ label, value, highlight = false }) => (
  <div className="space-y-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-sm ${highlight ? 'font-black text-[#451db3]' : 'font-bold text-slate-800'}`}>
      {value || <span className="text-slate-300 font-normal italic">Not specified</span>}
    </p>
  </div>
);

export default function DemandCreation() {
  const { userRole } = useOutletContext(); // Grabs 'Gram Panchayat', 'Janpad', or 'CO Jila Adhyaksh'

  // View States: 'list' | 'search' | 'form' | 'details'
  const [view, setView] = useState('list');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  // --- MOCK DATA ---
  const [availableProjects] = useState([
    { id: 101, workId: 'WRK-2026-834', name: 'Sample Community Hall', district: 'Bilaspur', tahsil: 'Bilha', block: 'Bilha', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Community', startDate: '2026-06-01', endDate: '2026-12-01', estCost: '1500000', docs: { ts: true, cc: false, uc: false, geo: true }, geoData: '📍 Lat: 22.08, Long: 82.14 (PREVIOUS)' },
    { id: 102, workId: 'WRK-2026-835', name: 'Primary School Renovation', district: 'Bilaspur', tahsil: 'Takhatpur', block: 'Takhatpur', vidhanSabha: 'Takhatpur Assembly', beneficiaryType: 'Students', startDate: '2026-07-15', endDate: '2026-10-15', estCost: '800000', docs: { ts: true, cc: false, uc: true, geo: true }, geoData: '📍 Lat: 22.09, Long: 82.11 (PREVIOUS)' },
    { id: 103, workId: 'WRK-2026-836', name: 'Village Water Tank', district: 'Bilaspur', tahsil: 'Kota', block: 'Kota', vidhanSabha: 'Kota Assembly', beneficiaryType: 'Public', startDate: '2026-08-01', endDate: '2027-02-01', estCost: '2200000', docs: { ts: true, cc: true, uc: true, geo: true }, geoData: '📍 Lat: 22.10, Long: 82.15 (PREVIOUS)' },
  ]);

  const [demands, setDemands] = useState([
    { id: 1, workId: 'WRK-2026-800', name: 'Road Development Ward 4', amountRequested: '500000', submittedTo: 'Janpad', status: 'Pending', startDate: '2026-01-01', endDate: '2026-06-01', sanctionArea: 'Rural', district: 'Bilaspur', workLevel: 'Gram Panchayat', coverageDistrict: 'Bilaspur', area: 'Ward 4', tahsil: 'Bilha', block: 'Bilha', gramPanchayat: 'Uslapur', villageWard: 'Ward 4', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Community', docs: { ts: true, uc: false, cc: false, geo: true } },
    { id: 2, workId: 'WRK-2026-801', name: 'Panchayat Solar Expansion', amountRequested: '250000', submittedTo: 'CEO Jila Panchayat', status: 'Approved', startDate: '2026-02-15', endDate: '2026-05-15', sanctionArea: 'Semi-Urban', district: 'Bilaspur', workLevel: 'Janpad', coverageDistrict: 'Bilaspur', area: 'Block B', tahsil: 'Takhatpur', block: 'Takhatpur', gramPanchayat: 'Khamhariya', villageWard: 'Ward 12', vidhanSabha: 'Takhatpur Assembly', beneficiaryType: 'Public', docs: { ts: true, uc: true, cc: false, geo: true } },
    { id: 3, workId: 'WRK-2026-802', name: 'Rural Dispensary Block A', amountRequested: '850000', submittedTo: 'Janpad', status: 'Approved with Lesser Fund', startDate: '2026-03-10', endDate: '2026-10-10', sanctionArea: 'Rural', district: 'Bilaspur', workLevel: 'Janpad', coverageDistrict: 'Bilaspur', area: 'Block A', tahsil: 'Kota', block: 'Kota', gramPanchayat: 'Block A Center', villageWard: 'Ward 1', vidhanSabha: 'Kota Assembly', beneficiaryType: 'Health', docs: { ts: true, uc: false, cc: false, geo: true } },
    { id: 4, workId: 'WRK-2026-803', name: 'Connecting Road Bridge', amountRequested: '1200000', submittedTo: 'CEO Jila Panchayat', status: 'Rejected', startDate: '2026-04-01', endDate: '2026-12-31', sanctionArea: 'Rural', district: 'Bilaspur', workLevel: 'Jila Panchayat', coverageDistrict: 'Bilaspur', area: 'River Zone', tahsil: 'Bilha', block: 'Bilha', gramPanchayat: 'Bridge Zone', villageWard: 'Ward 8', vidhanSabha: 'Bilha Assembly', beneficiaryType: 'Logistics', docs: { ts: true, uc: true, cc: true, geo: true } },
  ]);

  // --- STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeDemand, setActiveDemand] = useState(null);
  const [geoTagData, setGeoTagData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    startDate: '', endDate: '', estimatedCost: '', requestTo: '',
    tahsil: '', vidhanSabha: '', beneficiaryType: '', // Added required fields
    tsDoc: null, ucDoc: null, ccDoc: null, geoPhoto: null
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(demands.length / itemsPerPage);
  const currentData = demands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  // Determine Approval Routing based on Role
  let approvalOptions = [];
  if (userRole === 'Gram Panchayat') {
    approvalOptions = ['Janpad', 'CEO Jila Panchayat'];
  } else if (userRole === 'Janpad' || userRole === 'Jila Panchayat') {
    approvalOptions = ['CEO Jila Panchayat'];
  }

  // --- HANDLERS ---
  const handleSearchSelect = (project) => {
    setSelectedProject(project);
    // Pre-populate data including mock presence of existing docs and new form fields
    setFormData({
      startDate: project.startDate,
      endDate: project.endDate,
      estimatedCost: project.estCost,
      tahsil: project.tahsil || '',
      vidhanSabha: project.vidhanSabha || '',
      beneficiaryType: project.beneficiaryType || '',
      requestTo: '',
      tsDoc: project.docs.ts ? 'existing' : null,
      ucDoc: project.docs.uc ? 'existing' : null,
      ccDoc: project.docs.cc ? 'existing' : null,
      geoPhoto: project.docs.geo ? 'existing' : null,
    });
    setGeoTagData(project.geoData || '📍 Lat: 22.07, Long: 82.13 (PREVIOUS)');
    setView('form');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, geoPhoto: file }));
      setGeoTagData('Extracting new GPS coordinates...');
      setTimeout(() => setGeoTagData('📍 Lat: 22.0796, Long: 82.1391 (UPDATED)'), 1500);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (approvalOptions.length > 0 && !formData.requestTo) {
      alert('Please select where you want to send this request.');
      return;
    }

    const newDemand = {
      id: Date.now(),
      workId: selectedProject.workId,
      name: selectedProject.name,
      amountRequested: formData.estimatedCost,
      submittedTo: approvalOptions.length === 0 ? 'Self (CEO)' : formData.requestTo,
      status: 'Submitted',
      startDate: formData.startDate,
      endDate: formData.endDate,
      // Setting mock data for the new table fields for newly created demands
      sanctionArea: 'Rural', district: selectedProject.district || 'Bilaspur', workLevel: userRole, coverageDistrict: selectedProject.district || 'Bilaspur', 
      area: 'General', tahsil: formData.tahsil, block: selectedProject.block || 'General', gramPanchayat: 'General GP', villageWard: 'General Ward', vidhanSabha: formData.vidhanSabha, beneficiaryType: formData.beneficiaryType,
      docs: {
        ts: !!formData.tsDoc,
        uc: !!formData.ucDoc,
        cc: !!formData.ccDoc,
        geo: !!formData.geoPhoto
      }
    };

    setDemands([newDemand, ...demands]);
    setCurrentPage(1); 
    showToast('Demand Request Submitted Successfully!');
    setView('list');
    setSelectedProject(null);
    setSearchQuery('');
  };

  const handleViewDemand = (demand) => {
    setActiveDemand(demand);
    setView('details');
  };

  const handleNewDemandForLesserFund = (demand) => {
    // This allows creating a new demand from an existing "Approved with Lesser Fund" record
    setSelectedProject({
      workId: demand.workId,
      name: demand.name,
      district: demand.district,
      startDate: demand.startDate,
      endDate: demand.endDate,
      estCost: '', // User needs to enter the new amount they want
      tahsil: demand.tahsil,
      block: demand.block,
      vidhanSabha: demand.vidhanSabha,
      beneficiaryType: demand.beneficiaryType,
      docs: demand.docs,
      geoData: '📍 Lat: 22.07, Long: 82.13 (PREVIOUS)'
    });
    setFormData({
      startDate: demand.startDate,
      endDate: demand.endDate,
      estimatedCost: '', // Blank for new request amount
      tahsil: demand.tahsil || '',
      vidhanSabha: demand.vidhanSabha || '',
      beneficiaryType: demand.beneficiaryType || '',
      requestTo: '',
      tsDoc: demand.docs.ts ? 'existing' : null,
      ucDoc: demand.docs.uc ? 'existing' : null,
      ccDoc: demand.docs.cc ? 'existing' : null,
      geoPhoto: demand.docs.geo ? 'existing' : null,
    });
    setGeoTagData('📍 Lat: 22.07, Long: 82.13 (PREVIOUS)');
    setView('form');
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-sm";

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-6 fade-in">
          <div className="bg-white px-6 py-4 rounded-full shadow-2xl border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span className="font-bold text-slate-800">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">
            {view === 'list' && 'Demand Creation'}
            {view === 'search' && 'Search Project'}
            {view === 'form' && 'Create Demand Request'}
            {view === 'details' && 'Demand Details'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {view === 'list' && 'Initiate and track fund demand requests for approved projects.'}
            {view === 'search' && 'Select an approved project to request funds for.'}
            {view === 'form' && 'Fill out financial details and verify documents.'}
            {view === 'details' && 'Review the submitted demand details.'}
          </p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('search')} 
            className="bg-gradient-to-r from-[#451db3] to-[#5b2bd9] hover:from-[#3a1796] hover:to-[#451db3] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(69,29,179,0.25)] shrink-0"
          >
            + Create Demand
          </button>
        ) : (
          <button 
            onClick={() => { setView('list'); setSelectedProject(null); setActiveDemand(null); }} 
            className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* ======================================================= */}
      {/* VIEW: LIST DEMANDS (UPDATED TABLE COLUMNS) */}
      {/* ======================================================= */}
      {view === 'list' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden animate-in fade-in z-10 relative w-full">
          <div className="overflow-x-auto pb-10 -mb-10"> {/* Padding for custom Action dropdowns if added */}
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#451db3]/15 border-b border-[#451db3]/20">
                <tr>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">S.No</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Status of Sanction Area</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">District</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Work Level</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Coverage District</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Area</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Tehsil</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Block</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Gram Panchayat</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Village/Ward</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest">Vidhan Sabha</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-right">Est. Amount (₹)</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Status</th>
                  <th className="px-5 py-5 text-[10px] font-black text-[#451db3] uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length === 0 ? (
                  <tr><td colSpan="14" className="px-8 py-12 text-center text-slate-500 font-bold">No demands created yet.</td></tr>
                ) : (
                  currentData.map((demand, index) => (
                    <tr key={demand.id} className="hover:bg-[#451db3]/5 transition-colors group text-sm">
                      <td className="px-5 py-5 font-bold text-slate-500 align-middle">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.sanctionArea}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.district}</td>
                      <td className="px-5 py-5 font-bold text-slate-800 align-middle">{demand.workLevel}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.coverageDistrict}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.area}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.tahsil}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.block}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.gramPanchayat}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.villageWard}</td>
                      <td className="px-5 py-5 font-medium text-slate-600 align-middle">{demand.vidhanSabha}</td>
                      <td className="px-5 py-5 font-black text-[#451db3] align-middle text-right">{formatCurrency(demand.amountRequested)}</td>
                      <td className="px-5 py-5 text-center align-middle">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          demand.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' :
                          demand.status === 'Approved with Lesser Fund' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                          demand.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                          demand.status === 'Submitted' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-amber-50 text-amber-600 border-amber-200'
                        }`}>
                          {demand.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 text-center align-middle space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => handleViewDemand(demand)}
                          className="bg-white border border-slate-200 text-slate-600 hover:text-white hover:bg-[#451db3] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                          View
                        </button>
                        {demand.status === 'Approved with Lesser Fund' && (
                          <button 
                            onClick={() => handleNewDemandForLesserFund(demand)}
                            className="bg-purple-50 border border-purple-200 text-purple-600 hover:text-white hover:bg-purple-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                          >
                            New Demand
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5 mt-10 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#451db3]">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#451db3]">{Math.min(currentPage * itemsPerPage, demands.length)}</span> of <span className="text-[#451db3]">{demands.length}</span>
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white disabled:opacity-50 transition-all shadow-sm">Prev</button>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#451db3]/10 text-[#451db3] font-black text-xs">{currentPage}</div>
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-[#451db3] hover:text-white disabled:opacity-50 transition-all shadow-sm">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: SEARCH PROJECT */}
      {/* ======================================================= */}
      {view === 'search' && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in slide-in-from-right-8 duration-500 w-full">
          <h3 className="text-xl font-black text-slate-800 mb-2">Search Approved Project</h3>
          <p className="text-sm font-medium text-slate-500 mb-8">Search by Work ID or Project Name to initiate a new demand.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-full sm:w-1/3 space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">District</label>
              <input type="text" disabled value="Bilaspur" className={`${inputClass} opacity-60 cursor-not-allowed`} />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Search Query</label>
              <input 
                type="text" 
                placeholder="Enter Work ID or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-3">
            {availableProjects
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.workId.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(proj => (
              <div key={proj.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-5 rounded-2xl hover:border-[#451db3]/30 hover:shadow-md transition-all gap-4">
                <div className="w-full sm:w-auto">
                  <h4 className="font-bold text-slate-800 text-lg">{proj.name}</h4>
                  <p className="text-xs font-black text-[#451db3] font-mono tracking-wider mt-1 mb-2">{proj.workId}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Amt: {formatCurrency(proj.estCost)}</span>
                    <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Tahsil: {proj.tahsil}</span>
                    <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Block: {proj.block}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleSearchSelect(proj)}
                  className="px-6 py-3 rounded-full bg-[#451db3]/10 text-[#451db3] text-xs font-black uppercase tracking-widest hover:bg-[#451db3] hover:text-white transition-all shadow-sm shrink-0"
                >
                  Select Project →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: DEMAND FORM (WITH ADDED FIELDS & WARNING) */}
      {/* ======================================================= */}
      {view === 'form' && selectedProject && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full">
          
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-black text-slate-800">Demand Request Form</h3>
            <div className="mt-4 bg-[#451db3]/5 border border-[#451db3]/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest">Selected Project</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{selectedProject.name}</p>
                <p className="text-sm font-bold text-slate-500 font-mono mt-1">{selectedProject.workId}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-10">
            
            {/* General Request Info (Added Tahsil, Vidhan Sabha, Beneficiary) */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. Demand Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Tehsil <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.tahsil} onChange={e => setFormData({...formData, tahsil: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Vidhan Sabha <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.vidhanSabha} onChange={e => setFormData({...formData, vidhanSabha: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Beneficiary Type <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.beneficiaryType} onChange={e => setFormData({...formData, beneficiaryType: e.target.value})} className={inputClass} placeholder="e.g. Community, Students, Local Farmers" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">End Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Demand Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required value={formData.estimatedCost} onChange={e => setFormData({...formData, estimatedCost: e.target.value})} className={inputClass} />
                </div>
                {approvalOptions.length > 0 && (
                  <div className="space-y-1.5 relative z-50">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Submit Request To <span className="text-red-500">*</span></label>
                    <CustomDropdown placeholder="Select Approving Authority" value={formData.requestTo} onChange={v => setFormData({...formData, requestTo: v})} options={approvalOptions} />
                  </div>
                )}
              </div>
            </div>

            {/* Document Verification & Replacement */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Document Verification & Updates</h4>
              <p className="text-sm font-bold text-slate-500 mb-6">Review existing documents. Upload a new file to replace the existing one for this demand request.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FileInput 
                  label="Technical Sanction (TS)" required={false} accept=".pdf" 
                  placeholder={formData.tsDoc === 'existing' ? "Existing TS Uploaded ✓" : "Upload TS Doc"}
                  onChange={e => setFormData({...formData, tsDoc: e.target.files[0]})} 
                />
                <FileInput 
                  label="Utility Certificate (UC)" required={false} accept=".pdf" 
                  placeholder={formData.ucDoc === 'existing' ? "Existing UC Uploaded ✓" : "Upload UC Doc"}
                  onChange={e => setFormData({...formData, ucDoc: e.target.files[0]})} 
                />
                <FileInput 
                  label="Completion Certificate (CC)" required={false} accept=".pdf" 
                  placeholder={formData.ccDoc === 'existing' ? "Existing CC Uploaded ✓" : "Upload CC Doc"}
                  onChange={e => setFormData({...formData, ccDoc: e.target.files[0]})} 
                />
              </div>
            </div>

            {/* Geofence Check (With Explicit Warning) */}
            <div>
              <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">3. Location Validation</h4>
              
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm">
                <span className="text-4xl text-amber-500 mt-1">⚠️</span>
                <div>
                  <h5 className="text-amber-700 font-black uppercase tracking-widest mb-2">Crucial Geofence Matching</h5>
                  <p className="text-sm font-bold text-amber-700/80 leading-relaxed">
                    The GPS coordinates captured below <span className="font-black underline underline-offset-2">must precisely match</span> the original project coordinates stored in the system. If the system detects a mismatch, your fund demand request will be immediately flagged and blocked. Ensure you are physically at the original project site.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 md:w-1/2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Current Site Geo-Tag Photo <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`w-full flex items-center justify-between px-5 py-4 rounded-full border-2 ${formData.geoPhoto === 'existing' ? 'border-[#451db3] bg-[#451db3]/5' : formData.geoPhoto ? 'border-emerald-400 bg-emerald-50' : 'border-red-200 bg-white'} text-sm font-bold text-slate-500 transition-all shadow-sm`}>
                    <span className={`truncate ${formData.geoPhoto ? 'text-slate-800' : ''}`}>
                      {formData.geoPhoto === 'existing' ? 'Previous Photo on File (Tap to Update)' : formData.geoPhoto ? `Captured: ${formData.geoPhoto.name}` : 'Tap to Open Camera...'}
                    </span>
                    <span className="text-2xl">{formData.geoPhoto === 'existing' ? '📁' : formData.geoPhoto ? '✅' : '📸'}</span>
                  </div>
                </div>
                {geoTagData && <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest pl-4 mt-2 animate-pulse">{geoTagData}</p>}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <button type="button" onClick={() => { setView('search'); setSelectedProject(null); }} className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                ← Back to Search
              </button>
              <button type="submit" className="px-10 py-3.5 rounded-full bg-gradient-to-r from-[#451db3] to-[#5b2bd9] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:bg-[#3a1796] hover:-translate-y-0.5 transition-all">
                Submit Demand Request ✓
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ======================================================= */}
      {/* VIEW: DEMAND DETAILS */}
      {/* ======================================================= */}
      {view === 'details' && activeDemand && (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 animate-in slide-in-from-right-8 duration-500 w-full space-y-10">
          
          <div className="border-b border-[#451db3]/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#451db3]/5 p-6 rounded-3xl">
            <div>
              <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest mb-1">Demand Record</p>
              <h3 className="text-3xl font-black text-slate-900">{activeDemand.name}</h3>
              <p className="text-sm font-bold text-slate-500 font-mono mt-2">{activeDemand.workId}</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 text-right min-w-[200px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Requested Amount</p>
              <p className="text-3xl font-black text-[#451db3]">{formatCurrency(activeDemand.amountRequested)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">1. Primary Location & Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <DetailItem label="Status" value={activeDemand.status} highlight={true} />
              <DetailItem label="Status of Sanction Area" value={activeDemand.sanctionArea} />
              <DetailItem label="District" value={activeDemand.district} />
              <DetailItem label="Work Level" value={activeDemand.workLevel} />
              <DetailItem label="Coverage District" value={activeDemand.coverageDistrict} />
              <DetailItem label="Area" value={activeDemand.area} />
              <DetailItem label="Tehsil" value={activeDemand.tahsil} />
              <DetailItem label="Block" value={activeDemand.block} />
              <DetailItem label="Gram Panchayat" value={activeDemand.gramPanchayat} />
              <DetailItem label="Village / Ward" value={activeDemand.villageWard} />
              <DetailItem label="Vidhan Sabha" value={activeDemand.vidhanSabha} />
              <DetailItem label="Beneficiary Type" value={activeDemand.beneficiaryType} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black text-[#451db3] uppercase tracking-widest mb-6 border-b border-[#451db3]/10 pb-3">2. Attached Documentation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Technical Sanction (TS)</span>
                {activeDemand.docs?.ts ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">N/A</span>}
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Utility Certificate (UC)</span>
                {activeDemand.docs?.uc ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">N/A</span>}
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Completion Certificate (CC)</span>
                {activeDemand.docs?.cc ? <span className="bg-[#451db3]/10 text-[#451db3] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Included</span> : <span className="text-slate-400 text-[10px] font-black uppercase">N/A</span>}
              </div>
            </div>
            
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden min-h-[150px]">
              {activeDemand.docs?.geo ? (
                <>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
                  <span className="text-4xl relative z-10 mb-2">📍</span>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-widest relative z-10">Geo-Tag Logged</p>
                  <p className="text-[10px] font-bold text-emerald-600 font-mono mt-2 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 relative z-10 shadow-sm">Verified Match</p>
                </>
              ) : (
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Geo-Tag on File</p>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button onClick={() => setView('list')} className="px-10 py-4 rounded-full bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all">
              Close Details View
            </button>
          </div>
        </div>
      )}

    </div>
  );
}