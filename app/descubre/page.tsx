'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Sun, Cloud, Thermometer, Mountain, TreePine, Coffee, Users, Heart, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Question = {
  id: string;
  question: string;
  options: {
    label: string;
    icon: any;
    scores: { huasteca: number; altiplano: number; centro: number; media: number };
  }[];
};

const questions: Question[] = [
  {
    id: 'clima',
    question: '¿Qué tipo de clima prefieres para tus vacaciones?',
    options: [
      { label: 'Calor tropical y humedad', icon: Sun, scores: { huasteca: 3, altiplano: 0, centro: 0, media: 1 } },
      { label: 'Clima fresco o frío', icon: Cloud, scores: { huasteca: 0, altiplano: 3, centro: 1, media: 1 } },
      { label: 'Templado, ni mucho frío ni mucho calor', icon: Thermometer, scores: { huasteca: 0, altiplano: 1, centro: 3, media: 2 } },
    ],
  },
  {
    id: 'actividad',
    question: '¿Cuál es tu actividad ideal?',
    options: [
      { label: 'Aventura extrema y agua', icon: Mountain, scores: { huasteca: 3, altiplano: 0, centro: 0, media: 1 } },
      { label: 'Caminar por calles empedradas e historia', icon: Map, scores: { huasteca: 0, altiplano: 3, centro: 2, media: 1 } },
      { label: 'Comprar artesanías y comer rico', icon: Coffee, scores: { huasteca: 1, altiplano: 1, centro: 3, media: 2 } },
      { label: 'Naturaleza tranquila y senderismo', icon: TreePine, scores: { huasteca: 1, altiplano: 1, centro: 1, media: 3 } },
    ],
  },
  {
    id: 'compania',
    question: '¿Con quién viajas?',
    options: [
      { label: 'Solo o en pareja (Romántico/Exploración)', icon: Heart, scores: { huasteca: 1, altiplano: 3, centro: 2, media: 1 } },
      { label: 'Con amigos (Diversión)', icon: Sparkles, scores: { huasteca: 3, altiplano: 2, centro: 1, media: 1 } },
      { label: 'En familia con niños o mayores', icon: Users, scores: { huasteca: 1, altiplano: 1, centro: 3, media: 3 } },
    ],
  }
];

const results = {
  huasteca: {
    title: 'La Huasteca Potosina',
    desc: '¡Eres un aventurero! Te encanta el agua, el calor y la naturaleza espectacular. Aquismón y Xilitla te esperan con sus cascadas, sótanos y selvas surrealistas.',
    img: '/images/xilitla.jpg',
    pueblo: 'Xilitla o Aquismón'
  },
  altiplano: {
    title: 'El Altiplano Potosino',
    desc: 'Buscas misticismo, historia y paisajes desérticos impresionantes. Real de Catorce es tu destino ideal, con su Pueblo Fantasma y el desierto sagrado.',
    img: '/images/real-de-catorce.jpg',
    pueblo: 'Real de Catorce'
  },
  centro: {
    title: 'Región Centro',
    desc: 'Prefieres la tranquilidad, las tradiciones y la buena comida en un clima agradable. Santa María del Río y Tierra Nueva son perfectos para ti.',
    img: '/images/santa-maria-del-rio.jpg',
    pueblo: 'Santa María del Río'
  },
  media: {
    title: 'La Zona Media',
    desc: 'Un balance perfecto entre naturaleza accesible y cultura. Disfrutarás de Ciudad del Maíz o nadando en las aguas cristalinas de la Laguna de la Media Luna.',
    img: '/images/ciudad-del-maiz.jpg',
    pueblo: 'Ciudad del Maíz'
  }
};

export default function DescubrePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ huasteca: 0, altiplano: 0, centro: 0, media: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (optionScores: { huasteca: number; altiplano: number; centro: number; media: number }) => {
    const newScores = {
      huasteca: scores.huasteca + optionScores.huasteca,
      altiplano: scores.altiplano + optionScores.altiplano,
      centro: scores.centro + optionScores.centro,
      media: scores.media + optionScores.media,
    };
    
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getWinner = () => {
    const max = Math.max(scores.huasteca, scores.altiplano, scores.centro, scores.media);
    if (max === scores.huasteca) return results.huasteca;
    if (max === scores.altiplano) return results.altiplano;
    if (max === scores.centro) return results.centro;
    return results.media;
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-[90vh] flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel p-8 md:p-12"
            >
              <div className="mb-8 flex justify-between items-center text-sm font-medium text-stone-500">
                <span>Pregunta {currentStep + 1} de {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <div key={idx} className={`h-1.5 w-8 rounded-full ${idx <= currentStep ? 'bg-amber-600' : 'bg-stone-200 dark:bg-stone-800'}`} />
                  ))}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-stone-900 dark:text-white">
                {questions[currentStep].question}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {questions[currentStep].options.map((opt, idx) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt.scores)}
                      className="flex items-center gap-4 p-4 md:p-6 rounded-2xl border-2 border-stone-100 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-left transition-all duration-300 group"
                    >
                      <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                        <Icon className="w-6 h-6 text-stone-700 dark:text-stone-300 group-hover:text-amber-900 dark:group-hover:text-amber-100" />
                      </div>
                      <span className="font-medium text-stone-800 dark:text-stone-200 text-lg">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel overflow-hidden"
            >
              <div className="h-48 md:h-64 relative">
                <img src={getWinner().img} alt={getWinner().title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-2 block">Tu destino ideal es</span>
                  <h2 className="text-4xl font-display font-bold">{getWinner().title}</h2>
                </div>
              </div>
              <div className="p-8 md:p-12 text-center">
                <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
                  {getWinner().desc}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/#region-map" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-full font-medium transition-colors">
                    <MapPin className="w-4 h-4" />
                    Ver {getWinner().pueblo} en el mapa
                  </Link>
                  <button 
                    onClick={() => { setCurrentStep(0); setScores({huasteca:0, altiplano:0, centro:0, media:0}); setIsFinished(false); }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-full font-medium transition-colors"
                  >
                    Volver a intentar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
