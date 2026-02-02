import { getTheme } from "./lib/get-theme";
import { loadThemeIndexPage } from "./lib/theme-loader";

export default async function Home() {
  // Get the current theme
  const themeName = await getTheme();

  // Try to load theme-specific index page
  const ThemeIndexPage = await loadThemeIndexPage(themeName);

  // If theme has a custom index page, use it
  if (ThemeIndexPage) {
    return <ThemeIndexPage />;
  }

  // Otherwise, use default index page
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-bold">Default Index Page</p>
        <p className="text-sm">This is the default landing page. Create a custom index page in your theme to override this.</p>
        <p className="text-sm mt-2">Current theme: <strong>{themeName}</strong></p>
      </div>

      <h1 className="text-4xl font-bold mb-6">Welcome to FastDuka</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Featured Products</h3>
          <p className="text-gray-600">Browse our latest collection</p>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Special Offers</h3>
          <p className="text-gray-600">Check out amazing deals</p>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">New Arrivals</h3>
          <p className="text-gray-600">Discover what's new</p>
        </div>
      </div>
    </div>
  );
}
