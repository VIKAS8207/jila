import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project'; 
import DemandCreation from './pages/DemandCreation'; 
import CloseProject from './pages/CloseProject';
// 1. IMPORT THE NEW DEMAND UPDATE PAGE
import DemandUpdate from './pages/DemandUpdate'; 
import Documentation from './pages/Documentation'; 
import ProgressUpdate from './pages/ProgressUpdate'; 
import Scheme from './pages/Scheme';
import Engineer from './pages/Engineer';
import Accountant from './pages/Accountant';
import Valuation from './pages/Valuation';
import GramPanchayat from './pages/GramPanchayat';

import Sector from './pages/Sector';
import FinancialYear from './pages/FinancialYear';
import ProposalAuthority from './pages/ProposalAuthority';

import ProjectVerify from './pages/verifypage/ProjectVerify';
import BankDetails from './pages/BankDetails';

// Generic placeholder
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
    

          <Route path="demand-creation" element={<DemandCreation />} />
          <Route path="close-project" element={<CloseProject />} />
          {/* 2. ADD THE DEMAND UPDATE ROUTE HERE */}
          <Route path="demand-update" element={<DemandUpdate />} />

          <Route path="documentation" element={<Documentation />} />
          <Route path="progress" element={<ProgressUpdate />} />

          
          {/* Master Configurations */}
          <Route path="scheme" element={<Scheme />} />
          <Route path="engineer" element={<Engineer />} />
          <Route path="accountant" element={<Accountant />} />
          <Route path="valuation" element={<Valuation />} />
          <Route path="gram-panchayat" element={<GramPanchayat />} />

          <Route path="sector" element={<Sector />} />
          <Route path="financial-year" element={<FinancialYear />} />
          <Route path="proposal-authority" element={<ProposalAuthority />} />

          <Route path="verify-project" element={<ProjectVerify />} />
          <Route path="bank-details" element={<BankDetails />} />
          
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