import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Import your new separated dashboard components
import AdminDashboard from '../components/dashboards/AdminDashboard';
//import EngineerDashboard from '../components/dashboards/EngineerDashboard';
// import AccountantDashboard from '../components/dashboards/AccountantDashboard';

export default function Dashboard() {
  const { userRole, isFullAccess } = useOutletContext();

  // Traffic Controller Logic
  if (userRole === 'CO Jila Adhyaksh' || userRole === 'Janpad') {
    return <AdminDashboard userRole={userRole} />;
  } 
  
  if (userRole === 'Gram Panchayat') {
    // return <PanchayatDashboard userRole={userRole} />;
    return <AdminDashboard userRole={userRole} />; // Fallback for now
  }
  
  if (userRole === 'Accountant') {
    // return <AccountantDashboard />;
    return <div>Accountant Dashboard Under Construction</div>;
  }

  // Default to Engineer / Sub-Engineer view
  return <EngineerDashboard userRole={userRole} />;
}