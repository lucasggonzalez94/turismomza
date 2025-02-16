import AboutMza from '@/components/home/sections/AboutMza';
import PlacesHome from '@/components/home/sections/PlacesHome';
import Banner from '@/components/home/sections/Banner';
import Donations from '@/components/home/sections/Donations';
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Banner />
      <AboutMza />
      <PlacesHome />
      <div className="w-full flex justify-center">
        <hr className="border-gray-300 w-[95%]" />
      </div>
      <Donations />
    </div>
  );
}
