"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthApiFetch, TokenSessionStorage, AuthService } from '../api';

interface User {
  id: string;
  name: string;
  email: string;
  emergencyType?: string;
  vehicleNumber?: string;
}

type AuthContextValue = {
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string) => Promise<any>;
  logout: () => void;
  token: string | null;
  user: User | null;
  incidentApi: any;
  loading: boolean; // ← PROPIEDAD AÑADIDA
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Función para guardar usuario en sessionStorage
const saveUserToStorage = (user: User | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      sessionStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('auth_user');
    }
  }
};

// Función para obtener usuario de sessionStorage
const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = sessionStorage.getItem('auth_user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        return null;
      }
    }
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authService = useMemo(() => new AuthService(new AuthApiFetch(), new TokenSessionStorage()), []);
  
  // Mock de incidentApi para evitar errores de importación
  const incidentApi = useMemo(() => ({
    getDashboardStats: async (): Promise<any> => {
      return {
        totalIncidents: 0,
        activeIncidents: 0,
        resolvedToday: 0,
        averageResponseTime: "0 min"
      };
    },
    getRecentIncidents: async (): Promise<any[]> => {
      return [];
    },
    getActiveIncidents: async (): Promise<any[]> => {
      return [];
    },
    createIncident: async (): Promise<any> => {
      return {};
    }
  }), []);

  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState<boolean>(false); // ← ESTADO AÑADIDO

  const login = async (email: string, password: string) => {
    setLoading(true); // ← INICIAR LOADING
    try {
      const result = await authService.login(email, password);
      setToken(authService.getToken());
      
      // Extraer información del usuario del token o de la respuesta
      if (result.user) {
        const userData = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          emergencyType: result.user.emergencyType,
          vehicleNumber: result.user.vehicleNumber
        };
        setUser(userData);
        saveUserToStorage(userData);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false); // ← FINALIZAR LOADING
    }
  };

  const register = async (name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string) => {
    setLoading(true); // ← INICIAR LOADING
    try {
      const result = await authService.register(name, email, password, emergencyType, vehicleNumber);
      
      // Establecer información del usuario después del registro
      const userData = {
        id: result.userId,
        name,
        email,
        emergencyType,
        vehicleNumber
      };
      
      setUser(userData);
      saveUserToStorage(userData);
      
      return result;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false); // ← FINALIZAR LOADING
    }
  };

  const logout = () => {
    setLoading(true); // ← INICIAR LOADING
    try {
      authService.logout();
      setToken(null);
      setUser(null);
      saveUserToStorage(null);
      router.push('/login');
    } finally {
      setLoading(false); // ← FINALIZAR LOADING
    }
  };

  return (
    <AuthContext.Provider value={{ 
      login, 
      register, 
      logout, 
      token, 
      user, 
      incidentApi, 
      loading // ← PROPIEDAD INCLUIDA EN EL VALUE
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}