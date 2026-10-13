import { db } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

export interface MapLocationConfig {
  id: string;
  slug: string;
  nombre: string;
  tipo: 'pueblo' | 'paraje';
  region: 'Huasteca' | 'Altiplano' | 'Centro' | 'Media';
  municipio: string;
  svgX: number;
  svgY: number;
  googleMapsQuery: string;
  puntoPartida: string;
  distancia: string;
  tiempoEstimado: string;
  comoLlegar: string;
}

const LOCAL_STORAGE_KEY = 'slp_admin_map_locations_v1';

export const DEFAULT_MAP_LOCATIONS: MapLocationConfig[] = [
  // --- PUEBLOS MÁGICOS (6) ---
  {
    id: 'pueblo-aquismon',
    slug: 'aquismon',
    nombre: 'Aquismon',
    tipo: 'pueblo',
    region: 'Huasteca',
    municipio: 'Aquismon',
    svgX: 465,
    svgY: 350,
    googleMapsQuery: 'Aquismon, San Luis Potosi, Mexico',
    puntoPartida: 'Ciudad Valles / SLP Capital',
    distancia: '56 km desde Cd. Valles (345 km desde SLP Capital)',
    tiempoEstimado: '50 min desde Cd. Valles / 4 h 30 min desde SLP',
    comoLlegar: 'Desde Ciudad Valles tomar la Carretera Federal 85 México-Laredo hacia el sur por 45 km hasta el entronque El Puente y continuar 11 km por carretera estatal pavimentada hasta la cabecera municipal de Aquismón.',
  },
  {
    id: 'pueblo-xilitla',
    slug: 'xilitla',
    nombre: 'Xilitla',
    tipo: 'pueblo',
    region: 'Huasteca',
    municipio: 'Xilitla',
    svgX: 505,
    svgY: 425,
    googleMapsQuery: 'Xilitla, San Luis Potosi, Mexico',
    puntoPartida: 'Ciudad Valles / Río Verde',
    distancia: '88 km desde Cd. Valles (385 km desde SLP Capital)',
    tiempoEstimado: '1 h 30 min desde Cd. Valles / 5 h desde SLP',
    comoLlegar: 'Desde Ciudad Valles circular por la Carretera Federal 85 hacia Tamazunchale y tomar la desviación por la Carretera Federal 120 rumbo a Jalpan de Serra hasta subir a Xilitla.',
  },
  {
    id: 'pueblo-real-de-catorce',
    slug: 'real-de-catorce',
    nombre: 'Real de Catorce',
    tipo: 'pueblo',
    region: 'Altiplano',
    municipio: 'Real de Catorce',
    svgX: 200,
    svgY: 95,
    googleMapsQuery: 'Real de Catorce, San Luis Potosi, Mexico',
    puntoPartida: 'Matehuala / SLP Capital',
    distancia: '68 km desde Matehuala (260 km desde SLP Capital)',
    tiempoEstimado: '1 h 15 min desde Matehuala / 3 h 10 min desde SLP',
    comoLlegar: 'Tomar la Carretera Federal 57 rumbo a Matehuala, desviarse en el entronque a Cedral, continuar por camino empedrado de 27 km en la sierra de Catorce y cruzar el histórico Túnel de Ogarrio.',
  },
  {
    id: 'pueblo-santa-maria-del-rio',
    slug: 'santa-maria-del-rio',
    nombre: 'Santa Maria del Rio',
    tipo: 'pueblo',
    region: 'Centro',
    municipio: 'Santa Maria del Rio',
    svgX: 195,
    svgY: 375,
    googleMapsQuery: 'Santa Maria del Rio, San Luis Potosi, Mexico',
    puntoPartida: 'San Luis Potosí Capital',
    distancia: '48 km desde SLP Capital',
    tiempoEstimado: '40 min desde SLP Capital',
    comoLlegar: 'Salir de San Luis Potosí Capital hacia el sur por la Carretera Federal 57 (México-Piedras Negras) rumbo a Querétaro y tomar la salida directa hacia Santa María del Río.',
  },
  {
    id: 'pueblo-tierra-nueva',
    slug: 'tierra-nueva',
    nombre: 'Tierra Nueva',
    tipo: 'pueblo',
    region: 'Centro',
    municipio: 'Tierra Nueva',
    svgX: 225,
    svgY: 395,
    googleMapsQuery: 'Tierra Nueva, San Luis Potosi, Mexico',
    puntoPartida: 'San Luis Potosí Capital',
    distancia: '72 km desde SLP Capital',
    tiempoEstimado: '1 h desde SLP Capital',
    comoLlegar: 'Circular por la Carretera Federal 57 hacia el sur, pasar Santa María del Río y tomar la desviación estatal señalizada hacia Tierra Nueva.',
  },
  {
    id: 'pueblo-ciudad-del-maiz',
    slug: 'ciudad-del-maiz',
    nombre: 'Ciudad del Maiz',
    tipo: 'pueblo',
    region: 'Media',
    municipio: 'Ciudad del Maiz',
    svgX: 355,
    svgY: 255,
    googleMapsQuery: 'Ciudad del Maiz, San Luis Potosi, Mexico',
    puntoPartida: 'Río Verde / SLP Capital',
    distancia: '95 km desde Río Verde (182 km desde SLP Capital)',
    tiempoEstimado: '1 h 25 min desde Río Verde / 2 h 20 min desde SLP',
    comoLlegar: 'Desde San Luis Potosí Capital tomar la Carretera Federal 70 o la autopista a Cerritos-Tula y continuar por la Carretera Federal 80 (Tampico-Barra de Navidad) hasta Ciudad del Maíz.',
  },

  // --- PARAJES HIDROLÓGICOS Y NATURALES (14) ---
  {
    id: 'paraje-cascada-de-tamul',
    slug: 'cascada-de-tamul',
    nombre: 'Cascada de Tamul',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Aquismon',
    svgX: 450,
    svgY: 330,
    googleMapsQuery: 'Cascada de Tamul, Aquismon, San Luis Potosi, Mexico',
    puntoPartida: 'Ciudad Valles / Aquismón',
    distancia: '45 km desde Cd. Valles al embarcadero La Morena',
    tiempoEstimado: '55 min en auto + 1 h 30 min remando en panga',
    comoLlegar: 'Tomar la carretera libre Ciudad Valles - San Luis Potosí (Fed. 70), desviarse hacia el ejido Tanchachín o La Morena y abordar una panga comunitaria con chaleco salvavidas obligatorio por el río Tampaón.',
  },
  {
    id: 'paraje-jardin-escultorico-las-pozas',
    slug: 'jardin-escultorico-las-pozas',
    nombre: 'Jardin Escultorico "Las Pozas"',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Xilitla',
    svgX: 515,
    svgY: 410,
    googleMapsQuery: 'Jardin Escultorico Edward James Las Pozas, Xilitla, San Luis Potosi',
    puntoPartida: 'Centro de Xilitla',
    distancia: '2.5 km desde la plaza principal de Xilitla',
    tiempoEstimado: '8 min en auto / 25 min caminando desde Xilitla',
    comoLlegar: 'Desde el centro histórico de Xilitla tomar el camino pavimentado hacia la comunidad de La Conchita durante 2.5 km hasta llegar al acceso principal del Jardín Escultórico Edward James.',
  },
  {
    id: 'paraje-sotano-de-las-golondrinas',
    slug: 'sotano-de-las-golondrinas',
    nombre: 'Sotano de las Golondrinas',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Aquismon',
    svgX: 470,
    svgY: 370,
    googleMapsQuery: 'Sotano de las Golondrinas, Aquismon, San Luis Potosi',
    puntoPartida: 'Cabecera Municipal de Aquismón',
    distancia: '16 km de subida serrana desde Aquismón',
    tiempoEstimado: '35 min en auto + 15 min por escalones',
    comoLlegar: 'Desde el centro de Aquismón subir por el camino pavimentado serrano hacia la comunidad de Unión de Guadalupe (Tamapatz) y descender los 568 escalones ecológicos hasta el mirador del abismo.',
  },
  {
    id: 'paraje-sotano-de-las-huahuas',
    slug: 'sotano-de-las-huahuas',
    nombre: 'Sotano de las Huahuas',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Aquismon',
    svgX: 490,
    svgY: 440,
    googleMapsQuery: 'Sotano de las Huahuas, Aquismon, San Luis Potosi',
    puntoPartida: 'Aquismón / Entronque San Isidro',
    distancia: '24 km desde Aquismón',
    tiempoEstimado: '40 min en auto + 25 min de caminata',
    comoLlegar: 'Circular por la Carretera Federal 85 al sur de Aquismón, tomar la desviación hacia la comunidad de San Isidro Tampaxal y recorrer el sendero comunitario entre cafetales.',
  },
  {
    id: 'paraje-nacimiento-de-tambaque',
    slug: 'nacimiento-de-tambaque',
    nombre: 'Nacimiento de Tambaque',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Aquismon',
    svgX: 490,
    svgY: 320,
    googleMapsQuery: 'Manantial de Tambaque, Aquismon, San Luis Potosi',
    puntoPartida: 'Aquismón / Carretera Fed. 85',
    distancia: '14 km al norte de Aquismón',
    tiempoEstimado: '15 min en auto desde Aquismón',
    comoLlegar: 'Ubicado directamente a pie de la Carretera Federal 85 México-Laredo en el tramo Ciudad Valles - Tamazunchale, a 14 km del entronque de Aquismón.',
  },
  {
    id: 'paraje-cascada-el-meco',
    slug: 'cascada-el-meco',
    nombre: 'Cascada El Meco',
    tipo: 'paraje',
    region: 'Huasteca',
    municipio: 'Xilitla (Periferia)',
    svgX: 530,
    svgY: 370,
    googleMapsQuery: 'Cascada El Meco, El Naranjo, San Luis Potosi',
    puntoPartida: 'El Naranjo / Ciudad Valles',
    distancia: '85 km al norte de Ciudad Valles',
    tiempoEstimado: '1 h 25 min desde Ciudad Valles',
    comoLlegar: 'Tomar la carretera hacia El Naranjo (corredor turístico de cascadas), subir al mirador público gratuito o contratar un recorrido en lancha sin motor por el río El Salto.',
  },
  {
    id: 'paraje-desierto-sagrado-wirikuta',
    slug: 'desierto-sagrado-wirikuta',
    nombre: 'Desierto Sagrado de Wirikuta',
    tipo: 'paraje',
    region: 'Altiplano',
    municipio: 'Real de Catorce (Periferia)',
    svgX: 170,
    svgY: 110,
    googleMapsQuery: 'Estacion Catorce Wirikuta, Real de Catorce, San Luis Potosi',
    puntoPartida: 'Real de Catorce',
    distancia: '18 km de descenso por el camino del Socavón',
    tiempoEstimado: '50 min en vehículo Willys 4x4',
    comoLlegar: 'Contratar un vehículo todoterreno Willys oficial en el centro de Real de Catorce para descender por la cuesta del Socavón hacia el semidesierto de Estación Wadley y el Cerro del Quemado.',
  },
  {
    id: 'paraje-aguas-termales-lourdes',
    slug: 'aguas-termales-lourdes',
    nombre: 'Aguas Termales de Lourdes',
    tipo: 'paraje',
    region: 'Centro',
    municipio: 'Santa Maria del Rio',
    svgX: 170,
    svgY: 360,
    googleMapsQuery: 'Balneario de Lourdes, Santa Maria del Rio, San Luis Potosi',
    puntoPartida: 'Santa María del Río',
    distancia: '16 km desde Santa María del Río (62 km desde SLP)',
    tiempoEstimado: '20 min desde Santa María del Río',
    comoLlegar: 'Desde Santa María del Río tomar la carretera estatal pavimentada rumbo a la Ex Hacienda de Lourdes siguiendo los señalamientos hacia el balneario termal.',
  },
  {
    id: 'paraje-cascada-el-salto',
    slug: 'cascada-el-salto',
    nombre: 'Cascada El Salto / Senor del Amparo',
    tipo: 'paraje',
    region: 'Centro',
    municipio: 'Santa Maria del Rio',
    svgX: 180,
    svgY: 320,
    googleMapsQuery: 'Santa Maria del Rio, San Luis Potosi',
    puntoPartida: 'Cabecera de Santa María del Río',
    distancia: '12 km de camino rural desde Santa María del Río',
    tiempoEstimado: '30 min en camioneta / vehículo alto',
    comoLlegar: 'Salir de la cabecera municipal de Santa María del Río por el camino rural hacia la serranía del Señor del Amparo (activo principalmente de julio a octubre en época de lluvias).',
  },
  {
    id: 'paraje-presa-la-muneca',
    slug: 'presa-la-muneca',
    nombre: 'Presa La Muneca',
    tipo: 'paraje',
    region: 'Centro',
    municipio: 'Tierra Nueva',
    svgX: 230,
    svgY: 380,
    googleMapsQuery: 'Presa La Muneca, Tierra Nueva, San Luis Potosi',
    puntoPartida: 'Centro de Tierra Nueva',
    distancia: '8 km desde la plaza principal de Tierra Nueva',
    tiempoEstimado: '15 min en auto desde Tierra Nueva',
    comoLlegar: 'Desde el centro de Tierra Nueva seguir la avenida principal hacia el sur siguiendo los letreros turísticos hacia el embalse de la Presa La Muñeca.',
  },
  {
    id: 'paraje-laguna-media-luna',
    slug: 'laguna-media-luna',
    nombre: 'Laguna de la Media Luna',
    tipo: 'paraje',
    region: 'Media',
    municipio: 'Rioverde',
    svgX: 340,
    svgY: 410,
    googleMapsQuery: 'Laguna de la Media Luna, Rioverde, San Luis Potosi',
    puntoPartida: 'Río Verde / Ciudad Fernández',
    distancia: '15 km desde Río Verde (140 km desde SLP Capital)',
    tiempoEstimado: '20 min desde Río Verde / 1 h 50 min desde SLP',
    comoLlegar: 'Desde Río Verde tomar el bulevar hacia el ejido El Jabalí y seguir el camino pavimentado directo al Parque Estatal Manantial de la Media Luna.',
  },
  {
    id: 'paraje-manantiales-los-peroles',
    slug: 'manantiales-los-peroles',
    nombre: 'Manantiales Los Peroles',
    tipo: 'paraje',
    region: 'Media',
    municipio: 'Ciudad del Maiz',
    svgX: 345,
    svgY: 280,
    googleMapsQuery: 'Manantiales Los Peroles, San Luis Potosi',
    puntoPartida: 'Ciudad del Maíz / Río Verde',
    distancia: '42 km desde Río Verde por camino rural',
    tiempoEstimado: '55 min en vehículo alto o camioneta',
    comoLlegar: 'Desde la zona media tomar la ruta hacia el ejido San Francisco / Palomas y continuar por brecha rural compactada hasta el bosque de sabinos milenarios de Los Peroles.',
  },
  {
    id: 'paraje-cascadas-minas-viejas',
    slug: 'cascadas-minas-viejas',
    nombre: 'Cascadas de Minas Viejas',
    tipo: 'paraje',
    region: 'Media',
    municipio: 'El Naranjo (Ruta Media)',
    svgX: 380,
    svgY: 315,
    googleMapsQuery: 'Cascadas de Minas Viejas, El Naranjo, San Luis Potosi',
    puntoPartida: 'Ciudad del Maíz / El Naranjo',
    distancia: '58 km desde Ciudad del Maíz',
    tiempoEstimado: '1 h en auto + 10 min de descenso por escalinatas',
    comoLlegar: 'Tomar la Carretera Federal 80 desde Ciudad del Maíz hacia El Naranjo y seguir la desviación señalizada al paraje ecoturístico de Minas Viejas.',
  },
  {
    id: 'paraje-estacion-tablas',
    slug: 'estacion-tablas',
    nombre: 'Estacion Tablas',
    tipo: 'paraje',
    region: 'Media',
    municipio: 'Ciudad del Maiz',
    svgX: 320,
    svgY: 220,
    googleMapsQuery: 'Estacion Tablas, Ciudad del Maiz, San Luis Potosi',
    puntoPartida: 'Cabecera de Ciudad del Maíz',
    distancia: '28 km al poniente de Ciudad del Maíz',
    tiempoEstimado: '35 min en auto',
    comoLlegar: 'Desde Ciudad del Maíz circular hacia el poniente por la carretera estatal rumbo a la antigua estación ferroviaria de Tablas.',
  },
];

