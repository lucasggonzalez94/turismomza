import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from '@nextui-org/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro',
  description: '...',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-10 min-w-96">
      <div>
        <h2 className="text-xl font-bold">Crea una cuenta</h2>
        <span>¡Bienvenido a Mendoza!</span>
      </div>

      <RegisterForm />

      <div className="flex justify-center items-center gap-2">
        <span>¿Ya tienes una cuenta?</span>
        <Link href="/auth/login" className="font-bold text-siren-900">
          Ingresá
        </Link>
      </div>
    </div>
  );
}
