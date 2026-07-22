'use client';

import { motion } from 'framer-motion';
import { Compass, ChevronDown } from 'lucide-react';

const collageImages = [
  '/images/cascada_tamul_1784665879590.png',
  '/images/jardin_surrealista_1784665889348.png',
  '/images/real-de-catorce.jpg',
  '/images/santa-maria-del-rio.jpg',
  '/images/laguna_media_luna_1783383868547.png',
  '/images/cascadas_minas_viejas_1783383905380.png',
];

export default function HeroSection() {
  const scrollToMap = () => {
    document.getElementById('region-map')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background Image Collage with Blur */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-1 scale-110 blur-sm opacity-40 dark:opacity-35 pointer-events-none">
        {collageImages.map((src, index) => (
          <div key={index} className="relative w-full h-full min-h-[200px] overflow-hidden">
            <img
              src={src}
              alt="Sitio Turístico San Luis Potosí"
              className="w-full h-full object-cover brightness-90"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay Gradient to ensure contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/60" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Compass className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
            <span className="text-sm font-semibold tracking-[0.25em] uppercase text-amber-400">
              San Luis Potosí
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight leading-[1.1] mb-8 text-white">
            Conoce <span className="text-gradient drop-shadow-md">San Luis Potosí</span>
          </h1>

          <p className="text-lg sm:text-xl font-sans text-stone-200/90 max-w-2xl mx-auto leading-relaxed mb-12 drop-shadow-sm">
            Seis destinos extraordinarios. Desde abismos verticales en la Huasteca hasta pueblos fantasma en el silencio del desierto.
          </p>

          <motion.button
            onClick={scrollToMap}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-medium text-sm transition-all shadow-xl shadow-amber-900/30 border border-amber-400/30"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Explorar las regiones
            <ChevronDown className="w-4 h-4 ml-1" />
          </motion.button>
        </motion.div>
      </div>

      {/* Linea decorativa inferior sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  );
}
