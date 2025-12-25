import React, { useState, createContext, useContext } from 'react';
const UserContext = createContext(undefined);
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (role) => {
    const mockUser = {
      id: 'u1',
      name: role === 'partner' ? 'City General Hospital' : 'John Doe',
      email: role === 'partner' ? 'admin@cityhospital.lk' : 'john@example.com',
      role: role,
      avatar: 'https://ui-avatars.com/api/?name=' + (role === 'partner' ? 'City+Hospital' : 'John+Doe')
    };
    setUser(mockUser);
  };
  const logout = () => {
    setUser(null);
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
