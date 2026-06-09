import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project'; 
import Documentation from './pages/Documentation'; 
import ProgressUpdate from './pages/ProgressUpdate'; 
import FundAllotment from './pages/FundAllotment';
import ProjectRequest from './pages/ProjectRequest';

// 1. Import the new Master pages
import Scheme from './pages/Scheme';
import Engineer from './pages/Engineer';

import Accountant from './pages/Accountant';
import Valuation from './pages/Valuation';

// Generic placeholder for the remaining reports/settings links
const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
    <h2 className="text-xl font-bold text-gray-900">{title} Module</h2>
    <p className="text-gray-500 mt-2">This is the future home of the {title} configuration.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Main Features */}
          <Route index element={<Dashboard />} />
          <Route path="project" element={<Project />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="progress" element={<ProgressUpdate />} />
          <Route path="fund-allotment" element={<FundAllotment />} />
          <Route path="project-request" element={<ProjectRequest />} />
          
          {/* Master Configurations - Now Active! */}
          <Route path="scheme" element={<Scheme />} />
          <Route path="engineer" element={<Engineer />} />

          <Route path="accountant" element={<Accountant />} />
          <Route path="valuation" element={<Valuation />} />
          
          {/* Reports */}
          <Route path="reports/financial" element={<PlaceholderPage title="Financial Summary Report" />} />
          <Route path="reports/progress" element={<PlaceholderPage title="Progress Analytics Report" />} />
          <Route path="reports/audit" element={<PlaceholderPage title="Audit Log Report" />} />
          
          {/* Settings */}
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}