'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, BarChart3, Sun, Moon, Menu, X, ChevronDown, Compass, Camera, CalendarDays, Utensils, Leaf, Library } from 'lucide-react';
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
            <span className="font-display font-bold text-xl tracking-tight hidden lg:block">
              Conoce <span className="text-amber-700 dark:text-amber-500 italic">San Luis Potosí</span>
            </span>
          </Link>

          {/* Centro: Buscador */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Derecha: Nav links + Dark mode */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-surface-900/70 dark:text-surface-50/70 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                Inicio
              </Link>
              
              {/* Dropdown Explorar */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm font-medium text-surface-900/70 dark:text-surface-50/70 hover:text-amber-700 dark:hover:text-amber-400 transition-colors py-2">
                  Explorar
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <div className="p-2 flex flex-col gap-1">
                    <Link href="/directorio" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Library className="w-4 h-4 text-stone-500" /> Directorio
                    </Link>
                    <Link href="/itinerarios" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Compass className="w-4 h-4 text-emerald-500" /> Itinerarios
                    </Link>
                    <Link href="/gastronomia" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Utensils className="w-4 h-4 text-amber-500" /> Gastronomía
                    </Link>
                    <Link href="/galeria" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Camera className="w-4 h-4 text-blue-500" /> Spots Fotográficos
                    </Link>
                    <Link href="/calendario" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <CalendarDays className="w-4 h-4 text-purple-500" /> Calendario
                    </Link>
                    <Link href="/eco-guia" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Leaf className="w-4 h-4 text-green-500" /> Eco-Guía
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/descubre" className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 rounded-full text-sm font-medium transition-colors shadow-sm">
                Descubre tu destino
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
              className="lg:hidden p-2 rounded-2xl bg-surface-100 dark:bg-surface-800"
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
            className="lg:hidden border-t border-surface-200/50 dark:border-surface-800/50 bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-2">
              <SearchBar />
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                Inicio
              </Link>
              <Link href="/descubre" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 rounded-xl text-base font-medium">
                Test: Descubre tu destino
              </Link>
              
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-bold uppercase tracking-wider text-surface-500">Explorar</p>
              </div>
              
              <Link href="/directorio" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <Library className="w-5 h-5 text-stone-500" /> Directorio Completo
              </Link>
              <Link href="/itinerarios" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <Compass className="w-5 h-5 text-emerald-500" /> Itinerarios Sugeridos
              </Link>
              <Link href="/gastronomia" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <Utensils className="w-5 h-5 text-amber-500" /> Gastronomía
              </Link>
              <Link href="/galeria" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <Camera className="w-5 h-5 text-blue-500" /> Spots Fotográficos
              </Link>
              <Link href="/calendario" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <CalendarDays className="w-5 h-5 text-purple-500" /> Calendario de Eventos
              </Link>
              <Link href="/eco-guia" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <Leaf className="w-5 h-5 text-green-500" /> Guía de Eco-Turismo
              </Link>
              <Link href="/comparativo" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800">
                <BarChart3 className="w-5 h-5 text-stone-500" /> Análisis Comparativo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
