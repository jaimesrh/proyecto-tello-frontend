import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { Evento, eventosData } from './eventos';
import { Platillo, gastronomiaData } from './gastronomia';
import { Producto, productos as productosInitial } from './productos';
import { Tour, tours as toursInitial } from './tours';
import { Noticia } from './firebaseFirestore';
import { Review } from './reviewsFirebase';

export const NOTICIAS_INITIAL: Noticia[] = [
  {
    id: 'demo-0',
    slug: 'xantolo-la-fiesta-de-los-muertos-en-la-huasteca',
    titulo: 'Xantolo: La Fiesta de los Muertos en la Huasteca',
    resumen:
      'Descubre la magia, música y tradición de la festividad más importante de la Huasteca Potosina.',
    contenido:
      'El Xantolo es mucho más que el Día de Muertos; es la fiesta de las almas. Durante los primeros días de noviembre, los pueblos de la Huasteca Potosina se llenan de comparsas, máscaras talladas en madera, y el inconfundible aroma a cempasúchil y copal.\n\nLas familias preparan altares espectaculares, arcos de flores y el tradicional zacahuil para recibir a sus seres queridos. Los huehues (viejos) bailan por las calles al ritmo de sones huastecos, representando la conexión entre los vivos y los muertos.',
    imagenPortada: '/images/noticias/xantolo.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Cultura',
    fecha: '2026-10-15',
  },
  {
    id: 'demo-1',
    slug: 'procesion-del-silencio-san-luis-potosi',
    titulo: 'Procesión del Silencio: Fervor y Tradición',
    resumen:
      'Una de las celebraciones de Semana Santa más imponentes de México y el mundo.',
    contenido:
      'Cada Viernes Santo, las calles del centro histórico de San Luis Potosí se sumen en un profundo respeto. La Procesión del Silencio, declarada Patrimonio Cultural del Estado, es una de las manifestaciones religiosas y culturales más impresionantes a nivel internacional.\n\nCientos de cofrades encapuchados caminan lentamente en total silencio, acompañados únicamente por el sonido de los tambores y las trompetas, cargando pesadas imágenes religiosas. Es una experiencia sobrecogedora que atrae a visitantes de todo el mundo.',
    imagenPortada: '/images/noticias/procesion.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Eventos',
    fecha: '2026-03-20',
  },
  {
    id: 'demo-2',
    slug: 'descubre-las-cascadas-de-el-meco',
    titulo: 'Descubre el Paraíso Turquesa: Cascadas de El Meco',
    resumen:
      'Aventúrate en las cristalinas aguas de El Meco, la joya escondida del municipio de El Naranjo.',
    contenido:
      'Si buscas aguas color azul turquesa y un entorno de selva exuberante, El Meco es el destino ideal. Ubicada en el municipio de El Naranjo, esta majestuosa cascada de 38 metros de altura te dejará sin aliento.\n\nPuedes disfrutar de paseos en panga (canoa tradicional) acercándote a la caída de agua, hacer tubing en el río, o simplemente relajarte escuchando el sonido de la naturaleza. Recomendamos visitarla entre noviembre y mayo, cuando las lluvias han pasado y el agua alcanza su tono azul más intenso.',
    imagenPortada: '/images/noticias/ecoturismo.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Naturaleza',
    fecha: '2026-07-10',
  },
];

// Claves de almacenamiento local y colecciones de Firestore
const STORAGE_KEYS = {
  noticias: 'slp_admin_noticias_v1',
  eventos: 'slp_admin_eventos_v1',
  gastronomia: 'slp_admin_gastronomia_v1',
  productos: 'slp_admin_productos_v1',
  tours: 'slp_admin_tours_v1',
  deletedIds: 'slp_admin_deleted_ids_v1',
};

function getDeletedIds(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.deletedIds);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markIdDeleted(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedIds();
    current[id] = true;
    localStorage.setItem(STORAGE_KEYS.deletedIds, JSON.stringify(current));
  } catch (e) {
    console.warn(e);
  }
}

