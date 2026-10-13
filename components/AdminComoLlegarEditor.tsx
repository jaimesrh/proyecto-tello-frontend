'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Save,
  Eye,
  Navigation,
  Clock,
  Route,
  Compass,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Satellite,
  Map as MapIcon,
} from 'lucide-react';
import {
  MapLocationConfig,
  DEFAULT_MAP_LOCATIONS,
  saveMapLocation,
} from '@/lib/mapPinsFirebase';
import ComoLlegarModal from './ComoLlegarModal';

export interface AdminComoLlegarEditorProps {
  locations: MapLocationConfig[];
  onLocationsChange: (updated: MapLocationConfig[]) => void;
}

export default function AdminComoLlegarEditor({
  locations,
  onLocationsChange,
}: AdminComoLlegarEditorProps) {
  const effectiveLocations = locations.length > 0 ? locations : DEFAULT_MAP_LOCATIONS;

  const [selectedSlug, setSelectedSlug] = useState<string>(
    effectiveLocations[0]?.slug || 'aquismon'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('Todas');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'pueblo' | 'paraje'>('todos');

  const [googleMapsQuery, setGoogleMapsQuery] = useState<string>('');
  const [puntoPartida, setPuntoPartida] = useState<string>('');
  const [distancia, setDistancia] = useState<string>('');
  const [tiempoEstimado, setTiempoEstimado] = useState<string>('');
  const [comoLlegar, setComoLlegar] = useState<string>('');

  const [previewMapMode, setPreviewMapMode] = useState<'roadmap' | 'satellite'>('roadmap');
  const [saving, setSaving] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [testModalOpen, setTestModalOpen] = useState<boolean>(false);

  const selectedLocation = useMemo(
    () =>
      effectiveLocations.find((loc) => loc.slug === selectedSlug) ||
      effectiveLocations[0],
    [effectiveLocations, selectedSlug]
  );

  useEffect(() => {
    if (selectedLocation) {
      setGoogleMapsQuery(selectedLocation.googleMapsQuery || '');
      setPuntoPartida(selectedLocation.puntoPartida || '');
      setDistancia(selectedLocation.distancia || '');
      setTiempoEstimado(selectedLocation.tiempoEstimado || '');
      setComoLlegar(selectedLocation.comoLlegar || '');
      setSavedNotice(null);
    }
  }, [selectedLocation]);

  const filteredLocations = useMemo(() => {
    return effectiveLocations.filter((loc) => {
      const matchesSearch =
        !searchTerm.trim() ||
        loc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.region.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'Todas' || loc.region === regionFilter;
      const matchesTipo = tipoFilter === 'todos' || loc.tipo === tipoFilter;
      return matchesSearch && matchesRegion && matchesTipo;
    });
  }, [effectiveLocations, searchTerm, regionFilter, tipoFilter]);

  const currentDraftLocation: MapLocationConfig | null = selectedLocation
    ? {
        ...selectedLocation,
        googleMapsQuery:
          googleMapsQuery.trim() || `${selectedLocation.nombre}, San Luis Potosí, México`,
        puntoPartida: puntoPartida.trim(),
        distancia: distancia.trim(),
        tiempoEstimado: tiempoEstimado.trim(),
        comoLlegar: comoLlegar.trim(),
      }
    : null;

  const liveEmbedQuery =
    googleMapsQuery.trim() ||
    (selectedLocation ? `${selectedLocation.nombre}, San Luis Potosí, México` : 'San Luis Potosí');

  const liveEmbedUrl =
    previewMapMode === 'satellite'
      ? `https://maps.google.com/maps?q=${encodeURIComponent(liveEmbedQuery)}&t=k&z=14&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(liveEmbedQuery)}&t=m&z=13&ie=UTF8&iwloc=&output=embed`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDraftLocation) return;

    setSaving(true);
    setSavedNotice(null);
    try {
      const updated = await saveMapLocation(currentDraftLocation);
      onLocationsChange(updated);
      setSavedNotice(`Ruta y mapa de "${currentDraftLocation.nombre}" guardados correctamente.`);
      setTimeout(() => setSavedNotice(null), 4500);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreSelectedDefault = () => {
    if (!selectedLocation) return;
    const def = DEFAULT_MAP_LOCATIONS.find((d) => d.slug === selectedLocation.slug);
    if (!def) return;
    setGoogleMapsQuery(def.googleMapsQuery);
    setPuntoPartida(def.puntoPartida);
    setDistancia(def.distancia);
    setTiempoEstimado(def.tiempoEstimado);
    setComoLlegar(def.comoLlegar);
    setSavedNotice('Valores originales cargados en el formulario. Pulsa "Guardar Ruta y Mapa" para aplicar.');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado informativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-stone-50 to-emerald-50/60 dark:from-surface-800 dark:via-surface-900 dark:to-surface-800 border border-amber-200/70 dark:border-stone-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <Navigation className="w-3.5 h-3.5" />
            Configuración de Rutas y Google Maps
          </span>
          <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 dark:text-white">
            Editor de &ldquo;Cómo Llegar&rdquo; y Ubicación en Google Maps
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Personaliza la búsqueda o coordenadas de Google Maps, tiempos de traslado e indicaciones carreteras de cada Pueblo Mágico y Paraje Natural.
          </p>
        </div>

        {currentDraftLocation && (
          <button
            type="button"
            onClick={() => setTestModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-sm transition-colors shrink-0"
          >
            <Eye className="w-4 h-4" />
            Probar Modal Cómo Llegar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna izquierda: Selector de destinos con buscador y filtros */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl bg-white dark:bg-surface-900 border border-stone-200 dark:border-stone-800 p-4 space-y-4 shadow-sm">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              1. Seleccionar Destino ({filteredLocations.length})
            </label>

            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pueblo, paraje o municipio..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-stone-50 dark:bg-surface-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Filtros por tipo y región */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value as 'todos' | 'pueblo' | 'paraje')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-stone-50 dark:bg-surface-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
              >
                <option value="todos">Todos los tipos</option>
                <option value="pueblo">Pueblos Mágicos</option>
                <option value="paraje">Parajes Naturales</option>
              </select>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-stone-50 dark:bg-surface-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
              >
                <option value="Todas">Todas las regiones</option>
                <option value="Huasteca">Huasteca</option>
                <option value="Altiplano">Altiplano</option>
                <option value="Centro">Centro</option>
                <option value="Media">Media</option>
              </select>
            </div>
          </div>

          {/* Lista de ubicaciones */}
          <div className="flex-1 max-h-[460px] overflow-y-auto space-y-1.5 pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = loc.slug === selectedLocation?.slug;
              return (
                <button
                  key={loc.slug}
                  type="button"
                  onClick={() => setSelectedSlug(loc.slug)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 shadow-sm'
                      : 'bg-stone-50/60 dark:bg-surface-800/50 border-stone-200/70 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold truncate ${
                        isSelected
                          ? 'text-amber-900 dark:text-amber-300'
                          : 'text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {loc.nombre}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {loc.municipio} • Región {loc.region}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      loc.tipo === 'pueblo'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    }`}
                  >
                    {loc.tipo === 'pueblo' ? 'Pueblo' : 'Paraje'}
                  </span>
                </button>
              );
            })}

            {filteredLocations.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400">
                No se encontraron destinos con ese criterio.
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Formulario de edición + Vista previa del mapa en vivo */}
        <div className="lg:col-span-8 space-y-6">
          {selectedLocation && (
            <form
              onSubmit={handleSave}
              className="rounded-2xl bg-white dark:bg-surface-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    2. Editando Destino
                  </span>
                  <h4 className="text-lg font-display font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {selectedLocation.nombre}
                    <span className="text-xs font-normal text-stone-500 dark:text-stone-400">
                      ({selectedLocation.municipio} — {selectedLocation.region})
                    </span>
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={handleRestoreSelectedDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-surface-800 dark:hover:bg-stone-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar valores por defecto
                </button>
              </div>

              {savedNotice && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{savedNotice}</span>
                </div>
              )}

              {/* Campo: googleMapsQuery */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Búsqueda o Coordenadas en Google Maps (`googleMapsQuery`)
                </label>
                <input
                  type="text"
                  value={googleMapsQuery}
                  onChange={(e) => setGoogleMapsQuery(e.target.value)}
                  placeholder='Ej. "Cascada de Tamul, Aquismon, San Luis Potosi" o "21.9754,-99.1782"'
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-surface-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Puedes ingresar el nombre exacto del lugar en Google Maps o coordenadas GPS (`latitud,longitud`). El mapa de abajo se actualizará automáticamente.
                </p>
              </div>

              {/* Campos: puntoPartida, distancia, tiempoEstimado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    <Navigation className="w-3.5 h-3.5 text-amber-600" />
                    Punto de Partida
                  </label>
                  <input
                    type="text"
                    value={puntoPartida}
                    onChange={(e) => setPuntoPartida(e.target.value)}
                    placeholder="Ej. Ciudad Valles / SLP Capital"
                    required
                    className="w-full px-3 py-2 rounded-xl text-sm bg-stone-50 dark:bg-surface-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    <Route className="w-3.5 h-3.5 text-emerald-600" />
                    Distancia Estimada
                  </label>
                  <input
                    type="text"
                    value={distancia}
                    onChange={(e) => setDistancia(e.target.value)}
                    placeholder="Ej. 45 km desde Cd. Valles"
                    required
                    className="w-full px-3 py-2 rounded-xl text-sm bg-stone-50 dark:bg-surface-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    Tiempo Estimado
                  </label>
                  <input
                    type="text"
                    value={tiempoEstimado}
                    onChange={(e) => setTiempoEstimado(e.target.value)}
                    placeholder="Ej. 55 min en auto + 1 h 30 min en panga"
                    required
                    className="w-full px-3 py-2 rounded-xl text-sm bg-stone-50 dark:bg-surface-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Campo: comoLlegar */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  Indicaciones Detalladas de Cómo Llegar
                </label>
                <textarea
                  rows={4}
                  value={comoLlegar}
                  onChange={(e) => setComoLlegar(e.target.value)}
                  placeholder="Describe carreteras federales/estatales, entronques, caminos comunitarios o recomendaciones de vehículo..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-surface-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Vista Previa en Vivo del Mapa de Google Maps */}
              <div className="space-y-2.5 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Vista Previa en Vivo de Google Maps
                  </span>

                  <div className="inline-flex rounded-lg p-0.5 bg-stone-200/80 dark:bg-surface-800 border border-stone-300/60 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => setPreviewMapMode('roadmap')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        previewMapMode === 'roadmap'
                          ? 'bg-white dark:bg-surface-900 text-amber-700 dark:text-amber-400 shadow-sm'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <MapIcon className="w-3 h-3" />
                      Mapa
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMapMode('satellite')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                        previewMapMode === 'satellite'
                          ? 'bg-white dark:bg-surface-900 text-amber-700 dark:text-amber-400 shadow-sm'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Satellite className="w-3 h-3" />
                      Satélite
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-950">
                  <iframe
                    key={liveEmbedUrl}
                    src={liveEmbedUrl}
                    title={`Vista previa de ${selectedLocation.nombre}`}
                    className="w-full h-[290px] border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-stone-300 dark:border-stone-700 bg-stone-50 hover:bg-stone-100 dark:bg-surface-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                    Probar Modal Cómo Llegar
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      liveEmbedQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    Abrir en Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white shadow-md shadow-amber-900/20 disabled:opacity-60 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar Ruta y Mapa'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de prueba con los datos en edición */}
      <ComoLlegarModal
        location={testModalOpen ? currentDraftLocation : null}
        onClose={() => setTestModalOpen(false)}
      />
    </div>
  );
}
