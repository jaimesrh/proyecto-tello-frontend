'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { Evento } from '@/lib/eventos';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface CalendarViewProps {
  eventos: Evento[];
}

export default function CalendarView({ eventos }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // Iniciamos en Agosto 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Funciones de navegación
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  // Generación de los días del mes actual
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];
    
    // Días del mes anterior para llenar la primera fila
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
      });
    }

    // Días del mes siguiente para completar la cuadrícula (6 filas x 7 días = 42)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Encontrar eventos para un día específico
  const getEventsForDate = (date: Date) => {
    return eventos.filter((e) => {
      const eventDate = new Date(e.fecha);
      // Ajustar zona horaria si es necesario, o comparar strings YYYY-MM-DD
      const localEventDateStr = new Date(eventDate.getTime() + Math.abs(eventDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const cellDateStr = date.toISOString().split('T')[0];
      return localEventDateStr === cellDateStr;
    });
  };

  // Eventos seleccionados
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  
  // Todos los eventos del mes actual para mostrarlos debajo si no hay selección
  const monthEvents = useMemo(() => {
    return eventos.filter((e) => {
      const d = new Date(e.fecha);
      // Ajuste básico de timezone
      const localD = new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000));
      return localD.getMonth() === currentMonth && localD.getFullYear() === currentYear;
    });
  }, [eventos, currentMonth, currentYear]);

  const displayEvents = selectedDate ? selectedEvents : monthEvents;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Contenedor del Calendario (Lado Izquierdo en Desktop) */}
      <div className="glass-panel p-6 rounded-3xl border border-surface-200 dark:border-surface-700 shadow-sm w-full lg:w-3/5">
        
        {/* Cabecera del Calendario */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-600 dark:text-surface-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-600 dark:text-surface-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuadrícula (Días de la semana) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-surface-500 uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Cuadrícula (Días del mes) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((dayObj, i) => {
            const hasEvent = getEventsForDate(dayObj.date).length > 0;
            const isSelected = selectedDate && selectedDate.toDateString() === dayObj.date.toDateString();
            const isToday = new Date().toDateString() === dayObj.date.toDateString();

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dayObj.date)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all duration-200
                  ${!dayObj.isCurrentMonth ? 'opacity-30' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}
                  ${isSelected ? 'bg-amber-600 text-white shadow-md hover:bg-amber-700 dark:hover:bg-amber-500 scale-105 z-10' : 'text-surface-700 dark:text-surface-300'}
                  ${isToday && !isSelected ? 'border-2 border-amber-500 text-amber-600 font-bold' : ''}
                `}
              >
                <span className="text-sm sm:text-base font-medium z-10">{dayObj.date.getDate()}</span>
                
                {/* Indicador de evento */}
                {hasEvent && (
                  <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjetas de Eventos (Lado Derecho en Desktop) */}
      <div className="w-full lg:w-2/5 lg:sticky lg:top-28">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-600" />
            {selectedDate 
              ? `Eventos del ${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`
              : `Eventos en ${MONTHS[currentMonth]}`
            }
          </h3>
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-sm text-surface-500 hover:text-amber-600 transition-colors"
            >
              Ver mes completo
            </button>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-600">
          <AnimatePresence mode="popLayout">
            {displayEvents.length > 0 ? (
              displayEvents.map((evento) => (
                <motion.div
                  key={evento.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-6 rounded-2xl shadow-sm mb-4"
                >
                  <h4 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{evento.nombre}</h4>
                  <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 text-sm font-medium mb-3">
                    <MapPin className="w-4 h-4" />
                    {evento.municipio}
                  </div>
                  <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">
                    {evento.descripcion}
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center p-8 border border-dashed border-surface-300 dark:border-surface-700 rounded-2xl"
              >
                <p className="text-surface-500 dark:text-surface-400">
                  {selectedDate 
                    ? "No hay eventos programados para este día."
                    : "No hay eventos destacados para este mes."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
