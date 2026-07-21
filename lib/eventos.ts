export interface Evento {
  id: string;
  nombre: string;
  mes: string;
  municipio: string;
  descripcion: string;
}

export const eventosData: Evento[] = [
  {
    id: 'xantolo',
    nombre: 'Xantolo (Día de Muertos)',
    mes: 'Noviembre',
    municipio: 'Huasteca Potosina',
    descripcion: 'La fiesta más importante de la Huasteca. Celebración a los muertos con danzas de los huehues, arcos de cempasúchil y zacahuil.'
  },
  {
    id: 'procesion-silencio',
    nombre: 'Procesión del Silencio',
    mes: 'Marzo/Abril',
    municipio: 'San Luis Potosí (Capital)',
    descripcion: 'Evento solemne de Semana Santa, considerado el segundo más importante a nivel mundial en su tipo, después del de Sevilla.'
  },
  {
    id: 'feria-rebozo',
    nombre: 'Feria del Rebozo',
    mes: 'Agosto',
    municipio: 'Santa María del Río',
    descripcion: 'Exposición y venta de los tradicionales rebozos de seda elaborados en telar de cintura, acompañados de eventos culturales.'
  },
  {
    id: 'fiesta-san-francisco',
    nombre: 'Fiestas de San Francisco de Asís',
    mes: 'Octubre',
    municipio: 'Real de Catorce',
    descripcion: 'Miles de peregrinos llegan a este pueblo fantasma para visitar la milagrosa imagen de "Panchito" en una devoción que dura varios días.'
  }
];
