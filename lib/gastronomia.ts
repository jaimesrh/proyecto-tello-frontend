export interface Platillo {
  id: string;
  nombre: string;
  region: string;
  pueblo?: string;
  descripcion: string;
  ingredientes: string[];
  imagen: string;
}

export const gastronomiaData: Platillo[] = [
  {
    id: 'zacahuil',
    nombre: 'Zacahuil Huasteco',
    region: 'Huasteca',
    pueblo: 'Aquismón',
    descripcion: 'El rey de la gastronomía huasteca. Un tamal gigante horneado lentamente bajo tierra o en horno de leña por más de 12 horas, envuelto en hojas de plátano con carne jugosa en salsa de chiles secos.',
    ingredientes: ['Masa martajada de maíz', 'Chile guajillo y ancho', 'Carne de cerdo o guajolote', 'Hojas de plátano'],
    imagen: '/images/zacahuil_1784665862653.png'
  },
  {
    id: 'bocoles',
    nombre: 'Bocoles Huastecos',
    region: 'Huasteca',
    pueblo: 'Aquismón',
    descripcion: 'Pequeñas y gruesas gorditas de masa de maíz amasadas con manteca de cerdo, cocidas en comal de barro y rellenas de frijoles negros, queso fresco o chicharrón prensado.',
    ingredientes: ['Masa de maíz', 'Manteca de cerdo', 'Frijoles negros refritos', 'Queso fresco de rancho'],
    imagen: '/images/bocoles.png'
  },
  {
    id: 'vino-de-jobo',
    nombre: 'Vino de Jobo',
    region: 'Huasteca',
    pueblo: 'Aquismón',
    descripcion: 'Bebida artesanal embriagante y agridulce producida mediante la fermentación natural de la ciruela amarilla silvestre de la selva (jobo) con piloncillo.',
    ingredientes: ['Fruto de Jobo silvestre', 'Piloncillo artesanal', 'Agua de manantial'],
    imagen: '/images/gastronomia/vino-de-jobo.jpg'
  },
  {
    id: 'enchiladas-huastecas-cecina',
    nombre: 'Enchiladas Huastecas con Cecina',
    region: 'Huasteca',
    pueblo: 'Xilitla',
    descripcion: 'Tortillas recién hechas bañadas en salsa verde de tomate serrano o salsa roja picante, servidas con queso fresco desmoronado y una sábana de cecina salada seada a la parrilla.',
    ingredientes: ['Tortillas de maíz', 'Salsa de tomate verde', 'Queso fresco', 'Cecina de res curada'],
    imagen: '/images/enchiladas_potosinas_1784665870684.png'
  },
  {
    id: 'pan-de-queso-xilitla',
    nombre: 'Pan de Queso de Xilitla',
    region: 'Huasteca',
    pueblo: 'Xilitla',
    descripcion: 'Pan dulce artesanal de montaña horneado a la leña, crujiente por fuera y esponjoso por dentro, relleno de suave queso fresco criollo.',
    ingredientes: ['Harina de trigo', 'Mantequilla de pueblo', 'Queso fresco salado', 'Levadura artesanal'],
    imagen: '/images/gastronomia/pan-de-queso-xilitla.jpg'
  },
  {
    id: 'cafe-altura-xilitla',
    nombre: 'Café de Altura de Xilitla',
    region: 'Huasteca',
    pueblo: 'Xilitla',
    descripcion: 'Café orgánico cultivado bajo sombra en las laderas neblinosas de la sierra huasteca. Destaca por su aroma pronunciado, cuerpo denso y notas de chocolate y especias.',
    ingredientes: ['Grano Arábica de altura', 'Piloncillo', 'Canela en raja'],
    imagen: '/images/gastronomia/cafe-altura-xilitla.jpg'
  },
  {
    id: 'asado-de-boda',
    nombre: 'Asado de Boda',
    region: 'Altiplano',
    pueblo: 'Real de Catorce',
    descripcion: 'Un festín ceremonial del desierto potosino. Trozos suaves de carne de cerdo bañados en un mole espeso de chiles secos, jugo de naranja criolla, especias y piloncillo.',
    ingredientes: ['Carne de cerdo', 'Chile ancho y pasilla', 'Cáscara y jugo de naranja', 'Chocolate obscuro'],
    imagen: '/images/asado_de_boda.png'
  },
  {
    id: 'queso-de-tuna',
    nombre: 'Queso de Tuna',
    region: 'Altiplano',
    pueblo: 'Real de Catorce',
    descripcion: 'Un postre ancestral 100% vegetal sin lácteos. Se elabora cociendo durante horas el jugo de la tuna cardona del nopal desértico hasta formar una pasta firme y acaramelada.',
    ingredientes: ['Jugo concentrado de tuna cardona', 'Nuez de nogal'],
    imagen: '/images/gastronomia/queso-de-tuna.jpg'
  },
  {
    id: 'colonche',
    nombre: 'Colonche del Altiplano',
    region: 'Altiplano',
    pueblo: 'Real de Catorce',
    descripcion: 'Bebida ritual prehispánica de color rojo rubí efervescente, obtenida tras la fermentación del jugo fresco de la tuna roja recién cosechada.',
    ingredientes: ['Jugo de tuna roja silvestres', 'Nódulos de fermentación'],
    imagen: '/images/gastronomia/colonche.jpg'
  },
  {
    id: 'campechanas',
    nombre: 'Campechanas de Santa María',
    region: 'Centro',
    pueblo: 'Santa María del Río',
    descripcion: 'Orgullo de la panadería potosina. Hojaldre extremadamente fino de mil hojas que se deshace en la boca, cubierto con un glacé dorado brillante caramelizado.',
    ingredientes: ['Harina de trigo de alta fuerza', 'Manteca de cerdo', 'Azúcar dorada en masa'],
    imagen: '/images/gastronomia/campechanas.jpg'
  },
  {
    id: 'enchiladas-potosinas',
    nombre: 'Enchiladas Potosinas',
    region: 'Centro',
    pueblo: 'Santa María del Río',
    descripcion: 'Ícono gastronómico del estado. Tortillas hechas con masa sazonada con chile ancho, rellenas de queso de metate con cebolla, fritas y servidas con crema y cecina.',
    ingredientes: ['Masa de maíz al chile ancho', 'Queso de metate', 'Cebolla fina', 'Crema ácida'],
    imagen: '/images/enchiladas_potosinas_1784665870684.png'
  }
];
