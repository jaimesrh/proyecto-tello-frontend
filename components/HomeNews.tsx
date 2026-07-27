'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { getNoticias, Noticia } from '@/lib/firebaseFirestore';

export default function HomeNews() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await getNoticias();
        // Mostrar solo las últimas 3
        setNoticias(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching noticias:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchNoticias();
  }, []);

  if (cargando || noticias.length === 0) {
    return null; // No mostrar la sección si está cargando o vacía
  }

  return (
    <section className="py-24 px-4 bg-surface-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium mb-4">
              <Newspaper className="w-4 h-4" />
              Noticias y Novedades
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-surface-900 dark:text-surface-50">
              Lo último en San Luis Potosí
            </h2>
          </div>
          <Link 
            href="/noticias"
            className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-500 font-medium hover:gap-3 transition-all"
          >
            Ver todas las noticias <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia, index) => (
            <motion.div
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass-panel overflow-hidden hover-lift flex flex-col"
            >
              <Link href={`/noticias/${noticia.slug}`} className="block flex-1">
                <div className="relative h-48 overflow-hidden">
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
                  <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(noticia.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-surface-50 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  
                  <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                    {noticia.resumen}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
