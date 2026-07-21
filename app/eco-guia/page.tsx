'use client';

import { motion } from 'framer-motion';
import { Leaf, Droplets, Flame, Trash2, HeartHandshake, Tent } from 'lucide-react';

const ecoTips = [
  {
    icon: Droplets,
    title: 'Protege los Ríos y Cascadas',
    desc: 'Los ecosistemas acuáticos de la Huasteca son frágiles. Nunca uses bloqueador solar ni repelente de insectos químico antes de nadar. Opta por prendas con protección UV (rash guards).',
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  },
  {
    icon: Flame,
    title: 'Respeta lo Sagrado',
    desc: 'El desierto de Wirikuta en el Altiplano no es solo un paraje, es el territorio fundacional de la cultura Wixárika (Huichol). Respeta sus ceremonias, no extraigas peyote (es ilegal) ni dejes huella.',
    color: 'text-orange-500',
    bg: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800'
  },
  {
    icon: Trash2,
    title: 'Llévate tu Basura',
    desc: 'Muchos de los parajes más hermosos como Los Peroles o Estación Tablas no cuentan con servicios de recolección regulares. Si lo llevas en tu mochila, puede regresar en tu mochila.',
    color: 'text-stone-500',
    bg: 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
  },
  {
    icon: HeartHandshake,
    title: 'Apoya el Comercio Local',
    desc: 'Compra directamente a los artesanos (como los tejedores de rebozos en Santa María del Río). Pagar el precio justo ayuda a preservar oficios de más de cuatro siglos de antigüedad.',
    color: 'text-rose-500',
    bg: 'bg-rose-100 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800'
  },
  {
    icon: Tent,
    title: 'Respeta la Capacidad de Carga',
    desc: 'Sitios como el Sótano de las Golondrinas o el Jardín Surrealista tienen límites de visitantes. Ten paciencia si debes esperar, es por la conservación del lugar.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800'
  }
];

export default function EcoGuiaPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
            <Leaf className="w-8 h-8 text-green-700 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Guía de Turismo Responsable
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            El verdadero explorador no deja más huella que la de sus zapatos. 
            Conoce cómo disfrutar de San Luis Potosí cuidando su invaluable patrimonio natural y cultural.
          </p>
        </div>

        <div className="space-y-6">
          {ecoTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="glass-panel p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-lg transition-shadow"
              >
                <div className={`p-4 rounded-2xl border flex-shrink-0 ${tip.bg}`}>
                  <Icon className={`w-8 h-8 ${tip.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-green-900 rounded-3xl text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/images/xilitla.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Sé parte de la solución
            </h2>
            <p className="text-green-100 max-w-xl mx-auto mb-8">
              La conservación de los Pueblos Mágicos depende de todos. Comparte estos consejos 
              con tus compañeros de viaje.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
