// Construction theme custom index page

import FeaturedProducts from "@/components/default-products/featured/FeaturedProducts";

export default function ConstructionIndexPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 text-black">
            <p className="font-bold">🏗️ Construction Theme - Custom Index Page</p>
            <p className="text-sm">This page is loaded from themes/construction/page.tsx</p>
          </div>

          <h1 className="text-5xl font-bold mb-4">Build Your Future</h1>
          <p className="text-xl mb-8">Quality construction equipment and materials for professionals</p>
          <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition">
            Shop Now
          </button>
        </div>
      </div>
      {/* Image #2 - Featured Products Section */}
      <FeaturedProducts />

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-orange-500 rounded-lg p-6 hover:shadow-xl transition">
            <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-7xl">
              🔨
            </div>
            <h3 className="text-2xl font-bold mb-2">Power Tools</h3>
            <p className="text-gray-600 mb-4">Heavy duty construction tools for every project</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full">
              Explore Tools
            </button>
          </div>

          <div className="border-2 border-orange-500 rounded-lg p-6 hover:shadow-xl transition">
            <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-7xl">
              🚜
            </div>
            <h3 className="text-2xl font-bold mb-2">Heavy Machinery</h3>
            <p className="text-gray-600 mb-4">Industrial equipment and construction vehicles</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full">
              View Machinery
            </button>
          </div>

          <div className="border-2 border-orange-500 rounded-lg p-6 hover:shadow-xl transition">
            <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-7xl">
              🦺
            </div>
            <h3 className="text-2xl font-bold mb-2">Safety Equipment</h3>
            <p className="text-gray-600 mb-4">PPE and safety gear for your team</p>
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full">
              Shop Safety
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Get your equipment when you need it</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-gray-600">All products tested and certified</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive pricing for contractors</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="font-bold mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">24/7 technical assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
