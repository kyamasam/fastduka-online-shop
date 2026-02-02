// Clothing theme custom index page

export default function ClothingIndexPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="font-bold">👗 Clothing Theme - Custom Index Page</p>
              <p className="text-sm">This page is loaded from themes/clothing/page.tsx</p>
            </div>

            <h1 className="text-6xl font-bold mb-4 text-gray-900">
              Fashion That Speaks
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Discover the latest trends and timeless classics
            </p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                Shop Women
              </button>
              <button className="border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition">
                Shop Men
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Shop by Collection</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group cursor-pointer">
            <div className="relative h-96 bg-pink-200 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                👗
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Summer Collection</h3>
            <p className="text-gray-600 mb-3">Light, breezy outfits for warm days</p>
            <a href="#" className="text-pink-600 font-semibold hover:underline">
              Shop Now →
            </a>
          </div>

          <div className="group cursor-pointer">
            <div className="relative h-96 bg-purple-200 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                👔
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Formal Wear</h3>
            <p className="text-gray-600 mb-3">Elegant pieces for special occasions</p>
            <a href="#" className="text-pink-600 font-semibold hover:underline">
              Shop Now →
            </a>
          </div>

          <div className="group cursor-pointer">
            <div className="relative h-96 bg-blue-200 rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                👟
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Casual Comfort</h3>
            <p className="text-gray-600 mb-3">Everyday styles that feel amazing</p>
            <a href="#" className="text-pink-600 font-semibold hover:underline">
              Shop Now →
            </a>
          </div>
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Oversized Tees', 'High-Waist Jeans', 'Sneakers', 'Blazers'].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition">
                <div className="text-4xl mb-3">✨</div>
                <h4 className="font-semibold">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Style Community</h2>
          <p className="mb-8 text-pink-100">Get exclusive access to new collections and special offers</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-900"
            />
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
