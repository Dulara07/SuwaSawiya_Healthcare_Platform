import React, { useState, createContext, useContext } from 'react';
import { User, UserRole } from '../types';
interface UserContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
const UserContext = createContext<UserContextType | undefined>(undefined);
export function UserProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const login = (role: UserRole) => {
    // Mock login logic
    const mockUser: User = {
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
  return <UserContext.Provider value={{
    user,
    login,
    logout,
    isAuthenticated: !!user
  }}>
      {children}
    </UserContext.Provider>;
}
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}