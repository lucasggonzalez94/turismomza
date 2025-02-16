import LinkToSection from '@/components/ui/LinkToSection';
import {
  IoArrowForwardCircleOutline,
  IoArrowDownCircleOutline,
} from 'react-icons/io5';

const Banner = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center p-24 relative"
      style={{
        backgroundImage: 'url(/images/background.jpg)',
      }}
    >
      <div className="h-full absolute inset-0 bg-black opacity-40 pointer-events-none z-10"></div>
      <div className="relative z-10 flex flex-col gap-5 items-center md:items-start">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl text-center md:text-left font-magiesta select-none">
          Descubre lo mejor de<br></br>
          <span className="text-8xl md:text-9xl lg:text-10xl">Mendoza</span>
        </h1>
        <LinkToSection
          idToScroll="places"
          className="text-lg text-white flex flex-col md:flex-row items-center justify-between w-[240px] transition-transform duration-300 transform hover:scale-110"
        >
          <span>Comienza tu aventura</span>
          <IoArrowForwardCircleOutline
            size={25}
            className="hidden md:inline-block"
          />
          <IoArrowDownCircleOutline
            size={25}
            className="inline-block md:hidden"
          />
        </LinkToSection>
      </div>
    </div>
  );
};

export default Banner;
