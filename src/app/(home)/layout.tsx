import Topbar from '@/components/ui/Topbar';
import Footer from '@/components/ui/Footer';
import NavBar from '@/components/ui/NavBar';
import NavigationTracker from '@/components/NavigationTracker';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Topbar />
      {children}
      <NavBar />
      <Footer />
      <NavigationTracker />
    </main>
  );
}
