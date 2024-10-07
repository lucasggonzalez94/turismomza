'use client';

import { useState } from "react";
import { Input } from "@nextui-org/react";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";

const InputPassword = () => {
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
          {isVisible ? (
            <IoEye />
          ) : (
            <IoEyeOffOutline />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  );
};

export default InputPassword;
