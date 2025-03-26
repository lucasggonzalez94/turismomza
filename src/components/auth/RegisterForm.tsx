'use client';

import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { toast } from 'sonner';
import InputPassword from '../ui/InputPassword';
import { register as registerService } from '@/services/auth/register';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useNavigation from '@/hooks/useNavigation';
import GoogleButton from './GoogleButton';
import { useAuthStore } from '@/store/authStore';
import { useNavigationStore } from '@/store/navigationStore';

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
  const lastPath = useNavigationStore((state) => state.lastPath);
  const { setUser, setIsAuthenticated, setAuthProvider } = useAuthStore(
    (state) => state,
  );
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
      const response = await registerService(registerBody);
      const { user } = response;
      setUser(user);
      setIsAuthenticated(true);
      setAuthProvider('credentials');
      handleNavigation(lastPath);
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
            {/* TODO: Crear componente Input reutilizable */}
            <div className="flex flex-col gap-1 w-full">
              <Input
                type="text"
                label="Nombre"
                labelPlacement="outside"
                placeholder="Ingresá tu nombre"
                variant="faded"
                {...register('name')}
              />
              <span className="text-sm text-red-500">
                {errors.name?.message}
              </span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                type="text"
                label="Apellido"
                labelPlacement="outside"
                placeholder="Ingresá tu apellido"
                variant="faded"
                {...register('lastname')}
              />
              <span className="text-sm text-red-500">
                {errors.lastname?.message}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="Ingresá tu email"
              variant="faded"
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
            <span className="text-sm text-red-500 text-wrap">
              {errors.password?.message}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-10 items-center">
        <Button
          color="primary"
          className="w-full font-bold"
          type="submit"
          isLoading={loading}
        >
          Regístrate
        </Button>

        <span className="text-gray-500 text-tiny">o continuar con</span>

        <GoogleButton />
      </div>
    </form>
  );
};

export default RegisterForm;
