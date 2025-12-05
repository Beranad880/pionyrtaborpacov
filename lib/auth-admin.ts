'use client';

import { useState, useEffect } from 'react';

// Jednoduché admin ověření - v produkci by mělo být robustnější
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'pionyr2025!', // V produkci by mělo být v ENV proměnných
};

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('admin-token');
    const loginTime = localStorage.getItem('admin-login-time');

    if (token && loginTime) {
      const now = Date.now();
      const loginTimestamp = parseInt(loginTime);
      const EIGHT_HOURS = 8 * 60 * 60 * 1000; // 8 hodin

      if (now - loginTimestamp < EIGHT_HOURS) {
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }

    setIsLoading(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = btoa(`${username}:${Date.now()}`);
      localStorage.setItem('admin-token', token);
      localStorage.setItem('admin-login-time', Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-login-time');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

// Middleware pro ověření admin API requestů
export function verifyAdminRequest(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = atob(token);
    const [username] = decoded.split(':');

    return username === ADMIN_CREDENTIALS.username;
  } catch {
    return false;
  }
}