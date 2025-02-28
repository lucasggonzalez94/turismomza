import React from 'react';
import SliderCarousel from '../../ui/SliderCarousel/SliderCarousel';

const IMAGES = [
  '/images/portones.webp',
  '/images/puente-uspallata.webp',
  '/images/portada_auth.webp',
];

const AboutMza = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center lg:gap-4 h-fit lg:h-screen">
      <div className="flex flex-col justify-center gap-8 lg:w-1/2 p-8 md:p-12">
        <h2 className="font-magiesta text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
          Tierra del sol
          <br />y del buen vino
        </h2>
        <p className="text-xs md:text-sm xl:text-base">
          Ubicada al pie de la majestuosa cordillera de los Andes, Mendoza es el
          lugar perfecto para los amantes del vino, la naturaleza y la aventura.
          Famosa por su exquisito Malbec, esta provincia te invita a recorrer
          sus viñedos, disfrutar de catas en encantadoras bodegas y deleitarte
          con la deliciosa gastronomía local.
          <br />
          <br />
          La belleza natural de Mendoza es asombrosa. Desde el imponente
          Aconcagua hasta el impresionante Parque Provincial Quebrada del
          Cóndor, cada rincón ofrece oportunidades para el senderismo, la
          escalada y el avistamiento de fauna. Los deportes extremos como el
          rafting y el esquí en invierno añaden un toque de adrenalina a tu
          viaje.
          <br />
          <br />
          Pero Mendoza también es rica en cultura. Pasea por la Plaza
          Independencia, visita el Museo del Área Fundacional y disfruta del
          calor humano de su gente, siempre dispuesta a compartir una sonrisa.
          <br />
          <br />
          Si buscas un destino que combine aventura, buena comida y vino
          excepcional, Mendoza te espera con los brazos abiertos. ¡No te lo
          pierdas!
        </p>
      </div>
      <div className="hidden w-1/2 h-full lg:flex justify-center items-center p-16">
        <SliderCarousel
          images={IMAGES}
          showDots
          autoplay
          autoplayDelay={5000}
        />
      </div>
    </div>
  );
};

export default AboutMza;
