import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold tracking-tight text-amber-900 dark:text-amber-500">
                Pueblos Magicos SLP
              </h2>
            </Link>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 max-w-xs">
              Explora la riqueza cultural, natural y sostenible de los 6 Pueblos Magicos del estado de San Luis Potosi.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="/" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors">
              Inicio
            </Link>
            <Link href="/#region-map" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors">
              Explorar Regiones
            </Link>
            <Link href="/comparativo" className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors">
              Análisis Comparativo
            </Link>
          </div>

          <div className="text-left md:text-right text-sm text-stone-500 dark:text-stone-400">
            <p>&copy; {currentYear} Pueblos Magicos SLP.</p>
            <p className="mt-1">Desarrollado para promover el turismo sostenible.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
