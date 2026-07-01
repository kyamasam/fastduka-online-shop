import Header from './components/Header';
import Footer from './components/Footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      <Footer />
    </div>
  );
}
