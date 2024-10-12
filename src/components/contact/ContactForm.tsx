'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStore } from '@/store/store';
import { Button, Input, Textarea } from '@nextui-org/react';
import { sendMail } from '@/services/contact/sendMail';

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
  const user = useStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const notifySuccess = (message?: string) =>
    toast.success(message ?? 'El email se envió correctamente.', {
      position: 'top-left',
      theme: 'dark',
    });
  const notifyError = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'top-left',
      theme: 'dark',
    });

  const sendEmail = async (data: any) => {
    try {
      setLoading(true);
      await sendMail(data);
      setLoading(false);
      notifySuccess();
    } catch {
      setLoading(false);
      notifyError();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(sendEmail)}
        className="w-full flex flex-col gap-7"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá tu nombre"
              {...register('name')}
            />
            <span className="text-sm text-red-500">{errors.name?.message}</span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              label="Asunto"
              labelPlacement="outside"
              placeholder="Ingresá el asunto"
              {...register('subject')}
            />
            <span className="text-sm text-red-500">
              {errors.subject?.message}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Ingresá tu email"
              {...register('email')}
            />
            <span className="text-sm text-red-500">
              {errors.email?.message}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Textarea
              label="Mensaje"
              className="w-full"
              labelPlacement="outside"
              placeholder="Ingresá el mensaje"
              {...register('message')}
            />
            <span className="text-sm text-red-500">
              {errors.message?.message}
            </span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end w-full">
          <Button color="primary" type="submit" isLoading={loading}>
            Enviar
          </Button>
        </div>
      </form>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ContactForm;