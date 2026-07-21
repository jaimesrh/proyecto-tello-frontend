'use client';

import { motion } from 'framer-motion';
import { Utensils, ChefHat } from 'lucide-react';
import { gastronomiaData } from '@/lib/gastronomia';

export default function GastronomiaPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl mb-6">
            <Utensils className="w-8 h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Sabores de San Luis Potosí
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Desde el gigantesco Zacahuil huasteco hasta el asado de boda del altiplano. 
            Descubre la herencia culinaria que hace a San Luis Potosí un destino delicioso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {gastronomiaData.map((platillo, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={platillo.id} 
              className="glass-panel overflow-hidden group flex flex-col"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={platillo.imagen} 
                  alt={platillo.nombre} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold tracking-wider uppercase">
                  {platillo.region}
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-display font-bold text-amber-900 dark:text-amber-400 mb-3">
                  {platillo.nombre}
                </h2>
                <p className="text-stone-600 dark:text-stone-300 mb-6 flex-grow">
                  {platillo.descripcion}
                </p>
                
                <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl mt-auto">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    Ingredientes Clave
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {platillo.ingredientes.map(ing => (
                      <span key={ing} className="px-2 py-1 bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs rounded-md shadow-sm border border-stone-200 dark:border-stone-600">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
