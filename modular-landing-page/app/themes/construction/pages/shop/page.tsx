// Construction theme override for shop page

export default function ConstructionShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-bold">🏗️ Construction Theme - Shop Page Override</p>
        <p className="text-sm">This page is loaded from themes/construction/pages/shop/page.tsx</p>
      </div>

      <h1 className="text-4xl font-bold mb-6">Construction Equipment Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-6xl">
            🔨
          </div>
          <h3 className="text-xl font-bold mb-2">Power Tools</h3>
          <p className="text-gray-600 mb-4">Heavy duty construction tools</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            View Products
          </button>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-6xl">
            🚜
          </div>
          <h3 className="text-xl font-bold mb-2">Heavy Machinery</h3>
          <p className="text-gray-600 mb-4">Construction vehicles and equipment</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            View Products
          </button>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition">
          <div className="bg-orange-500 h-48 mb-4 rounded flex items-center justify-center text-white text-6xl">
            🦺
          </div>
          <h3 className="text-xl font-bold mb-2">Safety Equipment</h3>
          <p className="text-gray-600 mb-4">PPE and safety gear</p>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
            View Products
          </button>
        </div>
      </div>
    </div>
  );
}
