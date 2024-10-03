import AboutMza from '@/components/sections/AboutMza';
import Banner from '@/components/sections/Banner';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Banner />
      <AboutMza />
    </div>
  );
}
