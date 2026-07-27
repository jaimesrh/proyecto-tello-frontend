import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Badge {
  id?: string;
  userId: string;
  badgeId: string;
  name: string;
  iconToken: string;
  dateUnlocked: any; // Firebase timestamp
}

export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  const badgesRef = collection(db, 'passports');
  const q = query(badgesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Badge[];
};

export const unlockBadge = async (userId: string, badgeId: string, name: string, iconToken: string) => {
  const badgesRef = collection(db, 'passports');
  
  // Check if badge is already unlocked
  const q = query(badgesRef, where('userId', '==', userId), where('badgeId', '==', badgeId));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    return snapshot.docs[0].id; // Already unlocked
  }
  
  const newBadgeRef = await addDoc(badgesRef, {
    userId,
    badgeId,
    name,
    iconToken,
    dateUnlocked: serverTimestamp()
  });
  
  return newBadgeRef.id;
};
