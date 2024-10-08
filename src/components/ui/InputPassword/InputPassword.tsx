'use client';

import { ChangeEvent, FC, useState } from 'react';
import { Input } from '@nextui-org/react';
import { IoEye, IoEyeOffOutline } from 'react-icons/io5';

interface IPropsInputPassword {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const InputPassword: FC<IPropsInputPassword> = ({ value, onChange, name }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label="Contraseña"
      labelPlacement="outside"
      placeholder="Ingresá tu contraseña"
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? <IoEye /> : <IoEyeOffOutline />}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      name={name}
    />
  );
};

export default InputPassword;
