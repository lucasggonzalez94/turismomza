import LinkToSection from '@/components/ui/LinkToSection/LinkToSection';

const Banner = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center p-24"
      style={{
        backgroundImage: 'url(/images/background.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col gap-5 items-center md:items-start w-fit">
        <h1 className="text-white text-5xl lg:text-6xl text-center md:text-left font-magiesta select-none">
          Descubre lo mejor de<br></br>
          <span className="text-9xl lg:text-10xl">Mendoza</span>
        </h1>
        <LinkToSection text="Comienza tu aventura" idToScroll="attractions" />
      </div>
    </div>
  );
};

export default Banner;
