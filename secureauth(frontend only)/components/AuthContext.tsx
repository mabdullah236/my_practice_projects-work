
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const session = authService.getSession();
    if (session && authService.isAuthenticated()) {
      setState({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: any) => {
    const response = await authService.login(credentials);
    setState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (userData: any) => {
    const response = await authService.signup(userData);
    setState({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
