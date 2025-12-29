import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Roles: 'admin', 'worker', 'user'
  const [user, setUser] = useState({ role: 'admin', name: 'Test Admin' });

  const logout = () => setUser(null);
  const login = (role) => setUser({ role, name: `Demo ${role}` });

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);