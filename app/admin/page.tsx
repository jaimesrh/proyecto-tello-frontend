'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Newspaper,
  CalendarDays,
  Utensils,
  ShoppingBag,
  Compass,
  Camera,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Star,
  Lock,
  LogOut,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Noticia } from '@/lib/firebaseFirestore';
import { Evento } from '@/lib/eventos';
import { Platillo } from '@/lib/gastronomia';
import { Producto } from '@/lib/productos';
import { Tour } from '@/lib/tours';
import { Review } from '@/lib/reviewsFirebase';
import {
  SpotPhoto,
  getCommunityPhotos,
  deleteCommunityPhoto,
  compressImageFile,
} from '@/lib/galeriaFirebase';
import {
  getManagedNoticias,
  saveNoticia,
  removeNoticia,
  slugify,
  getManagedEventos,
  saveEvento,
  removeEvento,
  getManagedPlatillos,
  savePlatillo,
  removePlatillo,
  getManagedProductos,
  saveProducto,
  removeProducto,
  getManagedTours,
  saveTour,
  removeTour,
  getAllReviewsForAdmin,
  deleteReviewAsAdmin,
} from '@/lib/adminFirebase';

type AdminTab =
  | 'noticias'
  | 'calendario'
  | 'gastronomia'
  | 'mercado'
  | 'tours'
  | 'moderacion';

const ADMIN_PIN = 'admin123';
const SESSION_KEY = 'slp_admin_unlocked';

