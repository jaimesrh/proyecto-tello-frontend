import { Thermometer, Mountain, TreePine, Compass } from 'lucide-react';
import type { PuebloMagico } from '@/lib/types';

interface TabPanoramaProps {
  pueblo: PuebloMagico;
}

export default function TabPanorama({ pueblo }: TabPanoramaProps) {
  const dataPoints = [
    {
      icon: Mountain,
      label: 'Altitud',
      value: pueblo.altitud ? `${pueblo.altitud.toLocaleString()} msnm` : 'No disponible',
    },
    {
      icon: Thermometer,
      label: 'Clima',
      value: pueblo.clima || 'No disponible',
    },
    {
      icon: Thermometer,
      label: 'Temperatura media',
      value: pueblo.temperaturaMedia || 'No disponible',
    },
    {
      icon: TreePine,
      label: 'Ecosistema',
      value: pueblo.ecosistema || 'No disponible',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Datos rapidos */}
      <div className="grid sm:grid-cols-2 gap-4">
        {dataPoints.map((point, index) => (
          <div key={index} className="glass-panel p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <point.icon className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                  {point.label}
                </p>
                <p className="text-sm font-medium mt-1 leading-relaxed">{point.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Perfil turistico */}
      {pueblo.perfilTuristico && (
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <h3 className="font-semibold text-lg">Perfil Turistico</h3>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            {pueblo.perfilTuristico}
          </p>
        </div>
      )}
    </div>
  );
}
