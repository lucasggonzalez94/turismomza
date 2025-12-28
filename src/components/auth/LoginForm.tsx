'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import InputPassword from '../ui/InputPassword';
import { login } from '@/services/auth/login';
import useNavigation from '@/hooks/useNavigation';
import { useNavigationStore } from '@/store/navigationStore';
import GoogleAuthButton from './GoogleAuthButton';
import { useAuthStore } from '@/store/authStore';

const schema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Debes ingresar un correo electrónico válido.',
      )
      .required('El campo es obligatorio.'),
    password: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const LoginForm = () => {
  const { handleNavigation } = useNavigation();
  const lastPath = useNavigationStore((state) => state.lastPath);
  const { setUser, setIsAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: any) => {
    try {
      setLoading(true);
      const res = await login(data);
      setUser(res);
      setIsAuthenticated(true);
      handleNavigation(lastPath);
    } catch (error: any) {
      if (error.status === 401) {
        toast.error('Las credenciales no son válidas.');
      } else {
        toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="max-w-96">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="Ingresá tu email"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="flex flex-col gap-1">
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputPassword {...field} error={errors.password?.message} />
              )}
            />
          </div>
        </div>
        <Link
          href="#"
          className="mt-1 text-sm text-end text-siren-900 hover:underline"
        >
          <span className="w-full">¿Has olvidado tu contraseña?</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <Button className="w-full font-bold" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <GoogleAuthButton />
      </div>
    </form>
  );
};

export default LoginForm;
