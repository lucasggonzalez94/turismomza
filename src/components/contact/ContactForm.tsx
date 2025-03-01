'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Button, Input, Textarea } from '@nextui-org/react';
import { sendMail } from '@/services/contact/sendMail';
import { useAuthStore } from '@/store/authStore';

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    subject: yup.string().required('El campo es obligatorio.'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Debe ingresar un correo electrónico válido.',
      )
      .required('El campo es obligatorio.'),
    message: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const ContactForm = () => {
  const user = useAuthStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const sendEmail = async (data: any) => {
    try {
      setLoading(true);
      await sendMail(data);
      toast.success('El email se envió correctamente.');
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit(sendEmail)}
        className="w-full xl:w-[80%] 2xl:w-1/2 flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">Formulario de contacto</h2>
        <Input
          type="text"
          label="Nombre"
          labelPlacement="outside"
          placeholder="Ingresá tu nombre"
          variant="faded"
          isInvalid={!!errors.name?.message}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <Input
          type="text"
          label="Asunto"
          labelPlacement="outside"
          placeholder="Ingresá el asunto"
          variant="faded"
          isInvalid={!!errors.subject?.message}
          errorMessage={errors.subject?.message}
          {...register('subject')}
        />
        <Input
          type="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Ingresá tu email"
          variant="faded"
          isInvalid={!!errors.email?.message}
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Textarea
          label="Mensaje"
          className="w-full"
          labelPlacement="outside"
          placeholder="Ingresá el mensaje"
          variant="faded"
          isInvalid={!!errors.message?.message}
          errorMessage={errors.message?.message}
          {...register('message')}
        />
        <div className="flex justify-end lg:justify-end w-full">
          <Button color="primary" type="submit" isLoading={loading}>
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
