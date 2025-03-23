
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { encryptData, decryptData } from '@/utils/crypto';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { username } = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUsername(username);
      } catch (error) {
        console.error('Failed to parse auth data', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const getUsersData = (): Record<string, string> => {
    const encryptedData = localStorage.getItem('usersData');
    if (!encryptedData) return {};
    
    try {
      const decrypted = decryptData(encryptedData);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt users data', error);
      return {};
    }
  };

  const saveUsersData = (data: Record<string, string>) => {
    const encrypted = encryptData(JSON.stringify(data));
    localStorage.setItem('usersData', encrypted);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const usersData = getUsersData();
    
    if (usersData[username] === password) {
      setIsAuthenticated(true);
      setUsername(username);
      localStorage.setItem('auth', JSON.stringify({ username }));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    const usersData = getUsersData();
    
    if (usersData[username]) {
      return false; // Username already exists
    }
    
    const updatedData = { ...usersData, [username]: password };
    saveUsersData(updatedData);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('auth');
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      username,
      login,
      register,
      logout,
    }),
    [isAuthenticated, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
