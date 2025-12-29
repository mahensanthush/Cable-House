import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Activity, Package, CheckCircle, Clock, LayoutGrid, Users, Trash2, Database, Search } from 'lucide-react';
import { getWorkerOrders, deleteOrder, getCables, deleteCable } from '../../services/cableService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search

  const refresh = async () => {
    try {
      const orderData = await getWorkerOrders(); 
      const cableData = await getCables();
      setOrders(orderData);
      setBlueprints(cableData);
    } catch (error) {
      console.error("Refresh Error:", error);
    }
  };

  // Filter logic: Only show blueprints that match the search term
  const filteredBlueprints = blueprints.filter(bp => 
    bp.cableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this order from the log?")) {
      const result = await deleteOrder(id);
      if (result.success) refresh();
    }
  };

  const handleDeleteBlueprint = async (id) => {
    if (window.confirm("Permanently delete this blueprint? Customers will no longer be able to see or order it.")) {
      const result = await deleteCable(id);
      if (result.success) refresh();
    }
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

  const getDuration = (start, end) => {
    if (!start || !end) return null;
    const diff = Math.floor((end - start) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Admin Monitor</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time production oversight and logistics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/users')} 
            className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Users size={18} /> Manage Staff
          </button>

          <button 
            onClick={() => navigate('/admin/add')} 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} /> New Blueprint
          </button>
        </div>
      </div>

      {/* Metrics Row (Total Orders, In Progress, Completed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Activity size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
            <p className="text-3xl font-black text-slate-900">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Package size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</p>
            <p className="text-3xl font-black text-slate-900">{orders.filter(o => o.status === 'In Progress').length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><CheckCircle size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
            <p className="text-3xl font-black text-slate-900">{orders.filter(o => o.status === 'Finished').length}</p>
          </div>
        </div>
      </div>

      {/* Table Section: Live Production Log */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid size={20} className="text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Live Production Log</h2>
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map(o => (
              <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 uppercase tracking-tight">{o.cableName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">REF: #{o.orderId}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${o.status === 'Finished' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {o.status || 'Pending'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <button onClick={() => handleDelete(o._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blueprint Library with Search Bar */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database size={20} className="text-slate-400" />
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Blueprint Library</h2>
          </div>

          {/* THE SEARCH BAR */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="SEARCH BLUEPRINTS..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlueprints.length > 0 ? filteredBlueprints.map((bp) => (
            <div key={bp._id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] group border border-transparent hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                  <Database size={22} />
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{bp.cableName}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                    {bp.dimensions?.length || 0} Dimensions Set
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteBlueprint(bp._id)}
                className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">
                {searchTerm ? "No Match Found" : "No Blueprints Saved"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;