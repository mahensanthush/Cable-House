import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://cable-house-backend.onrender.com/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userName', response.data.user.username);

      if (response.data.user.role === 'admin') navigate('/admin');
      else if (response.data.user.role === 'worker') navigate('/worker');
      else navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800/10">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="mb-1 flex justify-center">
            {/* White box wrapper added here */}
            <div className="bg-white p-0.5 rounded-xl shadow-sm inline-flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Cable House Logo" 
                className="w-24 h-24 object-contain" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=CH"; }}
              />
            </div>
          </div>
          
          <h1 className="text-xl font-black uppercase tracking-[0.1em] leading-none">
            CABLE HOUSE
          </h1>
          <p className="text-blue-100 text-[9px] mt-2 font-bold uppercase tracking-widest opacity-80">
            WORKFLOW MANAGEMENT SYSTEM
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-7 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-red-100">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-xs transition-all font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-xs transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg mt-2"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
