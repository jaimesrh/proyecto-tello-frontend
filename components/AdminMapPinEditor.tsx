'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Move,
  Save,
  RotateCcw,
  CheckCircle2,
  Compass,
  Crosshair,
} from 'lucide-react';
import {
  MapLocationConfig,
  saveMapLocation,
  resetMapLocations,
} from '@/lib/mapPinsFirebase';

interface AdminMapPinEditorProps {
  locations: MapLocationConfig[];
  onLocationsChange: (updated: MapLocationConfig[]) => void;
}

const REGION_PATHS: Record<
  'Altiplano' | 'Centro' | 'Media' | 'Huasteca',
  { path: string; fill: string; labelX: number; labelY: number }
> = {
  Altiplano: {
    path: 'M 20.0 246.0 L 21.4 253.7 L 26.6 258.7 L 36.5 264.9 L 44.0 268.3 L 49.5 271.6 L 55.6 278.4 L 68.2 280.1 L 74.1 283.0 L 75.8 286.4 L 125.7 286.4 L 136.5 276.6 L 144.5 273.0 L 148.4 272.8 L 159.2 285.9 L 159.2 286.4 L 300.1 286.4 L 300.1 194.3 L 297.0 193.6 L 289.8 201.4 L 286.8 206.6 L 284.2 207.8 L 275.9 204.1 L 271.0 199.6 L 269.1 196.7 L 266.1 188.4 L 266.0 178.7 L 264.3 173.6 L 264.7 167.7 L 261.9 161.2 L 262.6 153.2 L 265.9 145.8 L 267.5 139.3 L 268.2 132.9 L 267.6 128.4 L 262.3 121.0 L 263.1 115.3 L 263.7 105.7 L 263.4 99.0 L 258.6 87.6 L 250.5 77.3 L 245.0 71.8 L 245.7 64.7 L 244.2 62.5 L 235.9 56.0 L 234.3 52.0 L 240.9 44.1 L 237.3 41.1 L 240.3 34.7 L 240.0 33.2 L 232.3 30.7 L 226.6 31.7 L 223.7 29.8 L 217.2 20.0 L 212.7 22.2 L 210.7 31.2 L 204.2 36.2 L 200.4 44.8 L 195.1 47.3 L 186.4 47.0 L 182.7 49.6 L 181.5 57.1 L 177.8 61.7 L 176.5 66.1 L 169.1 70.5 L 158.8 72.9 L 155.2 76.0 L 152.9 80.4 L 153.0 89.0 L 150.7 93.4 L 156.2 99.4 L 154.2 105.0 L 151.3 109.9 L 149.7 114.3 L 143.7 122.1 L 136.1 124.5 L 120.0 128.8 L 117.7 130.1 L 111.1 137.5 L 103.7 149.7 L 98.6 156.1 L 94.9 159.4 L 79.1 166.9 L 68.6 170.0 L 66.6 171.1 L 61.9 176.3 L 59.0 183.6 L 54.1 185.2 L 42.9 186.6 L 32.3 183.6 L 30.2 181.8 L 26.6 182.8 L 21.8 191.3 L 25.2 195.5 L 25.5 197.9 L 22.4 204.0 L 28.0 219.3 L 27.2 224.5 L 23.6 231.4 L 21.1 239.6 L 20.0 246.0 Z',
    fill: '#B45309',
    labelX: 160,
    labelY: 150,
  },
  Centro: {
    path: 'M 75.8 286.4 L 79.2 293.3 L 83.3 299.6 L 87.3 303.6 L 90.5 304.5 L 98.7 303.8 L 112.0 300.1 L 114.6 298.6 L 120.3 291.4 L 125.7 286.4 L 75.8 286.4 Z M 131.7 388.5 L 138.0 391.9 L 147.3 392.1 L 154.1 393.5 L 160.9 397.3 L 167.6 398.6 L 176.1 401.4 L 186.4 402.7 L 193.1 406.5 L 199.0 406.3 L 203.9 408.5 L 216.4 418.7 L 226.2 425.5 L 233.5 429.7 L 241.3 432.7 L 256.4 432.6 L 264.7 429.5 L 263.9 423.7 L 267.1 417.5 L 267.3 414.4 L 269.8 411.6 L 273.2 410.6 L 277.7 412.3 L 285.6 413.9 L 292.8 417.4 L 294.6 417.2 L 300.1 420.5 L 300.1 286.4 L 159.2 286.4 L 159.4 289.5 L 158.2 294.3 L 149.7 313.0 L 141.9 326.8 L 140.0 331.6 L 140.4 334.8 L 146.3 344.8 L 147.6 351.3 L 145.6 359.7 L 142.3 368.2 L 137.9 376.9 L 133.9 383.4 L 131.7 388.5 Z',
    fill: '#9A3412',
    labelX: 190,
    labelY: 360,
  },
  Media: {
    path: 'M 300.1 420.5 L 304.2 422.9 L 309.5 427.0 L 311.8 427.4 L 313.4 431.0 L 316.0 430.5 L 318.9 434.6 L 325.3 441.4 L 335.3 440.6 L 337.4 437.8 L 341.1 442.1 L 349.9 442.3 L 359.3 438.8 L 364.5 435.5 L 361.2 432.6 L 364.1 430.9 L 369.6 430.6 L 368.1 428.3 L 369.1 425.9 L 375.2 426.0 L 381.2 428.8 L 383.4 431.2 L 386.7 440.9 L 390.2 444.3 L 394.5 445.2 L 403.8 445.6 L 408.4 443.7 L 410.0 443.5 L 410.0 275.2 L 408.4 274.8 L 404.0 268.2 L 400.6 266.5 L 397.4 269.3 L 395.3 269.4 L 395.5 274.6 L 391.9 276.8 L 385.1 274.3 L 379.9 273.1 L 375.2 273.3 L 362.0 271.8 L 352.3 268.0 L 338.9 264.8 L 332.9 260.1 L 331.8 256.6 L 330.6 241.4 L 330.9 232.3 L 332.4 223.0 L 329.8 217.1 L 324.1 213.2 L 323.3 202.8 L 322.4 200.5 L 318.4 197.4 L 303.2 195.0 L 300.1 194.3 L 300.1 420.5 Z',
    fill: '#A16207',
    labelX: 350,
    labelY: 330,
  },
  Huasteca: {
    path: 'M 410.0 443.5 L 414.4 443.0 L 417.6 444.8 L 423.5 430.6 L 426.5 428.7 L 430.9 430.0 L 434.7 429.7 L 434.9 433.8 L 439.0 439.8 L 447.9 449.1 L 451.2 451.4 L 456.6 457.0 L 461.2 464.5 L 466.0 465.9 L 474.3 462.7 L 478.4 462.0 L 483.3 469.2 L 484.6 474.4 L 492.0 480.0 L 497.9 479.8 L 504.2 471.0 L 510.4 474.3 L 512.6 468.7 L 517.7 459.1 L 520.2 455.6 L 526.3 449.6 L 535.5 449.7 L 534.8 442.6 L 534.8 432.6 L 529.8 432.6 L 527.5 431.4 L 524.0 423.7 L 522.6 414.4 L 523.7 410.1 L 530.6 410.1 L 530.4 406.5 L 536.1 406.7 L 537.7 402.6 L 541.2 402.2 L 542.9 399.6 L 547.1 398.5 L 546.0 396.1 L 537.9 390.9 L 534.7 387.2 L 533.5 379.6 L 530.4 376.9 L 532.5 373.8 L 541.8 374.2 L 544.0 372.8 L 545.4 369.3 L 543.7 356.3 L 549.5 352.6 L 554.1 351.8 L 560.7 353.2 L 563.4 352.3 L 562.3 347.5 L 559.3 344.4 L 556.8 334.1 L 553.3 330.4 L 548.9 328.3 L 528.9 323.4 L 516.0 323.6 L 513.0 322.3 L 511.5 317.6 L 506.2 316.7 L 494.5 319.0 L 489.9 316.9 L 487.2 314.0 L 484.1 312.9 L 480.2 317.0 L 467.5 317.3 L 456.5 315.4 L 446.7 316.5 L 442.0 312.6 L 434.9 302.0 L 431.4 294.2 L 429.8 289.1 L 425.3 283.1 L 417.7 277.6 L 410.0 275.2 L 410.0 443.5 Z',
    fill: '#166534',
    labelX: 490,
    labelY: 380,
  },
};

