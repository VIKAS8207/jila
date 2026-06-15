import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../config/roles';

export default function Login() {
  const navigate = useNavigate();
  
  // View Controller: 'login', 'forgot-email', 'forgot-otp', 'forgot-reset'
  const [currentView, setCurrentView] = useState('login');

  // Form States
  const [role, setRole] = useState(ROLES.CEO_JILA_PANCHAYAT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Custom Notification State
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const triggerNotification = (type, message) => {
    setNotification({ show: true, type, message });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  // --- Handlers ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard', { state: { userRole: role } });
  };

  const handleForgotEmailSubmit = (e) => {
    e.preventDefault();
    setCurrentView('forgot-otp');
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setCurrentView('forgot-reset');
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      triggerNotification('error', 'Passwords do not match. Please try again.');
      return;
    }
    triggerNotification('success', 'Password changed successfully! You can now log in.');
    setCurrentView('login');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  // --- Custom Dropdown Data ---
  const roleGroups = [
    {
      label: 'Verifying Authority (Full Access)',
      options: [
        { value: ROLES.CEO_JILA_PANCHAYAT, display: ROLES.CEO_JILA_PANCHAYAT }
      ]
    },
    {
      label: 'Administrative (Full Access)',
      options: [
        { value: ROLES.JILA_PANCHAYAT, display: ROLES.JILA_PANCHAYAT },
        { value: ROLES.JANPAD, display: ROLES.JANPAD },
        { value: ROLES.GRAM_PANCHAYAT, display: ROLES.GRAM_PANCHAYAT }
      ]
    },
    {
      label: 'Technical (Limited Access)',
      options: [
        { value: ROLES.ENGINEER, display: ROLES.ENGINEER },
        { value: ROLES.SUB_ENGINEER, display: ROLES.SUB_ENGINEER }
      ]
    },
    {
      label: 'Finance (Restricted Access)',
      options: [
        { value: ROLES.ACCOUNTANT, display: ROLES.ACCOUNTANT }
      ]
    }
  ];

  const getRoleDisplay = (val) => {
    for (const group of roleGroups) {
      const found = group.options.find(opt => opt.value === val);
      if (found) return found.display;
    }
    return val;
  };

  // --- Reusable SVG Icons ---
  const EyeIcon = () => (
    <svg className="w-5 h-5 text-gray-500 hover:text-purple-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg className="w-5 h-5 text-gray-500 hover:text-purple-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    // Outer Container: Edge-to-Edge
    <div className="h-screen w-screen flex bg-white overflow-hidden relative">
      
      {/* --- CUSTOM NOTIFICATION ALERT --- */}
      {notification.show && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            {notification.type === 'error' ? (
              <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span className="text-sm font-bold">{notification.message}</span>
            <button onClick={() => setNotification({ show: false, type: '', message: '' })} className={`ml-4 hover:opacity-70 transition-opacity ${notification.type === 'error' ? 'text-red-900' : 'text-green-900'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* LEFT PANE: Branding / Image (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-purple-900 via-[#160b24] to-fuchsia-900 flex-col justify-between p-12 overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-600/30 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-400/20 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-1">
            <div className="w-10 h-0.5 bg-fuchsia-400"></div>
            <p className="text-xs font-bold text-fuchsia-400 tracking-[0.2em] uppercase ml-2">Official Portal</p>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
            Streamline<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
              Project Tracking
            </span>
          </h1>
          <p className="text-purple-100/80 text-sm max-w-sm leading-relaxed">
            Empowering rural development through transparent financial monitoring, real-time progress updates, and seamless administrative workflows.
          </p>
        </div>
      </div>

      {/* RIGHT PANE: Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 bg-white overflow-y-auto">
        
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center overflow-hidden border border-purple-100">
                <img src="/images/shashan.png" alt="Logo" className="w-full h-full object-cover p-1" />
              </div>
              <div className="leading-none">
                <h1 className="text-[11px] font-bold text-gray-900 tracking-widest">CHHATTISGARH</h1>
                <h1 className="text-[11px] font-bold text-purple-600 tracking-widest">SHASHAN</h1>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VIEW: LOGIN */}
          {/* ========================================================= */}
          {currentView === 'login' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                
                {/* Custom Role Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Role</label>
                  <button 
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                  >
                    <span>{getRoleDisplay(role)}</span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Options List */}
                  {isDropdownOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95">
                      {roleGroups.map((group, idx) => (
                        <div key={idx}>
                          <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/50">
                            {group.label}
                          </div>
                          <ul className="px-2">
                            {group.options.map((opt) => (
                              <li 
                                key={opt.value}
                                onClick={() => { setRole(opt.value); setIsDropdownOpen(false); }}
                                className={`px-3 py-2.5 my-0.5 text-sm font-bold rounded-lg cursor-pointer transition-colors ${role === opt.value ? 'bg-purple-100 text-purple-900' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'}`}
                              >
                                {opt.display}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overlay to close dropdown if clicking outside */}
                {isDropdownOpen && (
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder-gray-400 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-12 py-3.5 text-gray-900 placeholder-gray-400 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 focus:outline-none"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                    />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setCurrentView('forgot-email')} 
                    className="text-sm font-bold text-gray-900 hover:text-purple-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-purple-600 px-4 py-4 text-sm font-bold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 mt-6 shadow-lg shadow-purple-600/20"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: FORGOT PASSWORD - EMAIL */}
          {/* ========================================================= */}
          {currentView === 'forgot-email' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900">Reset Password</h2>
                <p className="text-sm text-gray-500 mt-2">Enter your registered email address to receive an OTP.</p>
              </div>

              <form onSubmit={handleForgotEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 placeholder-gray-400 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                  />
                </div>

                <button type="submit" className="w-full rounded-xl bg-purple-600 px-4 py-4 text-sm font-bold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all shadow-lg shadow-purple-600/20">
                  Send OTP
                </button>

                <div className="text-center pt-4">
                  <button type="button" onClick={() => setCurrentView('login')} className="text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors">
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: FORGOT PASSWORD - OTP */}
          {/* ========================================================= */}
          {currentView === 'forgot-otp' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900">Enter OTP</h2>
                <p className="text-sm text-gray-500 mt-2">We sent a 6-digit code to <span className="font-bold text-gray-900">{resetEmail || 'your email'}</span></p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Secure Code</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center tracking-[0.5em] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-2xl text-gray-900 placeholder-gray-300 font-black focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>

                <button type="submit" className="w-full rounded-xl bg-purple-600 px-4 py-4 text-sm font-bold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all shadow-lg shadow-purple-600/20">
                  Verify & Continue
                </button>

                <div className="text-center pt-4 flex flex-col gap-3">
                  <p className="text-sm font-bold text-gray-500">Didn't receive it? <button type="button" className="text-purple-600 hover:text-purple-800 transition-colors">Resend</button></p>
                  <button type="button" onClick={() => setCurrentView('login')} className="text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors">
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW: FORGOT PASSWORD - RESET */}
          {/* ========================================================= */}
          {currentView === 'forgot-reset' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900">New Password</h2>
                <p className="text-sm text-gray-500 mt-2">Create a strong, new password for your account.</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-12 py-3.5 text-gray-900 placeholder-gray-400 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 focus:outline-none">
                      {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-12 py-3.5 text-gray-900 placeholder-gray-400 font-bold focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 sm:text-sm transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 focus:outline-none">
                      {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full rounded-xl bg-purple-600 px-4 py-4 text-sm font-bold text-white hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all shadow-lg shadow-purple-600/20 mt-6">
                  Save New Password
                </button>

                <div className="text-center pt-4">
                  <button type="button" onClick={() => setCurrentView('login')} className="text-sm font-bold text-gray-500 hover:text-purple-600 transition-colors">
                    ← Cancel & Back to Sign In
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}