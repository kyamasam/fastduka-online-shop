'use client';

import { Category } from '@/types/product';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useThemeColors } from '@/store/settings.store';

interface ShopFiltersProps {
  categories: Category[];
  priceRange: { min: number; max: number };
}

export function ShopFilters({ categories, priceRange }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { primary } = useThemeColors();

  // Initialize state from URL params
  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get('selling_price__gte')) || priceRange.min
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get('selling_price__lte')) || priceRange.max
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category_id')?.split(',').filter(Boolean) || []
  );
  const [onSale, setOnSale] = useState(searchParams.get('on_sale') === 'true');
  const [inStock, setInStock] = useState(searchParams.get('in_stock') === 'true');

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'false') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handlePriceChange = () => {
    updateFilters({
      selling_price__gte: minPrice > priceRange.min ? String(minPrice) : null,
      selling_price__lte: maxPrice < priceRange.max ? String(maxPrice) : null,
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    let newCategories: string[];

    if (selectedCategories.includes(categoryId)) {
      newCategories = selectedCategories.filter((id) => id !== categoryId);
    } else {
      newCategories = [...selectedCategories, categoryId];
    }

    setSelectedCategories(newCategories);
    updateFilters({
      category_id: newCategories.length > 0 ? newCategories.join(',') : null,
    });
  };

  const handleOnSaleToggle = () => {
    const newValue = !onSale;
    setOnSale(newValue);
    updateFilters({ on_sale: newValue ? 'true' : null });
  };

  const handleInStockToggle = () => {
    const newValue = !inStock;
    setInStock(newValue);
    updateFilters({ in_stock: newValue ? 'true' : null });
  };

  const clearAllFilters = () => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSelectedCategories([]);
    setOnSale(false);
    setInStock(false);
    router.push('/shop');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Clear Filters */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">REFINE BY</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear All
        </button>
      </div>

      {/* Price Filter */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4" style={{ color: primary }}>
          Price Filter
        </h4>

        {/* Dual Range Slider */}
        <div className="mb-4 px-2">
          <div className="relative h-2 bg-gray-200 rounded">
            <div
              className="absolute h-2 rounded"
              style={{
                backgroundColor: primary,
                left: `${((minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                right: `${100 - ((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
              }}
            />
          </div>

          <div className="relative">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={minPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < maxPrice) {
                  setMinPrice(value);
                }
              }}
              onMouseUp={handlePriceChange}
              onTouchEnd={handlePriceChange}
              className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              style={{
                zIndex: minPrice > maxPrice - (priceRange.max - priceRange.min) * 0.05 ? 5 : 3,
                ['--thumb-color' as any]: primary
              }}
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > minPrice) {
                  setMaxPrice(value);
                }
              }}
              onMouseUp={handlePriceChange}
              onTouchEnd={handlePriceChange}
              className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              style={{ ['--thumb-color' as any]: primary }}
            />
          </div>

          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              background-color: ${primary};
            }
            input[type="range"]::-moz-range-thumb {
              background-color: ${primary};
            }
          `}</style>
        </div>

        <div className="text-sm text-gray-700 mt-6">
          KES {minPrice.toLocaleString()} - KES {maxPrice.toLocaleString()}
        </div>
      </div>

      {/* Product Status */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4" style={{ color: primary }}>
          Product Status
        </h4>

        <label className="flex items-center gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={onSale}
            onChange={handleOnSaleToggle}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">On sale</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockToggle}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">In Stock</span>
        </label>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4" style={{ color: primary }}>
          Categories
        </h4>

        {categories.map((category) => (
          <div key={category.id} className="mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(String(category.id))}
                onChange={() => handleCategoryToggle(String(category.id))}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>

            {/* Render child categories */}
            {category.children && category.children.length > 0 && (
              <div className="ml-6 mt-2">
                {category.children.map((child) => (
                  <label key={child.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(String(child.id))}
                      onChange={() => handleCategoryToggle(String(child.id))}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{child.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
