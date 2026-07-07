import { NextResponse } from 'next/server';
import regionesData from '@/lib/data';

export async function GET() {
  return NextResponse.json(regionesData);
}
