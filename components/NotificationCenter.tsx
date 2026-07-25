'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Bell, Calendar } from 'lucide-react';

export default function NotificationCenter() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-600 hover:text-centro-600 dark:text-surface-300 dark:hover:text-centro-400 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-surface-800 dark:ring-white/10 z-50"
          >
            <div className="flex items-center justify-between border-b border-surface-100 p-4 dark:border-surface-700">
              <h3 className="font-semibold text-surface-900 dark:text-surface-50">
                Notificaciones
              </h3>
            </div>

            <div className="p-6 text-center">
              <Calendar className="w-10 h-10 text-surface-300 mx-auto mb-3" />
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
                Tus reservas y eventos aparecerán en tu agenda.
              </p>
              <Link
                href="/agenda"
                onClick={() => setIsOpen(false)}
                className="inline-block text-sm font-medium text-centro-600 hover:text-centro-700 dark:text-centro-400 hover:underline"
              >
                Ver mi agenda →
              </Link>
            </div>

            {user.regionFavorita && (
              <div className="border-t border-surface-100 bg-surface-50 p-3 text-center dark:border-surface-700 dark:bg-surface-800/50">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Viendo eventos para: <span className="font-semibold">{user.regionFavorita}</span>
                </p>
                <Link
                  href="/perfil"
                  onClick={() => setIsOpen(false)}
                  className="mt-1 block text-xs text-centro-600 hover:underline dark:text-centro-400"
                >
                  Cambiar preferencias
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
