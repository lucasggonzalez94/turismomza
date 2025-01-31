'use client';

import { useStore } from '@/store/store';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const FeedbackError = () => {
  const { errorFeedback } = useStore((state) => state);

  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 items-center max-w-[50%]">
      <Image src="/images/error.svg" alt="Error" width={100} height={100} />
      <span className="text-xl font-bold">
        {errorFeedback?.status === 406
          ? 'Publicación Rechazada'
          : '¡Algo salio mal!'}
      </span>
      <p className="text-center">
        {errorFeedback?.status === 406
          ? 'Lo sentimos, tu publicación tiene contenido que ha sido marcado como inapropiado y no cumple con nuestras normas. Por favor, revisa y ajusta el contenido antes de intentarlo nuevamente.'
          : 'Vuelve a intentarlo más tarde.'}
      </p>
      <Button
        color="primary"
        onPress={() => {
          if (errorFeedback?.pathname) {
            router.push(errorFeedback.pathname);
          }
        }}
      >
        {errorFeedback?.pathname?.includes('edit')
          ? 'Volver a editar'
          : 'Volver a publicar'}
      </Button>
    </div>
  );
};

export default FeedbackError;
