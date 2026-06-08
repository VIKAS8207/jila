import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Documentation() {
  // Retrieve the access level from our Layout wrapper
  const { isFullAccess } = useOutletContext();

  // State to manage what we are currently looking at ('list', 'upload', 'view')
  const [currentView, setCurrentView] = useState('list');
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Database of projects and their document status
  const [projects, setProjects] = useState([
    { id: 1, projectName: 'Sample Community Hall', ts: true, patvari: true, admin: true },
    { id: 2, projectName: 'Primary School Renovation', ts: true, patvari: false, admin: false },
    { id: 3, projectName: 'Road Construction Ward 45', ts: false, patvari: false, admin: false },
  ]);

  // Handle Search Filtering
  const filteredProjects = projects.filter(proj => 
    proj.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation Handlers
  const handleOpenUpload = (project) => {
    setActiveProject(project);
    setCurrentView('upload');
  };

  const handleOpenView = (project) => {
    setActiveProject(project);
    setCurrentView('view');
  };

  const handleBackToList = () => {
    setActiveProject(null);
    setCurrentView('list');
  };

  // Handle Simulated File Upload Submission
  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    // Simulate checking the checkboxes/files. In a real app, you'd process FormData here.
    const updatedProjects = projects.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          ts: e.target.ts.checked || p.ts,
          patvari: e.target.patvari.checked || p.patvari,
          admin: e.target.admin.checked || p.admin
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    handleBackToList();
  };

  // --- RENDER: LIST VIEW ---
  if (currentView === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Documentation Control</h2>
            <p className="text-sm text-gray-500">Manage technical and administrative files.</p>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Project Name</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">TS</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Patvari B1</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Admin Sanction</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((proj) => {
                const isComplete = proj.ts && proj.patvari && proj.admin;
                
                return (
                  <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{proj.projectName}</td>
                    <td className="px-6 py-4 text-center">{proj.ts ? '✅' : '❌'}</td>
                    <td className="px-6 py-4 text-center">{proj.patvari ? '✅' : '❌'}</td>
                    <td className="px-6 py-4 text-center">{proj.admin ? '✅' : '❌'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isComplete ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {isComplete ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleOpenView(proj)}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-300 underline-offset-2"
                      >
                        View
                      </button>
                      
                      {/* ONLY SHOW UPLOAD IF NOT FULL ACCESS (Limited Access) */}
                      {!isFullAccess && (
                        <button 
                          onClick={() => handleOpenUpload(proj)}
                          className="text-sm font-medium text-gray-900 hover:text-gray-600 underline decoration-gray-300 underline-offset-2"
                        >
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- RENDER: UPLOAD VIEW ---
  if (currentView === 'upload') {
    return (
      <div className="max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upload Documents</h3>
            <p className="text-sm text-gray-500">{activeProject.projectName}</p>
          </div>
          <button onClick={handleBackToList} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back to List</button>
        </div>
        
        <form onSubmit={handleFileUploadSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* TS Document */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Technical Sanction (TS)</p>
                <p className="text-xs text-gray-500">Upload PDF only</p>
              </div>
              <div className="flex items-center gap-3">
                {activeProject.ts && <span className="text-xs text-green-600 font-medium">Already Uploaded</span>}
                <input type="checkbox" name="ts" id="ts" defaultChecked={activeProject.ts} className="w-5 h-5 accent-gray-900" />
                <label htmlFor="ts" className="text-sm text-gray-600">Simulate Upload</label>
              </div>
            </div>

            {/* Patvari B1 */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Patvari B1</p>
                <p className="text-xs text-gray-500">Upload land record document</p>
              </div>
              <div className="flex items-center gap-3">
                {activeProject.patvari && <span className="text-xs text-green-600 font-medium">Already Uploaded</span>}
                <input type="checkbox" name="patvari" id="patvari" defaultChecked={activeProject.patvari} className="w-5 h-5 accent-gray-900" />
                <label htmlFor="patvari" className="text-sm text-gray-600">Simulate Upload</label>
              </div>
            </div>

            {/* Admin Sanction */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Administrative Sanction</p>
                <p className="text-xs text-gray-500">Upload official approval</p>
              </div>
              <div className="flex items-center gap-3">
                {activeProject.admin && <span className="text-xs text-green-600 font-medium">Already Uploaded</span>}
                <input type="checkbox" name="admin" id="admin" defaultChecked={activeProject.admin} className="w-5 h-5 accent-gray-900" />
                <label htmlFor="admin" className="text-sm text-gray-600">Simulate Upload</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleBackToList} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">Save Documents</button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER: VIEW VIEW ---
  if (currentView === 'view') {
    return (
      <div className="max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Document Viewer</h3>
            <p className="text-sm text-gray-500">{activeProject.projectName}</p>
          </div>
          <button onClick={handleBackToList} className="text-sm font-medium text-gray-500 hover:text-gray-900">← Back to List</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Technical Sanction (TS)</span>
            {activeProject.ts ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Patvari B1</span>
            {activeProject.patvari ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
          <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <span className="font-medium text-gray-900">Administrative Sanction</span>
            {activeProject.admin ? <button className="text-sm text-gray-600 underline">View PDF</button> : <span className="text-sm text-gray-400">Missing</span>}
          </div>
        </div>
      </div>
    );
  }
}