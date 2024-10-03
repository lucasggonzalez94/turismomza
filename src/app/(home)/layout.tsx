import Topbar from '@/components/ui/Topbar/Topbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-200">
      <Topbar></Topbar>
      {children}
    </main>
  );
}
