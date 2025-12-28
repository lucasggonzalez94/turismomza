'use client';

import { ChangeEvent, ReactNode, forwardRef, useState } from 'react';
import { IoEye, IoEyeOffOutline } from 'react-icons/io5';

import InputField from '@/components/ui/InputField';
import { Input } from '@/components/ui/Input';

interface IPropsInputPassword {
  value: string;
  label?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  error?: ReactNode;
}

const InputPassword = forwardRef<HTMLInputElement, IPropsInputPassword>(
  ({ value, label, placeholder, onChange, name, required, error }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <InputField
        label={label || 'Contraseña'}
        error={error}
        renderInput={(id) => (
          <div className="relative">
            <Input
              id={id}
              placeholder={placeholder || 'Ingresa tu contraseña'}
              type={isVisible ? 'text' : 'password'}
              value={value}
              onChange={onChange}
              name={name}
              ref={ref}
              required={required}
              className="pr-10"
            />
            <button
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="Alternar visibilidad de contraseña"
            >
              {isVisible ? <IoEye size={18} /> : <IoEyeOffOutline size={18} />}
            </button>
          </div>
        )}
      />
    );
  },
);

InputPassword.displayName = 'InputPassword';

export default InputPassword;