function unmarkIdDeleted(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedIds();
    delete current[id];
    localStorage.setItem(STORAGE_KEYS.deletedIds, JSON.stringify(current));
  } catch (e) {
    console.warn(e);
  }
}

function readLocal<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn('Error guardando en localStorage:', e);
  }
}

/**
 * Sincroniza una colección dinámica entre Firestore, datos iniciales y localStorage
 */
async function fetchManagedCollection<T extends { id?: string }>(
  collectionName: string,
  storageKey: string,
  initialData: T[]
): Promise<T[]> {
  const localItems = readLocal<T>(storageKey, initialData);
  const deletedMap = getDeletedIds();

  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(query(colRef));

    if (snapshot.empty) {
      return localItems.filter((item) => item.id && !deletedMap[item.id]);
    }

    const remoteMap = new Map<string, T>();
    snapshot.docs.forEach((d) => {
      const data = d.data() as T;
      const id = data.id || d.id;
      if (!deletedMap[id]) {
        remoteMap.set(id, { ...data, id });
      }
    });

    // Mezclar con los elementos locales/iniciales que no hayan sido eliminados
    localItems.forEach((item) => {
      if (item.id && !deletedMap[item.id] && !remoteMap.has(item.id)) {
        remoteMap.set(item.id, item);
      }
    });

    const merged = Array.from(remoteMap.values());
    writeLocal(storageKey, merged);
    return merged;
  } catch {
    return localItems.filter((item) => item.id && !deletedMap[item.id]);
  }
}

async function saveManagedItem<T extends { id?: string }>(
  collectionName: string,
  storageKey: string,
  initialData: T[],
  item: T
): Promise<T> {
  const id = item.id || `${collectionName}-${Date.now()}`;
  const itemWithId = { ...item, id };
  unmarkIdDeleted(id);

  const current = readLocal<T>(storageKey, initialData);
  const exists = current.some((i) => i.id === id);
  const updated = exists
    ? current.map((i) => (i.id === id ? itemWithId : i))
    : [itemWithId, ...current];
  writeLocal(storageKey, updated);

  try {
    await setDoc(doc(db, collectionName, id), itemWithId, { merge: true });
  } catch (e) {
    console.warn(`Guardado local activo para ${collectionName}:`, e);
  }

  return itemWithId;
}

async function deleteManagedItem<T extends { id?: string }>(
  collectionName: string,
  storageKey: string,
  initialData: T[],
  id: string
): Promise<void> {
  markIdDeleted(id);
  const current = readLocal<T>(storageKey, initialData);
  writeLocal(
    storageKey,
    current.filter((i) => i.id !== id)
  );

  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.warn(`Eliminado local activo para ${collectionName}:`, e);
  }
}

// ==========================================
// 1. GESTOR DE NOTICIAS
// ==========================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function getManagedNoticias(): Promise<Noticia[]> {
  const items = await fetchManagedCollection<Noticia>(
    'noticias',
    STORAGE_KEYS.noticias,
    NOTICIAS_INITIAL
  );
  return items.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function saveNoticia(noticia: Noticia): Promise<Noticia> {
  const slug = noticia.slug || slugify(noticia.titulo);
  const id = noticia.id || `noticia-${Date.now()}`;
  return saveManagedItem<Noticia>(
    'noticias',
    STORAGE_KEYS.noticias,
    NOTICIAS_INITIAL,
    { ...noticia, id, slug }
  );
}

export async function removeNoticia(id: string): Promise<void> {
  return deleteManagedItem('noticias', STORAGE_KEYS.noticias, NOTICIAS_INITIAL, id);
}

// ==========================================
// 2. GESTOR DE CALENDARIO DE EVENTOS
// ==========================================

