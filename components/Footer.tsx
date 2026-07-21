import Link from 'next/link';
import { Leaf, Map, Utensils, Camera, CalendarDays, Compass } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold tracking-tight text-amber-900 dark:text-amber-500">
                Conoce San Luis Potosí
              </h2>
            </Link>
            <p className="mt-4 text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              Explora la riqueza cultural, natural y gastronómica del estado de San Luis Potosí. 
              Descubre experiencias únicas desde la Huasteca hasta el Altiplano.
            </p>
          </div>

          {/* Enlaces Explorar */}
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Explorar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/directorio" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Map className="w-4 h-4" /> Directorio de Parajes
                </Link>
              </li>
              <li>
                <Link href="/itinerarios" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Compass className="w-4 h-4" /> Itinerarios Sugeridos
                </Link>
              </li>
              <li>
                <Link href="/gastronomia" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Utensils className="w-4 h-4" /> Gastronomía
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces Multimedia / Sostenibilidad */}
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Descubrir</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/galeria" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Spots Fotográficos
                </Link>
              </li>
              <li>
                <Link href="/calendario" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Eventos
                </Link>
              </li>
              <li>
                <Link href="/eco-guia" className="text-sm text-stone-600 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Turismo Responsable
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            &copy; {currentYear} Conoce San Luis Potosí. Desarrollado para promover el turismo sostenible.
          </p>
          <div className="flex gap-4">
            <Link href="/comparativo" className="text-xs text-stone-500 hover:text-amber-700 dark:text-stone-500 dark:hover:text-amber-400 transition-colors">
              Análisis Comparativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
