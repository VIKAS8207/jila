import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../config/roles';

export default function Login() {
  const [role, setRole] = useState(ROLES.CO_JILA_ADHYAKSH);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would validate credentials with a backend here.
    // For now, we simulate a successful login and pass the role to the dashboard.
    navigate('/dashboard', { state: { userRole: role } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white selection:bg-yellow-500 selection:text-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-neutral-900 bg-neutral-950/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Project Monitor</h2>
          <p className="mt-2 text-sm text-neutral-400">Select your role to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Role Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Designation / Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3.5 py-2.5 text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm backdrop-blur-md appearance-none cursor-pointer"
            >
              <optgroup label="Administrative (Full Access)">
                <option value={ROLES.CO_JILA_ADHYAKSH}>{ROLES.CO_JILA_ADHYAKSH}</option>
                <option value={ROLES.JANPAD}>{ROLES.JANPAD}</option>
                <option value={ROLES.GRAM_PANCHAYAT}>{ROLES.GRAM_PANCHAYAT}</option>
              </optgroup>
              <optgroup label="Technical (Limited Access)">
                <option value={ROLES.ENGINEER}>{ROLES.ENGINEER}</option>
                <option value={ROLES.SUB_ENGINEER}>{ROLES.SUB_ENGINEER}</option>
              </optgroup>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email / User ID</label>
            <input
              type="text"
              required
              placeholder="Enter your ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3.5 py-2 text-white placeholder-neutral-600 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm backdrop-blur-md"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3.5 py-2 text-white placeholder-neutral-600 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm backdrop-blur-md"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 mt-6"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}