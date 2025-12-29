import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';


import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import CableConfigurator from './pages/admin/CableConfigurator';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import UserCatalog from './pages/user/UserCatalog';
import UserManagement from './pages/admin/UserManagement';


import Sidebar from './components/Sidebar';
import Layout from './components/Layout'; 


const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) return <Navigate to="/login" />;
  if (allowedRole && userRole !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

function App() {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  
  const showSidebar = userRole && location.pathname !== '/login';

  return (
    
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Sidebar on the left */}
      {showSidebar && <Sidebar />}

      {/* 2. Main content area: A flex column that fills the remaining width */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        
        {/* 3. Layout wraps everything and places the Footer at the bottom */}
        <Layout>
          {/* CRITICAL FIX: flex-1 and overflow-y-auto make ONLY the routes scrollable.
            The footer stays fixed at the bottom of the Layout component.
          */}
          <div className="flex-1 overflow-y-auto p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Public User Catalog */}
              <Route path="/" element={<UserCatalog />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/add" element={
                <ProtectedRoute allowedRole="admin">
                  <CableConfigurator />
                </ProtectedRoute>
              } />

              <Route path="/admin/users" element={
                <ProtectedRoute allowedRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              } />

              {/* Worker Routes */}
              <Route path="/worker/:orderId?" element={
                <ProtectedRoute allowedRole="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              } />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;