import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Shield, Hammer, Users } from 'lucide-react';

const UserManagement = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [msg, setMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // ---------------------------------------------------------
      // FIX 1: Changed URL from localhost to your Render Backend
      // FIX 2: Added 'x-auth-token' header so the server knows you are Admin
      // ---------------------------------------------------------
      await axios.post(
        'https://cable-house-backend.onrender.com/api/auth/register', 
        formData,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      setMsg(`Success: ${formData.role} account created!`);
      setFormData({ username: '', password: '', role: 'user' });
    } catch (err) {
      console.error(err);
      setMsg("Error: Username might already exist or server issue.");
    }
  };

  return (
    <div className="p-10 bg-[#f8fafc] min-h-screen">
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8">Access Control</h1>
      
      <div className="max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Username</label>
            <input 
              type="text" 
              className="w-full p-4 mt-2 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
            <input 
              type="password" 
              className="w-full p-4 mt-2 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Assign Role</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'user'})}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'user' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
              >
                <Users size={20} /> <span className="text-[10px] font-black uppercase">Customer</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'worker'})}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${formData.role === 'worker' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
              >
                <Hammer size={20} /> <span className="text-[10px] font-black uppercase">Worker</span>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
            Create Account
          </button>
          {msg && <p className="text-center text-[10px] font-bold uppercase text-blue-600">{msg}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
