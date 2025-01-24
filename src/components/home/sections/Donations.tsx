import { Button } from '@nextui-org/react';
import { SiMercadopago } from 'react-icons/si';
import { PiPaypalLogoLight } from 'react-icons/pi';

const Donations = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-fit h-auto">
      {/* <div className="flex justify-center items-start lg:w-1/2 p-8 md:p-14">
        <div className="flex flex-col items-start justify-start gap-8 h-full">
          <h2 className="font-bold text-3xl">Contacto</h2>
          <p className="text-sm">
            Utiliza el siguiente formulario para enviarnos tus dudas,
            sugerencias, críticas constructivas o ideas para nuevas
            funcionalidades que te gustaría ver en nuestro sitio. Queremos
            mejorar continuamente y tu opinión nos ayuda a crecer. ¡Gracias por
            tomarte el tiempo de compartir tus pensamientos con nosotros!
          </p>
          <ContactForm />
        </div>
      </div> */}
      <div className="flex justify-center items-start lg:w-1/2 p-8 md:p-14">
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          <h2 className="font-bold text-3xl">Apoyá nuestro proyecto</h2>
          <p className="text-sm text-center">
            Tus donaciones nos ayudan a mantener este sitio funcionando y
            mejorar nuestros servicios. ¡Gracias por tu apoyo!
          </p>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-2">
            <span className="text-sm">Donar con</span>
            <Button
              className="bg-blue-800 text-white"
              startContent={<PiPaypalLogoLight size={30} />}
            >
              PayPal
            </Button>
            <span className="text-sm">o</span>
            <Button
              className="bg-blue-500 text-white"
              startContent={<SiMercadopago size={30} />}
            >
              Mercado Pago
            </Button>
          </div>
          <p className="text-tiny text-center">
            Las donaciones son voluntarias. Cualquier aporte, por pequeño que
            sea, es valioso y apreciado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donations;
