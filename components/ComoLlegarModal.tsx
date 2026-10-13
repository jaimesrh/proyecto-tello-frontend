'use client';

import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Clock,
  Route,
  Compass,
  ExternalLink,
  Satellite,
  Map as MapIcon,
  Car,
} from 'lucide-react';
import { MapLocationConfig } from '@/lib/mapPinsFirebase';

export interface ComoLlegarModalProps {
  location: MapLocationConfig | null;
  onClose: () => void;
}

const REGION_BADGE_STYLES: Record<MapLocationConfig['region'], string> = {
  Huasteca:
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
  Altiplano:
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
  Centro:
    'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60',
  Media:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800/60',
};

export default function ComoLlegarModal({ location, onClose }: ComoLlegarModalProps) {
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite'>('roadmap');
  const [origenUsuario, setOrigenUsuario] = useState<string>('San Luis Potosí, S.L.P.');

  useEffect(() => {
    if (location) {
      setOrigenUsuario(location.puntoPartida || 'San Luis Potosí, S.L.P.');
      setMapMode('roadmap');
    }
  }, [location]);

  useEffect(() => {
    if (!location) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location, onClose]);

  if (!location) return null;

  const query = location.googleMapsQuery || `${location.nombre}, San Luis Potosí, México`;
  const embedUrl =
    mapMode === 'satellite'
      ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=k&z=14&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=13&ie=UTF8&iwloc=&output=embed`;

  const originQuery = origenUsuario.trim() || location.puntoPartida || 'San Luis Potosí, S.L.P.';
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    originQuery
  )}&destination=${encodeURIComponent(query)}&travelmode=driving`;

  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const quickOrigins = [
    location.puntoPartida,
    'San Luis Potosí, S.L.P.',
    'Ciudad Valles, S.L.P.',
    'Matehuala, S.L.P.',
    'Río Verde, S.L.P.',
  ].filter((v, idx, arr) => Boolean(v) && arr.indexOf(v) === idx);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="como-llegar-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-surface-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-stone-200 dark:border-stone-800 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 dark:from-surface-900 dark:via-surface-800/70 dark:to-surface-900">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  REGION_BADGE_STYLES[location.region]
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Región {location.region}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Municipio de {location.municipio}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                {location.tipo === 'pueblo' ? 'Pueblo Mágico' : 'Paraje Natural'}
              </span>
            </div>
            <h2
              id="como-llegar-title"
              className="text-xl sm:text-2xl font-display font-bold text-stone-900 dark:text-white flex items-center gap-2"
            >
              Cómo llegar a {location.nombre}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selector de vista de mapa y punto de salida */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-stone-50 dark:bg-surface-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Modo de visualización del mapa
              </label>
              <div className="inline-flex rounded-xl p-1 bg-stone-200/70 dark:bg-stone-900 border border-stone-300/60 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setMapMode('roadmap')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mapMode === 'roadmap'
                      ? 'bg-white dark:bg-surface-800 text-amber-700 dark:text-amber-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Vista del Lugar en Mapa
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('satellite')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mapMode === 'satellite'
                      ? 'bg-white dark:bg-surface-800 text-amber-700 dark:text-amber-400 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5" />
                  Vista Satélite
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-md space-y-1.5">
              <label
                htmlFor="origen-usuario-input"
                className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400"
              >
                Tu punto de salida (para trazar ruta en Google Maps)
              </label>
              <div className="relative">
                <Car className="w-4 h-4 text-amber-600 dark:text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="origen-usuario-input"
                  type="text"
                  value={origenUsuario}
                  onChange={(e) => setOrigenUsuario(e.target.value)}
                  placeholder="Ej. San Luis Potosí, S.L.P."
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl text-sm bg-white dark:bg-surface-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-stone-400 dark:text-stone-500">Salidas rápidas:</span>
                {quickOrigins.map((origin) => (
                  <button
                    key={origin}
                    type="button"
                    onClick={() => setOrigenUsuario(origin)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                      origenUsuario === origin
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mapa interactivo de Google Maps embebido */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 shadow-inner">
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`Mapa de ubicación de ${location.nombre}`}
              className="w-full min-h-[360px] h-[360px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-4 py-2 bg-stone-900/90 text-stone-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Búsqueda en mapa: <strong className="text-white">{query}</strong>
                </span>
              </span>
              <span className="text-stone-400">
                {mapMode === 'satellite' ? 'Vista satelital detallada' : 'Mapa de carreteras y relieve'}
              </span>
            </div>
          </div>

          {/* Tarjetas informativas de traslado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Navigation className="w-4 h-4 shrink-0" />
                Punto de partida sugerido
              </div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {location.puntoPartida || 'San Luis Potosí Capital'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Route className="w-4 h-4 shrink-0" />
                Distancia aproximada
              </div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {location.distancia || 'Consultar en ruta'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-900/50">
              <div className="flex items-center gap-2 text-sky-800 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Clock className="w-4 h-4 shrink-0" />
                Tiempo estimado de traslado
              </div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {location.tiempoEstimado || 'Variable según punto de salida'}
              </p>
            </div>
          </div>

          {/* Indicaciones detalladas de Cómo Llegar */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-surface-800/60 border border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Indicaciones detalladas de Cómo Llegar
            </h3>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed">
              {location.comoLlegar}
            </p>
          </div>
        </div>

        {/* Pie del modal con botones de acción */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-surface-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors order-3 sm:order-1"
          >
            Cerrar ventana
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 order-1 sm:order-2">
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-surface-800 text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Ver en Google Maps
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-md shadow-amber-900/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Iniciar Ruta en Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
