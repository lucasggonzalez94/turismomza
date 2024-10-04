import React from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { Button } from '@nextui-org/react';
import SliderCarousel from '../ui/SliderCarousel/SliderCarousel';

const IMAGES = [
  'https://images.unsplash.com/photo-1587000098522-812f8896e8df?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1587000098522-812f8896e8df?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1587000098522-812f8896e8df?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const AboutMza = () => {
  return (
    <div className="flex justify-between items-center gap-4 h-screen">
      <div className="flex flex-col gap-8 w-1/2 p-16">
        <h2 className="font-magiesta text-8xl">
          Tierra del sol
          <br />y del buen vino
        </h2>
        <p>
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
        <Button
          as={Link}
          href="https://es.wikipedia.org/wiki/Mendoza_(Argentina)"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          className="w-fit"
        >
          Leer más...
        </Button>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center p-16">
        <SliderCarousel
          images={IMAGES}
          showDots
          autoplay
          autoplayDelay={5000}
        />
        {/* <Image
          src="https://images.unsplash.com/photo-1587000098522-812f8896e8df?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="viñedo"
          width={600}
          height={700}
          className="rounded-lg object-cover h-full"
        /> */}
      </div>
    </div>
  );
};

export default AboutMza;
