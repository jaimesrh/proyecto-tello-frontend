import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import type { Atractivo } from '@/lib/types';

interface TabAtractivosProps {
  atractivos: Atractivo[];
}

export default function TabAtractivos({ atractivos }: TabAtractivosProps) {
  if (!atractivos || atractivos.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        No hay informacion de atractivos disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {atractivos.map((atractivo, index) => (
        <div key={index} className="glass-panel p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{atractivo.nombre}</h3>
            <span className="px-3 py-1 bg-stone-200/50 dark:bg-stone-700/50 text-stone-600 dark:text-stone-300 rounded-full text-xs font-semibold whitespace-nowrap">
              {atractivo.tipo}
            </span>
          </div>

          <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed">
            {atractivo.descripcion}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {atractivo.estacionalidad && (
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900 dark:text-stone-200 mb-1">
                    Estacionalidad
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {atractivo.estacionalidad}
                  </span>
                </div>
              </div>
            )}
            {atractivo.acceso && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-stone-900 dark:text-stone-200 mb-1">
                    Acceso
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {atractivo.acceso}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
