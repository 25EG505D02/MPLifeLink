import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, getStoredUser, setStoredUser, setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      setAuthToken(data.token);
      setStoredUser(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const data = await apiRegister(formData);
      setAuthToken(data.token);
      setStoredUser(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setStoredUser(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateCurrentUser = (updatedInfo) => {
    const updated = { ...user, ...updatedInfo };
    setStoredUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
