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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-surface-900 shadow-2xl border border-surface-200 dark:border-surface-800"
        >
          {/* Header Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-800" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-100 text-surface-500 hover:bg-surface-200 hover:text-surface-900 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white transition-colors"
          >
            ✕
          </button>

          <div className="p-6 sm:p-8">
            <h2 className="mb-1 text-center font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Conoce San Luis Potosí
            </h2>
            <p className="text-center text-sm text-surface-500 dark:text-surface-400 mb-6">
              {tab === 'login' ? 'Bienvenido de regreso' : 'Crea tu cuenta gratis'}
            </p>

            {/* Tabs */}
            <div className="mb-6 flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    tab === t
                      ? 'bg-white text-amber-700 shadow-sm dark:bg-surface-700 dark:text-amber-400'
                      : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
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
                className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-surface-900 placeholder-surface-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder-surface-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-amber-700 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Procesando...' : tab === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">o continúa con</span>
              <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-surface-300 bg-white dark:bg-surface-800 py-3 text-sm font-semibold text-surface-800 dark:text-white transition-all hover:bg-surface-50 dark:hover:bg-surface-700 hover:shadow-sm active:scale-[0.99] disabled:opacity-60"
            >
              <FcGoogle className="w-5 h-5 shrink-0" />
              <span>Continuar con Google</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
