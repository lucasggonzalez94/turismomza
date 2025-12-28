'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import InputPassword from '../ui/InputPassword';
import { register as registerService } from '@/services/auth/register';
import useNavigation from '@/hooks/useNavigation';
import GoogleAuthButton from './GoogleAuthButton';
import { useAuthStore } from '@/store/authStore';

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    lastname: yup.string().required('El campo es obligatorio.'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Debe ingresar un correo electrónico válido.',
      )
      .required('El campo es obligatorio.'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      )
      .required('El campo es obligatorio.'),
  })
  .required();

const RegisterForm = () => {
  const { handleNavigation } = useNavigation();
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

  const handleRegister = async (data: any) => {
    try {
      setLoading(true);
      const { name, lastname, ...restValues } = data;
      const registerBody = {
        ...restValues,
        name: `${name} ${lastname}`,
      };
      const res = await registerService(registerBody);
      setUser(res);
      setIsAuthenticated(true);
      handleNavigation('/');
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="max-w-96">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 w-full">
            <InputField
              className="w-full"
              type="text"
              label="Nombre"
              placeholder="Ingresá tu nombre"
              error={errors.name?.message}
              {...register('name')}
            />
            <InputField
              className="w-full"
              type="text"
              label="Apellido"
              placeholder="Ingresá tu apellido"
              error={errors.lastname?.message}
              {...register('lastname')}
            />
          </div>
          <InputField
            type="email"
            label="Email"
            placeholder="Ingresá tu email"
            error={errors.email?.message}
            {...register('email')}
          />
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

      <div className="flex flex-col gap-3 mt-10">
        <Button className="w-full font-bold" type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Regístrate'}
        </Button>
        <GoogleAuthButton />
      </div>
    </form>
  );
};

export default RegisterForm;
