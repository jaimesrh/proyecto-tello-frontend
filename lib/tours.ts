export type Tour = {
  id: string;
  titulo: string;
  region: string; // Centro, Altiplano, Media, Huasteca
  pueblo: string;
  duracion: string; // e.g. "8 horas", "2 días"
  precio: number;
  dificultad: "Baja" | "Media" | "Alta";
  tipo: "Aventura" | "Cultural" | "Gastronómico" | "Relax";
  incluye: string[];
  descripcion: string;
  imagen: string;
  guiaCertificado: boolean;
};

export const tours: Tour[] = [
  {
    id: "tour-1",
    titulo: "Expedición Surrealista en Xilitla",
    region: "Huasteca",
    pueblo: "Xilitla",
    duracion: "8 horas",
    precio: 1200,
    dificultad: "Media",
    tipo: "Cultural",
    incluye: ["Transporte", "Guía certificado", "Entrada a Las Pozas", "Comida Huasteca"],
    descripcion: "Descubre el asombroso Jardín Escultórico de Edward James, camina entre estructuras surrealistas en medio de la selva y disfruta de la gastronomía local.",
    imagen: "/images/parajes/jardin-escultorico-las-pozas.png",
    guiaCertificado: true,
  },
  {
    id: "tour-2",
    titulo: "Ruta de Cascadas y Sótano en Aquismón",
    region: "Huasteca",
    pueblo: "Aquismón",
    duracion: "12 horas",
    precio: 1500,
    dificultad: "Alta",
    tipo: "Aventura",
    incluye: ["Transporte 4x4", "Navegación en panga", "Equipo de seguridad", "Entrada al Sótano"],
    descripcion: "Una aventura épica hacia la Cascada de Tamul remando en panga, seguida de la imponente vista de aves en el Sótano de las Golondrinas al atardecer.",
    imagen: "/images/parajes/cascada-de-tamul.png",
    guiaCertificado: true,
  },
  {
    id: "tour-3",
    titulo: "Ruta Fantasma Nocturna en Real de Catorce",
    region: "Altiplano",
    pueblo: "Real de Catorce",
    duracion: "3 horas",
    precio: 450,
    dificultad: "Baja",
    tipo: "Cultural",
    incluye: ["Guía local", "Recorrido en Willys", "Cata de cafe/mezcal tradicional"],
    descripcion: "Recorre las calles empedradas de noche escuchando las leyendas de mineros y fantasmas que habitan este pueblo mágico del altiplano.",
    imagen: "/images/atractivos/pueblo-fantasma.png",
    guiaCertificado: true,
  },
  {
    id: "tour-4",
    titulo: "Aventura en Canales de la Media Luna",
    region: "Media",
    pueblo: "Ciudad del Maíz / Rioverde",
    duracion: "6 horas",
    precio: 850,
    dificultad: "Baja",
    tipo: "Relax",
    incluye: ["Entrada a manantiales", "Chaleco salvavidas", "Equipo de snorkel"],
    descripcion: "Bucea o haz snorkel en aguas cristalinas y termales. Descubre el bosque petrificado bajo el agua y relájate en la naturaleza.",
    imagen: "/images/parajes/laguna-media-luna.png",
    guiaCertificado: true,
  },
  {
    id: "tour-5",
    titulo: "Ruta de las Aguas Termales y Rebozo en Santa María",
    region: "Centro",
    pueblo: "Santa María del Río",
    duracion: "5 horas",
    precio: 600,
    dificultad: "Baja",
    tipo: "Cultural",
    incluye: ["Visita a Casa del Rebozo", "Cata de dulces típicos", "Entrada a balneario termal"],
    descripcion: "Conoce el proceso artesanal del famoso rebozo de bolita, degusta campechanas y relájate en las aguas termales cercanas.",
    imagen: "/images/parajes/aguas-termales-lourdes.png",
    guiaCertificado: true,
  },
  {
    id: "tour-6",
    titulo: "Senderismo en Cerro La Mesa y Canadas",
    region: "Centro",
    pueblo: "Tierra Nueva",
    duracion: "7 horas",
    precio: 750,
    dificultad: "Media",
    tipo: "Aventura",
    incluye: ["Guía experto", "Almuerzo campestre", "Bastones de senderismo"],
    descripcion: "Caminata por antiguos caminos mineros con vistas panorámicas increíbles hacia la presa La Muñeca y cañadas profundas.",
    imagen: "/images/atractivos/cerro-la-mesa.jpg",
    guiaCertificado: true,
  },
  {
    id: "tour-7",
    titulo: "Tour Gastronómico Huasteco",
    region: "Huasteca",
    pueblo: "Aquismón / Xilitla",
    duracion: "4 horas",
    precio: 650,
    dificultad: "Baja",
    tipo: "Gastronómico",
    incluye: ["Degustación de Zacahuil", "Bocoles tradicionales", "Vino de Jobo"],
    descripcion: "Deléitate con los sabores más auténticos de la Huasteca, incluyendo el monumental tamal Zacahuil y bocoles preparados por cocineras tradicionales.",
    imagen: "/images/zacahuil_1784665862653.png",
    guiaCertificado: true,
  },
  {
    id: "tour-8",
    titulo: "Expedición al Sótano de las Huahuas",
    region: "Huasteca",
    pueblo: "Aquismón",
    duracion: "6 horas",
    precio: 950,
    dificultad: "Media",
    tipo: "Aventura",
    incluye: ["Transporte", "Entradas", "Guía local experto"],
    descripcion: "Adéntrate en la selva para presenciar el impresionante abismo de las Huahuas, santuario de miles de aves y espectáculo natural de luz y sonido.",
    imagen: "/images/parajes/sotano-de-las-huahuas.png",
    guiaCertificado: true,
  },
];
