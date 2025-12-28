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
    <main className="flex flex-col min-h-screen pb-24 md:pb-0">
      <Topbar></Topbar>
      {children}
      <NavBar />
      <Footer />
      <NavigationTracker />
    </main>
  );
}
