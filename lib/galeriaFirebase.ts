import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  query,
  Timestamp,
} from 'firebase/firestore';

export interface SpotPhoto {
  id: string;
  src: string;
  title: string;
  location: string;
  description?: string;
  authorName: string;
  userId?: string;
  createdAt: string;
  likes?: number;
  isFeatured?: boolean;
  colSpan?: string;
  rowSpan?: string;
}

const COLLECTION_NAME = 'galeria_spots';
const LOCAL_STORAGE_KEY = 'slp_community_photos';

function getLocalPhotos(): SpotPhoto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPhotos(photos: SpotPhoto[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

export async function getCommunityPhotos(): Promise<SpotPhoto[]> {
  const localPhotos = getLocalPhotos();

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef);
    const snapshot = await getDocs(q);

    const firestorePhotos: SpotPhoto[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      let dateStr = '';
      if (data.createdAt instanceof Timestamp) {
        dateStr = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === 'string') {
        dateStr = data.createdAt;
      } else {
        dateStr = new Date().toISOString();
      }

      return {
        id: docSnap.id,
        src: data.src,
        title: data.title,
        location: data.location,
        description: data.description || '',
        authorName: data.authorName || 'Viajero',
        userId: data.userId,
        createdAt: dateStr,
        likes: typeof data.likes === 'number' ? data.likes : 0,
        isFeatured: false,
        colSpan: 'col-span-1',
        rowSpan: 'row-span-1',
      };
    });

    // Combinar fotos de Firestore con cualquier foto local que no esté duplicada
    const ids = new Set(firestorePhotos.map((p) => p.id));
    const merged = [
      ...firestorePhotos,
      ...localPhotos.filter((lp) => !ids.has(lp.id)),
    ];

    return merged.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Usando respaldo local para galería comunitaria:', error);
    return localPhotos.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function addCommunityPhoto(
  photoData: Omit<SpotPhoto, 'id' | 'createdAt' | 'likes' | 'isFeatured'>
): Promise<SpotPhoto> {
  const nowIso = new Date().toISOString();

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(colRef, {
      ...photoData,
      likes: 0,
      createdAt: Timestamp.now(),
    });

    const newPhoto: SpotPhoto = {
      ...photoData,
      id: docRef.id,
      createdAt: nowIso,
      likes: 0,
      isFeatured: false,
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
    };

    const currentLocal = getLocalPhotos();
    saveLocalPhotos([newPhoto, ...currentLocal]);

    return newPhoto;
  } catch (error) {
    // Respaldo local en caso de que Firestore bloquee la escritura o no haya red
    console.warn('Guardando fotografía en almacenamiento local como respaldo:', error);
    const fallbackPhoto: SpotPhoto = {
      ...photoData,
      id: `local-${Date.now()}`,
      createdAt: nowIso,
      likes: 0,
      isFeatured: false,
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
    };

    const currentLocal = getLocalPhotos();
    saveLocalPhotos([fallbackPhoto, ...currentLocal]);
    return fallbackPhoto;
  }
}

export async function deleteCommunityPhoto(photoId: string): Promise<void> {
  const currentLocal = getLocalPhotos();
  saveLocalPhotos(currentLocal.filter((p) => p.id !== photoId));

  if (!photoId.startsWith('local-')) {
    try {
      const docRef = doc(db, COLLECTION_NAME, photoId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Error eliminando documento de Firestore:', e);
    }
  }
}

export async function likeCommunityPhoto(photoId: string): Promise<void> {
  const currentLocal = getLocalPhotos();
  const updatedLocal = currentLocal.map((p) =>
    p.id === photoId ? { ...p, likes: (p.likes || 0) + 1 } : p
  );
  saveLocalPhotos(updatedLocal);

  if (!photoId.startsWith('local-')) {
    try {
      const docRef = doc(db, COLLECTION_NAME, photoId);
      await updateDoc(docRef, {
        likes: increment(1),
      });
    } catch (e) {
      console.warn('No se pudo actualizar like en Firestore:', e);
    }
  }
}

/**
 * Comprime y redimensiona un archivo de imagen en el navegador usando Canvas
 * para producir un Data URL ligero (~80-200 KB) apto para Firestore.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Archivo de imagen inválido'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.readAsDataURL(file);
  });
}
