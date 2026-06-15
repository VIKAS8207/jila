import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Import the separated dashboard components
import AdminDashboard from '../components/dashboards/AdminDashboard';
import EngineerDashboard from '../components/dashboards/EngineerDashboard';

export default function Dashboard() {
  const { userRole } = useOutletContext();

  // Traffic Controller Logic for Higher Admins
  if (['CEO Jila Panchayat', 'Jila Panchayat', 'Janpad', 'Gram Panchayat', 'CO Jila Adhyaksh'].includes(userRole)) {
    return <AdminDashboard userRole={userRole} />;
  } 
  
  // Traffic Controller Logic for Accountant
  if (userRole === 'Accountant') {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white/60 backdrop-blur-2xl rounded-3xl border border-slate-100 shadow-sm">
        <span className="text-5xl mb-4">🚧</span>
        <h2 className="text-2xl font-black text-slate-800">Accountant Dashboard</h2>
        <p className="text-slate-500 font-bold mt-2">Currently under construction.</p>
      </div>
    );
  }

  // Default to Engineer / Sub-Engineer view
  return <EngineerDashboard userRole={userRole} />;
}