type TipoFilter = 'todos' | 'pueblo' | 'paraje';
type RegionFilter = 'Todas' | 'Huasteca' | 'Altiplano' | 'Centro' | 'Media';

export default function AdminMapPinEditor({
  locations,
  onLocationsChange,
}: AdminMapPinEditorProps) {
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>('todos');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('Todas');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    locations[0]?.slug ?? null
  );
  const [draftX, setDraftX] = useState<number>(locations[0]?.svgX ?? 300);
  const [draftY, setDraftY] = useState<number>(locations[0]?.svgY ?? 250);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const selectedLocation =
    locations.find((loc) => loc.slug === selectedSlug) || null;

  useEffect(() => {
    if (!selectedSlug && locations.length > 0) {
      setSelectedSlug(locations[0].slug);
      setDraftX(locations[0].svgX);
      setDraftY(locations[0].svgY);
    }
  }, [locations, selectedSlug]);

  const handleSelectLocation = (loc: MapLocationConfig) => {
    setSelectedSlug(loc.slug);
    setDraftX(loc.svgX);
    setDraftY(loc.svgY);
    setSavedNotice(null);
  };

  const filteredLocations = locations.filter((loc) => {
    if (tipoFilter !== 'todos' && loc.tipo !== tipoFilter) return false;
    if (regionFilter !== 'Todas' && loc.region !== regionFilter) return false;
    return true;
  });

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedLocation) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = ((e.clientX - rect.left) / rect.width) * 600;
    const rawY = ((e.clientY - rect.top) / rect.height) * 500;

    const clampedX = Math.max(20, Math.min(580, Math.round(rawX)));
    const clampedY = Math.max(20, Math.min(480, Math.round(rawY)));

    setDraftX(clampedX);
    setDraftY(clampedY);
    setSavedNotice(null);
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) return;
    setSaving(true);
    setSavedNotice(null);
    try {
      const updated = await saveMapLocation({
        ...selectedLocation,
        svgX: Math.max(20, Math.min(580, Math.round(draftX))),
        svgY: Math.max(20, Math.min(480, Math.round(draftY))),
      });
      onLocationsChange(updated);
      setSavedNotice(
        `Ubicación de "${selectedLocation.nombre}" guardada en (${Math.round(
          draftX
        )}, ${Math.round(draftY)})`
      );
      setTimeout(() => setSavedNotice(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = async () => {
    setResetting(true);
    setSavedNotice(null);
    try {
      const defaults = await resetMapLocations();
      onLocationsChange(defaults);
      if (selectedSlug) {
        const refreshed = defaults.find((d) => d.slug === selectedSlug);
        if (refreshed) {
          setDraftX(refreshed.svgX);
          setDraftY(refreshed.svgY);
        }
      }
      setSavedNotice('Todos los pines fueron restablecidos a sus coordenadas de fábrica.');
      setTimeout(() => setSavedNotice(null), 4000);
    } finally {
      setResetting(false);
    }
  };

  const hasUnsavedChanges =
    selectedLocation !== null &&
    (Math.round(draftX) !== selectedLocation.svgX ||
      Math.round(draftY) !== selectedLocation.svgY);

  return (
    <div className="space-y-6">
      {/* Barra superior de filtros y botón de restablecer */}
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mr-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-600" />
            Tipo:
          </span>
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'pueblo', label: 'Pueblos Mágicos' },
              { id: 'paraje', label: 'Parajes Naturales' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTipoFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tipoFilter === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mr-1">
            Región:
          </span>
          {(['Todas', 'Huasteca', 'Altiplano', 'Centro', 'Media'] as const).map(
            (reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  regionFilter === reg
                    ? 'bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 shadow-sm'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {reg}
              </button>
            )
          )}

          <button
            type="button"
            onClick={handleResetAll}
            disabled={resetting}
            className="ml-auto lg:ml-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-red-300 dark:border-red-800/70 text-red-700 dark:text-red-300 bg-red-50/70 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {resetting
              ? 'Restableciendo...'
              : 'Restablecer todos los pines de fábrica'}
          </button>
        </div>
      </div>

      {/* Notificación de confirmación */}
      {savedNotice && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna izquierda: Mapa interactivo SVG */}
        <div className="lg:col-span-7 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-600" />
                Lienzo Interactivo de San Luis Potosí (600 × 500)
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Selecciona un pin y haz clic en cualquier punto del mapa para moverlo.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-600 dark:text-surface-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white" />
                Pueblo Mágico
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block border border-white" />
                Paraje Natural
              </span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-surface-950/95 border border-surface-200 dark:border-surface-800">
            <svg
              viewBox="0 0 600 500"
              onClick={handleSvgClick}
              className="w-full h-auto cursor-crosshair select-none"
              role="img"
              aria-label="Editor de pines del mapa de San Luis Potosí"
            >
              {/* Regiones de SLP */}
              {(
                Object.entries(REGION_PATHS) as [
                  keyof typeof REGION_PATHS,
                  (typeof REGION_PATHS)['Altiplano']
                ][]
              ).map(([regionName, data]) => {
                const isRegionFiltered =
                  regionFilter === 'Todas' || regionFilter === regionName;
                return (
                  <g key={regionName}>
                    <path
                      d={data.path}
                      fill={data.fill}
                      fillOpacity={isRegionFiltered ? 0.78 : 0.28}
                      stroke="#ffffff"
                      strokeOpacity={0.55}
                      strokeWidth={1.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    <text
                      x={data.labelX}
                      y={data.labelY}
                      textAnchor="middle"
                      className="fill-white/75 text-[12px] font-sans font-bold pointer-events-none select-none uppercase tracking-wider"
                    >
                      {regionName}
                    </text>
                  </g>
                );
              })}

              {/* Guías de coordenadas del pin seleccionado */}
              {selectedLocation && (
                <g className="pointer-events-none">
                  <line
                    x1={draftX}
                    y1={0}
                    x2={draftX}
                    y2={500}
                    stroke="#FBBF24"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    strokeOpacity={0.75}
                  />
                  <line
                    x1={0}
                    y1={draftY}
                    x2={600}
                    y2={draftY}
                    stroke="#FBBF24"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    strokeOpacity={0.75}
                  />
                </g>
              )}

              {/* Pines sobre el mapa */}
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.slug === loc.slug;
                const displayX = isSelected ? draftX : loc.svgX;
                const displayY = isSelected ? draftY : loc.svgY;
                const isPueblo = loc.tipo === 'pueblo';

                return (
                  <g
                    key={loc.id}
                    transform={`translate(${displayX}, ${displayY})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectLocation(loc);
                    }}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        r={16}
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth={2.5}
                        strokeOpacity={0.95}
                      />
                    )}
                    <circle
                      r={isSelected ? 9 : 6.5}
                      fill={
                        isSelected
                          ? '#F59E0B'
                          : isPueblo
                          ? '#F59E0B'
                          : '#0EA5E9'
                      }
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1.75}
                    />
                    {isSelected && (
                      <text
                        x={0}
                        y={-14}
                        textAnchor="middle"
                        className="fill-white text-[11px] font-bold pointer-events-none select-none"
                        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                      >
                        {loc.nombre} ({Math.round(displayX)}, {Math.round(displayY)})
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Columna derecha: Controles del pin seleccionado + Lista de ubicaciones */}
        <div className="lg:col-span-5 space-y-5">
          {/* Editor de coordenadas del pin activo */}
          {selectedLocation ? (
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      selectedLocation.tipo === 'pueblo'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {selectedLocation.tipo === 'pueblo'
                      ? 'Pueblo Mágico'
                      : 'Paraje Natural'}{' '}
                    • {selectedLocation.region}
                  </span>
                  <h4 className="text-lg font-bold text-surface-900 dark:text-surface-50 mt-1">
                    {selectedLocation.nombre}
                  </h4>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Municipio: {selectedLocation.municipio}
                  </p>
                </div>
                <div className="text-right font-mono text-xs bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-lg text-surface-700 dark:text-surface-200">
                  X: {Math.round(draftX)} | Y: {Math.round(draftY)}
                </div>
              </div>

              {/* Controles deslizables y numéricos */}
              <div className="space-y-3 pt-2 border-t border-surface-200 dark:border-surface-800">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-amber-600" />
                      Coordenada Horizontal (svgX)
                    </span>
                    <input
                      type="number"
                      min={20}
                      max={580}
                      value={Math.round(draftX)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!Number.isNaN(val)) {
                          setDraftX(Math.max(20, Math.min(580, val)));
                          setSavedNotice(null);
                        }
                      }}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-xs font-mono"
                    />
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={580}
                    value={Math.round(draftX)}
                    onChange={(e) => {
                      setDraftX(Number(e.target.value));
                      setSavedNotice(null);
                    }}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-amber-600" />
                      Coordenada Vertical (svgY)
                    </span>
                    <input
                      type="number"
                      min={20}
                      max={480}
                      value={Math.round(draftY)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!Number.isNaN(val)) {
                          setDraftY(Math.max(20, Math.min(480, val)));
                          setSavedNotice(null);
                        }
                      }}
                      className="w-20 px-2 py-1 text-right rounded-lg border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-xs font-mono"
                    />
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={480}
                    value={Math.round(draftY)}
                    onChange={(e) => {
                      setDraftY(Number(e.target.value));
                      setSavedNotice(null);
                    }}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveLocation}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving
                  ? 'Guardando ubicación...'
                  : 'Guardar Nueva Ubicación del Pin'}
                {hasUnsavedChanges && !saving && (
                  <span className="ml-1 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">
                    Sin guardar
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 text-center text-sm text-surface-500">
              Selecciona un pueblo o paraje en el mapa o de la lista inferior para ajustar su posición.
            </div>
          )}

          {/* Lista de lugares filtrados */}
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3 px-1">
              Lugares en el mapa ({filteredLocations.length})
            </h4>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation?.slug === loc.slug;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          loc.tipo === 'pueblo' ? 'bg-amber-500' : 'bg-sky-500'
                        }`}
                      />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">
                          {loc.nombre}
                        </p>
                        <p className="text-[11px] text-surface-500 dark:text-surface-400">
                          {loc.region} • {loc.municipio}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-surface-500 dark:text-surface-400 flex-shrink-0">
                      ({loc.svgX}, {loc.svgY})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
