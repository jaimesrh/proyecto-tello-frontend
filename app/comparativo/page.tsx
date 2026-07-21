import { api } from '@/lib/api';
import { Mountain, MapPin, TreePine, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Análisis Comparativo | Conoce San Luis Potosí',
  description: 'Comparativa de datos altitudinales, climáticos y turísticos del estado de San Luis Potosí.',
};

export const revalidate = 3600;

export default async function ComparativoPage() {
  const data = await api.getComparativo();

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-6">
            <BarChart3 className="w-8 h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Análisis Comparativo
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Explora las diferencias geograficas y de atractivos entre los distintos
            Pueblos Magicos del estado.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel Principal - Tabla Comparativa */}
          <div className="lg:col-span-2 glass-panel p-1 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100/50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
                    <th className="p-4 font-semibold text-stone-900 dark:text-white">Pueblo</th>
                    <th className="p-4 font-semibold text-stone-900 dark:text-white">Region</th>
                    <th className="p-4 font-semibold text-stone-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-stone-500" />
                        Altitud
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-stone-900 dark:text-white">Atractivos</th>
                    <th className="p-4 font-semibold text-stone-900 dark:text-white text-right">Cultura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {data.map((item, index) => (
                    <tr 
                      key={item.id}
                      className="hover:bg-stone-50/50 dark:hover:bg-stone-800/20 transition-colors"
                    >
                      <td className="p-4 font-medium text-stone-900 dark:text-white">
                        {item.nombre}
                      </td>
                      <td className="p-4">
                        <span 
                          className="px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
                          style={{ backgroundColor: item.region.colorHex }}
                        >
                          {item.region.nombre}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600 dark:text-stone-300 font-mono text-sm">
                        {item.altitud ? `${item.altitud.toLocaleString()} m` : '-'}
                      </td>
                      <td className="p-4 text-stone-600 dark:text-stone-300">
                        {item._count.atractivos}
                      </td>
                      <td className="p-4 text-stone-600 dark:text-stone-300 text-right">
                        {item._count.culturas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Lateral - Insights */}
          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Rango Altitudinal
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Existe un contraste extremo en el estado: desde los 100 msnm en la region Huasteca (Aquismon) 
                hasta los 2,700 msnm en el Altiplano (Real de Catorce). Esta diferencia de 2,600 metros 
                genera ecosistemas diametralmente opuestos.
              </p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Distribucion de Atractivos
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                La zona media (Ciudad del Maiz) concentra la mayor cantidad de atractivos catalogados, 
                debido a su funcion historica como frontera civilizatoria y su diversidad de parajes naturales.
              </p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Sostenibilidad
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                Los pueblos de la Huasteca enfrentan mayores retos de capacidad de carga hidrica, 
                mientras que en el Altiplano y Centro los limites estan marcados por la preservacion 
                del patrimonio arquitectonico e historico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
