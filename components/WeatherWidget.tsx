'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSun, Sun, Wind, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  region: string;
  climaStr?: string;
}

export default function WeatherWidget({ region, climaStr = 'Soleado' }: WeatherWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [temp, setTemp] = useState(25);

  useEffect(() => {
    setMounted(true);
    // Simular temperaturas realistas basadas en la región
    if (region === 'Huasteca') setTemp(32);
    if (region === 'Altiplano') setTemp(18);
    if (region === 'Centro') setTemp(22);
    if (region === 'Media') setTemp(28);
  }, [region]);

  if (!mounted) return null;

  // Determinar icono basado en el string o en la región
  const getWeatherIcon = () => {
    const text = climaStr.toLowerCase();
    if (text.includes('lluvia') || text.includes('húmedo')) return <CloudRain className="w-10 h-10 text-blue-400" />;
    if (text.includes('nublado')) return <Cloud className="w-10 h-10 text-gray-400" />;
    if (text.includes('semi')) return <CloudSun className="w-10 h-10 text-amber-500" />;
    return <Sun className="w-10 h-10 text-amber-400" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-surface-100 to-surface-50 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700 p-5 rounded-3xl shadow-sm flex items-center gap-6 max-w-sm"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        <div className="relative z-10 drop-shadow-md">
          {getWeatherIcon()}
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Clima Actual</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold text-surface-900 dark:text-surface-50">{temp}°</span>
          <span className="text-lg text-surface-600 dark:text-surface-400">C</span>
        </div>
        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">{climaStr}</p>
      </div>

      <div className="hidden sm:flex flex-col gap-2 pl-4 border-l border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>{region === 'Huasteca' ? '85%' : '45%'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span>12 km/h</span>
        </div>
      </div>
    </motion.div>
  );
}
