export interface Region {
  id: number;
  nombre: string;
  descripcion: string | null;
  colorHex: string;
  pueblos: PuebloResumen[];
  parajes: Paraje[];
}

export interface Paraje {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  tokenIcon: string;
  municipio: string;
  clima: string | null;
  logistica: string | null;
  svgX: number;
  svgY: number;
}

export interface PuebloResumen {
  id: number;
  nombre: string;
  slug: string;
  descripcionBreve: string | null;
  imagenUrl: string | null;
  altitud: number | null;
}

export interface PuebloMagico {
  id: number;
  nombre: string;
  slug: string;
  altitud: number | null;
  clima: string | null;
  temperaturaMedia: string | null;
  ecosistema: string | null;
  perfilTuristico: string | null;
  descripcionBreve: string | null;
  imagenUrl: string | null;
  regionId: number;
  region: {
    id: number;
    nombre: string;
    colorHex: string;
    descripcion: string | null;
  };
  atractivos: Atractivo[];
  culturas: Cultura[];
  sostenibilidad: Sostenibilidad | null;
}

export interface Atractivo {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estacionalidad: string | null;
  acceso: string | null;
  puebloId: number;
  imagenUrl?: string | null;
}

export interface Cultura {
  id: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  puebloId: number;
}

export interface Sostenibilidad {
  id: number;
  capacidadCarga: string | null;
  riesgosSaturacion: string | null;
  mejoresTemporadas: string | null;
  recomendaciones: string | null;
  puebloId: number;
}

export interface PuebloComparativo {
  id: number;
  nombre: string;
  slug: string;
  altitud: number | null;
  clima: string | null;
  temperaturaMedia: string | null;
  ecosistema: string | null;
  perfilTuristico: string | null;
  region: {
    nombre: string;
    colorHex: string;
  };
  _count: {
    atractivos: number;
    culturas: number;
  };
}

export type TabId = 'panorama' | 'atractivos' | 'cultura' | 'sostenibilidad';

export interface TabItem {
  id: TabId;
  label: string;
  icon: string;
}
