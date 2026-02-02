'use client';

import apiService from '@/services/api.service';
import { Category } from '@/types/category';
import { useEffect, useState } from 'react';

interface CategoryFilterProps {
  onCategoryChange: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

export function CategoryFilter({ onCategoryChange, selectedCategoryId }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiService.get<Category[]>('/category/categories-unpaged/', {
          requiresAuth: false,
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-4 py-8">
        <div className="animate-pulse flex gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-3 flex-wrap py-4">
      {/* All Categories Button */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedCategoryId === null
          ? 'text-[#8B4513] font-semibold'
          : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        All
      </button>

      {/* Category Separators and Buttons */}
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-3">
          <span className="text-gray-300">•</span>
          <button
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedCategoryId === category.id
              ? 'text-[#8B4513] font-semibold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {category.name}
          </button>
        </div>
      ))}
    </div>
  );
}
