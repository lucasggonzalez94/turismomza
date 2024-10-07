'use client';

import { Button, Input, Link } from '@nextui-org/react';
import React, { useState } from 'react';
import InputPassword from '../ui/InputPassword/InputPassword';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth/login';

const LoginForm = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleChange = (field: string, value: string) => {
    setFormValues({
      ...formValues,
      [field]: value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(formValues.email, formValues.password);
      handleNavigation('/');
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Ingresá tu email"
            value={formValues?.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <InputPassword
            value={formValues?.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </div>
        <Link href="#" className="mt-1 text-sm text-end">
          <span className="w-full">¿Has olvidado tu contraseña?</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          color="primary"
          className="w-full font-bold"
          onClick={handleLogin}
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
    </>
  );
};

export default LoginForm;
