'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { login, signup, loginGoogle, error, clearError, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (t: 'login' | 'signup') => {
    setTab(t);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await signup(nombre, email, password);
      }
      onClose();
    } catch {
      // error is handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await loginGoogle();
      onClose();
    } catch {
      // error is handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/95 shadow-2xl backdrop-blur-md dark:bg-surface-800/95"
        >
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-huasteca-400 via-centro-500 to-altiplano-400" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-surface-500 hover:text-surface-800 dark:hover:text-surface-100 transition-colors text-xl"
          >
            ✕
          </button>

          <div className="p-8">
            <h2 className="mb-1 text-center font-serif text-3xl font-bold text-surface-900 dark:text-surface-50">
              Conoce San Luis Potosí
            </h2>
            <p className="text-center text-sm text-surface-500 dark:text-surface-400 mb-6">
              {tab === 'login' ? 'Bienvenido de regreso' : 'Crea tu cuenta gratis'}
            </p>

            {/* Tabs */}
            <div className="mb-6 flex rounded-lg bg-surface-100 p-1 dark:bg-surface-700">
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                    tab === t
                      ? 'bg-white text-centro-600 shadow-sm dark:bg-surface-800 dark:text-centro-400'
                      : 'text-surface-500 dark:text-surface-300'
                  }`}
                  onClick={() => handleTabChange(t)}
                >
                  {t === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
              ))}
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="mt-1 block w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-centro-500 focus:outline-none focus:ring-2 focus:ring-centro-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
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
                  placeholder="correo@ejemplo.com"
                  className="mt-1 block w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-centro-500 focus:outline-none focus:ring-2 focus:ring-centro-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1 block w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-centro-500 focus:outline-none focus:ring-2 focus:ring-centro-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-centro-600 py-3 text-sm font-semibold text-white transition-all hover:bg-centro-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Procesando...' : tab === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-600" />
              <span className="text-xs text-surface-400">o continúa con</span>
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-600" />
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white py-3 text-sm font-semibold text-surface-700 transition-all hover:bg-surface-50 hover:shadow-sm dark:border-surface-600 dark:bg-surface-700 dark:text-surface-200 dark:hover:bg-surface-600 disabled:opacity-60"
            >
              <FcGoogle className="w-5 h-5" />
              Continuar con Google
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
