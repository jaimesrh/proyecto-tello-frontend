import type { Region, PuebloMagico, PuebloComparativo } from './types';
import regionesData, { obtenerPuebloPorSlug, obtenerDatosComparativos } from './data';

/**
 * Cliente de datos para la aplicación.
 * En lugar de hacer fetch a un backend externo, importa los datos
 * directamente desde lib/data.ts. Las API Routes (/api/v1/*) siguen
 * disponibles para consumo externo si se necesitan.
 */
export const api = {
  getRegiones: async (): Promise<Region[]> => {
    return regionesData;
  },

  getPueblo: async (slug: string): Promise<PuebloMagico | null> => {
    return obtenerPuebloPorSlug(slug) || null;
  },

  getComparativo: async (): Promise<PuebloComparativo[]> => {
    return obtenerDatosComparativos();
  }
};