export default function AdminDashboardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('noticias');
  const [toast, setToast] = useState<string | null>(null);

  // Datos administrables
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [communityPhotos, setCommunityPhotos] = useState<SpotPhoto[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de modales de edición/creación
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [editingPlatillo, setEditingPlatillo] = useState<Platillo | null>(null);
  const [ingredientesText, setIngredientesText] = useState('');
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [incluyeText, setIncluyeText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved === 'true') {
        setUnlocked(true);
      }
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      loadAllData();
    }
  }, [unlocked]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [n, ev, pl, pr, tr, ph, rv] = await Promise.all([
        getManagedNoticias(),
        getManagedEventos(),
        getManagedPlatillos(),
        getManagedProductos(),
        getManagedTours(),
        getCommunityPhotos(),
        getAllReviewsForAdmin(),
      ]);
      setNoticias(n);
      setEventos(ev);
      setPlatillos(pl);
      setProductos(pr);
      setTours(tr);
      setCommunityPhotos(ph);
      setReviews(rv);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setUnlocked(true);
      setPinError(false);
      sessionStorage.setItem(SESSION_KEY, 'true');
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setPinInput('');
  };

  // Subida y compresión de imagen para cualquier formulario
  const handleImageUpload = async (
    file: File | null,
    onResult: (dataUrl: string) => void
  ) => {
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      onResult(compressed);
      showToast('Imagen procesada correctamente');
    } catch {
      alert('No se pudo procesar la imagen seleccionada.');
    }
  };

  // --- CRUD Handlers: Noticias ---
  const handleSaveNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNoticia) return;
    const saved = await saveNoticia({
      ...editingNoticia,
      slug: editingNoticia.slug || slugify(editingNoticia.titulo),
    });
    setNoticias((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev];
    });
    setEditingNoticia(null);
    showToast('Noticia guardada con éxito');
  };

  const handleDeleteNoticia = async (id?: string) => {
    if (!id) return;
    await removeNoticia(id);
    setNoticias((prev) => prev.filter((n) => n.id !== id));
    showToast('Noticia eliminada');
  };

  // --- CRUD Handlers: Calendario ---
  const handleSaveEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvento) return;
    const saved = await saveEvento(editingEvento);
    setEventos((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      const list = exists
        ? prev.map((i) => (i.id === saved.id ? saved : i))
        : [...prev, saved];
      return list.sort((a, b) => a.fecha.localeCompare(b.fecha));
    });
    setEditingEvento(null);
    showToast('Evento guardado en el calendario');
  };

  const handleDeleteEvento = async (id: string) => {
    await removeEvento(id);
    setEventos((prev) => prev.filter((ev) => ev.id !== id));
    showToast('Evento eliminado');
  };

  // --- CRUD Handlers: Gastronomía ---
  const openPlatilloModal = (platillo?: Platillo) => {
    if (platillo) {
      setEditingPlatillo(platillo);
      setIngredientesText(platillo.ingredientes.join(', '));
    } else {
      setEditingPlatillo({
        id: '',
        nombre: '',
        region: 'Huasteca',
        pueblo: 'Aquismón',
        descripcion: '',
        ingredientes: [],
        imagen: '/images/zacahuil_1784665862653.png',
      });
      setIngredientesText('');
    }
  };

  const handleSavePlatillo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlatillo) return;
    const ingredientes = ingredientesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const saved = await savePlatillo({ ...editingPlatillo, ingredientes });
    setPlatillos((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev];
    });
    setEditingPlatillo(null);
    showToast('Platillo gastronómico guardado');
  };

  const handleDeletePlatillo = async (id: string) => {
    await removePlatillo(id);
    setPlatillos((prev) => prev.filter((p) => p.id !== id));
    showToast('Platillo eliminado');
  };

  // --- CRUD Handlers: Mercado Potosino ---
  const handleSaveProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProducto) return;
    const saved = await saveProducto({
      ...editingProducto,
      precio: Number(editingProducto.precio) || 0,
    });
    setProductos((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev];
    });
    setEditingProducto(null);
    showToast('Artesanía guardada en el Mercado Potosino');
  };

  const handleDeleteProducto = async (id: string) => {
    await removeProducto(id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    showToast('Artesanía eliminada');
  };

  // --- CRUD Handlers: Tours ---
  const openTourModal = (tour?: Tour) => {
    if (tour) {
      setEditingTour(tour);
      setIncluyeText(tour.incluye.join(', '));
    } else {
      setEditingTour({
        id: '',
        titulo: '',
        region: 'Huasteca',
        pueblo: 'Aquismón',
        duracion: '6 horas',
        precio: 850,
        dificultad: 'Media',
        tipo: 'Aventura',
        incluye: [],
        descripcion: '',
        imagen: '/images/parajes/cascada-de-tamul.png',
        guiaCertificado: true,
      });
      setIncluyeText('Transporte, Guía certificado, Entradas');
    }
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    const incluye = incluyeText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const saved = await saveTour({
      ...editingTour,
      precio: Number(editingTour.precio) || 0,
      incluye,
    });
    setTours((prev) => {
      const exists = prev.some((i) => i.id === saved.id);
      return exists ? prev.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...prev];
    });
    setEditingTour(null);
    showToast('Tour guardado correctamente');
  };

  const handleDeleteTour = async (id: string) => {
    await removeTour(id);
    setTours((prev) => prev.filter((t) => t.id !== id));
    showToast('Tour eliminado');
  };

  // --- Moderación ---
  const handleDeleteSpotPhoto = async (id: string) => {
    await deleteCommunityPhoto(id);
    setCommunityPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Fotografía eliminada de la galería');
  };

  const handleDeleteReview = async (id: string) => {
    await deleteReviewAsAdmin(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Reseña eliminada');
  };

  // =========================================================
  // VISTA DE ACCESO CON PIN DE ADMINISTRADOR
  // =========================================================
  if (!unlocked) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel max-w-md w-full p-8 text-center border border-amber-500/30"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white mb-2">
            Panel de Administrador
          </h1>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
            Ingresa tu clave de administrador para gestionar noticias, calendario, gastronomía, artesanías, tours y moderación.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Clave de administrador (Ej. admin123)"
              className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-center text-surface-900 dark:text-white focus:border-amber-500 focus:outline-none"
            />
            {pinError && (
              <p className="text-xs text-red-500 font-medium">
                Clave incorrecta. La clave predeterminada es: <strong>admin123</strong>
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/20 transition-all"
            >
              Entrar al Panel de Control
            </button>
          </form>

          <p className="text-xs text-surface-400 mt-6">
            Clave actual configurada: <code className="text-amber-600 dark:text-amber-400 font-semibold">admin123</code>
          </p>
        </motion.div>
      </div>
    );
  }

  // =========================================================
  // VISTA PRINCIPAL DEL DASHBOARD DE ADMINISTRADOR
  // =========================================================
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Notificación Flotante (Toast) */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-semibold shadow-xl"
            >
              <CheckCircle2 className="w-4 h-4" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encabezado Superior */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-white">
                Centro de Administración
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Edita, publica o elimina cualquier contenido de Conoce San Luis Potosí en tiempo real.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutAdmin}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-200/80 dark:bg-surface-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-surface-700 dark:text-surface-300 hover:text-red-600 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Bloquear Panel
          </button>
        </div>

        {/* Tarjetas de Resumen Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { id: 'noticias', label: 'Noticias', count: noticias.length, icon: Newspaper, color: 'text-amber-500' },
            { id: 'calendario', label: 'Eventos', count: eventos.length, icon: CalendarDays, color: 'text-purple-500' },
            { id: 'gastronomia', label: 'Platillos', count: platillos.length, icon: Utensils, color: 'text-orange-500' },
            { id: 'mercado', label: 'Artesanías', count: productos.length, icon: ShoppingBag, color: 'text-emerald-500' },
            { id: 'tours', label: 'Tours', count: tours.length, icon: Compass, color: 'text-blue-500' },
            { id: 'moderacion', label: 'Comunidad', count: communityPhotos.length + reviews.length, icon: Camera, color: 'text-rose-500' },
          ].map((stat) => {
            const Icon = stat.icon;
            const isSelected = activeTab === stat.id;
            return (
              <button
                key={stat.id}
                onClick={() => setActiveTab(stat.id as AdminTab)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/20'
                    : 'glass-panel hover:border-amber-500/40'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : stat.color}`} />
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className={`text-xs font-medium ${isSelected ? 'text-amber-100' : 'text-surface-500'}`}>
                  {stat.label}
                </div>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="glass-panel p-16 text-center text-surface-500">
            Cargando datos del sistema...
          </div>
        ) : (
          <div className="glass-panel p-6 md:p-8">
            {/* ==========================================
                TAB 1: GESTOR DE NOTICIAS
               ========================================== */}
            {activeTab === 'noticias' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                      Gestor de Noticias y Blog
                    </h2>
                    <p className="text-sm text-surface-500">
                      Publica artículos, reportajes y novedades que aparecerán en Inicio y en /noticias.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingNoticia({
                        id: '',
                        slug: '',
                        titulo: '',
                        resumen: '',
                        contenido: '',
                        imagenPortada: '/images/noticias/xantolo.jpg',
                        autor: 'Equipo Editorial',
                        categoria: 'Cultura',
                        fecha: new Date().toISOString().split('T')[0],
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Noticia
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {noticias.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-900 flex flex-col"
                    >
                      <div className="h-44 relative overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <img
                          src={item.imagenPortada}
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 text-white">
                          {item.categoria}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <span className="text-xs text-surface-400 mb-1">{item.fecha}</span>
                        <h3 className="font-bold text-base text-surface-900 dark:text-white mb-2 line-clamp-2">
                          {item.titulo}
                        </h3>
                        <p className="text-xs text-surface-500 line-clamp-2 mb-4 flex-1">
                          {item.resumen}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
                          <button
                            onClick={() => setEditingNoticia(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-xs font-semibold text-surface-700 dark:text-surface-200"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteNoticia(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-xs font-semibold text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 2: GESTOR DE CALENDARIO
               ========================================== */}
            {activeTab === 'calendario' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                      Gestor del Calendario Cultural
                    </h2>
                    <p className="text-sm text-surface-500">
                      Agrega o modifica las festividades y eventos que se marcan en el calendario interactivo.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingEvento({
                        id: '',
                        nombre: '',
                        fecha: '2026-08-20',
                        municipio: 'San Luis Potosí',
                        descripcion: '',
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                  </button>
                </div>

                <div className="space-y-3">
                  {eventos.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            {ev.fecha}
                          </span>
                          <span className="text-xs font-semibold text-surface-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {ev.municipio}
                          </span>
                        </div>
                        <h3 className="font-bold text-surface-900 dark:text-white">{ev.nombre}</h3>
                        <p className="text-xs text-surface-500 mt-1">{ev.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingEvento(ev)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEvento(ev.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 3: GESTOR GASTRONÓMICO
               ========================================== */}
            {activeTab === 'gastronomia' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                      Gestor Gastronómico
                    </h2>
                    <p className="text-sm text-surface-500">
                      Administra los platillos típicos y bebidas tradicionales de las 4 regiones.
                    </p>
                  </div>
                  <button
                    onClick={() => openPlatilloModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Platillo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platillos.map((pl) => (
                    <div
                      key={pl.id}
                      className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-900 flex flex-col"
                    >
                      <div className="h-44 relative overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <img
                          src={pl.imagen}
                          alt={pl.nombre}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {pl.pueblo && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-600 text-white">
                              {pl.pueblo}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/70 text-white">
                            {pl.region}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-base text-surface-900 dark:text-white mb-1">
                          {pl.nombre}
                        </h3>
                        <p className="text-xs text-surface-500 line-clamp-2 mb-3 flex-1">
                          {pl.descripcion}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {pl.ingredientes.slice(0, 3).map((ing) => (
                            <span
                              key={ing}
                              className="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-[10px] text-surface-600 dark:text-surface-300"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-100 dark:border-surface-800">
                          <button
                            onClick={() => openPlatilloModal(pl)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeletePlatillo(pl.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 4: GESTOR DE MERCADO POTOSINO
               ========================================== */}
            {activeTab === 'mercado' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                      Gestor del Mercado Potosino (Artesanías)
                    </h2>
                    <p className="text-sm text-surface-500">
                      Agrega nuevas piezas artesanales, actualiza sus precios o talleres artesanos.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setEditingProducto({
                        id: '',
                        nombre: '',
                        descripcion: '',
                        categoria: 'Artesanías',
                        precio: 450,
                        imagenUrl: '/artesanias/rebozo.jpg',
                        artesano: '',
                      })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Artesanía
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.map((prod) => (
                    <div
                      key={prod.id}
                      className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-900 flex flex-col"
                    >
                      <div className="h-44 relative overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <img
                          src={prod.imagenUrl}
                          alt={prod.nombre}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/70 text-white">
                          {prod.categoria}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <span className="text-xs text-surface-400">{prod.artesano}</span>
                        <h3 className="font-bold text-base text-surface-900 dark:text-white mb-1">
                          {prod.nombre}
                        </h3>
                        <p className="text-xs text-surface-500 line-clamp-2 mb-3 flex-1">
                          {prod.descripcion}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800">
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            ${Number(prod.precio).toFixed(2)} MXN
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProducto(prod)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProducto(prod.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 5: GESTOR DE TOURS
               ========================================== */}
            {activeTab === 'tours' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                      Gestor de Tours y Experiencias
                    </h2>
                    <p className="text-sm text-surface-500">
                      Configura las excursiones reservables, precios, duración y nivel de dificultad.
                    </p>
                  </div>
                  <button
                    onClick={() => openTourModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Tour
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-900 flex flex-col"
                    >
                      <div className="h-44 relative overflow-hidden bg-surface-100 dark:bg-surface-800">
                        <img
                          src={t.imagen}
                          alt={t.titulo}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-black/70 text-white">
                          {t.tipo} • {t.region}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <span className="text-xs text-surface-400">
                          {t.pueblo} • {t.duracion}
                        </span>
                        <h3 className="font-bold text-base text-surface-900 dark:text-white mb-1">
                          {t.titulo}
                        </h3>
                        <p className="text-xs text-surface-500 line-clamp-2 mb-3 flex-1">
                          {t.descripcion}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            ${t.precio} MXN
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openTourModal(t)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTour(t.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 6: MODERACIÓN DE COMUNIDAD
               ========================================== */}
            {activeTab === 'moderacion' && (
              <div className="space-y-10">
                {/* Fotos subidas por la comunidad */}
                <div>
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
                    Fotografías Subidas por Usuarios ({communityPhotos.length})
                  </h2>
                  <p className="text-sm text-surface-500 mb-6">
                    Supervisa o elimina fotografías compartidas por visitantes en Spots Fotográficos.
                  </p>

                  {communityPhotos.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-surface-100/60 dark:bg-surface-800/40 text-center text-sm text-surface-500">
                      No hay fotografías comunitarias subidas por el momento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {communityPhotos.map((ph) => (
                        <div
                          key={ph.id}
                          className="rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-900 flex flex-col"
                        >
                          <div className="h-40 relative">
                            <img
                              src={ph.src}
                              alt={ph.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-surface-900 dark:text-white">
                                {ph.title}
                              </h4>
                              <p className="text-xs text-surface-500">
                                {ph.location} • Por {ph.authorName}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteSpotPhoto(ph.id)}
                              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar foto
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reseñas de Pueblos Mágicos */}
                <div className="pt-6 border-t border-surface-200 dark:border-surface-800">
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
                    Reseñas de Pueblos Mágicos ({reviews.length})
                  </h2>
                  <p className="text-sm text-surface-500 mb-6">
                    Revisa y modera los comentarios dejados por usuarios en las páginas de destino.
                  </p>

                  {reviews.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-surface-100/60 dark:bg-surface-800/40 text-center text-sm text-surface-500">
                      No se encontraron reseñas registradas en Firestore.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-surface-900 dark:text-white">
                                {rev.userName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">
                                Destino: {rev.targetId}
                              </span>
                              <span className="flex items-center text-amber-400 text-xs">
                                <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> {rev.rating}
                              </span>
                            </div>
                            <p className="text-xs text-surface-600 dark:text-surface-300">
                              {rev.comment}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-semibold text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: CREAR / EDITAR NOTICIA
         ========================================================= */}
      <AnimatePresence>
        {editingNoticia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 p-6 sm:p-8 border border-surface-200 dark:border-surface-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingNoticia(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">
                {editingNoticia.id ? 'Editar Noticia' : 'Nueva Noticia'}
              </h3>
              <form onSubmit={handleSaveNoticia} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={editingNoticia.titulo}
                    onChange={(e) =>
                      setEditingNoticia({ ...editingNoticia, titulo: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Categoría</label>
                    <select
                      value={editingNoticia.categoria}
                      onChange={(e) =>
                        setEditingNoticia({ ...editingNoticia, categoria: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    >
                      <option value="Cultura">Cultura</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Naturaleza">Naturaleza</option>
                      <option value="Gastronomía">Gastronomía</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Fecha</label>
                    <input
                      type="date"
                      value={editingNoticia.fecha}
                      onChange={(e) =>
                        setEditingNoticia({ ...editingNoticia, fecha: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Autor</label>
                  <input
                    type="text"
                    value={editingNoticia.autor}
                    onChange={(e) =>
                      setEditingNoticia({ ...editingNoticia, autor: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Resumen breve *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingNoticia.resumen}
                    onChange={(e) =>
                      setEditingNoticia({ ...editingNoticia, resumen: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Contenido Completo *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingNoticia.contenido}
                    onChange={(e) =>
                      setEditingNoticia({ ...editingNoticia, contenido: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Imagen de Portada
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingNoticia.imagenPortada}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Subir imagen desde mi equipo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] || null, (url) =>
                            setEditingNoticia({ ...editingNoticia, imagenPortada: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingNoticia(null)}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-100 dark:bg-surface-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white"
                  >
                    Guardar Noticia
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MODAL 2: CREAR / EDITAR EVENTO DEL CALENDARIO
         ========================================================= */}
      <AnimatePresence>
        {editingEvento && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl bg-white dark:bg-surface-900 p-6 sm:p-8 border border-surface-200 dark:border-surface-700 shadow-2xl"
            >
              <button
                onClick={() => setEditingEvento(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">
                {editingEvento.id ? 'Editar Evento' : 'Nuevo Evento del Calendario'}
              </h3>
              <form onSubmit={handleSaveEvento} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Nombre del Evento / Festividad *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvento.nombre}
                    onChange={(e) =>
                      setEditingEvento({ ...editingEvento, nombre: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Fecha Exacta *</label>
                  <input
                    type="date"
                    required
                    value={editingEvento.fecha}
                    onChange={(e) =>
                      setEditingEvento({ ...editingEvento, fecha: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Municipio / Región *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvento.municipio}
                    onChange={(e) =>
                      setEditingEvento({ ...editingEvento, municipio: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Descripción *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingEvento.descripcion}
                    onChange={(e) =>
                      setEditingEvento({ ...editingEvento, descripcion: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingEvento(null)}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-100 dark:bg-surface-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white"
                  >
                    Guardar Evento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MODAL 3: CREAR / EDITAR PLATILLO GASTRONÓMICO
         ========================================================= */}
      <AnimatePresence>
        {editingPlatillo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 p-6 sm:p-8 border border-surface-200 dark:border-surface-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingPlatillo(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">
                {editingPlatillo.id ? 'Editar Platillo' : 'Nuevo Platillo Gastronómico'}
              </h3>
              <form onSubmit={handleSavePlatillo} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Nombre del Platillo o Bebida *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlatillo.nombre}
                    onChange={(e) =>
                      setEditingPlatillo({ ...editingPlatillo, nombre: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Región</label>
                    <select
                      value={editingPlatillo.region}
                      onChange={(e) =>
                        setEditingPlatillo({ ...editingPlatillo, region: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    >
                      <option value="Huasteca">Huasteca</option>
                      <option value="Altiplano">Altiplano</option>
                      <option value="Centro">Centro</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      Pueblo Mágico / Municipio
                    </label>
                    <input
                      type="text"
                      value={editingPlatillo.pueblo || ''}
                      onChange={(e) =>
                        setEditingPlatillo({ ...editingPlatillo, pueblo: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Descripción *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingPlatillo.descripcion}
                    onChange={(e) =>
                      setEditingPlatillo({ ...editingPlatillo, descripcion: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Ingredientes Clave (separados por coma) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Masa de maíz, Chile ancho, Queso fresco"
                    value={ingredientesText}
                    onChange={(e) => setIngredientesText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Fotografía del Platillo
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingPlatillo.imagen}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Subir foto desde mi equipo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] || null, (url) =>
                            setEditingPlatillo({ ...editingPlatillo, imagen: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingPlatillo(null)}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-100 dark:bg-surface-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white"
                  >
                    Guardar Platillo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MODAL 4: CREAR / EDITAR ARTESANÍA (MERCADO POTOSINO)
         ========================================================= */}
      <AnimatePresence>
        {editingProducto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 p-6 sm:p-8 border border-surface-200 dark:border-surface-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingProducto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">
                {editingProducto.id ? 'Editar Artesanía' : 'Nueva Artesanía'}
              </h3>
              <form onSubmit={handleSaveProducto} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Nombre de la Artesanía *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProducto.nombre}
                    onChange={(e) =>
                      setEditingProducto({ ...editingProducto, nombre: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Categoría</label>
                    <select
                      value={editingProducto.categoria}
                      onChange={(e) =>
                        setEditingProducto({ ...editingProducto, categoria: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    >
                      <option value="Textiles">Textiles</option>
                      <option value="Artesanías">Artesanías</option>
                      <option value="Talla en Madera">Talla en Madera</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Precio (MXN) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      step="0.01"
                      value={editingProducto.precio}
                      onChange={(e) =>
                        setEditingProducto({
                          ...editingProducto,
                          precio: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Maestro Artesano / Taller *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProducto.artesano}
                    onChange={(e) =>
                      setEditingProducto({ ...editingProducto, artesano: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Descripción *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProducto.descripcion}
                    onChange={(e) =>
                      setEditingProducto({ ...editingProducto, descripcion: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Fotografía del Producto
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingProducto.imagenUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Subir foto desde mi equipo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] || null, (url) =>
                            setEditingProducto({ ...editingProducto, imagenUrl: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProducto(null)}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-100 dark:bg-surface-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white"
                  >
                    Guardar Artesanía
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MODAL 5: CREAR / EDITAR TOUR
         ========================================================= */}
      <AnimatePresence>
        {editingTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 p-6 sm:p-8 border border-surface-200 dark:border-surface-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingTour(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-800"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xl font-bold mb-4 text-surface-900 dark:text-white">
                {editingTour.id ? 'Editar Tour' : 'Nuevo Tour'}
              </h3>
              <form onSubmit={handleSaveTour} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Título del Tour *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTour.titulo}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, titulo: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Región</label>
                    <select
                      value={editingTour.region}
                      onChange={(e) =>
                        setEditingTour({ ...editingTour, region: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    >
                      <option value="Huasteca">Huasteca</option>
                      <option value="Altiplano">Altiplano</option>
                      <option value="Centro">Centro</option>
                      <option value="Media">Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Pueblo Mágico *</label>
                    <input
                      type="text"
                      required
                      value={editingTour.pueblo}
                      onChange={(e) =>
                        setEditingTour({ ...editingTour, pueblo: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Precio (MXN)</label>
                    <input
                      type="number"
                      required
                      value={editingTour.precio}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          precio: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Duración</label>
                    <input
                      type="text"
                      required
                      value={editingTour.duracion}
                      onChange={(e) =>
                        setEditingTour({ ...editingTour, duracion: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Tipo</label>
                    <select
                      value={editingTour.tipo}
                      onChange={(e) =>
                        setEditingTour({
                          ...editingTour,
                          tipo: e.target.value as Tour['tipo'],
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                    >
                      <option value="Aventura">Aventura</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Gastronómico">Gastronómico</option>
                      <option value="Relax">Relax</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Qué incluye (separado por comas)
                  </label>
                  <input
                    type="text"
                    value={incluyeText}
                    onChange={(e) => setIncluyeText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Descripción *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingTour.descripcion}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, descripcion: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Imagen del Tour</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingTour.imagen}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-amber-100 text-xs font-semibold">
                      <Upload className="w-4 h-4" /> Subir foto desde mi equipo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] || null, (url) =>
                            setEditingTour({ ...editingTour, imagen: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingTour(null)}
                    className="px-4 py-2 rounded-xl text-sm bg-surface-100 dark:bg-surface-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white"
                  >
                    Guardar Tour
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
