'use client';

import { Category } from '@/types/product';
import { ShopFilters } from './ShopFilters';
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useThemeColors } from '@/store/settings.store';

interface ShopFiltersWrapperProps {
  categories: Category[];
  priceRange: { min: number; max: number };
}

export function ShopFiltersWrapper({ categories, priceRange }: ShopFiltersWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { primary } = useThemeColors();

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 text-white rounded-full p-4 shadow-lg transition-colors"
        style={{ backgroundColor: primary }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        aria-label="Toggle filters"
      >
        {isOpen ? <X size={24} /> : <Filter size={24} />}
      </button>

      {/* Filters Sidebar - Desktop */}
      <aside className="hidden lg:block w-full lg:w-64 shrink-0">
        <ShopFilters categories={categories} priceRange={priceRange} />
      </aside>

      {/* Filters Sidebar - Mobile (Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-0 left-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={24} />
                </button>
              </div>
              <ShopFilters categories={categories} priceRange={priceRange} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
