import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  nombre: string;
  email: string;
  regionFavorita: string;
  creadoEn?: unknown;
}

export interface Reservacion {
  id?: string;
  userId: string;
  tourId: string;
  tourTitulo: string;
  tourImagen: string;
  tourRegion: string;
  tourPueblo: string;
  fecha: string;
  personas: number;
  notas: string;
  estado: 'confirmada' | 'cancelada';
  precio: number;
  creadoEn?: unknown;
}

// --- Perfil de Usuario ---

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'usuarios', uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const docRef = doc(db, 'usuarios', uid);
  await setDoc(docRef, data, { merge: true });
}

// --- Reservaciones de Tours ---

export async function addReservacion(
  reservacion: Omit<Reservacion, 'id' | 'creadoEn'>
): Promise<string> {
  const colRef = collection(db, 'reservaciones');
  const docRef = await addDoc(colRef, {
    ...reservacion,
    creadoEn: serverTimestamp(),
  });
  return docRef.id;
}

export async function getReservaciones(userId: string): Promise<Reservacion[]> {
  const colRef = collection(db, 'reservaciones');
  const q = query(
    colRef,
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as Reservacion))
    .filter((r) => r.estado === 'confirmada');
}

export async function cancelReservacion(reservaId: string): Promise<void> {
  const docRef = doc(db, 'reservaciones', reservaId);
  await updateDoc(docRef, { estado: 'cancelada' });
}

// --- Noticias / Blog ---

export interface Noticia {
  id?: string;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagenPortada: string;
  autor: string;
  categoria: string;
  fecha: string;
  creadoEn?: unknown;
}

const noticiasDemo: Omit<Noticia, 'id' | 'creadoEn'>[] = [
  {
    slug: 'xantolo-la-fiesta-de-los-muertos-en-la-huasteca',
    titulo: 'Xantolo: La Fiesta de los Muertos en la Huasteca',
    resumen: 'Descubre la magia, música y tradición de la festividad más importante de la Huasteca Potosina.',
    contenido: 'El Xantolo es mucho más que el Día de Muertos; es la fiesta de las almas. Durante los primeros días de noviembre, los pueblos de la Huasteca Potosina se llenan de comparsas, máscaras talladas en madera, y el inconfundible aroma a cempasúchil y copal.\\n\\nLas familias preparan altares espectaculares, arcos de flores y el tradicional zacahuil para recibir a sus seres queridos. Los huehues (viejos) bailan por las calles al ritmo de sones huastecos, representando la conexión entre los vivos y los muertos.',
    imagenPortada: '/images/noticias/xantolo.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Cultura',
    fecha: '2026-10-15',
  },
  {
    slug: 'procesion-del-silencio-san-luis-potosi',
    titulo: 'Procesión del Silencio: Fervor y Tradición',
    resumen: 'Una de las celebraciones de Semana Santa más imponentes de México y el mundo.',
    contenido: 'Cada Viernes Santo, las calles del centro histórico de San Luis Potosí se sumen en un profundo respeto. La Procesión del Silencio, declarada Patrimonio Cultural del Estado, es una de las manifestaciones religiosas y culturales más impresionantes a nivel internacional.\\n\\nCientos de cofrades encapuchados caminan lentamente en total silencio, acompañados únicamente por el sonido de los tambores y las trompetas, cargando pesadas imágenes religiosas. Es una experiencia sobrecogedora que atrae a visitantes de todo el mundo.',
    imagenPortada: '/images/noticias/procesion.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Eventos',
    fecha: '2026-03-20',
  },
  {
    slug: 'descubre-las-cascadas-de-el-meco',
    titulo: 'Descubre el Paraíso Turquesa: Cascadas de El Meco',
    resumen: 'Aventúrate en las cristalinas aguas de El Meco, la joya escondida del municipio de El Naranjo.',
    contenido: 'Si buscas aguas color azul turquesa y un entorno de selva exuberante, El Meco es el destino ideal. Ubicada en el municipio de El Naranjo, esta majestuosa cascada de 38 metros de altura te dejará sin aliento.\\n\\nPuedes disfrutar de paseos en panga (canoa tradicional) acercándote a la caída de agua, hacer tubing en el río, o simplemente relajarte escuchando el sonido de la naturaleza. Recomendamos visitarla entre noviembre y mayo, cuando las lluvias han pasado y el agua alcanza su tono azul más intenso.',
    imagenPortada: '/images/noticias/ecoturismo.jpg',
    autor: 'Equipo Editorial',
    categoria: 'Naturaleza',
    fecha: '2026-07-10',
  }
];

export async function getNoticias(): Promise<Noticia[]> {
  const colRef = collection(db, 'noticias');
  try {
    const q = query(colRef);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Retornar datos demo si Firebase está vacío para que la UI no se vea rota
      return noticiasDemo.map((n, i) => ({ id: `demo-${i}`, ...n }));
    }
    
    const noticias = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Noticia));
    return noticias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  } catch (error) {
    // Si hay error de permisos, devolver fallback
    return noticiasDemo.map((n, i) => ({ id: `demo-${i}`, ...n }));
  }
}

export async function getNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const colRef = collection(db, 'noticias');
  try {
    const q = query(colRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Buscar en demo
      const demo = noticiasDemo.find(n => n.slug === slug);
      return demo ? { id: 'demo-1', ...demo } : null;
    }
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Noticia;
  } catch (error) {
    const demo = noticiasDemo.find(n => n.slug === slug);
    return demo ? { id: 'demo-1', ...demo } : null;
  }
}

export async function seedNoticias(): Promise<void> {
  // Ya no es necesario usar el botón seed porque getNoticias tiene fallback
}

