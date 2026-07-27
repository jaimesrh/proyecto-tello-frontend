export interface Evento {
  id: string;
  nombre: string;
  fecha: string; // ISO date YYYY-MM-DD
  municipio: string;
  descripcion: string;
}

export const eventosData: Evento[] = [
  {
    id: 'xantolo',
    nombre: 'Xantolo (Día de Muertos)',
    fecha: '2026-11-01',
    municipio: 'Huasteca Potosina',
    descripcion: 'La fiesta más importante de la Huasteca. Celebración a los muertos con danzas de los huehues, arcos de cempasúchil y zacahuil.'
  },
  {
    id: 'procesion-silencio',
    nombre: 'Procesión del Silencio',
    fecha: '2026-04-03',
    municipio: 'San Luis Potosí (Capital)',
    descripcion: 'Evento solemne de Semana Santa, considerado el segundo más importante a nivel mundial en su tipo, después del de Sevilla.'
  },
  {
    id: 'feria-rebozo',
    nombre: 'Feria Nacional del Rebozo',
    fecha: '2026-08-15',
    municipio: 'Santa María del Río',
    descripcion: 'Exposición y venta de los tradicionales rebozos de seda elaborados en telar de cintura, acompañados de eventos culturales.'
  },
  {
    id: 'fiesta-san-francisco',
    nombre: 'Fiestas de San Francisco de Asís',
    fecha: '2026-10-04',
    municipio: 'Real de Catorce',
    descripcion: 'Miles de peregrinos llegan a este pueblo fantasma para visitar la milagrosa imagen de "Panchito" en una devoción que dura varios días.'
  },
  {
    id: 'fenapo',
    nombre: 'FENAPO (Feria Nacional Potosina)',
    fecha: '2026-08-08',
    municipio: 'San Luis Potosí (Capital)',
    descripcion: 'Una de las ferias más grandes de México, con palenque, teatro del pueblo, juegos mecánicos y gastronomía.'
  }
];
