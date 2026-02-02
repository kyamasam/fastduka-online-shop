'use client';

import apiService from '@/services/api.service';
import { useThemeColors } from '@/store/settings.store';
import { Product, ProductsResponse } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { CategoryFilter } from '../CategoryFilter';
import { ProductCard } from '../ProductCard';

interface TopSellingProductsClientProps {
  products: Product[];
  title?: String,
  subTitle?: String
}

export function ProductsListClient({ products: initialProducts, title = "Top Selling Products", subTitle = "Top selling products in our store" }: TopSellingProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { primary } = useThemeColors();

  // Fetch products when category changes
  useEffect(() => {
    async function fetchProductsByCategory() {
      if (selectedCategoryId === null) {
        setProducts(initialProducts);
        return;
      }

      setLoading(true);
      try {
        const response = await apiService.get<ProductsResponse>('/product/', {
          params: { category_id: selectedCategoryId },
          requiresAuth: false,
        });
        setProducts(response.data.results || []);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsByCategory();
  }, [selectedCategoryId, initialProducts]);

  // Handler functions for product actions
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
    // Implement your add to cart logic here
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
    // Implement your quick view logic here
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Add to wishlist:', product);
    // Implement your wishlist logic here
  };

  return (
    <section className="bg-white py-4">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: primary }}
          >
            {title}
          </h2>
          <p className="text-gray-400 text-sm mb-2">
            {subTitle}
          </p>


        </div>
        {/* Category Filter */}
        <CategoryFilter
          onCategoryChange={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />

        {loading ? (
          <div className="flex justify-center items-center py-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg mb-6">No Products Match Your Criteria</p>
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="px-6 py-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              Go to Shop
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={20}
              navigation={{
                nextEl: '.tp-products-slider-button-next',
                prevEl: '.tp-products-slider-button-prev',
              }}
              modules={[Navigation]}
              breakpoints={{
                1024: { slidesPerView: 4, spaceBetween: 30 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                0: { slidesPerView: 1, spaceBetween: 16 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                className="tp-products-slider-button-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="tp-products-slider-button-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}