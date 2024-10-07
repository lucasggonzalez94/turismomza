'use client';

import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import InputPassword from '../ui/InputPassword/InputPassword';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { register } from '@/services/auth/register';

const RegisterForm = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    name: '',
    lastname: '',
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

  const handleRegister = async () => {
    try {
      setLoading(true);
      const { name, lastname, ...restValues } = formValues;
      const registerBody = {
        ...restValues,
        name: `${name} ${lastname}`,
      };
      await register(registerBody);
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
          <div className="flex justify-between gap-3 w-full">
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá tu nombre"
              value={formValues?.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              type="text"
              label="Apellido"
              labelPlacement="outside"
              placeholder="Ingresá tu apellido"
              value={formValues?.lastname}
              onChange={(e) => handleChange('lastname', e.target.value)}
            />
          </div>
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
      </div>

      <div className="flex flex-col gap-3">
        <Button
          color="primary"
          className="w-full font-bold"
          onClick={handleRegister}
          isLoading={loading}
        >
          Regístrate
        </Button>
        <Button
          color="primary"
          className="w-full font-bold bg-white border border-gray-400 text-black"
          startContent={<FcGoogle size={30} />}
        >
          Regístrate con Google
        </Button>
      </div>
    </>
  );
};

export default RegisterForm;
