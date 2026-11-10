import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sentinelpay_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res && res.data) {
      setUser(res.data);
      localStorage.setItem('sentinelpay_user', JSON.stringify(res.data));
      localStorage.setItem('sentinelpay_token', res.data.token);
      return res.data;
    }
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res && res.data) {
      setUser(res.data);
      localStorage.setItem('sentinelpay_user', JSON.stringify(res.data));
      localStorage.setItem('sentinelpay_token', res.data.token);
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentinelpay_user');
    localStorage.removeItem('sentinelpay_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, isAuthenticated: false, login: async () => {}, register: async () => {}, logout: () => {} };
  }
  return context;
}

