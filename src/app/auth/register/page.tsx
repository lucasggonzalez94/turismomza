import InputPassword from '@/components/ui/InputPassword/InputPassword';
import { Button, Input, Link } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-10 min-w-96">
      <div>
        <h2 className="text-4xl font-bold">Crea una cuenta</h2>
        <span>¡Bienvenido a Mendoza!</span>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-3 w-full">
            <Input
              type="text"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresá tu nombre"
            />
            <Input
              type="text"
              label="Apellido"
              labelPlacement="outside"
              placeholder="Ingresá tu apellido"
            />
          </div>
          <Input
            type="email"
            label="Email"
            labelPlacement="outside"
            placeholder="Ingresá tu email"
          />
          <InputPassword />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button color="primary" className="w-full font-bold">
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

      <div className="flex justify-center items-center gap-2">
        <span>¿Ya tienes una cuenta?</span>
        <Link href="/auth/login" className="font-bold text-black">
          Ingresá
        </Link>
      </div>
    </div>
  );
}
