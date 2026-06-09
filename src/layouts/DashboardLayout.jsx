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

  // Updated Light Theme Sidebar Styling
  const isActive = (path) => location.pathname === path;
  const linkStyles = (path) => `block px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl ${
    isActive(path) 
      ? 'bg-blue-50/80 border-l-4 border-blue-600 text-blue-700 font-bold shadow-sm' 
      : 'text-slate-600 hover:bg-slate-100/50 hover:text-blue-600'
  }`;

  return (
    // Main Wrapper
    <div className="relative flex h-screen bg-gradient-to-br from-white via-sky-50/50 to-sky-100 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Side Navbar - Light, Frosted Glass */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white/95 backdrop-blur-2xl border-l lg:border-l-0 lg:border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-out transform lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-100 shadow-sm">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-1" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 tracking-wider">Project Monitoring</h1>
              <h1 className="text-sm font-bold text-blue-600 tracking-widest">System Bilaspur</h1>
            </div>
          </div>
          <button onClick={closeMobileMenu} className="lg:hidden text-slate-400 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Navigation Area - Added custom classes to completely hide the scrollbar */}
        <nav className="flex-1 p-5 overflow-y-auto space-y-8 z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
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
              <div className="pt-6 border-t border-slate-100">
                <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Master Config</p>
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

              <div className="pt-6 border-t border-slate-100">
                <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Analytics</p>
                <div className="space-y-1.5">
                  <button 
                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-100/50 hover:text-blue-600 transition-all duration-300"
                  >
                    <span>Reports</span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isReportsOpen ? 'rotate-180 text-blue-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isReportsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 mt-2 space-y-1 border-l-2 border-slate-100 ml-4">
                      {reportLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          state={{ userRole }}
                          onClick={closeMobileMenu}
                          className="block px-4 py-2.5 text-sm text-slate-500 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
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
        <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50/50 z-10">
          <Link 
            to="/dashboard/settings" 
            state={{ userRole }}
            onClick={closeMobileMenu}
            className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all duration-300 shadow-sm"
          >
            <span className="mr-2">⚙️</span> System Settings
          </Link>

          <div className="pt-4 flex items-center justify-between">
            <div className="px-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Session</p>
              <p className="text-sm font-bold text-slate-800 truncate">{userRole}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        
        {/* Glassmorphic Light Header */}
        <header className="bg-white/60 backdrop-blur-xl border-b border-sky-100 px-6 sm:px-10 py-5 flex justify-between items-center z-30 shadow-sm">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border border-sky-200">
              <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-0.5" />
            </div>
            <div className="leading-none">
              <h1 className="text-[10px] font-bold text-slate-800 tracking-widest">Project Monitoring</h1>
              <h1 className="text-[10px] font-bold text-blue-600 tracking-widest">System Bilaspur</h1>
            </div>
          </div>
          
          <h2 className="hidden lg:block text-xl font-bold text-slate-800 tracking-wide">
            Command <span className="text-blue-600">Center</span>
          </h2>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-blue-600 rounded-lg transition-colors focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet context={{ userRole, isFullAccess, isAccountant }} />
        </main>
      </div>

    </div>
  );
}