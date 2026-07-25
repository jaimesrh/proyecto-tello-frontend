'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Info, XCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getReservaciones,
  cancelReservacion,
  type Reservacion,
} from '@/lib/firebaseFirestore';
import Link from 'next/link';

export default function AgendaPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Reservacion[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getReservaciones(user.uid)
      .then((data) => {
        // Sort by closest date
        const sorted = [...data].sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        setBookings(sorted);
      })
      .finally(() => setFetching(false));
  }, [user]);

  const handleCancel = async (reservaId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reservación?')) return;
    await cancelReservacion(reservaId);
    setBookings((prev) => prev.filter((b) => b.id !== reservaId));
  };

  // Loading de autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No está autenticado
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm max-w-md">
          <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Inicia sesión para ver tu agenda
          </h2>
          <p className="text-gray-500 mb-6">
            Necesitas una cuenta para ver y gestionar tus tours reservados.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Ir al inicio y conectarse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Mi Agenda de Viajes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Hola <span className="font-semibold text-blue-600">{user.nombre}</span> — tus próximas aventuras en San Luis Potosí
          </motion.p>
        </div>

        {fetching ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-sm">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Aún no tienes tours agendados
            </h2>
            <p className="text-gray-500 mb-6">
              Explora nuestro catálogo y comienza a planear tu viaje.
            </p>
            <Link
              href="/tours"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Ver Catálogo de Tours
            </Link>
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-200 dark:border-blue-900 ml-4 md:ml-8 space-y-12">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-8 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-white dark:ring-gray-950" />

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={booking.tourImagen}
                        alt={booking.tourTitulo}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
                        {new Date(booking.fecha).toLocaleDateString('es-MX', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    <div className="p-6 md:w-2/3 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {booking.tourTitulo}
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          Confirmada
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4" /> {booking.tourPueblo}, Región {booking.tourRegion}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl flex items-center gap-3">
                          <Users className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Pasajeros</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{booking.personas}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl flex items-center gap-3">
                          <Info className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Total Pagado</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ${booking.precio?.toLocaleString('es-MX')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {booking.notas && (
                        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl text-sm">
                          <strong>Notas: </strong> {booking.notas}
                        </div>
                      )}

                      <div className="mt-auto flex gap-4">
                        <button
                          onClick={() => booking.id && handleCancel(booking.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition"
                        >
                          <XCircle className="w-4 h-4" /> Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
