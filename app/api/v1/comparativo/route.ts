import { NextResponse } from 'next/server';
import { obtenerDatosComparativos } from '@/lib/data';

export async function GET() {
  const datos = obtenerDatosComparativos();
  return NextResponse.json(datos);
}
