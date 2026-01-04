import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import CableConfigurator from './pages/admin/CableConfigurator';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import UserCatalog from './pages/user/UserCatalog'; // Ensure this path is correct!
import UserManagement from './pages/admin/UserManagement';

import Sidebar from './components/Sidebar';
import Layout from './components/Layout'; 

const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) return <Navigate to="/login" />;
  
  // FIX: Allow 'user' to access specific pages if needed, or handle strict roles
  if (allowedRole && userRole !== allowedRole) {
    // Prevent infinite loop: If rejected, don't just go to /, send them to THEIR dashboard
    if (userRole === 'admin') return <Navigate to="/admin" />;
    if (userRole === 'worker') return <Navigate to="/worker" />;
    if (userRole === 'user') return <Navigate to="/catalog" />;
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  // Show sidebar only if logged in and not on login page
  const showSidebar = userRole && location.pathname !== '/login';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. Sidebar */}
      {showSidebar && <Sidebar />}

      {/* 2. Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        <Layout>
          <div className="flex-1 overflow-y-auto p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* --- FIXED ROOT REDIRECT --- */}
              <Route path="/" element={
                !userRole ? <Navigate to="/login" replace /> :
                userRole === 'admin' ? <Navigate to="/admin" replace /> :
                userRole === 'worker' ? <Navigate to="/worker" replace /> :
                <Navigate to="/catalog" replace /> // <--- FIXED: Users go to Catalog now
              } />

              {/* --- USER/CUSTOMER ROUTE (ADDED) --- */}
              <Route path="/catalog" element={
                <ProtectedRoute allowedRole="user">
                  <UserCatalog />
                </ProtectedRoute>
              } />

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

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;
