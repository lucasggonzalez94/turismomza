'use client';

import { Button, Input, Link } from '@nextui-org/react';
import React, { useState } from 'react';
import InputPassword from '../ui/InputPassword';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '@/store/store';

const schema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Debe ingresar un correo electrónico válido.',
      )
      .required('El campo es obligatorio.'),
    password: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const LoginForm = () => {
  const router = useRouter();
  const lastPath = useStore((state) => state.lastPath);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogin = async (data: any) => {
    try {
      setLoading(true);
      await login(data);
      handleNavigation(lastPath);
    } catch (error: any) {
      setLoading(false);
      if (error.status === 401) {
        notify('Las credenciales no son válidas.');
      } else {
        notify();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="max-w-96">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              variant="faded"
              placeholder="Ingresá tu email"
              {...register('email')}
            />
            <span className="text-sm text-red-500">
              {errors.email?.message}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => <InputPassword {...field} />}
            />
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          </div>
        </div>
        <Link href="#" className="mt-1 text-sm text-end">
          <span className="w-full text-black">
            ¿Has olvidado tu contraseña?
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <Button
          color="primary"
          className="w-full font-bold"
          type="submit"
          isLoading={loading}
        >
          Ingresar
        </Button>
        <Button
          color="primary"
          className="w-full font-bold bg-white border border-gray-400 text-black"
          startContent={<FcGoogle size={30} />}
        >
          Ingresar con Google
        </Button>
      </div>
      <ToastContainer autoClose={10000} />
    </form>
  );
};

export default LoginForm;
