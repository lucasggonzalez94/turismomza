'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
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
          placeholder="Ingresá tu nombre"
          errorMessage={errors.name?.message}
          {...register('name')}
        />
        <Input
          type="text"
          label="Asunto"
          placeholder="Ingresá el asunto"
          errorMessage={errors.subject?.message}
          {...register('subject')}
        />
        <Input
          type="email"
          label="Email"
          placeholder="Ingresá tu email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Textarea
          label="Mensaje"
          className="w-full"
          placeholder="Ingresá el mensaje"
          errorMessage={errors.message?.message}
          {...register('message')}
        />
        <div className="flex justify-end lg:justify-end w-full">
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
