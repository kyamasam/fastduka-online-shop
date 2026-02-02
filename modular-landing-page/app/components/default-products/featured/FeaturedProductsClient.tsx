'use client';

import { useThemeColors } from '@/store/settings.store';
import { Product } from '@/types/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { ProductCard } from '../ProductCard';

interface FeaturedProductsClientProps {
  products: Product[];
}

export function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
  const { primary } = useThemeColors();
  const [activeFilter, setActiveFilter] = useState('all');

  if (!products || products.length === 0) {
    return null;
  }

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

  const filters = ['All', 'Home Deco', 'Candles'];

  return (
    <section className="bg-white py-2">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ color: primary }}
          >
            Our Offers For
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            For the best offers in Kenya
          </p>


        </div>
        {/* Slider Container */}
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            navigation={{
              nextEl: '.tp-featured-slider-button-next',
              prevEl: '.tp-featured-slider-button-prev',
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
              className="tp-featured-slider-button-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="tp-featured-slider-button-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}