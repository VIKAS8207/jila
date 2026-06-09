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

  // Helper to close the mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  // --- ROLE BASED ACCESS LOGIC ---
  const accessLevel = ROLE_ACCESS[userRole];
  const isFullAccess = accessLevel === 'FULL';
  const isLimitedAccess = accessLevel === 'LIMITED';
  const isAccountant = accessLevel === 'FINANCE';

  // --- DYNAMIC LINK GENERATION ---
  let primaryLinks = [];

  if (isFullAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Project', path: '/dashboard/project' },
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Fund Allotment', path: '/dashboard/fund-allotment' },
      { name: 'Project Request', path: '/dashboard/project-request' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  } else if (isLimitedAccess) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Documentation', path: '/dashboard/documentation' },
      { name: 'Progress Update', path: '/dashboard/progress' },
      { name: 'Fund Allotment', path: '/dashboard/fund-allotment' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  } else if (isAccountant) {
    primaryLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Accountant Directory', path: '/dashboard/accountant' },
    ];
  }

  const masterLinks = [
    { name: 'Scheme', path: '/dashboard/scheme' },
    { name: 'Engineer', path: '/dashboard/engineer' },
  ];

  const reportLinks = [
    { name: 'Financial Summary', path: '/dashboard/reports/financial' },
    { name: 'Progress Analytics', path: '/dashboard/reports/progress' },
    { name: 'Audit Logs', path: '/dashboard/reports/audit' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Mobile Dark Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />

      {/* Side Navbar - Responsive */}
      <aside 
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out transform lg:relative lg:translate-x-0 lg:border-l-0 lg:border-r ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 tracking-wide">
            PROJECT <span className="text-gray-500">MONITOR</span>
          </h1>
          <button onClick={closeMobileMenu} className="lg:hidden text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          
          {/* Primary Links */}
          <div className="space-y-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                state={{ userRole }} 
                onClick={closeMobileMenu}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Master & Reports - ONLY Full Access sees this */}
          {isFullAccess && (
            <>
              <div className="pt-4 border-t border-gray-200">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Master Configuration</p>
                <div className="space-y-1">
                  {masterLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      state={{ userRole }} 
                      onClick={closeMobileMenu}
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Analytics</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <span>Reports</span>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isReportsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {isReportsOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-4">
                      {reportLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.path}
                          state={{ userRole }}
                          onClick={closeMobileMenu}
                          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-gray-200 space-y-4 bg-gray-50">
          <Link 
            to="/dashboard/settings" 
            state={{ userRole }}
            onClick={closeMobileMenu}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ⚙️ Settings
          </Link>

          <div className="pt-2 border-t border-gray-200">
            <div className="mb-3 px-2">
              <p className="text-xs text-gray-500">Logged in as:</p>
              <p className="text-sm font-bold text-gray-900 truncate">{userRole}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex justify-between items-center z-30">
          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-gray-900 tracking-wide">
              PROJECT <span className="text-gray-500">MONITOR</span>
            </h1>
          </div>
          
          <h2 className="hidden lg:block text-lg font-semibold text-gray-800">System Overview</h2>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* We pass down isAccountant to the Outlet so child pages know if finance is logged in */}
          <Outlet context={{ userRole, isFullAccess, isAccountant }} />
        </main>
      </div>

    </div>
  );
}