function readLocalMapLocations(): MapLocationConfig[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MapLocationConfig[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalMapLocations(items: MapLocationConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('No se pudo guardar ubicaciones en localStorage:', err);
  }
}

function mergeWithDefaults(customItems: MapLocationConfig[]): MapLocationConfig[] {
  const bySlug = new Map<string, MapLocationConfig>();
  for (const def of DEFAULT_MAP_LOCATIONS) {
    bySlug.set(def.slug, { ...def });
  }
  for (const item of customItems) {
    if (item && item.slug) {
      const existing = bySlug.get(item.slug);
      bySlug.set(item.slug, {
        ...(existing || item),
        ...item,
        svgX: Number(item.svgX ?? existing?.svgX ?? 300),
        svgY: Number(item.svgY ?? existing?.svgY ?? 250),
      });
    }
  }
  return Array.from(bySlug.values());
}

export async function getManagedMapLocations(): Promise<MapLocationConfig[]> {
  try {
    const snap = await getDocs(collection(db, 'mapa_ubicaciones'));
    if (!snap.empty) {
      const firestoreItems = snap.docs.map((d) => ({
        ...(d.data() as MapLocationConfig),
        id: d.id,
      }));
      const merged = mergeWithDefaults(firestoreItems);
      writeLocalMapLocations(merged);
      return merged;
    }
  } catch {
    // Fallback silencioso a localStorage o defaults
  }

  const local = readLocalMapLocations();
  if (local) {
    return mergeWithDefaults(local);
  }

  writeLocalMapLocations(DEFAULT_MAP_LOCATIONS);
  return DEFAULT_MAP_LOCATIONS.map((d) => ({ ...d }));
}

export async function saveMapLocation(item: MapLocationConfig): Promise<MapLocationConfig[]> {
  const current = await getManagedMapLocations();
  const updated = current.map((loc) =>
    loc.slug === item.slug
      ? {
          ...loc,
          ...item,
          svgX: Math.max(20, Math.min(580, Math.round(Number(item.svgX)))),
          svgY: Math.max(20, Math.min(480, Math.round(Number(item.svgY)))),
        }
      : loc
  );

  writeLocalMapLocations(updated);

  const savedItem = updated.find((loc) => loc.slug === item.slug) || item;
  try {
    await setDoc(doc(db, 'mapa_ubicaciones', savedItem.id), savedItem);
  } catch {
    // Guardado en localStorage ya completado
  }

  return updated;
}

export async function resetMapLocations(): Promise<MapLocationConfig[]> {
  const defaults = DEFAULT_MAP_LOCATIONS.map((d) => ({ ...d }));
  writeLocalMapLocations(defaults);
  try {
    const snap = await getDocs(collection(db, 'mapa_ubicaciones'));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'mapa_ubicaciones', d.id));
    }
  } catch {
    // Ignorar si Firestore no está disponible
  }
  return defaults;
}
