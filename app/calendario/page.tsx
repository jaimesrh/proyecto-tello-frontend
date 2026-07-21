'use client';

import { motion } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import { eventosData } from '@/lib/eventos';

export default function CalendarioPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-6">
            <CalendarDays className="w-8 h-8 text-purple-700 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Calendario de Eventos
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Planifica tu viaje para coincidir con algunas de las festividades 
            más espectaculares y llenas de tradición del estado.
          </p>
        </div>

        <div className="relative border-l-2 border-purple-200 dark:border-purple-900/50 ml-4 md:ml-8 space-y-12 pb-12">
          {eventosData.map((evento, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={evento.id} 
              className="relative pl-8 md:pl-12"
            >
              {/* Dot en la linea de tiempo */}
              <div className="absolute w-6 h-6 bg-purple-100 dark:bg-purple-900 border-4 border-purple-500 rounded-full -left-[13px] top-1" />
              
              <div className="glass-panel p-6 md:p-8 hover:border-purple-400/50 transition-colors">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  {evento.mes}
                </span>
                
                <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                  {evento.nombre}
                </h3>
                
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4" />
                  {evento.municipio}
                </div>
                
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {evento.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
