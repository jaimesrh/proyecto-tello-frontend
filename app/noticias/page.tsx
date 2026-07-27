'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ChevronRight, Newspaper, User } from 'lucide-react';
import { getNoticias, seedNoticias, Noticia } from '@/lib/firebaseFirestore';

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    setCargando(true);
    try {
      const data = await getNoticias();
      setNoticias(data);
    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    await seedNoticias();
    await cargarNoticias();
    setSeeding(false);
  };

  if (cargando) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6"
          >
            <Newspaper className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-surface-900 dark:text-surface-50 mb-6"
          >
            Noticias y Novedades
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto"
          >
            Descubre los próximos eventos, festivales culturales y las mejores recomendaciones para tu viaje por San Luis Potosí.
          </motion.p>
        </div>

        {/* Botón de Semilla (Visible solo si no hay noticias) */}
        {noticias.length === 0 && (
          <div className="text-center mb-12 bg-surface-100 dark:bg-surface-800 p-8 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
            <p className="text-surface-600 dark:text-surface-400 mb-4">No se encontraron noticias en la base de datos.</p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              {seeding ? 'Generando contenido...' : 'Poblar base de datos con Noticias de Prueba'}
            </button>
          </div>
        )}

        {/* Cuadrícula de Noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia, index) => (
            <motion.div
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-panel overflow-hidden hover-lift flex flex-col h-full"
            >
              <Link href={`/noticias/${noticia.slug}`} className="block flex-1">
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm text-surface-900 dark:text-surface-100">
                      {noticia.categoria}
                    </span>
                  </div>
                  <img
                    src={noticia.imagenPortada}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-surface-500 dark:text-surface-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(noticia.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-surface-900 dark:text-surface-50 mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {noticia.titulo}
                  </h3>
                  
                  <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {noticia.resumen}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-800/50 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs">
                        <User className="w-3 h-3 text-surface-500" />
                      </div>
                      <span className="text-xs font-medium text-surface-600 dark:text-surface-300">{noticia.autor}</span>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leer más <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
