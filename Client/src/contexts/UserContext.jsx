import React, { useEffect, useState, createContext, useContext } from 'react';
import { fetchCurrentUser } from '../api';
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const applyUserProfile = (profile) => {
    if (!profile) return;
    setUser({
      id: profile.id,
      name: profile.full_name || profile.username || 'User',
      username: profile.username,
      email: profile.email || '',
      role: profile.role || 'donor',
      total_donated: profile.total_donated || 0,
      donation_count: profile.donation_count || 0,
      avatar: 'https://ui-avatars.com/api/?name=' + (profile.full_name || profile.username || 'User'),
    });
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('token')) return null;
    try {
      const profile = await fetchCurrentUser();
      applyUserProfile(profile);
      return profile;
    } catch (error) {
      return null;
    }
  };

  // Real login: decode JWT and set user info
  const login = (token) => {
    if (!token) return;
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.sub,
        name: payload.name || payload.username || 'Admin',
        email: payload.email || '',
        role: payload.role || 'admin',
        total_donated: 0,
        donation_count: 0,
        avatar: 'https://ui-avatars.com/api/?name=' + (payload.name || payload.username || 'Admin')
      });
      refreshUser();
    } catch (e) {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      refreshUser();
    }
  }, []);

  return <UserContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated: !!user }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
