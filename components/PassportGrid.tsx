'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Mountain, Building, Utensils, Camera, Compass, Award } from 'lucide-react';
import { getUserBadges, Badge } from '@/lib/gamificationFirebase';

interface PassportGridProps {
  userId: string;
}

const POSSIBLE_BADGES = [
  { badgeId: 'huasteca_explorer', name: 'Explorador Huasteco', icon: Map, color: 'text-emerald-500', borderColor: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  { badgeId: 'altiplano_adventurer', name: 'Aventurero Altiplano', icon: Mountain, color: 'text-amber-600', borderColor: 'border-amber-600', bg: 'bg-amber-600/10' },
  { badgeId: 'city_walker', name: 'Caminante Citadino', icon: Building, color: 'text-blue-500', borderColor: 'border-blue-500', bg: 'bg-blue-500/10' },
  { badgeId: 'foodie', name: 'Gastrónomo', icon: Utensils, color: 'text-rose-500', borderColor: 'border-rose-500', bg: 'bg-rose-500/10' },
  { badgeId: 'culture_enthusiast', name: 'Entusiasta Cultural', icon: Camera, color: 'text-purple-500', borderColor: 'border-purple-500', bg: 'bg-purple-500/10' },
  { badgeId: 'trail_blazer', name: 'Pionero de Rutas', icon: Compass, color: 'text-teal-500', borderColor: 'border-teal-500', bg: 'bg-teal-500/10' },
];

export default function PassportGrid({ userId }: PassportGridProps) {
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBadges() {
      try {
        const badges = await getUserBadges(userId);
        setUnlockedBadges(badges);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBadges();
  }, [userId]);

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-[#1c2e4a] bg-[#fdfbf7] p-6 shadow-md dark:border-surface-600 dark:bg-surface-800 sm:p-8"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b-2 border-dashed border-[#1c2e4a]/20 pb-4 sm:flex-row dark:border-surface-600">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1c2e4a] text-amber-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-[#1c2e4a] dark:text-surface-100">
                Pasaporte Digital
              </h2>
              <p className="text-sm font-medium uppercase tracking-widest text-surface-500 dark:text-surface-400">
                Estados Unidos Mexicanos
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold uppercase text-surface-400">Sellos Obtenidos</p>
            <p className="font-serif text-3xl font-bold text-[#1c2e4a] dark:text-surface-100">
              {loading ? '-' : unlockedBadges.length}
              <span className="text-lg text-surface-400">/{POSSIBLE_BADGES.length}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {POSSIBLE_BADGES.map((b, index) => {
            const isUnlocked = unlockedBadges.some((ub) => ub.badgeId === b.badgeId);
            const Icon = b.icon;

            return (
              <motion.div
                key={b.badgeId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-all ${
                  isUnlocked
                    ? `border-dashed ${b.borderColor} ${b.bg} shadow-inner`
                    : 'border-dashed border-surface-200 bg-surface-50 opacity-60 grayscale dark:border-surface-700 dark:bg-surface-900'
                }`}
              >
                <div
                  className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-current shadow-sm ${
                    isUnlocked ? b.color : 'text-surface-400'
                  }`}
                  style={
                    isUnlocked
                      ? { transform: `rotate(${Math.random() * 20 - 10}deg)` } // Sellos ligeramente rotados
                      : {}
                  }
                >
                  <Icon className="h-8 w-8" strokeWidth={isUnlocked ? 2.5 : 1.5} />
                </div>
                <h3
                  className={`font-serif text-sm font-bold uppercase tracking-wider ${
                    isUnlocked ? 'text-surface-900 dark:text-surface-50' : 'text-surface-500'
                  }`}
                >
                  {b.name}
                </h3>
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-inset ring-black/5 dark:ring-white/5" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
