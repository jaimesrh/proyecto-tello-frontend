import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  targetId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const getReviews = async (targetId: string): Promise<Review[]> => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(
    reviewsRef,
    where('targetId', '==', targetId),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    let dateStr = '';
    if (data.date instanceof Timestamp) {
      dateStr = data.date.toDate().toISOString();
    } else if (data.date?.toDate) {
      dateStr = data.date.toDate().toISOString();
    } else if (typeof data.date === 'string') {
      dateStr = data.date;
    } else if (typeof data.date === 'number') {
      dateStr = new Date(data.date).toISOString();
    } else {
      dateStr = new Date().toISOString();
    }
    
    return {
      id: doc.id,
      targetId: data.targetId,
      userId: data.userId,
      userName: data.userName,
      rating: data.rating,
      comment: data.comment,
      date: dateStr,
    } as Review;
  });
};

export const addReview = async (review: Omit<Review, 'id' | 'date'>): Promise<string> => {
  const reviewsRef = collection(db, 'reviews');
  const docRef = await addDoc(reviewsRef, {
    ...review,
    date: Timestamp.now(),
  });
  return docRef.id;
};
