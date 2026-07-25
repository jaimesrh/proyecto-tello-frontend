'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, FileText } from 'lucide-react';
import { Tour } from '@/lib/tours';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addReservacion } from '@/lib/firebaseFirestore';

interface BookingModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [fecha, setFecha] = useState('');
  const [pasajeros, setPasajeros] = useState(1);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour || !fecha) return;

    if (!user) {
      setErrorMsg('Debes iniciar sesión para reservar un tour.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await addReservacion({
        userId: user.uid,
        tourId: tour.id,
        tourTitulo: tour.titulo,
        tourImagen: tour.imagen,
        tourRegion: tour.region,
        tourPueblo: tour.pueblo,
        fecha,
        personas: pasajeros,
        notas,
        precio: tour.precio * pasajeros,
        estado: 'confirmada',
      });

      onClose();
      router.push('/agenda');
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo guardar la reserva. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && tour && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="relative h-32 bg-gray-200 dark:bg-gray-800">
              <img src={tour.imagen} alt={tour.titulo} className="w-full h-full object-cover opacity-80" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white shadow-sm">{tour.titulo}</h3>
              </div>
            </div>

            <form onSubmit={handleBooking} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm dark:bg-red-900/30 dark:border-red-700 dark:text-red-300">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4" /> Fecha de Reserva
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Users className="w-4 h-4" /> Pasajeros
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={pasajeros}
                  onChange={(e) => setPasajeros(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FileText className="w-4 h-4" /> Notas adicionales
                </label>
                <textarea
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Alergias, requerimientos especiales..."
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total a pagar</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${(tour.precio * pasajeros).toLocaleString('es-MX')}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition disabled:opacity-60"
                >
                  {loading ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
