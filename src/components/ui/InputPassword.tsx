'use client';

import { ChangeEvent, forwardRef, useState } from 'react';
import { Input } from '@nextui-org/react';
import { IoEye, IoEyeOffOutline } from 'react-icons/io5';

interface IPropsInputPassword {
  value: string;
  label?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
}

const InputPassword = forwardRef<HTMLInputElement, IPropsInputPassword>(
  ({ value, label, placeholder, onChange, name, required }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <Input
        label={label || 'Contraseña'}
        labelPlacement="outside"
        placeholder={placeholder || 'Ingresa tu contraseña'}
        variant="faded"
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
        ref={ref}
        className="w-full"
        isRequired={required}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';

export default InputPassword;
