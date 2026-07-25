"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, FileText } from "lucide-react";
import { Tour } from "@/lib/tours";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ tour, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const [fecha, setFecha] = useState("");
  const [pasajeros, setPasajeros] = useState(1);
  const [notas, setNotas] = useState("");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour || !fecha) return;

    const newBooking = {
      id: crypto.randomUUID(),
      tour,
      fecha,
      pasajeros,
      notas,
      estado: "Confirmada",
      fechaReserva: new Date().toISOString()
    };

    const existingBookings = JSON.parse(localStorage.getItem("tours_agenda") || "[]");
    localStorage.setItem("tours_agenda", JSON.stringify([...existingBookings, newBooking]));

    onClose();
    router.push("/agenda");
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
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4" /> Fecha de Reserva
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
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
                    ${(tour.precio * pasajeros).toLocaleString("es-MX")}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
