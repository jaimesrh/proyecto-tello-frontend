'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, TreePine, Info, CloudSun, Map } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import type { Region, Paraje } from '@/lib/types';

interface RegionMapProps {
  regiones: Region[];
}

const regionPaths: Record<string, { path: string; labelX: number; labelY: number }> = {
  Altiplano: {
    path: 'M 20.0 246.0 L 21.4 253.7 L 26.6 258.7 L 36.5 264.9 L 44.0 268.3 L 49.5 271.6 L 55.6 278.4 L 68.2 280.1 L 74.1 283.0 L 75.8 286.4 L 125.7 286.4 L 136.5 276.6 L 144.5 273.0 L 148.4 272.8 L 159.2 285.9 L 159.2 286.4 L 300.1 286.4 L 300.1 194.3 L 297.0 193.6 L 289.8 201.4 L 286.8 206.6 L 284.2 207.8 L 275.9 204.1 L 271.0 199.6 L 269.1 196.7 L 266.1 188.4 L 266.0 178.7 L 264.3 173.6 L 264.7 167.7 L 261.9 161.2 L 262.6 153.2 L 265.9 145.8 L 267.5 139.3 L 268.2 132.9 L 267.6 128.4 L 262.3 121.0 L 263.1 115.3 L 263.7 105.7 L 263.4 99.0 L 258.6 87.6 L 250.5 77.3 L 245.0 71.8 L 245.7 64.7 L 244.2 62.5 L 235.9 56.0 L 234.3 52.0 L 240.9 44.1 L 237.3 41.1 L 240.3 34.7 L 240.0 33.2 L 232.3 30.7 L 226.6 31.7 L 223.7 29.8 L 217.2 20.0 L 212.7 22.2 L 210.7 31.2 L 204.2 36.2 L 200.4 44.8 L 195.1 47.3 L 186.4 47.0 L 182.7 49.6 L 181.5 57.1 L 177.8 61.7 L 176.5 66.1 L 169.1 70.5 L 158.8 72.9 L 155.2 76.0 L 152.9 80.4 L 153.0 89.0 L 150.7 93.4 L 156.2 99.4 L 154.2 105.0 L 151.3 109.9 L 149.7 114.3 L 143.7 122.1 L 136.1 124.5 L 120.0 128.8 L 117.7 130.1 L 111.1 137.5 L 103.7 149.7 L 98.6 156.1 L 94.9 159.4 L 79.1 166.9 L 68.6 170.0 L 66.6 171.1 L 61.9 176.3 L 59.0 183.6 L 54.1 185.2 L 42.9 186.6 L 32.3 183.6 L 30.2 181.8 L 26.6 182.8 L 21.8 191.3 L 25.2 195.5 L 25.5 197.9 L 22.4 204.0 L 28.0 219.3 L 27.2 224.5 L 23.6 231.4 L 21.1 239.6 L 20.0 246.0 Z',
    labelX: 160,
    labelY: 150,
  },
  Centro: {
    path: 'M 75.8 286.4 L 79.2 293.3 L 83.3 299.6 L 87.3 303.6 L 90.5 304.5 L 98.7 303.8 L 112.0 300.1 L 114.6 298.6 L 120.3 291.4 L 125.7 286.4 L 75.8 286.4 Z M 131.7 388.5 L 138.0 391.9 L 147.3 392.1 L 154.1 393.5 L 160.9 397.3 L 167.6 398.6 L 176.1 401.4 L 186.4 402.7 L 193.1 406.5 L 199.0 406.3 L 203.9 408.5 L 216.4 418.7 L 226.2 425.5 L 233.5 429.7 L 241.3 432.7 L 256.4 432.6 L 264.7 429.5 L 263.9 423.7 L 267.1 417.5 L 267.3 414.4 L 269.8 411.6 L 273.2 410.6 L 277.7 412.3 L 285.6 413.9 L 292.8 417.4 L 294.6 417.2 L 300.1 420.5 L 300.1 286.4 L 159.2 286.4 L 159.4 289.5 L 158.2 294.3 L 149.7 313.0 L 141.9 326.8 L 140.0 331.6 L 140.4 334.8 L 146.3 344.8 L 147.6 351.3 L 145.6 359.7 L 142.3 368.2 L 137.9 376.9 L 133.9 383.4 L 131.7 388.5 Z',
    labelX: 190,
    labelY: 360,
  },
  Media: {
    path: 'M 300.1 420.5 L 304.2 422.9 L 309.5 427.0 L 311.8 427.4 L 313.4 431.0 L 316.0 430.5 L 318.9 434.6 L 325.3 441.4 L 335.3 440.6 L 337.4 437.8 L 341.1 442.1 L 349.9 442.3 L 359.3 438.8 L 364.5 435.5 L 361.2 432.6 L 364.1 430.9 L 369.6 430.6 L 368.1 428.3 L 369.1 425.9 L 375.2 426.0 L 381.2 428.8 L 383.4 431.2 L 386.7 440.9 L 390.2 444.3 L 394.5 445.2 L 403.8 445.6 L 408.4 443.7 L 410.0 443.5 L 410.0 275.2 L 408.4 274.8 L 404.0 268.2 L 400.6 266.5 L 397.4 269.3 L 395.3 269.4 L 395.5 274.6 L 391.9 276.8 L 385.1 274.3 L 379.9 273.1 L 375.2 273.3 L 362.0 271.8 L 352.3 268.0 L 338.9 264.8 L 332.9 260.1 L 331.8 256.6 L 330.6 241.4 L 330.9 232.3 L 332.4 223.0 L 329.8 217.1 L 324.1 213.2 L 323.3 202.8 L 322.4 200.5 L 318.4 197.4 L 303.2 195.0 L 300.1 194.3 L 300.1 420.5 Z',
    labelX: 350,
    labelY: 330,
  },
  Huasteca: {
    path: 'M 410.0 443.5 L 414.4 443.0 L 417.6 444.8 L 423.5 430.6 L 426.5 428.7 L 430.9 430.0 L 434.7 429.7 L 434.9 433.8 L 439.0 439.8 L 447.9 449.1 L 451.2 451.4 L 456.6 457.0 L 461.2 464.5 L 466.0 465.9 L 474.3 462.7 L 478.4 462.0 L 483.3 469.2 L 484.6 474.4 L 492.0 480.0 L 497.9 479.8 L 504.2 471.0 L 510.4 474.3 L 512.6 468.7 L 517.7 459.1 L 520.2 455.6 L 526.3 449.6 L 535.5 449.7 L 534.8 442.6 L 534.8 432.6 L 529.8 432.6 L 527.5 431.4 L 524.0 423.7 L 522.6 414.4 L 523.7 410.1 L 530.6 410.1 L 530.4 406.5 L 536.1 406.7 L 537.7 402.6 L 541.2 402.2 L 542.9 399.6 L 547.1 398.5 L 546.0 396.1 L 537.9 390.9 L 534.7 387.2 L 533.5 379.6 L 530.4 376.9 L 532.5 373.8 L 541.8 374.2 L 544.0 372.8 L 545.4 369.3 L 543.7 356.3 L 549.5 352.6 L 554.1 351.8 L 560.7 353.2 L 563.4 352.3 L 562.3 347.5 L 559.3 344.4 L 556.8 334.1 L 553.3 330.4 L 548.9 328.3 L 528.9 323.4 L 516.0 323.6 L 513.0 322.3 L 511.5 317.6 L 506.2 316.7 L 494.5 319.0 L 489.9 316.9 L 487.2 314.0 L 484.1 312.9 L 480.2 317.0 L 467.5 317.3 L 456.5 315.4 L 446.7 316.5 L 442.0 312.6 L 434.9 302.0 L 431.4 294.2 L 429.8 289.1 L 425.3 283.1 L 417.7 277.6 L 410.0 275.2 L 410.0 443.5 Z',
    labelX: 490,
    labelY: 380,
  },
};

