import { Users, AlertTriangle, CalendarRange, HeartHandshake } from 'lucide-react';
import type { Sostenibilidad } from '@/lib/types';

interface TabSostenibilidadProps {
  sostenibilidad: Sostenibilidad | null;
}

export default function TabSostenibilidad({ sostenibilidad }: TabSostenibilidadProps) {
  if (!sostenibilidad) {
    return (
      <div className="text-center py-12 text-stone-500">
        No hay informacion de sostenibilidad disponible.
      </div>
    );
  }

  const sections = [
    {
      id: 'capacidad',
      title: 'Capacidad de Carga',
      icon: Users,
      content: sostenibilidad.capacidadCarga,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'riesgos',
      title: 'Riesgos de Saturacion',
      icon: AlertTriangle,
      content: sostenibilidad.riesgosSaturacion,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      id: 'temporadas',
      title: 'Mejores Temporadas',
      icon: CalendarRange,
      content: sostenibilidad.mejoresTemporadas,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      id: 'recomendaciones',
      title: 'Recomendaciones',
      icon: HeartHandshake,
      content: sostenibilidad.recomendaciones,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {sections.map(
        (section) =>
          section.content && (
            <div key={section.id} className="glass-panel p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${section.bg}`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed flex-grow">
                {section.content}
              </p>
            </div>
          )
      )}
    </div>
  );
}
