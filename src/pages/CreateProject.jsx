import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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
          isOpen ? 'bg-[#451db3]/10 border-[#451db3] text-[#451db3]' : 'bg-white/50 border-slate-200 text-slate-700 hover:border-[#451db3]/50 focus:ring-2 focus:ring-[#451db3]/20'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg className={`w-4 h-4 ml-3 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#451db3]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(69,29,179,0.15)] overflow-hidden animate-in fade-in zoom-in-95 py-2">
          <ul className="max-h-60 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

// --- REUSABLE FILE INPUT ---
const FileInput = ({ label, onChange, disabled, required }) => (
  <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative flex items-center">
      <input type="file" onChange={onChange} disabled={disabled} required={required} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white/50 text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20">
        <span className="truncate">Choose Document...</span>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm">BROWSE</span>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function CreateProject() {
  const navigate = useNavigate();
  const { userRole } = useOutletContext(); // Grabs the user session
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  // Form State
  const [formData, setFormData] = useState({
    district: 'Bilaspur', // Default mock fetched data
    projectName: '', workPriority: '', sector: '', subSector: '', department: '',
    remarks: '', financialYear: '', proposedBy: '', proposalLetterDoc: null,
    hasTS: 'Yes', tsDoc: null, geoPhoto: null, layoutDoc: null, mapDoc: null, 
    khasraDoc: null, gpProposalDoc: null, sitePlanDoc: null, additionalDoc: null,
    agency: '', proposalLetterNo: '', proposalDate: '', duration: '', proposalFinalDoc: null
  });

  const [geoTagData, setGeoTagData] = useState(null);

  // Handlers
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange('geoPhoto', file);
      setGeoTagData('Extracting GPS coordinates...');
      setTimeout(() => setGeoTagData('📍 Lat: 22.0796, Long: 82.1391 (Verified)'), 1500);
    }
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setToast({ show: true, message: 'Project Created Successfully!' });
      // FIX: Securely routing back to project dashboard with session state
      setTimeout(() => navigate('/dashboard/project', { state: { userRole } }), 2000); 
    }, 1000);
  };

  const inputClass = "w-full rounded-full border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-bold text-slate-700 placeholder-slate-400 focus:border-[#451db3] focus:ring-2 focus:ring-[#451db3]/20 transition-all outline-none shadow-sm";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10 relative">
      
      {/* Success Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in">
          <div className="bg-white px-6 py-4 rounded-full shadow-2xl border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <span className="font-bold text-slate-800">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)]">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-wide">Initiate New Project</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Complete the 3-step authorization process to register a new work scheme.</p>
        </div>
        {/* FIX: Securely routing back to project dashboard on Cancel */}
        <button onClick={() => navigate('/dashboard/project', { state: { userRole } })} className="text-sm font-bold text-slate-400 hover:text-[#451db3] transition-colors">
          Cancel ✕
        </button>
      </div>

      {/* Modern Progress Indicator */}
      <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_4px_30px_rgba(69,29,179,0.03)] flex justify-center">
        <div className="flex items-center w-full max-w-3xl">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                  currentStep === step ? 'bg-[#451db3] text-white shadow-[0_0_15px_rgba(69,29,179,0.3)] scale-110' :
                  currentStep > step ? 'bg-[#451db3]/20 text-[#451db3]' : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`absolute top-12 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${currentStep >= step ? 'text-[#451db3]' : 'text-slate-400'}`}>
                  {step === 1 ? 'Creation' : step === 2 ? 'Tech Sanction' : 'Proposal'}
                </span>
              </div>
              {index < 2 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${currentStep > step + 0 ? 'bg-[#451db3]/30' : 'bg-slate-100'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Forms Container */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-10 mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* --- STEP 1: PROJECT CREATION --- */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 mb-6">1. Primary Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">District (Auto-Fetched)</label>
                  <input type="text" disabled value={formData.district} className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Project Name <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="Enter official project name" value={formData.projectName} onChange={e => handleInputChange('projectName', e.target.value)} className={inputClass} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Work Priority <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Priority" value={formData.workPriority} onChange={v => handleInputChange('workPriority', v)} options={['High (Immediate)', 'Medium', 'Low (Routine)']} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sector <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Sector" value={formData.sector} onChange={v => handleInputChange('sector', v)} options={['Health', 'Infrastructure', 'Education', 'Welfare']} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Sub Sector <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Sub Sector" value={formData.subSector} onChange={v => handleInputChange('subSector', v)} options={['Creation of Hospital', 'Creation of Park', 'Making of School', 'Road Development']} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Related Department</label>
                  <CustomDropdown placeholder="Select Department" value={formData.department} onChange={v => handleInputChange('department', v)} options={['CEO Jila Panchayat', 'Janpad', 'Gram Panchayat', 'PWD']} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Financial Year</label>
                  <CustomDropdown placeholder="Select Year" value={formData.financialYear} onChange={v => handleInputChange('financialYear', v)} options={['2025-2026', '2026-2027']} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposed By <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="Name/Designation of proposer" value={formData.proposedBy} onChange={e => handleInputChange('proposedBy', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Objective / Remarks</label>
                <textarea rows="3" placeholder="Brief description of the work objective..." value={formData.remarks} onChange={e => handleInputChange('remarks', e.target.value)} className={`${inputClass} rounded-2xl resize-none`}></textarea>
              </div>

              <FileInput label="Upload Proposal Letter" required={true} onChange={e => handleInputChange('proposalLetterDoc', e.target.files[0])} />
            </div>
          )}

          {/* --- STEP 2: TECHNICAL SANCTION --- */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 mb-6">2. Technical Sanction Details</h3>
              
              {/* Radio Toggle */}
              <div className="bg-[#451db3]/5 p-5 rounded-2xl border border-[#451db3]/10 mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">Is there a Technical Sanction for this project?</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTS === 'Yes' ? 'border-[#451db3]' : 'border-slate-300'}`}>
                      {formData.hasTS === 'Yes' && <div className="w-2.5 h-2.5 rounded-full bg-[#451db3]"></div>}
                    </div>
                    <input type="radio" className="hidden" checked={formData.hasTS === 'Yes'} onChange={() => handleInputChange('hasTS', 'Yes')} />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Yes, Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTS === 'No' ? 'border-[#451db3]' : 'border-slate-300'}`}>
                      {formData.hasTS === 'No' && <div className="w-2.5 h-2.5 rounded-full bg-[#451db3]"></div>}
                    </div>
                    <input type="radio" className="hidden" checked={formData.hasTS === 'No'} onChange={() => handleInputChange('hasTS', 'No')} />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">No, Pending</span>
                  </label>
                </div>
              </div>

              {/* Conditionally Disabled Fields */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${formData.hasTS === 'No' ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                <FileInput label="Technical Sanction Document" required={formData.hasTS === 'Yes'} onChange={e => handleInputChange('tsDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Site Photo (With Geo-Tag) <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center">
                    <input type="file" accept="image/*" disabled={formData.hasTS === 'No'} onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-full border border-slate-200 bg-white/50 text-sm font-bold text-slate-500 transition-all focus-within:border-[#451db3] focus-within:ring-2 focus-within:ring-[#451db3]/20">
                      <span className="truncate">Upload Image...</span>
                      <span className="text-[#451db3]">📷</span>
                    </div>
                  </div>
                  {geoTagData && <p className="text-[10px] font-black text-[#451db3] uppercase tracking-widest pl-4 mt-2 animate-pulse">{geoTagData}</p>}
                </div>

                <FileInput label="Layout of Work Doc" onChange={e => handleInputChange('layoutDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                <FileInput label="Map Document" onChange={e => handleInputChange('mapDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                <FileInput label="Khasra B1 Document" onChange={e => handleInputChange('khasraDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                <FileInput label="GP Prastav Proposal Doc" onChange={e => handleInputChange('gpProposalDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                <FileInput label="Site Plan Document" onChange={e => handleInputChange('sitePlanDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
                <FileInput label="Additional Documents" onChange={e => handleInputChange('additionalDoc', e.target.files[0])} disabled={formData.hasTS === 'No'} />
              </div>
            </div>
          )}

          {/* --- STEP 3: PROPOSAL DETAILS --- */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 mb-6">3. Final Proposal Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Agency / Department <span className="text-red-500">*</span></label>
                  <CustomDropdown placeholder="Select Agency" value={formData.agency} onChange={v => handleInputChange('agency', v)} options={['Panchayat Raj', 'Urban Admin', 'PWD', 'RES']} />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposal Letter No. <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. PR-2026-X" value={formData.proposalLetterNo} onChange={e => handleInputChange('proposalLetterNo', e.target.value)} className={inputClass} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Proposal Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={formData.proposalDate} onChange={e => handleInputChange('proposalDate', e.target.value)} className={inputClass} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Duration of Work (Days) <span className="text-red-500">*</span></label>
                  <input type="number" required min="1" placeholder="e.g. 180" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} className={inputClass} />
                </div>
              </div>

              <FileInput label="Final Proposal Document" required={true} onChange={e => handleInputChange('proposalFinalDoc', e.target.files[0])} />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <button 
              type="button" 
              onClick={handleBack} 
              disabled={currentStep === 1}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ← Back
            </button>
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-10 py-3.5 rounded-full bg-[#451db3] text-white text-sm font-bold shadow-[0_8px_20px_rgba(69,29,179,0.25)] hover:bg-[#3a1796] hover:-translate-y-0.5 transition-all"
              >
                Continue Next Step →
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-10 py-3.5 rounded-full bg-green-500 text-white text-sm font-bold shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:bg-green-600 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Submit & Create Project ✓'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}