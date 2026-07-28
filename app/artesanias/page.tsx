"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Filter, Search, ChevronRight } from 'lucide-react';
import { productos, Producto } from '@/lib/productos';
import Image from 'next/image';

const CATEGORIES = ["Todos", "Textiles", "Artesanías", "Talla en Madera"];

export default function ArtesaniasPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return productos.filter((prod) => {
      const matchCategory = selectedCategory === "Todos" || prod.categoria === selectedCategory;
      const matchSearch = prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=2000"
            alt="Artesanías de México"
            className="w-full h-full object-cover opacity-90 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 drop-shadow-sm"
          >
            Mercado Potosino
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Descubre y apoya el talento local. Lleva a casa la auténtica esencia de San Luis Potosí a través de sus texturas y creaciones.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-md mx-auto"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-full leading-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all shadow-lg"
              placeholder="Buscar productos, artesanos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Categorías</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 dark:bg-amber-500 dark:shadow-amber-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No se encontraron productos</h3>
            <p className="text-slate-500 dark:text-slate-400">Intenta con otra búsqueda o categoría.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="mt-6 text-amber-600 dark:text-amber-500 font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ producto }: { producto: Producto }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative h-64 overflow-hidden w-full">
        <img
          src={producto.imagenUrl}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold text-amber-700 dark:text-amber-500 rounded-full shadow-sm uppercase tracking-wider">
            {producto.categoria}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{producto.artesano}</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
            {producto.nombre}
          </h3>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
          {producto.descripcion}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precio</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              ${producto.precio.toFixed(2)}
            </span>
          </div>
          
          <button className="flex items-center justify-center bg-slate-900 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white p-3 rounded-2xl transition-colors group/btn">
            <ShoppingBag className="w-5 h-5 mr-0 group-hover/btn:hidden block" />
            <span className="hidden group-hover/btn:block font-medium px-2">Comprar</span>
            <ChevronRight className="w-5 h-5 hidden group-hover/btn:block" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
