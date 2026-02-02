// Construction theme custom layout
// This completely overrides the default layout structure

import Header from './components/Header';

interface ConstructionLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: ConstructionLayoutProps) {
  return (
    <div className="construction-theme">
      {/* Theme-specific announcement banner */}
      <div className="bg-red-500 text-white text-center py-2 text-sm font-bold">
        Default theme
      </div>

      {/* Use construction theme Header */}
      <Header />

      {/* Main content with construction theme styling */}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      {/* Construction theme custom footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-500">Construction Equipment</h3>
              <p className="text-gray-400">
                Your trusted source for quality construction tools and machinery.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/shop" className="hover:text-orange-500">Shop Equipment</a></li>
                <li><a href="/rentals" className="hover:text-orange-500">Rentals</a></li>
                <li><a href="/services" className="hover:text-orange-500">Services</a></li>
                <li><a href="/contact" className="hover:text-orange-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <p className="text-gray-400">
                📞 1-800-BUILD-IT<br />
                📧 info@construction.com<br />
                📍 123 Builder St, City
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Construction Equipment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
