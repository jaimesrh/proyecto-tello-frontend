'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { getNoticiaBySlug, Noticia } from '@/lib/firebaseFirestore';

export default function NoticiaDetailPage({ params }: { params: { slug: string } }) {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const data = await getNoticiaBySlug(params.slug);
        setNoticia(data);
      } catch (error) {
        console.error('Error fetching noticia:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchNoticia();
  }, [params.slug]);

  if (cargando) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center text-center px-4">
        <h1 className="text-4xl font-display font-bold text-surface-900 dark:text-surface-50 mb-4">Artículo no encontrado</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">La noticia que buscas no existe o ha sido eliminada.</p>
        <Link href="/noticias" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Volver a Noticias
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <img
          src={noticia.imagenPortada}
          alt={noticia.titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
            <Link 
              href="/noticias"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a todas las noticias
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                {noticia.categoria}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {noticia.titulo}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{noticia.autor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(noticia.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg dark:prose-invert prose-amber max-w-none"
        >
          <p className="text-xl md:text-2xl font-medium text-surface-600 dark:text-surface-300 leading-relaxed mb-10 border-l-4 border-amber-500 pl-6 italic">
            {noticia.resumen}
          </p>
          
          <div className="text-surface-700 dark:text-surface-300 space-y-6 leading-loose">
            {noticia.contenido.split('\\n\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        {/* Footer del Artículo */}
        <div className="mt-16 pt-8 border-t border-surface-200 dark:border-surface-800 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-surface-500">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium">{noticia.categoria}, San Luis Potosí, Turismo</span>
          </div>
          
          <div className="flex gap-4">
            {/* Redes sociales (Placeholder) */}
            <button className="px-4 py-2 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 rounded-full text-sm font-medium transition-colors">
              Compartir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
