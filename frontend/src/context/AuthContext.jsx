import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session token on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Fallback if user details are not stored
          setUser({ name: 'Tanish Mishra', email: 'user@company.com' });
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, data } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Authentication failed.';
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password, confirmPassword });
      const { token, data } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      throw errorMsg;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};