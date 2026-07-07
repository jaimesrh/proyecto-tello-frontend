import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import TabSystem from '@/components/TabSystem';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const pueblo = await api.getPueblo(resolvedParams.id);

  if (!pueblo) {
    return {
      title: 'Pueblo No Encontrado',
    };
  }

  return {
    title: `${pueblo.nombre} | Pueblos Magicos SLP`,
    description: pueblo.descripcionBreve,
  };
}

export default async function PuebloPage({ params }: Props) {
  const resolvedParams = await params;
  const pueblo = await api.getPueblo(resolvedParams.id);

  if (!pueblo) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section del Pueblo */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {pueblo.imagenUrl ? (
          <Image
            src={pueblo.imagenUrl}
            alt={`Fotografia representativa de ${pueblo.nombre}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-stone-300 dark:bg-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 w-full pb-12">
            <Link 
              href="/#region-map"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al mapa
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white shadow-sm"
                style={{ backgroundColor: pueblo.region?.colorHex || '#57534e' }}
              >
                Region {pueblo.region?.nombre}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {pueblo.nombre}
            </h1>
            
            <p className="text-stone-200 text-lg md:text-xl max-w-2xl drop-shadow-md leading-relaxed">
              {pueblo.descripcionBreve}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <TabSystem pueblo={pueblo} />
      </div>
    </div>
  );
}
