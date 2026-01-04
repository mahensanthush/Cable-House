import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  BookOpen, // Icon for Catalog
  Shield,   // Icon for Admin
  Hammer    // Icon for Workshop
} from 'lucide-react';
import { getWorkerOrders, deleteOrder } from '../services/cableService';

const Sidebar = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true); // <--- New State
  const userRole = localStorage.getItem('userRole');

  const refresh = async () => {
    const data = await getWorkerOrders();
    setOrders(data);
  };

  useEffect(() => {
    refresh();
    window.addEventListener('storage-update', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('storage-update', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl`}
    >
      {/* 1. Header & Toggle Button */}
      <div className={`p-6 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} mb-4`}>
        {isExpanded && (
          <h1 className="text-sm font-black uppercase tracking-widest text-blue-500 whitespace-nowrap">
            Cable House
          </h1>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-slate-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-3 space-y-2">
        {/* Helper function to keep links clean */}
        <NavLink 
          to="/" 
          icon={<BookOpen size={20} />} 
          label="Catalog" 
          visible={userRole === 'user'} 
          expanded={isExpanded} 
        />
        <NavLink 
          to="/admin" 
          icon={<Shield size={20} />} 
          label="Admin Panel" 
          visible={userRole === 'admin'} 
          expanded={isExpanded} 
        />
        <NavLink 
          to="/worker" 
          icon={<Hammer size={20} />} 
          label="Workshop" 
          visible={userRole === 'worker'} 
          expanded={isExpanded} 
        />

        {/* 3. Live Queue (Hidden when contracted) */}
        <div className={`mt-10 border-t border-slate-800 pt-6 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Live Queue</p>
            <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
          </div>
          
          <div className="space-y-2 overflow-y-auto max-h-[40vh] pr-1 custom-scrollbar">
            {orders.map(o => (
              <div key={o._id || o.orderId} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl border border-slate-800/50 group hover:border-blue-500/30 transition-all">
                <Link to={`/worker/${o._id || o.orderId}`} className="text-[10px] font-bold truncate uppercase tracking-tight group-hover:text-blue-400 transition-colors w-24">
                  {o.cableName}
                </Link>
                <button 
                  onClick={async (e) => {
                    e.preventDefault(); 
                    await deleteOrder(o._id || o.orderId);
                    refresh();
                  }} 
                  className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
            {orders.length === 0 && <p className="text-[10px] text-slate-600 text-center italic">No active orders</p>}
          </div>
        </div>
      </nav>

      {/* 4. Logout Button */}
      <div className="p-3 mb-2">
        <button 
          onClick={handleLogout} 
          className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-500 ${isExpanded ? 'justify-start' : 'justify-center'}`}
        >
          <LogOut size={20} />
          {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </div>
  );
};

// Simple sub-component to handle the icons + text logic
const NavLink = ({ to, icon, label, visible, expanded }) => {
  if (!visible) return null;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white text-slate-400 ${expanded ? 'justify-start' : 'justify-center'}`}
      title={!expanded ? label : ''} // Show tooltip when collapsed
    >
      {icon}
      {expanded && <span className="font-bold text-xs uppercase tracking-wider">{label}</span>}
    </Link>
  );
};

export default Sidebar;
