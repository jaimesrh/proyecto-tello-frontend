'use client';

import { motion } from 'framer-motion';
import { Compass, Clock, MapPin, Tag } from 'lucide-react';
import { rutasData } from '@/lib/rutas';

const TypeColors: Record<string, string> = {
  'Aventura': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  'Cultura': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'Relajación': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'Familiar': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
};

export default function ItinerariosPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-6">
            <Compass className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Itinerarios Sugeridos
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            ¿No sabes por dónde empezar? Hemos diseñado estas rutas para que 
            aproveches al máximo tu tiempo, dependiendo del tipo de experiencia que busques.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rutasData.map((ruta, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={ruta.id} 
              className="glass-panel p-6 md:p-8 flex flex-col h-full hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${TypeColors[ruta.tipo] || TypeColors['Familiar']} flex items-center gap-1.5`}>
                  <Tag className="w-3 h-3" /> {ruta.tipo}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  <Clock className="w-4 h-4" /> {ruta.duracionDias} días
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {ruta.titulo}
              </h2>
              
              <p className="text-stone-600 dark:text-stone-300 mb-6 flex-grow">
                {ruta.descripcion}
              </p>
              
              <div className="bg-stone-50/50 dark:bg-stone-800/30 rounded-xl p-5 border border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 uppercase tracking-wider">
                  Plan de Ruta
                </h3>
                <div className="space-y-4">
                  {ruta.paradas.map((parada, pIdx) => {
                    const [dia, ...desc] = parada.split(': ');
                    return (
                      <div key={pIdx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                            <MapPin className="w-3 h-3" />
                          </div>
                          {pIdx < ruta.paradas.length - 1 && (
                            <div className="w-px h-full bg-emerald-200 dark:bg-emerald-900/50 my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider block mb-1">
                            {dia}
                          </span>
                          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                            {desc.join(': ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
