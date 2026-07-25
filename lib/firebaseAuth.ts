import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// --- Registro con Email y Contraseña ---
export async function signupWithEmail(
  nombre: string,
  email: string,
  password: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Actualizar displayName en Firebase Auth
  await updateProfile(credential.user, { displayName: nombre });

  // Crear documento de perfil en Firestore
  await setDoc(doc(db, 'usuarios', credential.user.uid), {
    nombre,
    email,
    regionFavorita: '',
    creadoEn: serverTimestamp(),
  });

  return credential;
}

// --- Login con Email y Contraseña ---
export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

// --- Login con Google ---
export async function loginWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  // Crear perfil si es la primera vez
  const { user } = credential;
  const profileRef = doc(db, 'usuarios', user.uid);
  await setDoc(
    profileRef,
    {
      nombre: user.displayName || 'Usuario',
      email: user.email,
      regionFavorita: '',
      creadoEn: serverTimestamp(),
    },
    { merge: true } // No sobreescribe si ya existe
  );

  return credential;
}

// --- Cerrar Sesión ---
export async function logoutUser(): Promise<void> {
  return signOut(auth);
}
