import { Button, Input } from '@nextui-org/react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-4xl font-bold">Bienvenido de nuevo</h2>
        <span>¡Mendoza te espera! Introduce tus datos.</span>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-3">
          <Input type="email" label="Email" />
          <Input type="password" label="Contraseña" />
        </div>
        <Link href="#" className="mt-1 text-sm text-end">
          ¿Has olvidado tu contraseña?
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <Button color="primary" className="w-full font-bold">
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

      <div className="flex justify-center items-center gap-2">
        <span>¿No tienes una cuenta?</span>
        <Link href="/auth/register" className="font-bold">Regístrate</Link>
      </div>
    </div>
  );
}
