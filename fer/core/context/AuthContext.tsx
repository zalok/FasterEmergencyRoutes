"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { AuthApiFetch, TokenSessionStorage, AuthService } from '../api';

type AuthContextValue = {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authService = useMemo(() => new AuthService(new AuthApiFetch(), new TokenSessionStorage()), []);
  const [token, setToken] = useState<string | null>(() => authService.getToken());

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(authService.getToken());
    return result;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
