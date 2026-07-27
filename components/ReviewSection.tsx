'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getReviews, addReview, Review } from '@/lib/reviewsFirebase';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface Props {
  targetId: string;
}

export default function ReviewSection({ targetId }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(targetId);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      await addReview({
        targetId,
        userId: user.uid,
        userName: user.nombre || 'Usuario',
        rating,
        comment: comment.trim(),
      });
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error('Error adding review', err);
      setError('Ocurrió un error al enviar tu reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 mb-8 bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-800">
      <h2 className="text-3xl font-bold text-stone-900 dark:text-white mb-8">
        Reseñas y Experiencias
      </h2>

      {/* Formulario de Reseña */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12 bg-stone-50 dark:bg-stone-950 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-4">
            Comparte tu experiencia
          </h3>
          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-stone-300 dark:text-stone-700'}`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció este pueblo mágico?"
            className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-4 resize-none transition-shadow"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-3 rounded-xl font-medium hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </form>
      ) : (
        <div className="mb-12 bg-stone-50 dark:bg-stone-950 p-6 rounded-2xl flex items-center justify-between">
          <p className="text-stone-600 dark:text-stone-400">
            Inicia sesión para compartir tu experiencia.
          </p>
          <Link
            href="/login"
            className="text-amber-600 dark:text-amber-500 font-medium hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      )}

      {/* Lista de Reseñas */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-stone-500 py-8">Cargando reseñas...</div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-stone-100 dark:border-stone-800 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-stone-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-sm font-bold text-stone-500 dark:text-stone-400">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  {review.userName}
                </div>
                <div className="text-sm text-stone-500 dark:text-stone-400">
                  {new Date(review.date).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="flex gap-1 mb-3 ml-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-stone-200 dark:text-stone-700'}`}
                  />
                ))}
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed ml-10">
                {review.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-stone-500 py-12 bg-stone-50 dark:bg-stone-950/50 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
            No hay reseñas aún. ¡Sé el primero en compartir tu experiencia!
          </div>
        )}
      </div>
    </div>
  );
}
