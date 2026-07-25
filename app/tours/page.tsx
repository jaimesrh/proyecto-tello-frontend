"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, DollarSign, Filter, CheckCircle2 } from "lucide-react";
import { tours, Tour } from "@/lib/tours";
import BookingModal from "@/components/BookingModal";

export default function ToursPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Todas");
  const [selectedType, setSelectedType] = useState("Todos");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const regiones = ["Todas", "Centro", "Altiplano", "Media", "Huasteca"];
  const tipos = ["Todos", "Aventura", "Cultural", "Gastronómico", "Relax"];

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tour.pueblo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "Todas" || tour.region === selectedRegion;
    const matchesType = selectedType === "Todos" || tour.tipo === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const openBooking = (tour: Tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          >
            Explora San Luis Potosí
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Descubre experiencias únicas en las 4 regiones. Aventura, cultura, gastronomía y relajación te esperan.
          </motion.p>
        </div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o pueblo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[140px]"
            >
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-w-[140px]"
            >
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={tour.imagen} 
                  alt={tour.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {tour.tipo}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
                  {tour.region}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" /> {tour.pueblo}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                  {tour.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {tour.descripcion}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                  <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3" /> {tour.duracion}
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Dificultad {tour.dificultad}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Precio por persona</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ${tour.precio}
                    </span>
                  </div>
                  <button 
                    onClick={() => openBooking(tour)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-500">No se encontraron tours</h3>
            <p className="text-gray-400 mt-2">Intenta ajustar los filtros o término de búsqueda.</p>
          </div>
        )}

      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tour={selectedTour} 
      />
    </div>
  );
}
