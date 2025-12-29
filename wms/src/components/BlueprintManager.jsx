import React, { useState, useEffect } from 'react';
import { getCables, deleteCable } from '../../services/cableService';
import { Trash2, FileText } from 'lucide-react';

const BlueprintManager = () => {
  const [blueprints, setBlueprints] = useState([]);

  const loadBlueprints = async () => {
    const data = await getCables();
    setBlueprints(data);
  };

  useEffect(() => { loadBlueprints(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this blueprint?")) {
      const result = await deleteCable(id);
      if (result.success) loadBlueprints();
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Saved Blueprints</h3>
      <div className="space-y-4">
        {blueprints.map((bp) => (
          <div key={bp._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{bp.cableName}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">{bp.dimensions?.length} Dimensions Defined</p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(bp._id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};