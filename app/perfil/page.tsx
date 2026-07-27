'use client';

import React, { useState } from 'react';
import { useAuth, Region } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, MapPin, Bell, Compass } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PassportGrid from '@/components/PassportGrid';

export default function PerfilPage() {
  const { user, logout, updatePreferences } = useAuth();
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<Region>(user?.regionFavorita || '');
  const [saveMessage, setSaveMessage] = useState('');

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <h1 className="mb-4 font-serif text-3xl font-bold text-surface-900 dark:text-surface-50">
          Inicia sesión para ver tu perfil
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Usa el botón &quot;Ingresar&quot; en el menú principal.
        </p>
      </div>
    );
  }

  const handleSavePreferences = async () => {
    await updatePreferences(selectedRegion);
    setSaveMessage('¡Preferencias actualizadas! Ahora verás eventos de esta región.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
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
            Gestiona tus preferencias e itinerarios de viaje.
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
              {(['Huasteca', 'Centro', 'Altiplano', 'Media'] as Region[]).map((region) => (
                <label
                  key={region}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    selectedRegion === region
                      ? 'border-centro-500 bg-centro-50 dark:border-centro-500 dark:bg-centro-900/20'
                      : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600'
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

          {/* Cuenta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
          >
            <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Bell className="h-5 w-5" />
              <h2 className="font-semibold text-surface-900 dark:text-surface-50">Mi Cuenta</h2>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-1">Correo registrado:</p>
            <p className="text-sm font-semibold text-surface-800 dark:text-surface-100">{user.email}</p>
            <p className="text-xs text-surface-400 mt-3 italic">
              Autenticado con Firebase Authentication
            </p>
          </motion.div>
        </div>

        {/* Columna Derecha: Itinerarios */}
        <div className="col-span-1 space-y-8 md:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-200 dark:bg-surface-800 dark:ring-surface-700"
          >
            <div className="mb-6 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Compass className="h-5 w-5" />
              <h2 className="font-semibold text-surface-900 dark:text-surface-50">Mis Tours Agendados</h2>
            </div>

            <div className="rounded-xl border border-dashed border-surface-300 p-8 text-center dark:border-surface-600">
              <p className="mb-4 text-surface-600 dark:text-surface-400">
                Consulta y gestiona todos tus tours reservados en la sección de Agenda.
              </p>
              <Link
                href="/agenda"
                className="inline-flex items-center justify-center rounded-xl bg-surface-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-800 dark:bg-white dark:text-surface-900 dark:hover:bg-surface-100"
              >
                Ver Mi Agenda
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gamification Passport Section */}
      <div className="mt-12">
        <PassportGrid userId={user.uid} />
      </div>
    </div>
  );
}
