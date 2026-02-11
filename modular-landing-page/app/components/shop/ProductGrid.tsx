'use client';

import { Product } from '@/types/product';
import { ProductCard } from '@/components/default-products/ProductCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeColors } from '@/store/settings.store';

interface ProductGridProps {
  products: Product[];
  totalCount: number;
}

export function ProductGrid({ products, totalCount }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('ordering') || '';
  const { primary } = useThemeColors();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('ordering', value);
    } else {
      params.delete('ordering');
    }

    params.set('page', '1');
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
    // Implement cart functionality
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Add to wishlist:', product);
  };

  // Calculate result range
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = 16;
  const startResult = (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalCount);

  return (
    <div>
      {/* Header with count and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-sm text-gray-600">
          Showing {startResult}–{endResult} of {totalCount} results
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
            style={{ ['--tw-ring-color' as any]: primary }}
          >
            <option value="">Default Sorting</option>
            <option value="-featured">Featured</option>
            <option value="selling_price">Price: Low to High</option>
            <option value="-selling_price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
