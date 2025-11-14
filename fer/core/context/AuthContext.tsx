"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthApiFetch, TokenSessionStorage, AuthService } from '../api';

type AuthContextValue = {
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string) => Promise<any>;
  logout: () => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authService = useMemo(() => new AuthService(new AuthApiFetch(), new TokenSessionStorage()), []);
  const [token, setToken] = useState<string | null>(() => authService.getToken());

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(authService.getToken());
    return result;
  };

  const register = async (name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string) => {
    const result = await authService.register(name, email, password, emergencyType, vehicleNumber);
    return result;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    // Redirigir al login después de cerrar sesión
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}