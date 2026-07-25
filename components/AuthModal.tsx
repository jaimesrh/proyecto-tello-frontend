"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const { login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") {
      login(email, password);
    } else {
      signup(nombre, email, password);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/90 shadow-2xl backdrop-blur-md dark:bg-surface-800/90"
        >
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-huasteca-400 via-centro-500 to-altiplano-400" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-surface-500 hover:text-surface-800 dark:hover:text-surface-100"
          >
            ✕
          </button>

          <div className="p-8">
            <h2 className="mb-6 text-center font-serif text-3xl font-bold text-surface-900 dark:text-surface-50">
              Conoce San Luis Potosí
            </h2>

            <div className="mb-6 flex rounded-lg bg-surface-100 p-1 dark:bg-surface-700">
              <button
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  tab === "login"
                    ? "bg-white text-centro-600 shadow-sm dark:bg-surface-800 dark:text-centro-400"
                    : "text-surface-500 dark:text-surface-300"
                }`}
                onClick={() => setTab("login")}
              >
                Iniciar Sesión
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  tab === "signup"
                    ? "bg-white text-centro-600 shadow-sm dark:bg-surface-800 dark:text-centro-400"
                    : "text-surface-500 dark:text-surface-300"
                }`}
                onClick={() => setTab("signup")}
              >
                Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-centro-500 focus:outline-none focus:ring-1 focus:ring-centro-500 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-centro-500 focus:outline-none focus:ring-1 focus:ring-centro-500 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-surface-900 focus:border-centro-500 focus:outline-none focus:ring-1 focus:ring-centro-500 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-centro-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-centro-700"
              >
                {tab === "login" ? "Ingresar" : "Registrarse"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
