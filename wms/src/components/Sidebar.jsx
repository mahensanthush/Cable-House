import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';
import { getWorkerOrders, deleteOrder } from '../services/cableService';

const Sidebar = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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
    <div className="w-64 h-screen bg-slate-900 text-white p-6 flex flex-col fixed left-0 top-0 z-50">
      <h1 className="text-sm font-black uppercase tracking-widest mb-500 text-blue-700">CABLE HOUSE</h1>
      <nav className="flex-1 space-y-2">
        {userRole === 'user' && <Link to="/" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider">Catalog</Link>}
        {userRole === 'admin' && <Link to="/admin" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider">Admin Panel</Link>}
        {userRole === 'worker' && <Link to="/worker" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider">Workshop</Link>}
        
        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-[10px] text-slate-500 font-black mb-4 uppercase tracking-[0.2em]">Live Queue</p>
          <div className="space-y-2 overflow-y-auto max-h-[50vh]">
            {orders.map(o => (
              <div key={o._id || o.orderId} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl border border-slate-800/50 group">
                <Link to={`/worker/${o._id || o.orderId}`} className="text-[10px] font-bold truncate uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                  {o.cableName}
                </Link>
                <button 
                  onClick={async () => {
                    await deleteOrder(o._id || o.orderId);
                    refresh();
                  }} 
                  className="text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 mt-auto hover:text-red-400 transition-colors tracking-widest">
        <LogOut size={14} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;