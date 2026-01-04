import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Ruler, Hash, CheckCircle, Play, Image as ImageIcon, Loader2, 
  X, ZoomIn, ZoomOut, Maximize2 
} from 'lucide-react';
import { getWorkerOrders, updateOrderStatus } from '../../services/cableService';

const WorkerDashboard = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Data State
  const [activeTask, setActiveTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsed, setElapsed] = useState("00:00");

  // Image Modal State
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const refresh = async () => {
    try {
      const orders = await getWorkerOrders();
      const found = orderId 
        ? orders.find(o => (o._id === orderId || o.orderId?.toString() === orderId))
        : orders[0];
      setActiveTask(found || null);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    refresh();
    window.addEventListener('storage-update', refresh);
    return () => window.removeEventListener('storage-update', refresh);
  }, [orderId]);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (activeTask?.status === 'In Progress' && activeTask.startTime) {
      const updateTimer = () => {
        const diff = Math.floor((new Date().getTime() - new Date(activeTask.startTime).getTime()) / 1000);
        if (diff < 0) { setElapsed("00:00"); return; }
        const m = Math.floor(diff / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setElapsed(`${m}:${s}`);
      };
      updateTimer();
      timer = setInterval(updateTimer, 1000);
    } else { 
      setElapsed("00:00"); 
    }
    return () => clearInterval(timer);
  }, [activeTask]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeImageModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleAction = async (status) => {
    setIsLoading(true);
    try {
      await updateOrderStatus(activeTask._id || activeTask.orderId, status);
      if (status === 'Finished') navigate('/worker');
      else await refresh();
    } catch (error) {
      console.error("Action failed", error);
      setIsLoading(false);
    }
  };

  // Image Modal Handlers
  const openImage = (img) => {
    setSelectedImage(img);
    setZoomLevel(1); // Reset zoom on open
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(prev + delta, 3))); // Min 0.5x, Max 3x
  };

  if (isLoading && !activeTask) {
    return (
      <div className="flex-1 p-10 min-h-screen flex justify-center items-center ml-64 bg-[#f8fafc]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-[#f8fafc] min-h-screen flex justify-center items-start ml-64 relative">
      
      {/* --- IMAGE MODAL OVERLAY --- */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Modal Toolbar */}
          <div className="flex justify-between items-center p-4 text-white bg-black/50 z-50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Image Inspector</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                 <button onClick={() => handleZoom(-0.25)} className="p-2 hover:bg-gray-700 rounded-md transition-colors"><ZoomOut size={20} /></button>
                 <span className="text-xs font-mono w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                 <button onClick={() => handleZoom(0.25)} className="p-2 hover:bg-gray-700 rounded-md transition-colors"><ZoomIn size={20} /></button>
               </div>
               <button onClick={closeImageModal} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                 <X size={24} />
               </button>
            </div>
          </div>

          {/* Modal Content - Scrollable for Panning */}
          <div 
            className="flex-1 overflow-auto flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.target === e.currentTarget && closeImageModal()} // Click outside to close
          >
            <img 
              src={selectedImage} 
              alt="Zoomed Detail" 
              className="transition-transform duration-200 ease-out origin-center max-w-none"
              style={{ 
                transform: `scale(${zoomLevel})`,
                // If zoom is 1, fit to screen. If zoomed in, allow it to expand naturally
                height: zoomLevel <= 1 ? '90vh' : 'auto',
                width: zoomLevel <= 1 ? 'auto' : 'auto' 
              }} 
            />
          </div>
        </div>
      )}

      {/* --- DASHBOARD CONTENT --- */}
      {activeTask ? (
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="p-10 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase mb-2">Workshop Order</h1>
              <p className="text-xs text-blue-600 font-black tracking-widest uppercase">Ref: #{activeTask.orderId} • {activeTask.cableName}</p>
            </div>
            <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
              activeTask.status === 'In Progress' ? 'bg-amber-100 text-amber-600 animate-pulse' : 
              activeTask.status === 'Finished' ? 'bg-emerald-100 text-emerald-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {activeTask.status}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Col: Images */}
            <div className="lg:w-1/2 p-10 bg-gray-50/50 border-r border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {activeTask.images && activeTask.images.length > 0 ? (
                  activeTask.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => openImage(img)} // Trigger Modal
                      className="aspect-square bg-white border-4 border-white rounded-[1.5rem] shadow-sm overflow-hidden group cursor-zoom-in relative"
                    >
                      <img src={img} alt="spec" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="text-white drop-shadow-md" size={32} />
                      </div>
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

            {/* Right Col: Details & Actions */}
            <div className="lg:w-1/2 p-10 flex flex-col justify-between">
              <div>
                {activeTask.status === 'In Progress' && (
                  <div className="mb-8 p-4 bg-slate-900 rounded-2xl flex items-center justify-between shadow-lg ring-4 ring-slate-100">
                    <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Timer Active
                    </div>
                    <div className="text-2xl font-black text-white font-mono tracking-tighter tabular-nums">{elapsed}</div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-8 uppercase text-[10px] font-black text-gray-400 tracking-widest border-b pb-4">
                  <Hash size={14} className="text-blue-500" /> Technical Dimensions
                </div>
                
                <div className="space-y-4 mb-10">
                  {activeTask.dimensions?.map((d, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-gray-50 pb-3 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                      <span className="text-gray-400 text-xs font-bold uppercase">{d.label}</span>
                      <span className="text-2xl font-black text-gray-900 leading-none">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-auto">
                {activeTask.status !== 'In Progress' && activeTask.status !== 'Finished' && (
                  <button 
                    onClick={() => handleAction('In Progress')} 
                    disabled={isLoading}
                    className="bg-amber-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16}/> : <><Play size={16} /> Start Production</>}
                  </button>
                )}
                
                {activeTask.status === 'In Progress' && (
                  <button 
                    onClick={() => handleAction('Finished')} 
                    disabled={isLoading}
                    className="bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16}/> : <><CheckCircle size={16} /> Mark Finished</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 opacity-50 grayscale flex flex-col items-center">
          <Ruler size={100} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-gray-400">Queue Idle</h2>
          <p className="text-xs font-bold uppercase text-gray-300 mt-2">Waiting for new assignments...</p>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
