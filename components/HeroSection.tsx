'use client';

import { motion } from 'framer-motion';
import { Compass, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToMap = () => {
    document.getElementById('region-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Fondo con gradiente cálido/orgánico */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-amber-100/30 to-teal-100/20 dark:from-surface-900 dark:via-amber-900/10 dark:to-teal-900/10" />

      {/* Patron decorativo sutil (ruido o puntos muy finos) */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Compass className="w-8 h-8 text-amber-700 dark:text-amber-500" strokeWidth={1.5} />
            <span className="text-sm font-semibold tracking-[0.25em] uppercase text-amber-700 dark:text-amber-500">
              San Luis Potosí
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight leading-[1.1] mb-8">
            <span className="text-gradient drop-shadow-sm">Conoce San Luis Potosí</span>
          </h1>

          <p className="text-lg sm:text-xl font-sans text-surface-800/80 dark:text-surface-100/80 max-w-2xl mx-auto leading-relaxed mb-12">
            Seis destinos extraordinarios. Desde abismos verticales en la huasteca hasta pueblos fantasma en el silencio del desierto.
          </p>

          <motion.button
            onClick={scrollToMap}
            className="inline-flex items-center gap-2 px-8 py-4 bg-surface-900 dark:bg-surface-50 text-surface-50 dark:text-surface-900 rounded-full font-medium text-sm hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors shadow-xl shadow-surface-900/10 dark:shadow-black/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorar las regiones
            <ChevronDown className="w-4 h-4 ml-1" />
          </motion.button>
        </motion.div>
      </div>

      {/* Linea decorativa inferior sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 dark:via-surface-800 to-transparent" />
    </section>
  );
}
