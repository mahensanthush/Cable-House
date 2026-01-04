import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Search, Filter, Loader2 } from 'lucide-react';  
import { getCables, placeOrder } from '../../services/cableService';

const UserCatalog = () => {
  const [cables, setCables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); 

  const loadData = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getCables();
      setCables(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('storage-update', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const handleConfirmOrder = async (cable) => {
    await placeOrder(cable);
    alert(`Order for ${cable.cableName} sent to Workshop!`);
  };

  const filteredCables = cables.filter(cable =>
    cable.cableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen">
      {/* Header & Search Bar */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Cable Catalog</h1>
          <p className="text-slate-500 font-medium mt-1">Select a blueprint to request production</p>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            />
          </div>
          <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Logic for different states: Loading vs Data vs Empty */}
      {loading ? (
        /* LOADING STATE */
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Connecting to Server...</p>
        </div>
      ) : filteredCables.length > 0 ? (
        /* DATA STATE */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCables.map((cable) => (
            <div key={cable._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:translate-y-[-8px] transition-all duration-300 flex flex-col">
              <div className="h-48 bg-slate-900 text-white flex justify-between items-start relative overflow-hidden">
                {cable.images && cable.images.length > 0 ? (
                  <img src={cable.images[0]} alt={cable.cableName} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="p-8 relative z-10"><Package size={40} className="text-blue-400" /></div>
                )}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
                <div className="p-8 w-full flex justify-end relative z-10">
                   <span className="bg-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-lg shadow-blue-900/50">Ready</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">{cable.cableName}</h3>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed font-medium italic truncate">{cable.description}</p>
               
                <button 
                  onClick={() => handleConfirmOrder(cable)}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-200"
                >
                  <ShoppingCart size={18} /> Confirm Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <Package size={64} className="text-slate-200 mb-4" />
          <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Catalog Empty</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium italic">Check back later for new blueprints.</p>
        </div>
      )}
    </div>
  );
};

export default UserCatalog;
