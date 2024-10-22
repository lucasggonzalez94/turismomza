import Footer from '@/components/ui/Footer';
import Topbar from '@/components/ui/Topbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-200">
      <Topbar></Topbar>
      {children}
      <Footer />
    </main>
  );
}
