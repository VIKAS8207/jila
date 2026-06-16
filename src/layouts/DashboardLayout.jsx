import React, { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { ROLE_ACCESS, ROLES } from '../config/roles';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Retrieve user role from navigation state. 
  // FALLBACK ADDED: If state is lost (e.g. on page refresh), default to CEO so the app doesn't white-screen.
  const userRole = location.state?.userRole || 'CEO Jila Panchayat';

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = () => navigate('/', { replace: true });

  // Map the role to the access level robustly
  const accessLevel = ROLE_ACCESS[userRole] || 'FULL'; // Fallback to FULL to prevent crashes
  const isFullAccess = accessLevel === 'FULL';
  const isLimitedAccess = accessLevel === 'LIMITED';
  const isAccountant = accessLevel === 'FINANCE';

  let primaryLinks = [];
  if (isFullAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { 
        name: 'Project', 
        path: userRole === ROLES.CEO_JILA_PANCHAYAT ? '/dashboard/verify-project' : '/dashboard/project' 
      },
      
      ...(userRole !== ROLES.CEO_JILA_PANCHAYAT ? [{ name: 'Demand Creation', path: '/dashboard/demand-Creation' }] : []),
      // Conditionally render Demand Update ONLY if the user is NOT Gram Panchayat
      ...(userRole !== ROLES.GRAM_PANCHAYAT ? [{ name: 'Demand Update', path: '/dashboard/demand-update' }] : []),
      
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Valuation', path: '/dashboard/valuation' },
      { name: 'Close Project', path: '/dashboard/close-project' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  
  } else if (isLimitedAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Valuation', path: '/dashboard/valuation' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  } else if (isAccountant) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Valuation', path: '/dashboard/valuation' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  }

  const masterLinks = [
    { name: 'Scheme', path: '/dashboard/scheme' },
    { name: 'Engineer', path: '/dashboard/engineer' },
    { name: 'Gram Panchayat', path: '/dashboard/gram-panchayat' },
    { name: 'Bank Details', path: '/dashboard/bank-details' },
    { name: 'Sector', path: '/dashboard/sector' },
    { name: 'Financial Year', path: '/dashboard/financial-year' },
    { name: 'Proposal Authority', path: '/dashboard/proposal-authority' },
  ];

  const reportLinks = [
    { name: 'Financial Summary', path: '/dashboard/reports/financial' },
    { name: 'Progress Analytics', path: '/dashboard/reports/progress' },
    { name: 'Audit Logs', path: '/dashboard/reports/audit' },
  ];

  const isActive = (path) => location.pathname === path;
  const linkStyles = (path) => `block px-6 py-3.5 text-sm font-bold transition-all duration-300 rounded-full text-center sm:text-left ${
    isActive(path) 
      ? 'bg-[#451db3] text-white shadow-[0_8px_20px_rgba(69,29,179,0.25)] scale-[1.02]' 
      : 'text-slate-500 hover:bg-[#451db3]/10 hover:text-[#451db3]'
  }`;

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-white via-slate-50 to-[#451db3]/15 text-slate-800 font-sans overflow-hidden">
      
      <div 
        className={`fixed inset-0 bg-[#451db3]/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-white/70 backdrop-blur-2xl border-none shadow-[10px_0_40px_rgba(69,29,179,0.08)] flex flex-col transition-transform duration-300 ease-out transform lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 pb-4 flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-4 w-full justify-center lg:justify-start">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-[0_4px_15px_rgba(69,29,179,0.15)]">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-1" />
            </div>
            <div className="leading-tight">
              <h1 className="text-xs font-bold text-slate-800 tracking-widest uppercase">Project Monitor</h1>
              <h1 className="text-xs font-black text-[#451db3] tracking-widest uppercase">System Bilaspur</h1>
            </div>
          </div>
          <button onClick={closeMobileMenu} className="lg:hidden text-slate-400 hover:text-[#451db3] transition-colors p-2 rounded-full hover:bg-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-6 overflow-y-auto space-y-8 z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-2">
            {primaryLinks.map((link) => (
              <Link key={link.name} to={link.path} state={{ userRole }} onClick={closeMobileMenu} className={linkStyles(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          {isFullAccess && (
            <>
              <div className="pt-6">
                <p className="px-6 text-[10px] font-black text-[#451db3]/40 uppercase tracking-widest mb-4 text-center lg:text-left">Master Config</p>
                <div className="space-y-2">
                  {masterLinks.map((link) => (
                    <Link key={link.name} to={link.path} state={{ userRole }} onClick={closeMobileMenu} className={linkStyles(link.path)}>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <p className="px-6 text-[10px] font-black text-[#451db3]/40 uppercase tracking-widest mb-4 text-center lg:text-left">Analytics</p>
                <div className="space-y-2">
                  <button onClick={() => setIsReportsOpen(!isReportsOpen)} className="flex items-center justify-between w-full px-6 py-3.5 text-sm font-bold text-slate-500 rounded-full hover:bg-[#451db3]/10 hover:text-[#451db3] transition-all duration-300">
                    <span>Reports</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isReportsOpen ? 'rotate-180 text-[#451db3]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isReportsOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mt-2 space-y-2 px-2">
                      {reportLinks.map((link) => (
                        <Link key={link.name} to={link.path} state={{ userRole }} onClick={closeMobileMenu} className="block px-6 py-3 text-xs font-bold text-slate-400 rounded-full hover:bg-white hover:text-[#451db3] hover:shadow-sm transition-all text-center lg:text-left">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        <div className="p-6 space-y-4 bg-transparent z-10">
          <Link to="/dashboard/settings" state={{ userRole }} onClick={closeMobileMenu} className="flex items-center justify-center w-full px-6 py-3.5 text-sm font-bold text-[#451db3] bg-white rounded-full hover:bg-[#451db3] hover:text-white transition-all duration-300 shadow-[0_4px_15px_rgba(69,29,179,0.1)]">
            <span className="mr-2">⚙️</span> System Settings
          </Link>
          <div className="pt-4 flex items-center justify-between px-2">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Active Session</p>
              <p className="text-sm font-black text-[#451db3] truncate max-w-[140px]">{userRole}</p>
            </div>
            <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-white hover:bg-red-500 rounded-full transition-all shadow-sm hover:shadow-md" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        <header className="bg-white/40 backdrop-blur-2xl border-none px-6 sm:px-10 py-5 flex justify-between items-center z-30 shadow-[0_4px_30px_rgba(69,29,179,0.03)]">
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-0.5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-[9px] font-bold text-slate-800 tracking-widest uppercase">Project Monitoring</h1>
              <h1 className="text-[9px] font-black text-[#451db3] tracking-widest uppercase">System Bilaspur</h1>
            </div>
          </div>
          <h2 className="hidden lg:block text-xl font-black text-slate-800 tracking-wide">
            Command <span className="text-[#451db3]">Center</span>
          </h2>
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 text-slate-600 hover:text-white hover:bg-[#451db3] rounded-full transition-all shadow-sm focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-10 z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet context={{ userRole, isFullAccess, isLimitedAccess, isAccountant, accessLevel }} />
        </main>
      </div>
    </div>
  );
}