import React, { useState, createContext, useContext } from 'react';
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

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
        avatar: 'https://ui-avatars.com/api/?name=' + (payload.name || payload.username || 'Admin')
      });
    } catch (e) {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
