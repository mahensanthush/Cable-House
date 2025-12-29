import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ruler, Hash, CheckCircle, Play, Image as ImageIcon } from 'lucide-react';
import { getWorkerOrders, updateOrderStatus } from '../../services/cableService';

const WorkerDashboard = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTask, setActiveTask] = useState(null);
  const [elapsed, setElapsed] = useState("00:00");

  
  const refresh = async () => {
    const orders = await getWorkerOrders();
    
    const found = orderId 
      ? orders.find(o => (o._id === orderId || o.orderId?.toString() === orderId))
      : orders[0];
    setActiveTask(found || null);
  };

  useEffect(() => {
    refresh();
    window.addEventListener('storage-update', refresh);
    return () => window.removeEventListener('storage-update', refresh);
  }, [orderId]);

  useEffect(() => {
    let timer;
    if (activeTask?.status === 'In Progress' && activeTask.startTime) {
      timer = setInterval(() => {
        const diff = Math.floor((new Date().getTime() - activeTask.startTime) / 1000);
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setElapsed(`${m}:${s}`);
      }, 1000);
    } else { setElapsed("00:00"); }
    return () => clearInterval(timer);
  }, [activeTask]);

  const handleAction = async (status) => {
    await updateOrderStatus(activeTask._id || activeTask.orderId, status);
    if (status === 'Finished') navigate('/worker');
    else refresh();
  };

  return (
    <div className="flex-1 p-10 bg-[#f8fafc] min-h-screen flex justify-center items-start ml-64">
      {activeTask ? (
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
          <div className="p-10 border-b flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Workshop Order</h1>
              <p className="text-xs text-blue-600 font-black tracking-widest uppercase">Ref: #{activeTask.orderId} • {activeTask.cableName}</p>
            </div>
            <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeTask.status === 'In Progress' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
              {activeTask.status}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 bg-gray-50/50 border-r border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {activeTask.images && activeTask.images.length > 0 ? (
                  activeTask.images.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-white border-4 border-white rounded-[1.5rem] shadow-sm overflow-hidden">
                      <img src={img} alt="spec" className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 aspect-video bg-white border-4 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                    <p className="text-[10px] font-black uppercase mt-2">No Reference Photos</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/2 p-10">
              {activeTask.status === 'In Progress' && (
                <div className="mb-8 p-4 bg-slate-900 rounded-2xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Timer Active</div>
                  <div className="text-2xl font-black text-white font-mono tracking-tighter">{elapsed}</div>
                </div>
              )}
              <div className="flex items-center gap-2 mb-8 uppercase text-[10px] font-black text-gray-400 tracking-widest border-b pb-4">
                <Hash size={14} className="text-blue-500" /> Technical Dimensions
              </div>
              <div className="space-y-4 mb-10">
                {activeTask.dimensions?.map((d, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-gray-50 pb-3">
                    <span className="text-gray-400 text-xs font-bold uppercase">{d.label}</span>
                    <span className="text-2xl font-black text-gray-900 leading-none">{d.value}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => handleAction('In Progress')} className="bg-amber-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2"><Play size={16} /> Start Production</button>
                <button onClick={() => handleAction('Finished')} className="bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"><CheckCircle size={16} /> Mark Finished</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 opacity-10 grayscale"><Ruler size={100} className="mx-auto mb-6" /><h2 className="text-2xl font-black uppercase tracking-[0.3em]">Queue Idle</h2></div>
      )}
    </div>
  );
};

export default WorkerDashboard;