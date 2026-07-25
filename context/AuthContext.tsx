"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { eventosData } from "../lib/eventos";

export type Region = "Huasteca" | "Altiplano" | "Centro" | "Media" | "";

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  regionFavorita: Region;
  notificaciones: Notification[];
  toursReservados: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  signup: (nombre: string, email: string, password?: string) => void;
  logout: () => void;
  updatePreferences: (regionFavorita: Region) => void;
  markNotificationsAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultSession: User = {
  id: "1",
  nombre: "Usuario Demo",
  email: "demo@sanluis.mx",
  regionFavorita: "Huasteca",
  notificaciones: [],
  toursReservados: [],
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar sesión
    const storedUser = localStorage.getItem("slp_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Generar notificaciones dinámicas según región
        setUser(generateNotifications(parsedUser));
      } catch (e) {
        setUser(generateNotifications(defaultSession));
      }
    } else {
      setUser(generateNotifications(defaultSession));
    }
    setIsLoaded(true);
  }, []);

  const generateNotifications = (currentUser: User): User => {
    if (!currentUser.regionFavorita) return currentUser;

    const unreadExisting = currentUser.notificaciones.filter(n => !n.read);
    
    // Filtrar eventos de lib/eventos.ts según región
    let regionEventos = eventosData.filter(e => {
      if (currentUser.regionFavorita === "Huasteca" && e.municipio.includes("Huasteca")) return true;
      if (currentUser.regionFavorita === "Centro" && (e.municipio.includes("San Luis") || e.municipio.includes("Santa María"))) return true;
      if (currentUser.regionFavorita === "Altiplano" && e.municipio.includes("Catorce")) return true;
      return false;
    });

    const newNotifications: Notification[] = regionEventos.map((e, idx) => ({
      id: `notif-${e.id}-${idx}`,
      title: `Próximo evento: ${e.nombre}`,
      message: `No te pierdas ${e.nombre} en ${e.mes} en ${e.municipio}.`,
      read: false,
      date: new Date().toISOString(),
    }));

    // Mantener sólo algunas notificaciones no leídas y mezclarlas (simulación simple)
    const combined = [...unreadExisting];
    newNotifications.forEach(nn => {
      if (!combined.find(c => c.title === nn.title)) {
        combined.push(nn);
      }
    });

    return { ...currentUser, notificaciones: combined };
  };

  const saveUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("slp_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("slp_user");
    }
  };

  const login = (email: string, password?: string) => {
    // Simulación
    const u: User = {
      id: "2",
      nombre: email.split("@")[0],
      email: email,
      regionFavorita: "Huasteca",
      notificaciones: [],
      toursReservados: [],
    };
    saveUser(generateNotifications(u));
  };

  const signup = (nombre: string, email: string, password?: string) => {
    const u: User = {
      id: String(Date.now()),
      nombre,
      email,
      regionFavorita: "",
      notificaciones: [],
      toursReservados: [],
    };
    saveUser(u);
  };

  const logout = () => {
    saveUser(null);
  };

  const updatePreferences = (regionFavorita: Region) => {
    if (user) {
      const updatedUser = { ...user, regionFavorita };
      saveUser(generateNotifications(updatedUser));
    }
  };

  const markNotificationsAsRead = () => {
    if (user) {
      const updatedNotifs = user.notificaciones.map(n => ({ ...n, read: true }));
      saveUser({ ...user, notificaciones: updatedNotifs });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePreferences, markNotificationsAsRead }}>
      {isLoaded ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
