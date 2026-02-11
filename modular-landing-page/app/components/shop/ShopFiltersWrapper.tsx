'use client';

import { useThemeColors } from '@/store/settings.store';
import { Category } from '@/types/product';
import { SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ShopFilters } from './ShopFilters';

interface ShopFiltersWrapperProps {
  categories: Category[];
  priceRange: { min: number; max: number };
}

export function ShopFiltersWrapper({ categories, priceRange }: ShopFiltersWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { primary } = useThemeColors();

  // Prevent scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return (
    <>
      {/* Mobile Floating Filter Button */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full shadow-xl text-white font-bold transition-transform active:scale-95"
          style={{ backgroundColor: primary }}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 pr-10">
        <div className="sticky top-28">
          <ShopFilters categories={categories} priceRange={priceRange} />
        </div>
      </aside>

      {/* Mobile Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Slide-out Drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-[101] w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-gray-400"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <ShopFilters categories={categories} priceRange={priceRange} />
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-black/5"
              style={{ backgroundColor: primary }}
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}