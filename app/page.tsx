import HeroSection from '@/components/HeroSection';
import RegionMap from '@/components/RegionMap';
import { api } from '@/lib/api';

export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  const regiones = await api.getRegiones();

  return (
    <div>
      <HeroSection />
      <RegionMap regiones={regiones} />
    </div>
  );
}
