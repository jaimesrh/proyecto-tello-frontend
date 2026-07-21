'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, BarChart3, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { isDark, toggleDarkMode, mounted } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <MapPin className="w-6 h-6 text-amber-700 dark:text-amber-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              Conoce <span className="text-amber-700 dark:text-amber-500 italic">San Luis Potosí</span>
            </span>
          </Link>

          {/* Centro: Buscador */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Derecha: Nav links + Dark mode */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-surface-900/70 dark:text-surface-50/70 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/comparativo"
                className="flex items-center gap-1.5 text-sm font-medium text-surface-900/70 dark:text-surface-50/70 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Comparativo
              </Link>
            </div>

            {/* Toggle Dark Mode */}
            {mounted && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-2xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Cambiar tema"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-surface-600" />
                )}
              </button>
            )}

            {/* Menu movil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl bg-surface-100 dark:bg-surface-800"
              aria-label="Menu de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu movil desplegable */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-200/50 dark:border-surface-800/50 bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <SearchBar />
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                Inicio
              </Link>
              <Link
                href="/comparativo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <BarChart3 className="w-4 h-4" />
                Comparativo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
