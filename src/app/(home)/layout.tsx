import { Button } from '@nextui-org/react';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-200">
      <Button color="primary" variant="flat" radius="md">
        Explorar Atracciones
      </Button>
      {children}
    </main>
  );
}
