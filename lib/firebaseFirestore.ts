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
