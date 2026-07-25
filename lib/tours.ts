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
    incluye: ["Transporte", "Guía", "Entrada a Las Pozas", "Comida Huasteca"],
    descripcion: "Descubre el asombroso Jardín Escultórico de Edward James, camina entre estructuras surrealistas en medio de la selva y disfruta de la gastronomía local.",
    imagen: "https://images.unsplash.com/photo-1518182170546-076616fd42bf?q=80&w=1000&auto=format&fit=crop",
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
    incluye: ["Transporte 4x4", "Equipo de seguridad", "Snacks", "Entradas"],
    descripcion: "Una aventura épica hacia la Cascada de Tamul remando en panga, seguida de la imponente vista de aves en el Sótano de las Golondrinas al atardecer.",
    imagen: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1000&auto=format&fit=crop",
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
    incluye: ["Guía local", "Bebida caliente", "Acceso a zonas exclusivas"],
    descripcion: "Recorre las calles empedradas de noche escuchando las leyendas de mineros y fantasmas que habitan este pueblo mágico del altiplano.",
    imagen: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000&auto=format&fit=crop",
    guiaCertificado: false,
  },
  {
    id: "tour-4",
    titulo: "Aventura en Canales de la Media Luna",
    region: "Media",
    pueblo: "Rioverde",
    duracion: "6 horas",
    precio: 850,
    dificultad: "Baja",
    tipo: "Relax",
    incluye: ["Entrada al manantial", "Chaleco salvavidas", "Clase de snorkel"],
    descripcion: "Bucea o haz snorkel en aguas cristalinas y termales. Descubre el bosque petrificado bajo el agua y relájate en la naturaleza.",
    imagen: "https://images.unsplash.com/photo-1682687982501-1e5898cb8f4b?q=80&w=1000&auto=format&fit=crop",
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
    incluye: ["Visita a talleres de telar", "Cata de dulces típicos", "Entrada a balneario termal"],
    descripcion: "Conoce el proceso artesanal del famoso rebozo de bolita, degusta campechanas y relájate en las aguas termales cercanas.",
    imagen: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop",
    guiaCertificado: true,
  },
  {
    id: "tour-6",
    titulo: "Senderismo en la Sierra de Álvarez",
    region: "Centro",
    pueblo: "Cerro de San Pedro",
    duracion: "7 horas",
    precio: 750,
    dificultad: "Media",
    tipo: "Aventura",
    incluye: ["Guía experto", "Almuerzo campestre", "Bastones de senderismo"],
    descripcion: "Caminata por antiguos caminos mineros con vistas panorámicas increíbles y una parada en el pueblo fantasma de Cerro de San Pedro.",
    imagen: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
    guiaCertificado: true,
  },
  {
    id: "tour-7",
    titulo: "Tour Gastronómico Huasteco",
    region: "Huasteca",
    pueblo: "Ciudad Valles",
    duracion: "4 horas",
    precio: 650,
    dificultad: "Baja",
    tipo: "Gastronómico",
    incluye: ["Degustación de Zacahuil", "Bebidas tradicionales", "Taller de cocina"],
    descripcion: "Deléitate con los sabores más auténticos de la Huasteca, incluyendo el monumental tamal Zacahuil y bocoles preparados por cocineras tradicionales.",
    imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    guiaCertificado: false,
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
    imagen: "https://images.unsplash.com/photo-1476611317561-60117649dd94?q=80&w=1000&auto=format&fit=crop",
    guiaCertificado: true,
  },
];
