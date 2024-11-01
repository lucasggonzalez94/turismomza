import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: '...',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-10 min-w-96">
      <div>
        <h2 className="text-4xl font-bold">Bienvenido de nuevo</h2>
        <span>¡Mendoza te espera! Introduce tus datos.</span>
      </div>

      <LoginForm />

      <div className="flex justify-center items-center gap-2">
        <span>¿No tienes una cuenta?</span>
        <Link href="/auth/register" className="font-bold">
          Regístrate
        </Link>
      </div>
    </div>
  );
}
