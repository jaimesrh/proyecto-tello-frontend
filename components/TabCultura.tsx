import { UtensilsCrossed, Music, Brush, Info } from 'lucide-react';
import type { Cultura } from '@/lib/types';

interface TabCulturaProps {
  culturas: Cultura[];
}

export default function TabCultura({ culturas }: TabCulturaProps) {
  if (!culturas || culturas.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        No hay informacion cultural disponible.
      </div>
    );
  }

  // Agrupar por tipo (Gastronomia, Artesania, etc.)
  const agrupado = culturas.reduce((acc, curr) => {
    if (!acc[curr.tipo]) {
      acc[curr.tipo] = [];
    }
    acc[curr.tipo].push(curr);
    return acc;
  }, {} as Record<string, Cultura[]>);

  const getIconForType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'gastronomia':
        return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
      case 'artesania':
        return <Brush className="w-5 h-5 text-purple-600" />;
      case 'festividad':
        return <Music className="w-5 h-5 text-pink-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-10">
      {Object.entries(agrupado).map(([tipo, items], idx) => (
        <div key={idx}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
              {getIconForType(tipo)}
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white capitalize">
              {tipo}
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <div key={index} className="glass-panel p-5 border-l-4 border-l-stone-300 dark:border-l-stone-600">
                <h4 className="font-semibold text-lg mb-2">{item.nombre}</h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
