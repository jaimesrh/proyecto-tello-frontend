'use client';

import { CalendarDays } from 'lucide-react';
import { eventosData } from '@/lib/eventos';
import CalendarView from '@/components/CalendarView';

export default function CalendarioPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-6 shadow-sm">
            <CalendarDays className="w-8 h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-6">
            Calendario de Eventos
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Planifica tu viaje para coincidir con algunas de las festividades 
            más espectaculares y llenas de tradición del estado. Selecciona un día para ver los detalles.
          </p>
        </div>

        {/* Vista Clásica del Calendario */}
        <CalendarView eventos={eventosData} />
      </div>
    </div>
  );
}
