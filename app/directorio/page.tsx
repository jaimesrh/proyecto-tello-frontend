'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Waves, Palmtree, Compass, Mountain, Droplets, TrendingDown, Sun, Activity, CloudRain, Anchor, Eye, TreePine, Layers, Sparkles, Filter, Search, MapPin } from 'lucide-react';
import regionesData from '@/lib/data';
import Link from 'next/link';

// Helper to map string icons to Lucide components
const IconMap: Record<string, any> = {
  Waves, Palmtree, Compass, Mountain, Droplets, TrendingDown,
  Sun, Activity, CloudRain, Anchor, Eye, TreePine, Layers, Sparkles
};

// Flatten all parajes from regionesData
const allParajes = regionesData.flatMap(region => 
  region.parajes.map(paraje => ({
    ...paraje,
    regionNombre: region.nombre,
    regionColor: region.colorHex
  }))
);

// Extract unique regions for filters
const regions = Array.from(new Set(allParajes.map(p => p.regionNombre)));

export default function DirectorioPage() {
  const [activeRegion, setActiveRegion] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParajes = allParajes.filter(paraje => {
    const matchesRegion = activeRegion === 'Todas' || paraje.regionNombre === activeRegion;
    const matchesSearch = paraje.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paraje.municipio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl mb-6">
            <Map className="w-8 h-8 text-stone-700 dark:text-stone-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Directorio de Parajes
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Explora todos los parajes naturales, sitios históricos y maravillas del estado. 
            Utiliza los filtros para encontrar tu próximo destino.
          </p>
        </div>

        {/* Controles de Filtrado y Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o municipio..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-stone-400 mr-2" />
            <button 
              onClick={() => setActiveRegion('Todas')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeRegion === 'Todas' ? 'bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'}`}
            >
              Todas
            </button>
            {regions.map(region => (
              <button 
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeRegion === region ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Parajes */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredParajes.map(paraje => {
              const Icon = IconMap[paraje.tokenIcon] || Map;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={paraje.id}
                  className="glass-panel p-6 flex flex-col hover:border-amber-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                      <Icon className="w-6 h-6 text-stone-700 dark:text-stone-300 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-sm"
                      style={{ backgroundColor: paraje.regionColor }}
                    >
                      {paraje.regionNombre}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-white line-clamp-2">
                    {paraje.nombre}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-500 mb-4 font-medium">
                    <MapPin className="w-4 h-4" />
                    {paraje.municipio}
                  </div>
                  
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-6 line-clamp-3 flex-grow">
                    {paraje.descripcion}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
                    <div className="text-xs text-stone-500 flex flex-col gap-1">
                      <span className="font-semibold text-stone-700 dark:text-stone-300">Clima: <span className="font-normal">{paraje.clima}</span></span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        
        {filteredParajes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 text-lg">No se encontraron parajes con esos filtros.</p>
            <button onClick={() => {setSearchQuery(''); setActiveRegion('Todas');}} className="mt-4 text-amber-600 font-medium hover:underline">
              Limpiar filtros
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
