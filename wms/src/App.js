import React, { useState } from 'react'; // 1. Import useState
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// ... imports remain the same ...
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
  if (allowedRole && userRole !== allowedRole) {
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
  
  // 2. Add State to track Sidebar status
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const showSidebar = userRole && location.pathname !== '/login';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 3. Pass state and toggle function to Sidebar */}
      {showSidebar && (
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        />
      )}

      {/* 4. DYNAMIC MARGIN FIX: 
          If no sidebar -> ml-0
          If expanded -> ml-64
          If collapsed -> ml-20
      */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          !showSidebar ? 'ml-0' : isSidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <Layout>
          <div className="flex-1 overflow-y-auto p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                !userRole ? <Navigate to="/login" replace /> :
                userRole === 'admin' ? <Navigate to="/admin" replace /> :
                userRole === 'worker' ? <Navigate to="/worker" replace /> :
                <Navigate to="/catalog" replace /> 
              } />

              <Route path="/catalog" element={<ProtectedRoute allowedRole="user"><UserCatalog /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/add" element={<ProtectedRoute allowedRole="admin"><CableConfigurator /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><UserManagement /></ProtectedRoute>} />
              <Route path="/worker/:orderId?" element={<ProtectedRoute allowedRole="worker"><WorkerDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Layout>
      </div>
    </div>
  );
}

export default App;
