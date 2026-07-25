"use client";

import React, { useState } from "react";
import { useAuth, Region } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { LogOut, MapPin, Bell, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { user, logout, updatePreferences, markNotificationsAsRead } = useAuth();
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<Region>(user?.regionFavorita || "");
  const [saveMessage, setSaveMessage] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <h1 className="mb-4 font-serif text-3xl font-bold text-surface-900 dark:text-surface-50">
          Inicia sesión para ver tu perfil
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Usa el botón "Ingresar" en el menú principal.
        </p>
      </div>
    );
  }

  const handleSavePreferences = () => {
    updatePreferences(selectedRegion);
    setSaveMessage("¡Preferencias actualizadas! Ahora verás eventos de esta región.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="font-serif text-4xl font-bold text-surface-900 dark:text-surface-50">
            Hola, {user.nombre}
          </h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Gestiona tus preferencias, notificaciones e itinerarios.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-surface-100 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:bg-surface-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Columna Izquierda: Preferencias */}
        <div className="col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
          >
            <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-500">
              <MapPin className="h-5 w-5" />
              <h2 className="font-semibold text-surface-900 dark:text-surface-50">Región Favorita</h2>
            </div>
            <p className="mb-4 text-sm text-surface-600 dark:text-surface-400">
              Selecciona tu región preferida para recibir recomendaciones personalizadas y notificaciones de eventos.
            </p>
            <div className="space-y-3">
              {(["Huasteca", "Centro", "Altiplano", "Media"] as Region[]).map((region) => (
                <label
                  key={region}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    selectedRegion === region
                      ? "border-centro-500 bg-centro-50 dark:border-centro-500 dark:bg-centro-900/20"
                      : "border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600"
                  }`}
                >
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{region}</span>
                  <input
                    type="radio"
                    name="region"
                    value={region}
                    checked={selectedRegion === region}
                    onChange={() => setSelectedRegion(region)}
                    className="h-4 w-4 text-centro-600 focus:ring-centro-500"
                  />
                </label>
              ))}
            </div>
            <button
              onClick={handleSavePreferences}
              className="mt-6 w-full rounded-xl bg-centro-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-centro-700"
            >
              Guardar Preferencias
            </button>
            {saveMessage && (
              <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {saveMessage}
              </p>
            )}
          </motion.div>
        </div>

        {/* Columna Derecha: Notificaciones e Itinerarios */}
        <div className="col-span-1 space-y-8 md:col-span-2">
          {/* Notificaciones */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Bell className="h-5 w-5" />
                <h2 className="font-semibold text-surface-900 dark:text-surface-50">Notificaciones Activas</h2>
              </div>
              <button
                onClick={markNotificationsAsRead}
                className="text-sm font-medium text-centro-600 hover:text-centro-700 dark:text-centro-400"
              >
                Marcar todas leídas
              </button>
            </div>
            
            {user.notificaciones.length === 0 ? (
              <p className="text-sm text-surface-500 dark:text-surface-400">No tienes notificaciones pendientes.</p>
            ) : (
              <div className="space-y-4">
                {user.notificaciones.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 rounded-xl p-4 transition-colors ${
                      n.read ? "bg-surface-50 dark:bg-surface-900/50" : "bg-blue-50 dark:bg-blue-900/10 ring-1 ring-blue-100 dark:ring-blue-900/30"
                    }`}
                  >
                    {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${!n.read ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'}`}>
                        {n.title}
                      </p>
                      <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">
                        {n.message}
                      </p>
                      <p className="mt-2 text-xs text-surface-400 dark:text-surface-500">
                        {new Date(n.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Itinerarios */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
          >
            <div className="mb-6 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Compass className="h-5 w-5" />
              <h2 className="font-semibold text-surface-900 dark:text-surface-50">Mis Itinerarios</h2>
            </div>
            
            {user.toursReservados.length === 0 ? (
              <div className="rounded-xl border border-dashed border-surface-300 p-8 text-center dark:border-surface-600">
                <p className="mb-4 text-surface-600 dark:text-surface-400">
                  Aún no has agendado ningún itinerario.
                </p>
                <Link
                  href="/itinerarios"
                  className="inline-flex items-center justify-center rounded-xl bg-surface-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-100"
                >
                  Explorar Itinerarios
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {user.toursReservados.map((tour, idx) => (
                  <li key={idx} className="rounded-lg bg-surface-50 p-4 dark:bg-surface-900/50">
                    <p className="font-medium text-surface-900 dark:text-surface-50">{tour}</p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
