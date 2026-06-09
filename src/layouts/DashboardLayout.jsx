import React, { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { ROLE_ACCESS } from '../config/roles';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = location.state?.userRole;

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = () => navigate('/', { replace: true });

  const accessLevel = ROLE_ACCESS[userRole];
  const isFullAccess = accessLevel === 'FULL';
  const isLimitedAccess = accessLevel === 'LIMITED';
  const isAccountant = accessLevel === 'FINANCE';

  let primaryLinks = [];
  if (isFullAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Project', path: '/dashboard/project' },
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Fund Allotment', path: '/dashboard/fund-allotment' },
      { name: 'Valuation', path: '/dashboard/valuation' },
      { name: 'Project Request', path: '/dashboard/project-request' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  } else if (isLimitedAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Fund Allotment', path: '/dashboard/fund-allotment' },
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
  ];

  const reportLinks = [
    { name: 'Financial Summary', path: '/dashboard/reports/financial' },
    { name: 'Progress Analytics', path: '/dashboard/reports/progress' },
    { name: 'Audit Logs', path: '/dashboard/reports/audit' },
  ];

  // Dynamic active link styling for the Dark Blue/Cyan Theme
  const isActive = (path) => location.pathname === path;
  const linkStyles = (path) => `block px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${
    isActive(path) 
      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-cyan-300 shadow-[inset_0px_0px_20px_rgba(34,211,238,0.05)]' 
      : 'text-blue-200/70 hover:bg-blue-900/40 hover:text-cyan-100'
  }`;

  return (
    // Deep dark blue base background
    <div className="relative flex h-screen bg-[#060b19] text-gray-200 font-sans overflow-hidden">
      
      {/* Ambient Light Blue Glowing Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Mobile Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-[#060b19]/90 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Side Navbar - Glassmorphic Dark Blue */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0a1128]/80 backdrop-blur-2xl border-l lg:border-l-0 lg:border-r border-blue-900/30 flex flex-col transition-transform duration-300 ease-out transform lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-blue-900/30 flex justify-between items-center bg-[#0a1128]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#060b19] flex items-center justify-center overflow-hidden border border-blue-800 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wider">CHHATTISGARH</h1>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-widest">SHASHAN</h1>
            </div>
          </div>
          <button onClick={closeMobileMenu} className="lg:hidden text-blue-400 hover:text-cyan-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Navigation Area */}
        <nav className="flex-1 p-5 overflow-y-auto space-y-8 scrollbar-hide z-10">
          
          {/* Primary Links */}
          <div className="space-y-1.5">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                state={{ userRole }} 
                onClick={closeMobileMenu}
                className={linkStyles(link.path)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Master & Reports */}
          {isFullAccess && (
            <>
              <div className="pt-6 border-t border-blue-900/30">
                <p className="px-4 text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Master Config</p>
                <div className="space-y-1.5">
                  {masterLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      state={{ userRole }} 
                      onClick={closeMobileMenu}
                      className={linkStyles(link.path)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-blue-900/30">
                <p className="px-4 text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Analytics</p>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-blue-200/70 rounded-xl hover:bg-blue-900/40 hover:text-cyan-100 transition-all duration-300"
                  >
                    <span>Reports</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isReportsOpen ? 'rotate-180 text-cyan-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isReportsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 mt-2 space-y-1 border-l-2 border-blue-800/50 ml-4">
                      {reportLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          state={{ userRole }}
                          onClick={closeMobileMenu}
                          className="block px-4 py-2.5 text-sm text-blue-300/60 rounded-lg hover:bg-blue-900/30 hover:text-cyan-200 transition-colors"
                        >
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

        {/* Footer Area */}
        <div className="p-5 border-t border-blue-900/30 space-y-4 bg-[#0a1128]/80 z-10">
          <Link 
            to="/dashboard/settings" 
            state={{ userRole }}
            onClick={closeMobileMenu}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-cyan-50 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl hover:from-blue-600/40 hover:to-cyan-600/40 hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.05)]"
          >
            <span className="mr-2">⚙️</span> System Settings
          </Link>

          <div className="pt-4 flex items-center justify-between">
            <div className="px-2">
              <p className="text-[10px] text-blue-500 uppercase tracking-widest">Active Session</p>
              <p className="text-sm font-bold text-white truncate">{userRole}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-blue-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        
        {/* Glassmorphic Top Header */}
        <header className="bg-[#0a1128]/60 backdrop-blur-xl border-b border-blue-900/30 px-6 sm:px-10 py-5 flex justify-between items-center z-30 shadow-sm">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#060b19] flex items-center justify-center overflow-hidden border border-blue-800">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="leading-none">
              <h1 className="text-[10px] font-bold text-white tracking-widest">CHHATTISGARH</h1>
              <h1 className="text-[10px] font-bold text-cyan-400 tracking-widest">SHASHAN</h1>
            </div>
          </div>
          
          <h2 className="hidden lg:block text-xl font-bold text-white tracking-wide">
            Command <span className="text-blue-500">Center</span>
          </h2>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-blue-400 hover:text-cyan-300 rounded-lg transition-colors focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide relative z-20">
          <Outlet context={{ userRole, isFullAccess, isAccountant }} />
        </main>
      </div>

    </div>
  );
}