'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  getUserProfile,
  updateUserProfile,
} from '@/lib/firebaseFirestore';
import {
  loginWithEmail,
  signupWithEmail,
  logoutUser,
  loginWithGoogle,
} from '@/lib/firebaseAuth';

export type Region = 'Huasteca' | 'Altiplano' | 'Centro' | 'Media' | '';

export interface User {
  uid: string;
  nombre: string;
  email: string;
  regionFavorita: Region;
  isAdmin?: boolean;
}

export const ADMIN_EMAILS = [
  'admin@sanluispotosi.gob.mx',
  'admin@slp.com',
  'admin@conocesanluis.com',
];
const ADMIN_DEFAULT_PASS = 'admin123';
const LOCAL_ADMIN_STORAGE_KEY = 'slp_admin_session_user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (nombre: string, email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (regionFavorita: Region) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escucha cambios en la sesión de Firebase en tiempo real o sesión de administrador
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        const emailLower = (firebaseUser.email || '').toLowerCase();
        const isUserAdmin = ADMIN_EMAILS.includes(emailLower);

        setUser({
          uid: firebaseUser.uid,
          nombre: profile?.nombre || firebaseUser.displayName || (isUserAdmin ? 'Administrador' : 'Usuario'),
          email: firebaseUser.email || '',
          regionFavorita: (profile?.regionFavorita as Region) || '',
          isAdmin: isUserAdmin,
        });
      } else {
        // Verificar si hay sesión activa de administrador local
        if (typeof window !== 'undefined') {
          const savedAdmin = localStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
          if (savedAdmin) {
            try {
              setUser(JSON.parse(savedAdmin));
              setLoading(false);
              return;
            } catch {
              localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
            }
          }
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleError = (err: unknown): string => {
    if (err instanceof Error) {
      const msg = err.message;
      if (msg.includes('email-already-in-use')) return 'Este correo ya está registrado.';
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) return 'Correo o contraseña incorrectos.';
      if (msg.includes('user-not-found')) return 'No existe una cuenta con ese correo.';
      if (msg.includes('weak-password')) return 'La contraseña debe tener al menos 6 caracteres.';
      if (msg.includes('invalid-email')) return 'El correo no tiene un formato válido.';
      if (msg.includes('popup-closed-by-user')) return 'Inicio con Google cancelado.';
    }
    return 'Ocurrió un error. Intenta de nuevo.';
  };

  const login = async (email: string, password: string) => {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    // Si ingresa con las credenciales de administrador en el botón normal de "Ingresar"
    if (ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_DEFAULT_PASS) {
      const adminUser: User = {
        uid: 'admin-master-uid',
        nombre: 'Administrador SLP',
        email: normalizedEmail,
        regionFavorita: 'Huasteca',
        isAdmin: true,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      }
      setUser(adminUser);
      return;
    }

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(handleError(err));
      throw err;
    }
  };

  const signup = async (nombre: string, email: string, password: string) => {
    setError(null);
    try {
      await signupWithEmail(nombre, email, password);
    } catch (err) {
      setError(handleError(err));
      throw err;
    }
  };

  const loginGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(handleError(err));
      throw err;
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
    }
    await logoutUser();
    setUser(null);
  };

  const updatePreferences = async (regionFavorita: Region) => {
    if (!user) return;
    if (user.uid !== 'admin-master-uid') {
      await updateUserProfile(user.uid, { regionFavorita });
    }
    setUser((prev) => (prev ? { ...prev, regionFavorita } : prev));
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginGoogle, logout, updatePreferences, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
