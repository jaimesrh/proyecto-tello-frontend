export interface Ruta {
  id: string;
  titulo: string;
  duracionDias: number;
  tipo: 'Aventura' | 'Cultura' | 'Relajación' | 'Familiar';
  descripcion: string;
  paradas: string[];
}

export const rutasData: Ruta[] = [
  {
    id: 'huasteca-extrema',
    titulo: 'Huasteca Extrema',
    duracionDias: 3,
    tipo: 'Aventura',
    descripcion: 'Tres días de adrenalina pura recorriendo los abismos y cascadas más impresionantes de México.',
    paradas: ['Día 1: Sótano de las Golondrinas (Amanecer)', 'Día 2: Navegación a Cascada de Tamul', 'Día 3: Rafting en Río Tampaón']
  },
  {
    id: 'misticismo-desierto',
    titulo: 'Misticismo en el Desierto',
    duracionDias: 2,
    tipo: 'Cultura',
    descripcion: 'Un viaje en el tiempo a través de túneles oscuros para emerger en un pueblo fantasma y montañas sagradas.',
    paradas: ['Día 1: Túnel de Ogarrio y Pueblo Fantasma', 'Día 2: Paseo en Willys al Desierto de Wirikuta']
  },
  {
    id: 'ruta-del-rebozo',
    titulo: 'Ruta del Rebozo y Aguas Termales',
    duracionDias: 2,
    tipo: 'Relajación',
    descripcion: 'Perfecto para desconectar. Conoce la historia textil de SLP y relájate en aguas termales sulfurosas.',
    paradas: ['Día 1: Casa del Rebozo en Santa María del Río', 'Día 2: Balneario de Aguas Termales de Lourdes']
  },
  {
    id: 'huasteca-surrealista',
    titulo: 'Huasteca Surrealista',
    duracionDias: 2,
    tipo: 'Cultura',
    descripcion: 'Descubre cómo la selva devora estructuras de concreto en un sueño arquitectónico sin igual.',
    paradas: ['Día 1: Xilitla y Jardín Escultórico de Edward James', 'Día 2: Museo Leonora Carrington']
  }
];
