export interface Platillo {
  id: string;
  nombre: string;
  region: string;
  descripcion: string;
  ingredientes: string[];
  imagen: string;
}

export const gastronomiaData: Platillo[] = [
  {
    id: 'zacahuil',
    nombre: 'Zacahuil',
    region: 'Huasteca',
    descripcion: 'El rey de la gastronomía huasteca. Un tamal gigante envuelto en hojas de plátano que puede medir hasta 5 metros, cocido lentamente en horno de leña.',
    ingredientes: ['Masa martajada', 'Chile colorado', 'Carne de cerdo o guajolote', 'Hojas de plátano'],
    imagen: '/images/zacahuil_1784665862653.png'
  },
  {
    id: 'enchiladas-potosinas',
    nombre: 'Enchiladas Potosinas',
    region: 'Centro',
    descripcion: 'Icono de la capital del estado. Tortillas hechas con masa mezclada con chile ancho, rellenas de queso y servidas con crema y guacamole.',
    ingredientes: ['Masa de maíz', 'Chile ancho', 'Queso fresco', 'Cebolla', 'Crema'],
    imagen: '/images/enchiladas_potosinas_1784665870684.png'
  },
  {
    id: 'asado-de-boda',
    nombre: 'Asado de Boda',
    region: 'Altiplano',
    descripcion: 'Un guiso espeso y rico tradicionalmente servido en las celebraciones matrimoniales del desierto potosino.',
    ingredientes: ['Carne de cerdo', 'Chiles secos', 'Especias', 'Naranja', 'Chocolate'],
    imagen: '/images/tierra-nueva.jpg' // Placeholder
  },
  {
    id: 'bocoles',
    nombre: 'Bocoles',
    region: 'Huasteca',
    descripcion: 'Gorditas de masa mezcladas con manteca, cocidas en comal y rellenas de diferentes guisos.',
    ingredientes: ['Masa de maíz', 'Manteca', 'Frijoles refritos', 'Queso', 'Chicharrón'],
    imagen: '/images/aquismon.jpg' // Placeholder
  }
];
