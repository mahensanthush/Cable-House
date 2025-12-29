import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, ArrowLeft, Trash2, Image as ImageIcon } from 'lucide-react';
import { saveCable } from '../../services/cableService';

const CableConfigurator = () => {
  const navigate = useNavigate();
  const [cableName, setCableName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState([{ label: '', value: '' }]);
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("Error: Maximum of 4 images allowed.");
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!cableName.trim()) return alert("Error: Cable Name is required!");

    const blueprint = {
      cableName: cableName.trim(),
      description: description.trim(),
      dimensions: dimensions.filter(d => d.label.trim() !== ''),
      images: images
    };

    if (saveCable(blueprint).success) {
      alert(`SUCCESS: "${cableName}" added to catalog.`);
      navigate('/admin'); 
    }
  };

  const updateDim = (index, field, val) => {
    const newDims = [...dimensions];
    newDims[index][field] = val;
    setDimensions(newDims);
  };

  return (
    <div className="p-10 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter text-slate-800 border-b pb-4">Create New Blueprint</h2>
        
        <div className="space-y-6">
          <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold" placeholder="Cable Name" value={cableName} onChange={e => setCableName(e.target.value)} />
          <textarea className="w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 text-sm" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Technical Images (Max 4)</label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><Trash2 size={12}/></button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
                  <ImageIcon size={24} className="text-slate-300 group-hover:text-blue-500" />
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Dimensions</label>
            {dimensions.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input className="flex-1 p-3 bg-slate-50 rounded-xl text-sm border" placeholder="Label" value={d.label} onChange={e => updateDim(i, 'label', e.target.value)} />
                <input className="w-32 p-3 bg-slate-50 rounded-xl text-sm border font-bold" placeholder="Value" value={d.value} onChange={e => updateDim(i, 'value', e.target.value)} />
              </div>
            ))}
            <button onClick={() => setDimensions([...dimensions, { label: '', value: '' }])} className="text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">+ Add Row</button>
          </div>

          <button onClick={handleSave} className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all mt-6 flex items-center justify-center gap-3">
            <Save size={20} /> Save Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};

export default CableConfigurator;