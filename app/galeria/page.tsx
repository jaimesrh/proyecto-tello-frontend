'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MapPin,
  Upload,
  Plus,
  X,
  Heart,
  Sparkles,
  User,
  Trash2,
  Maximize2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import {
  SpotPhoto,
  getCommunityPhotos,
  addCommunityPhoto,
  deleteCommunityPhoto,
  likeCommunityPhoto,
  compressImageFile,
} from '@/lib/galeriaFirebase';

const FEATURED_PHOTOS: SpotPhoto[] = [
  {
    id: 'feat-1',
    src: '/images/cascada_tamul_1784665879590.png',
    title: 'Cascada de Tamul',
    location: 'Aquismón',
    description: 'Llega temprano en panga para capturar el azul turquesa sin reflejos fuertes del sol.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-01T10:00:00.000Z',
    likes: 48,
    isFeatured: true,
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-2',
  },
  {
    id: 'feat-2',
    src: '/images/jardin_surrealista_1784665889348.png',
    title: 'Jardín Surrealista de Edward James',
    location: 'Xilitla',
    description: 'La neblina matutina entre noviembre y febrero crea una atmósfera de ensueño.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-02T10:00:00.000Z',
    likes: 62,
    isFeatured: true,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
  {
    id: 'feat-3',
    src: '/images/real-de-catorce.jpg',
    title: 'Pueblo Fantasma y Túnel Ogarrio',
    location: 'Real de Catorce',
    description: 'La hora dorada al atardecer resalta los tonos ocres de las ruinas mineras.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-03T10:00:00.000Z',
    likes: 39,
    isFeatured: true,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
  {
    id: 'feat-4',
    src: '/images/parajes/laguna-media-luna.png',
    title: 'Manantial Media Luna',
    location: 'Rioverde',
    description: 'Ideal para fotografía subacuática gracias a su visibilidad cristalina de hasta 30 metros.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-04T10:00:00.000Z',
    likes: 51,
    isFeatured: true,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-2',
  },
  {
    id: 'feat-5',
    src: '/images/parajes/cascadas-minas-viejas.png',
    title: 'Cascadas de Minas Viejas',
    location: 'El Naranjo',
    description: 'Usa velocidad de obturación lenta para lograr el efecto seda en las caídas de agua.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-05T10:00:00.000Z',
    likes: 34,
    isFeatured: true,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
  {
    id: 'feat-6',
    src: '/images/parajes/sotano-de-las-golondrinas.png',
    title: 'Sótano de las Golondrinas',
    location: 'Aquismón',
    description: 'Prepara ráfaga rápida al amanecer cuando miles de vencejos salen en espiral.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-06T10:00:00.000Z',
    likes: 57,
    isFeatured: true,
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1',
  },
  {
    id: 'feat-7',
    src: '/images/santa-maria-del-rio.jpg',
    title: 'Cuna del Rebozo de Seda',
    location: 'Santa María del Río',
    description: 'Captura el contraste de los hilos teñidos con técnica ikat en los telares de cintura.',
    authorName: 'Guía Oficial SLP',
    createdAt: '2026-07-07T10:00:00.000Z',
    likes: 29,
    isFeatured: true,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
];

const DESTINATIONS = [
  'Aquismón',
  'Xilitla',
  'Real de Catorce',
  'Santa María del Río',
  'Tierra Nueva',
  'Ciudad del Maíz',
  'Rioverde',
  'El Naranjo',
  'San Luis Potosí Capital',
  'Otro rincón de SLP',
];

export default function GaleriaPage() {
  const { user } = useAuth();
  const [communityPhotos, setCommunityPhotos] = useState<SpotPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'todos' | 'destacados' | 'comunidad'>('todos');
  const [selectedLocation, setSelectedLocation] = useState<string>('Todas');

  // Estado del modal de subida
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<SpotPhoto | null>(null);

  // Estado del formulario de subida
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(DESTINATIONS[0]);
  const [description, setDescription] = useState('');
  const [guestAuthor, setGuestAuthor] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [featuredLikes, setFeaturedLikes] = useState<Record<string, number>>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCommunityPhotos();
  }, []);

  const loadCommunityPhotos = async () => {
    setLoading(true);
    try {
      const data = await getCommunityPhotos();
      setCommunityPhotos(data);
    } finally {
      setLoading(false);
    }
  };

  const allPhotos = useMemo(() => {
    const featuredWithUpdatedLikes = FEATURED_PHOTOS.map((fp) => ({
      ...fp,
      likes: (fp.likes || 0) + (featuredLikes[fp.id] || 0),
    }));

    let list: SpotPhoto[] = [];
    if (filterTab === 'destacados') {
      list = featuredWithUpdatedLikes;
    } else if (filterTab === 'comunidad') {
      list = communityPhotos;
    } else {
      list = [...communityPhotos, ...featuredWithUpdatedLikes];
    }

    if (selectedLocation !== 'Todas') {
      list = list.filter((p) => p.location === selectedLocation);
    }

    return list;
  }, [communityPhotos, filterTab, selectedLocation, featuredLikes]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }
    setUploadError(null);
    try {
      const compressed = await compressImageFile(file);
      setPreviewSrc(compressed);
    } catch {
      setUploadError('No se pudo procesar la imagen seleccionada. Intenta con otra.');
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    await handleFileChange(file);
  };

  const resetForm = () => {
    setTitle('');
    setLocation(DESTINATIONS[0]);
    setDescription('');
    setPreviewSrc(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewSrc) {
      setUploadError('Por favor selecciona una fotografía para subir.');
      return;
    }
    if (!title.trim()) {
      setUploadError('Escribe un título para tu fotografía.');
      return;
    }

    const authorName = user?.nombre || guestAuthor.trim() || 'Viajero Potosino';

    setSubmitting(true);
    setUploadError(null);

    try {
      const newPhoto = await addCommunityPhoto({
        src: previewSrc,
        title: title.trim(),
        location,
        description: description.trim(),
        authorName,
        userId: user?.uid || 'guest',
      });

      setCommunityPhotos((prev) => [newPhoto, ...prev]);
      setUploadSuccess(true);
      setFilterTab('todos');

      setTimeout(() => {
        resetForm();
        setUploadModalOpen(false);
      }, 1100);
    } catch {
      setUploadError('Ocurrió un problema al subir la fotografía. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteCommunityPhoto(photoId);
    setCommunityPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhotoModal?.id === photoId) {
      setSelectedPhotoModal(null);
    }
  };

  const handleLikePhoto = async (photo: SpotPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds[photo.id]) return;

    setLikedIds((prev) => ({ ...prev, [photo.id]: true }));

    if (photo.isFeatured) {
      setFeaturedLikes((prev) => ({
        ...prev,
        [photo.id]: (prev[photo.id] || 0) + 1,
      }));
    } else {
      setCommunityPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, likes: (p.likes || 0) + 1 } : p))
      );
      await likeCommunityPhoto(photo.id);
    }
  };

  const locationsFilterList = useMemo(() => {
    const locs = new Set<string>(['Todas']);
    FEATURED_PHOTOS.forEach((p) => locs.add(p.location));
    communityPhotos.forEach((p) => locs.add(p.location));
    return Array.from(locs);
  }, [communityPhotos]);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado Principal */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-6 shadow-sm">
            <Camera className="w-8 h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 text-surface-900 dark:text-surface-50">
            Spots Fotográficos
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-8">
            Inspírate con los rincones más espectaculares del estado y comparte tus mejores capturas con la comunidad viajera de San Luis Potosí.
          </p>

          {/* Botón Principal para Subir Fotografía */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                resetForm();
                setUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full shadow-lg shadow-amber-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Subir mi fotografía
            </button>
          </div>
        </div>

        {/* Banner interactivo para invitar a subir fotos */}
        <div className="glass-panel p-6 md:p-8 mb-10 border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-teal-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">
                ¿Capturaste un momento mágico en San Luis Potosí?
              </h2>
              <p className="text-sm text-surface-600 dark:text-surface-300">
                Sube tu foto, indica en qué Pueblo Mágico o paraje la tomaste y deja un consejo fotográfico para otros viajeros.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetForm();
              setUploadModalOpen(true);
            }}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Compartir Spot
          </button>
        </div>

        {/* Barra de Filtros (Tabs + Ubicación) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-surface-200/70 dark:bg-surface-800/80 border border-surface-300/50 dark:border-surface-700/50">
            <button
              onClick={() => setFilterTab('todos')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterTab === 'todos'
                  ? 'bg-white dark:bg-surface-900 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              Todos ({FEATURED_PHOTOS.length + communityPhotos.length})
            </button>
            <button
              onClick={() => setFilterTab('destacados')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterTab === 'destacados'
                  ? 'bg-white dark:bg-surface-900 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              Oficiales ({FEATURED_PHOTOS.length})
            </button>
            <button
              onClick={() => setFilterTab('comunidad')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterTab === 'comunidad'
                  ? 'bg-white dark:bg-surface-900 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              Comunidad ({communityPhotos.length})
            </button>
          </div>

          {/* Filtro por ubicación */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {locationsFilterList.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLocation === loc
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Cuadrícula de Fotografías */}
        {loading && allPhotos.length === 0 ? (
          <div className="text-center py-20 text-surface-500">Cargando galería...</div>
        ) : allPhotos.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <Camera className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
              Aún no hay fotografías en esta categoría
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              ¡Sé el primero en inaugurar la galería comunitaria subiendo tu foto favorita!
            </p>
            <button
              onClick={() => {
                resetForm();
                setUploadModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full font-semibold text-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              Subir primera foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[270px] gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {allPhotos.map((photo, idx) => {
                const canDelete =
                  !photo.isFeatured &&
                  ((user && photo.userId === user.uid) || photo.id.startsWith('local-'));

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                    key={photo.id}
                    onClick={() => setSelectedPhotoModal(photo)}
                    className={`relative rounded-3xl overflow-hidden group cursor-pointer border border-surface-200/40 dark:border-surface-700/40 shadow-md ${
                      photo.colSpan || 'col-span-1'
                    } ${photo.rowSpan || 'row-span-1'}`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Etiqueta Superior Izquierda (Comunidad vs Oficial) */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {photo.isFeatured ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                          Destacado
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                          <User className="w-3 h-3" /> {photo.authorName}
                        </span>
                      )}
                    </div>

                    {/* Acciones Superiores Derecha */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {canDelete && (
                        <button
                          onClick={(e) => handleDeletePhoto(photo.id, e)}
                          title="Eliminar mi fotografía"
                          className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoModal(photo);
                        }}
                        title="Ver en pantalla completa"
                        className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Información Inferior */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-snug">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-xs text-stone-200/90 line-clamp-2 mb-3">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-white/90 pt-1">
                        <span className="flex items-center gap-1.5 text-xs md:text-sm font-medium">
                          <MapPin className="w-4 h-4 text-amber-400 shrink-0" /> {photo.location}
                        </span>
                        <button
                          onClick={(e) => handleLikePhoto(photo, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
                            likedIds[photo.id]
                              ? 'bg-rose-600 text-white'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${likedIds[photo.id] ? 'fill-current' : ''}`}
                          />
                          {photo.likes || 0}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal para Subir Fotografía */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-2xl overflow-hidden my-8"
            >
              <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600" />

              <button
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-white">
                      Subir Fotografía
                    </h2>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      Comparte tu mirada de San Luis Potosí con otros viajeros
                    </p>
                  </div>
                </div>

                {uploadSuccess ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                      ¡Fotografía publicada con éxito!
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Tu captura ya forma parte de los Spots Fotográficos.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUploadSubmit} className="space-y-4 mt-6">
                    {uploadError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
                        {uploadError}
                      </div>
                    )}

                    {/* Zona Drag & Drop o Selección de Imagen */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-2">
                        Fotografía *
                      </label>

                      {previewSrc ? (
                        <div className="relative rounded-2xl overflow-hidden h-56 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                          <img
                            src={previewSrc}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setPreviewSrc(null)}
                            className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md transition-colors"
                          >
                            Cambiar foto
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-amber-500 bg-amber-500/10'
                              : 'border-surface-300 dark:border-surface-700 hover:border-amber-500 dark:hover:border-amber-500 bg-surface-50 dark:bg-surface-800/50'
                          }`}
                        >
                          <ImageIcon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1">
                            Haz clic para elegir una foto o arrástrala aquí
                          </p>
                          <p className="text-xs text-surface-500">
                            Formatos JPG, PNG o WEBP (se optimiza automáticamente)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    {/* Título del Spot */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1.5">
                        Título de la fotografía *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Amanecer en el Sótano de las Golondrinas"
                        className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Ubicación / Pueblo Mágico */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1.5">
                        Ubicación / Destino *
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:border-amber-500 focus:outline-none"
                      >
                        {DESTINATIONS.map((dest) => (
                          <option key={dest} value={dest}>
                            {dest}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nombre del Autor si no ha iniciado sesión */}
                    {!user && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300">
                            Tu Nombre o Alias
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadModalOpen(false);
                              setAuthModalOpen(true);
                            }}
                            className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
                          >
                            O inicia sesión con tu cuenta
                          </button>
                        </div>
                        <input
                          type="text"
                          value={guestAuthor}
                          onChange={(e) => setGuestAuthor(e.target.value)}
                          placeholder="Ej. Ana López"
                          className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Tip fotográfico / Descripción */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300 mb-1.5">
                        Tip Fotográfico o Descripción (Opcional)
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej. Mejor hora para tomarla: 7:30 AM cuando entra la luz entre los árboles..."
                        className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-900 dark:text-white focus:border-amber-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setUploadModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {submitting ? 'Publicando...' : 'Publicar Fotografía'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal para ver fotografía en grande */}
      <AnimatePresence>
        {selectedPhotoModal && (
          <div
            onClick={() => setSelectedPhotoModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-surface-900 rounded-3xl overflow-hidden border border-surface-700 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhotoModal.src}
                  alt={selectedPhotoModal.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-surface-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedPhotoModal.location}
                    <span className="text-surface-500">•</span>
                    <span className="text-surface-300">Por {selectedPhotoModal.authorName}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{selectedPhotoModal.title}</h3>
                  {selectedPhotoModal.description && (
                    <p className="text-sm text-surface-300">{selectedPhotoModal.description}</p>
                  )}
                </div>

                <button
                  onClick={(e) => handleLikePhoto(selectedPhotoModal, e)}
                  className={`shrink-0 self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    likedIds[selectedPhotoModal.id]
                      ? 'bg-rose-600 text-white'
                      : 'bg-surface-800 hover:bg-surface-700 text-white'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${likedIds[selectedPhotoModal.id] ? 'fill-current' : ''}`}
                  />
                  Me gusta ({selectedPhotoModal.likes || 0})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
