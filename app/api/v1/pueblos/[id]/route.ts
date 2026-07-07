import { NextResponse } from 'next/server';
import { obtenerPuebloPorSlug } from '@/lib/data';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pueblo = obtenerPuebloPorSlug(id);

  if (!pueblo) {
    return NextResponse.json(
      { error: 'Pueblo Magico no encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(pueblo);
}
