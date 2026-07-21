'use client';

import { motion } from 'framer-motion';
import { Camera, MapPin, Instagram } from 'lucide-react';

const photos = [
  { id: 1, src: '/images/cascada_tamul_1784665879590.png', title: 'Cascada de Tamul', location: 'Aquismón', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-2' },
  { id: 2, src: '/images/jardin_surrealista_1784665889348.png', title: 'Jardín Surrealista', location: 'Xilitla', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { id: 3, src: '/images/real-de-catorce.jpg', title: 'Pueblo Fantasma', location: 'Real de Catorce', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { id: 4, src: '/images/parajes/laguna-media-luna.png', title: 'Media Luna', location: 'Rioverde', colSpan: 'col-span-1', rowSpan: 'row-span-2' },
  { id: 5, src: '/images/parajes/cascadas-minas-viejas.png', title: 'Minas Viejas', location: 'El Naranjo', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { id: 6, src: '/images/parajes/sotano-de-las-golondrinas.png', title: 'Sótano de las Golondrinas', location: 'Aquismón', colSpan: 'col-span-1 md:col-span-2', rowSpan: 'row-span-1' },
  { id: 7, src: '/images/santa-maria-del-rio.jpg', title: 'Capital del Rebozo', location: 'Santa María del Río', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
];

export default function GaleriaPage() {
  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
            <Camera className="w-8 h-8 text-blue-700 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Spots Fotográficos
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Inspírate con los rincones más instagrameables del estado. 
            Prepara tu cámara para capturar la magia de San Luis Potosí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 md:gap-6">
          {photos.map((photo, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={photo.id}
              className={`relative rounded-2xl overflow-hidden group ${photo.colSpan} ${photo.rowSpan}`}
            >
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-1">
                  {photo.title}
                </h3>
                <div className="flex items-center justify-between text-white/80">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin className="w-4 h-4" /> {photo.location}
                  </span>
                  <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors">
                    <Instagram className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
