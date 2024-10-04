import AboutMza from '@/components/home/sections/AboutMza';
import AttractionsHome from '@/components/home/sections/AttranctionsHome';
import Banner from '@/components/home/sections/Banner';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Banner />
      <AboutMza />
      <AttractionsHome />
    </div>
  );
}
