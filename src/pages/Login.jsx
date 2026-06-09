import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../config/roles';

export default function Login() {
  // Default to the CO_JILA_ADHYAKSH role for logic, even though we display CEO
  const [role, setRole] = useState(ROLES.CO_JILA_ADHYAKSH);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the actual role string to the dashboard
    navigate('/dashboard', { state: { userRole: role } });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#060b19] px-4 text-gray-200 overflow-hidden">
      
      {/* Ambient Light Blue Glowing Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none z-0" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-blue-900/50 bg-[#0a1128] p-8 sm:p-10 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
        
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-5">
            <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-1" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            PROJECT <span className="text-cyan-400">MONITOR</span>
          </h2>
          <p className="mt-2 text-sm text-blue-200">Authenticate to access the command center</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          {/* Role Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-bold text-blue-300 uppercase tracking-widest mb-2">Designation / Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-blue-700 bg-[#0f172a] px-4 py-3.5 text-white font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:text-sm cursor-pointer"
            >
              <optgroup label="Administrative (Full Access)" className="bg-[#0f172a] text-white font-bold">
                {/* We display CEO, but the value is still CO_JILA_ADHYAKSH */}
                <option value={ROLES.CO_JILA_ADHYAKSH}>CEO Jila Panchayat</option>
                <option value={ROLES.JANPAD}>{ROLES.JANPAD}</option>
                <option value={ROLES.GRAM_PANCHAYAT}>{ROLES.GRAM_PANCHAYAT}</option>
              </optgroup>
              <optgroup label="Technical (Limited Access)" className="bg-[#0f172a] text-white font-bold">
                <option value={ROLES.ENGINEER}>{ROLES.ENGINEER}</option>
                <option value={ROLES.SUB_ENGINEER}>{ROLES.SUB_ENGINEER}</option>
              </optgroup>
              <optgroup label="Finance (Restricted Access)" className="bg-[#0f172a] text-white font-bold">
                <option value={ROLES.ACCOUNTANT}>{ROLES.ACCOUNTANT}</option>
              </optgroup>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-bold text-blue-300 uppercase tracking-widest mb-2">Email / User ID</label>
            <input
              type="text"
              required
              placeholder="Enter your ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-blue-700 bg-[#0f172a] px-4 py-3.5 text-white placeholder-blue-300/50 font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:text-sm"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-bold text-blue-300 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-blue-700 bg-[#0f172a] px-4 py-3.5 text-white placeholder-blue-300/50 font-medium focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-sm font-bold text-white hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#060b19] transition-all duration-300 mt-8 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            Secure Login
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
}