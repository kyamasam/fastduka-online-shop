'use client';

import { useThemeColors } from '@/store/settings.store';
import { Category } from '@/types/product';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface ShopFiltersProps {
  categories: Category[];
  priceRange: { min: number; max: number };
}

export function ShopFilters({ categories, priceRange }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { primary } = useThemeColors();

  const [openSections, setOpenSections] = useState<string[]>(['price', 'status', 'categories']);
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('selling_price__gte')) || priceRange.min);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('selling_price__lte')) || priceRange.max);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'false') params.delete(key);
      else params.set(key, value);
    });
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategoryToggle = (id: string) => {
    const current = searchParams.get('category_id')?.split(',').filter(Boolean) || [];
    const next = current.includes(id) ? current.filter(c => c !== id) : [...current, id];
    updateFilters({ category_id: next.length ? next.join(',') : null });
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Filters</h3>
        <button
          onClick={() => router.push('/shop')}
          className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors font-medium"
        >
          <RotateCcw size={13} />
          Reset All
        </button>
      </div>

      {/* Price Section */}
      <FilterSection
        title="Price Range"
        isOpen={openSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <div className="pt-4 pb-4 px-1">
          <div className="relative h-1 w-full bg-gray-100 rounded-full">
            <div
              className="absolute h-full transition-all duration-150"
              style={{
                backgroundColor: primary,
                left: `${((minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                right: `${100 - ((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
              }}
            />
          </div>
          <div className="relative -mt-1 mb-10">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))}
              onMouseUp={() => updateFilters({ selling_price__gte: String(minPrice) })}
              className="range-thumb-custom pointer-events-none absolute w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))}
              onMouseUp={() => updateFilters({ selling_price__lte: String(maxPrice) })}
              className="range-thumb-custom pointer-events-none absolute w-full appearance-none bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] block text-gray-400 uppercase font-bold">Min</span>
              <span className="text-sm font-semibold text-gray-700">KES {minPrice.toLocaleString()}</span>
            </div>
            <div className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-100 text-right">
              <span className="text-[10px] block text-gray-400 uppercase font-bold">Max</span>
              <span className="text-sm font-semibold text-gray-700">KES {maxPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Status Section */}
      <FilterSection
        title="Availability"
        isOpen={openSections.includes('status')}
        onToggle={() => toggleSection('status')}
      >
        <div className="space-y-3 pt-2">
          <CustomCheckbox
            label="On Sale"
            checked={searchParams.get('on_sale') === 'true'}
            onChange={(val: boolean) => updateFilters({ on_sale: val ? 'true' : null })}
            color={primary}
          />
          <CustomCheckbox
            label="In Stock"
            checked={searchParams.get('in_stock') === 'true'}
            onChange={(val: boolean) => updateFilters({ in_stock: val ? 'true' : null })}
            color={primary}
          />
        </div>
      </FilterSection>

      {/* Categories Section */}
      <FilterSection
        title="Categories"
        isOpen={openSections.includes('categories')}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-1 pt-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((category) => (
            <div key={category.id}>
              <CustomCheckbox
                label={category.name}
                checked={searchParams.get('category_id')?.split(',').includes(String(category.id))}
                onChange={() => handleCategoryToggle(String(category.id))}
                color={primary}
                className="py-1.5"
              />
              {category.children && category.children.length > 0 && (
                <div className="ml-5 mt-1 pl-3 border-l border-gray-100 space-y-1">
                  {category.children.map((child) => (
                    <CustomCheckbox
                      key={child.id}
                      label={child.name}
                      checked={searchParams.get('category_id')?.split(',').includes(String(child.id))}
                      onChange={() => handleCategoryToggle(String(child.id))}
                      color={primary}
                      className="py-1 opacity-80 hover:opacity-100"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterSection>

      <style jsx global>{`
        .range-thumb-custom::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid ${primary};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// Sub-components with manual class handling
function FilterSection({ title, children, isOpen, onToggle }: any) {
  return (
    <div className="border-b border-gray-50 py-3">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-[13px] font-bold text-gray-700 hover:text-black transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90 opacity-40'}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function CustomCheckbox({ label, checked, onChange, color, className = "" }: any) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-5 h-5 border-2 rounded-md transition-all duration-200 ${checked ? 'border-transparent' : 'border-gray-200 group-hover:border-gray-300'}`}
          style={{ backgroundColor: checked ? color : 'transparent' }}
        />
        <svg
          className={`absolute w-3 h-3 text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </label>
  );
}