export async function getManagedEventos(): Promise<Evento[]> {
  const items = await fetchManagedCollection<Evento>(
    'eventos_calendario',
    STORAGE_KEYS.eventos,
    eventosData
  );
  return items.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export async function saveEvento(evento: Evento): Promise<Evento> {
  const id = evento.id || `evento-${Date.now()}`;
  return saveManagedItem<Evento>(
    'eventos_calendario',
    STORAGE_KEYS.eventos,
    eventosData,
    { ...evento, id }
  );
}

export async function removeEvento(id: string): Promise<void> {
  return deleteManagedItem(
    'eventos_calendario',
    STORAGE_KEYS.eventos,
    eventosData,
    id
  );
}

// ==========================================
// 3. GESTOR GASTRONÓMICO
// ==========================================

export async function getManagedPlatillos(): Promise<Platillo[]> {
  return fetchManagedCollection<Platillo>(
    'gastronomia_platillos',
    STORAGE_KEYS.gastronomia,
    gastronomiaData
  );
}

export async function savePlatillo(platillo: Platillo): Promise<Platillo> {
  const id = platillo.id || `platillo-${Date.now()}`;
  return saveManagedItem<Platillo>(
    'gastronomia_platillos',
    STORAGE_KEYS.gastronomia,
    gastronomiaData,
    { ...platillo, id }
  );
}

export async function removePlatillo(id: string): Promise<void> {
  return deleteManagedItem(
    'gastronomia_platillos',
    STORAGE_KEYS.gastronomia,
    gastronomiaData,
    id
  );
}

// ==========================================
// 4. GESTOR DE MERCADO POTOSINO (ARTESANÍAS)
// ==========================================

export async function getManagedProductos(): Promise<Producto[]> {
  return fetchManagedCollection<Producto>(
    'mercado_productos',
    STORAGE_KEYS.productos,
    productosInitial
  );
}

export async function saveProducto(producto: Producto): Promise<Producto> {
  const id = producto.id || `prod-${Date.now()}`;
  return saveManagedItem<Producto>(
    'mercado_productos',
    STORAGE_KEYS.productos,
    productosInitial,
    { ...producto, id }
  );
}

export async function removeProducto(id: string): Promise<void> {
  return deleteManagedItem(
    'mercado_productos',
    STORAGE_KEYS.productos,
    productosInitial,
    id
  );
}

// ==========================================
// 5. GESTOR DE TOURS
// ==========================================

export async function getManagedTours(): Promise<Tour[]> {
  return fetchManagedCollection<Tour>(
    'catalogo_tours',
    STORAGE_KEYS.tours,
    toursInitial
  );
}

export async function saveTour(tour: Tour): Promise<Tour> {
  const id = tour.id || `tour-${Date.now()}`;
  return saveManagedItem<Tour>(
    'catalogo_tours',
    STORAGE_KEYS.tours,
    toursInitial,
    { ...tour, id }
  );
}

export async function removeTour(id: string): Promise<void> {
  return deleteManagedItem(
    'catalogo_tours',
    STORAGE_KEYS.tours,
    toursInitial,
    id
  );
}

// ==========================================
// 6. MODERACIÓN DE RESEÑAS
// ==========================================

export async function getAllReviewsForAdmin(): Promise<Review[]> {
  try {
    const colRef = collection(db, 'reviews');
    const snapshot = await getDocs(query(colRef));
    const list: Review[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let dateStr = '';
      if (data.date?.toDate) {
        dateStr = data.date.toDate().toISOString();
      } else if (typeof data.date === 'string') {
        dateStr = data.date;
      } else {
        dateStr = new Date().toISOString();
      }
      return {
        id: docSnap.id,
        targetId: data.targetId || 'General',
        userId: data.userId || '',
        userName: data.userName || 'Usuario',
        rating: data.rating || 5,
        comment: data.comment || '',
        date: dateStr,
      };
    });
    return list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (e) {
    console.warn('Error obteniendo todas las reseñas:', e);
    return [];
  }
}

export async function deleteReviewAsAdmin(reviewId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (e) {
    console.warn('Error eliminando reseña:', e);
  }
}
