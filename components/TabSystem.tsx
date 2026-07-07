'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Mountain, History, ShieldAlert } from 'lucide-react';
import type { PuebloMagico, TabId } from '@/lib/types';
import TabPanorama from './TabPanorama';
import TabAtractivos from './TabAtractivos';
import TabCultura from './TabCultura';
import TabSostenibilidad from './TabSostenibilidad';

interface TabSystemProps {
  pueblo: PuebloMagico;
}

const tabs: { id: TabId; label: string; Icon: typeof Compass }[] = [
  { id: 'panorama', label: 'Panorama General', Icon: Compass },
  { id: 'atractivos', label: 'Atractivos', Icon: Mountain },
  { id: 'cultura', label: 'Cultura y Gastronomia', Icon: History },
  { id: 'sostenibilidad', label: 'Sostenibilidad', Icon: ShieldAlert },
];

export default function TabSystem({ pueblo }: TabSystemProps) {
  const [activeTab, setActiveTab] = useState<TabId>('panorama');

  return (
    <div>
      {/* Navegacion de pestanas */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-stone-100 dark:bg-stone-800/50 rounded-2xl mb-8 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-stone-900 dark:text-white'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-white dark:bg-stone-700 rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido de la pestana activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'panorama' && <TabPanorama pueblo={pueblo} />}
          {activeTab === 'atractivos' && <TabAtractivos atractivos={pueblo.atractivos} />}
          {activeTab === 'cultura' && <TabCultura culturas={pueblo.culturas} />}
          {activeTab === 'sostenibilidad' && (
            <TabSostenibilidad sostenibilidad={pueblo.sostenibilidad} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
