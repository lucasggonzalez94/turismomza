import AboutMza from '@/components/home/sections/AboutMza';
import AttractionsHome from '@/components/home/sections/AttranctionsHome';
import Banner from '@/components/home/sections/Banner';
import ContactAndDonations from '@/components/home/sections/ContactAndDonations';
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Banner />
      <AboutMza />
      <AttractionsHome />
      <div className="w-full flex justify-center">
        <hr className="border-gray-300 w-[95%]" />
      </div>
      <ContactAndDonations />
    </div>
  );
}