const regionColors: Record<string, { fill: string; hover: string; text: string; bg: string }> = {
  Huasteca: { fill: '#166534', hover: '#15803d', text: 'text-huasteca dark:text-huasteca', bg: 'bg-huasteca' },
  Altiplano: { fill: '#B45309', hover: '#D97706', text: 'text-altiplano dark:text-altiplano', bg: 'bg-altiplano' },
  Centro: { fill: '#9A3412', hover: '#C2410C', text: 'text-centro dark:text-centro', bg: 'bg-centro' },
  Media: { fill: '#A16207', hover: '#CA8A04', text: 'text-media dark:text-media', bg: 'bg-media' },
};

type LayerType = 'PUEBLOS_MAGICOS' | 'PARAJES_HIDROLOGICOS';
type TabType = 'general' | 'clima' | 'logistica';

export default function RegionMap({ regiones }: RegionMapProps) {
  const [activeLayer, setActiveLayer] = useState<LayerType>('PUEBLOS_MAGICOS');
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedParaje, setSelectedParaje] = useState<Paraje | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const activeRegionData = regiones.find((r) => r.nombre === activeRegion);

  const handleRegionClick = (nombre: string) => {
    setActiveRegion(activeRegion === nombre ? null : nombre);
    if (activeLayer === 'PARAJES_HIDROLOGICOS') {
      setSelectedParaje(null); // Reset paraje selection when toggling region
    }
  };

  const handleParajeClick = (e: React.MouseEvent, paraje: Paraje, regionNombre: string) => {
    e.stopPropagation();
    setActiveRegion(regionNombre);
    setSelectedParaje(paraje);
    setActiveTab('general');
  };

  const getDynamicIcon = (token: string) => {
    const Icon = (LucideIcons as any)[token];
    return Icon ? Icon : MapPin;
  };

  return (
    <section id="region-map" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-display font-medium text-surface-900 dark:text-surface-50 mb-6 drop-shadow-sm">
            Explora por Región
          </h2>
          <p className="text-lg font-sans text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed mb-8">
            San Luis Potosí se divide en cuatro maravillosas regiones, cada una con su propia alma. Selecciona una región en el mapa para descubrir sus secretos.
          </p>

          {/* Layer Switcher */}
          <div className="inline-flex items-center p-1 bg-surface-200 dark:bg-surface-800 rounded-full shadow-inner border border-surface-300 dark:border-surface-700">
            <button
              onClick={() => { setActiveLayer('PUEBLOS_MAGICOS'); setSelectedParaje(null); }}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeLayer === 'PUEBLOS_MAGICOS'
                  ? 'bg-white dark:bg-surface-600 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
              }`}
            >
              <TreePine className="w-4 h-4" />
              Pueblos Mágicos
            </button>
            <button
              onClick={() => setActiveLayer('PARAJES_HIDROLOGICOS')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeLayer === 'PARAJES_HIDROLOGICOS'
                  ? 'bg-white dark:bg-surface-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
              }`}
            >
              <LucideIcons.Waves className="w-4 h-4" />
              Parajes y Naturaleza
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mapa SVG */}
          <div className="glass-panel p-8 relative">
            <svg
              viewBox="0 0 600 500"
              className="w-full h-auto drop-shadow-2xl"
              role="img"
              aria-label="Mapa interactivo de las regiones de San Luis Potosí"
            >
              {regiones.map((region) => {
                const pathData = regionPaths[region.nombre];
                const colors = regionColors[region.nombre];
                if (!pathData || !colors) return null;

                const isActive = activeRegion === region.nombre;
                const isHovered = hoveredRegion === region.nombre;

                return (
                  <g key={region.nombre}>
                    <path
                      d={pathData.path}
                      fill={isActive || isHovered ? colors.hover : colors.fill}
                      fillOpacity={isActive ? 0.95 : isHovered ? 0.8 : 0.6}
                      stroke={isActive || isHovered ? colors.hover : colors.fill}
                      strokeWidth={isActive ? 3 : 1.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredRegion(region.nombre)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => handleRegionClick(region.nombre)}
                    />
                    
                    {/* Only show region label if PARAJES layer is NOT active, or if it IS active, maybe show it faint */}
                    <g className={`transition-opacity duration-300 ${activeLayer === 'PARAJES_HIDROLOGICOS' ? 'opacity-30' : 'opacity-100'}`}>
                      <text
                        x={pathData.labelX}
                        y={pathData.labelY}
                        textAnchor="middle"
                        className="fill-white text-[13px] font-sans font-semibold pointer-events-none select-none tracking-wide"
                        style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.4)' }}
                      >
                        {region.nombre}
                      </text>
                      <text
                        x={pathData.labelX}
                        y={pathData.labelY + 18}
                        textAnchor="middle"
                        className="fill-white/80 text-[10px] font-sans font-medium pointer-events-none select-none"
                      >
                        {region.pueblos.length} {region.pueblos.length === 1 ? 'pueblo' : 'pueblos'}
                      </text>
                    </g>

                    {/* Render Parajes if active layer is PARAJES_HIDROLOGICOS */}
                    {activeLayer === 'PARAJES_HIDROLOGICOS' && region.parajes && region.parajes.map((paraje) => {
                      const Icon = getDynamicIcon(paraje.tokenIcon);
                      const isParajeSelected = selectedParaje?.id === paraje.id;
                      
                      return (
                        <g 
                          key={`paraje-${paraje.id}`}
                          transform={`translate(${paraje.svgX}, ${paraje.svgY})`}
                          className="cursor-pointer group"
                          onClick={(e) => handleParajeClick(e, paraje, region.nombre)}
                        >
                          <g className="transition-transform duration-300 group-hover:scale-125" style={{ transformOrigin: '0px 0px' }}>
                            {/* Fondo del icono flotante */}
                            <circle 
                              r="16" 
                              fill={isParajeSelected ? '#3B82F6' : 'white'} 
                              className="drop-shadow-md transition-colors duration-300" 
                            />
                            <Icon 
                              x="-10"
                              y="-10"
                              width={20}
                              height={20}
                              className={`transition-colors duration-300 ${isParajeSelected ? 'text-white' : 'text-blue-900'}`} 
                              strokeWidth={2}
                            />
                          </g>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {!activeRegion && (
              <p className="text-center text-sm font-sans text-surface-500 dark:text-surface-400 mt-6">
                Haz clic en {activeLayer === 'PUEBLOS_MAGICOS' ? 'una región' : 'un icono del mapa'} para comenzar tu viaje
              </p>
            )}
          </div>

          {/* Panel Lateral Dinámico */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* VISTA PARAJES HIDROLÓGICOS (Detalle) */}
              {activeLayer === 'PARAJES_HIDROLOGICOS' && selectedParaje ? (
                <motion.div
                  key={`paraje-detail-${selectedParaje.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="glass-panel p-6 overflow-hidden"
                >
                  <div className="relative w-full h-48 md:h-56 mb-6 rounded-xl overflow-hidden shadow-sm bg-surface-200 dark:bg-surface-800">
                    <img 
                      src={`/images/parajes/${selectedParaje.slug}.png`}
                      alt={selectedParaje.nombre}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                      {(() => {
                         const Icon = getDynamicIcon(selectedParaje.tokenIcon);
                         return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-semibold text-surface-900 dark:text-surface-50">
                        {selectedParaje.nombre}
                      </h3>
                      <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
                        {selectedParaje.municipio} • Región {activeRegion}
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6">
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'general' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setActiveTab('clima')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'clima' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                    >
                      Clima
                    </button>
                    <button
                      onClick={() => setActiveTab('logistica')}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'logistica' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                    >
                      Logística
                    </button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm md:text-base"
                    >
                      {activeTab === 'general' && (
                        <div className="space-y-4">
                          <p><Info className="inline w-4 h-4 mr-2 text-blue-500" />{selectedParaje.descripcion}</p>
                        </div>
                      )}
                      {activeTab === 'clima' && (
                        <div className="space-y-4">
                          <p><CloudSun className="inline w-4 h-4 mr-2 text-amber-500" /><strong>Clima predominante:</strong> {selectedParaje.clima}</p>
                        </div>
                      )}
                      {activeTab === 'logistica' && (
                        <div className="space-y-4">
                          <p><Map className="inline w-4 h-4 mr-2 text-emerald-500" />{selectedParaje.logistica}</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ) : activeLayer === 'PARAJES_HIDROLOGICOS' && activeRegionData && !selectedParaje ? (
                /* VISTA PARAJES HIDROLÓGICOS (Lista por región) */
                <motion.div
                  key={`region-parajes-${activeRegion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-display font-medium text-surface-900 dark:text-surface-50">
                      Parajes de la Región {activeRegionData.nombre}
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {activeRegionData.parajes && activeRegionData.parajes.map((paraje, idx) => {
                      const Icon = getDynamicIcon(paraje.tokenIcon);
                      return (
                        <motion.div
                          key={paraje.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={(e) => handleParajeClick(e as any, paraje, activeRegionData.nombre)}
                          className="glass-panel p-4 hover-lift cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-surface-900 dark:text-surface-50">{paraje.nombre}</h4>
                            <p className="text-xs text-surface-500">{paraje.municipio}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-surface-400" />
                        </motion.div>
                      );
                    })}
                    {(!activeRegionData.parajes || activeRegionData.parajes.length === 0) && (
                      <p className="text-surface-500 text-sm">No hay parajes registrados en esta región.</p>
                    )}
                  </div>
                </motion.div>
              ) : activeLayer === 'PUEBLOS_MAGICOS' && activeRegionData ? (
                /* VISTA PUEBLOS MÁGICOS (Original) */
                <motion.div
                  key={activeRegion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: activeRegionData.colorHex }}
                      />
                      <h3 className="text-3xl md:text-4xl font-display font-medium text-surface-900 dark:text-surface-50">
                        Región {activeRegionData.nombre}
                      </h3>
                    </div>
                    <p className="text-surface-600 dark:text-surface-400 text-base leading-relaxed">
                      {activeRegionData.descripcion}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeRegionData.pueblos.map((pueblo, index) => (
                      <motion.div
                        key={pueblo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Link href={`/pueblo/${pueblo.slug}`}>
                          <div className="glass-panel p-5 hover-lift group cursor-pointer block">
                            <div className="flex items-start gap-5">
                              <div
                                className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-inner transition-colors duration-300"
                                style={{ backgroundColor: `${activeRegionData.colorHex}15` }}
                              >
                                <TreePine
                                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                                  style={{ color: activeRegionData.colorHex }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-display font-semibold text-xl text-surface-900 dark:text-surface-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-1">
                                      {pueblo.nombre}
                                    </h4>
                                    {pueblo.altitud && (
                                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
                                        {pueblo.altitud} msnm
                                      </p>
                                    )}
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2 leading-relaxed">
                                  {pueblo.descripcionBreve}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* VISTA VACÍA INICIAL */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                >
                  <MapPin className="w-12 h-12 text-surface-300 dark:text-surface-700 mb-6" strokeWidth={1.5} />
                  <h3 className="text-xl font-display font-medium text-surface-400 dark:text-surface-500 mb-3">
                    El viaje comienza aquí
                  </h3>
                  <p className="text-base font-sans text-surface-400 dark:text-surface-500 max-w-sm leading-relaxed">
                    Interactúa con el mapa para seleccionar una región o un paraje y descubrir los secretos que guardan.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
