"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function NotificationCenter() {
  const { user, markNotificationsAsRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificaciones = user?.notificaciones || [];
  const unreadCount = notificaciones.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-600 hover:text-centro-600 dark:text-surface-300 dark:hover:text-centro-400 transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
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
              {unreadCount > 0 && (
                <button
                  onClick={markNotificationsAsRead}
                  className="text-xs font-medium text-centro-600 hover:text-centro-700 dark:text-centro-400 dark:hover:text-centro-300"
                >
                  Marcar todas leídas
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notificaciones.length === 0 ? (
                <div className="p-8 text-center text-sm text-surface-500 dark:text-surface-400">
                  No tienes notificaciones
                </div>
              ) : (
                <ul className="divide-y divide-surface-100 dark:divide-surface-700">
                  {notificaciones.map((n) => (
                    <li
                      key={n.id}
                      className={`p-4 transition-colors hover:bg-surface-50 dark:hover:bg-surface-700 ${
                        !n.read ? "bg-surface-50/50 dark:bg-surface-700/50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {!n.read && (
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-centro-500" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${!n.read ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'}`}>
                            {n.title}
                          </p>
                          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {user?.regionFavorita && (
              <div className="border-t border-surface-100 bg-surface-50 p-3 text-center dark:border-surface-700 dark:bg-surface-800/50">
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  Viendo eventos para: <span className="font-semibold">{user.regionFavorita}</span>
                </p>
                <Link href="/perfil" onClick={() => setIsOpen(false)} className="mt-1 block text-xs text-centro-600 hover:underline dark:text-centro-400">
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
