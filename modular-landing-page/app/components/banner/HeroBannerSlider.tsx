'use client';

import { useHeroSliderStore } from '@/store/hero-slider.store';
import { useThemeColors } from '@/store/settings.store';
import { HeroSlide } from '@/types/hero-slider';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroBannerSliderProps {
  initialSliders?: HeroSlide[];
}

export default function HeroBannerSlider({ initialSliders }: HeroBannerSliderProps) {
  const { sliders, loading, fetchSliders, setSliders } = useHeroSliderStore();
  const { primary: primaryColor } = useThemeColors();

  useEffect(() => {
    // If we have initial sliders from SSR, set them
    if (initialSliders && initialSliders.length > 0) {
      setSliders(initialSliders);
    } else if (sliders.length === 0 && !loading) {
      // Otherwise fetch from API
      fetchSliders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Display sliders (prefer store sliders, fallback to initial)
  const displaySliders = sliders.length > 0 ? sliders : initialSliders || [];

  if (loading && displaySliders.length === 0) {
    return (
      <section className="relative z-10">
        <div className="flex items-center justify-center min-h-[600px] lg:min-h-[650px] md:min-h-[550px] sm:min-h-[450px] bg-gray-900">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading slides...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displaySliders.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={displaySliders.length > 1}
        effect="fade"
        modules={[Pagination, Navigation, EffectFade, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.tp-slider-3-button-next',
          prevEl: '.tp-slider-3-button-prev',
        }}
        pagination={{
          el: '.tp-slider-3-dot',
          clickable: true,
        }}
        className="swiper-container"
      >
        {displaySliders.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative bg-gray-900 flex items-center min-h-[600px] lg:min-h-[650px] md:min-h-[550px] sm:min-h-[450px]"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${item.background_image_url || item.background_image})`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center min-h-[500px]">
                <div className="w-full max-w-2xl">
                  <div className="text-white space-y-5">
                    {/* Icon with Subtitle */}
                    {item.subtitle && (
                      <div className="flex items-center gap-3 mb-4">

                        <span
                          className="text-lg text-white sm:text-xl font-semibold italic"

                        >
                          {item.subtitle}
                        </span>
                      </div>
                    )}

                    {/* Main Title */}
                    <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-tight tracking-wide">
                      {item.title}
                    </p>

                    {/* Description */}
                    {item.description && (
                      <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link
                        href={item.button_link || '/shop'}
                        className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-white text-sm sm:text-base font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 border border-white rounded"
                      >
                        {item.button_text || 'Shop Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Pagination Dots - Left Side */}
        <div className="tp-slider-3-dot absolute left-6 sm:left-8 lg:left-12 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3"></div>

        {/* Navigation Arrows */}
        {displaySliders.length > 1 && (
          <>
            <button
              type="button"
              className="tp-slider-3-button-prev absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 w-10 h-10 sm:w-12 sm:h-12 bg-transparent border border-white/30 hover:bg-white hover:border-white text-white hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 z-20 -ml-16 sm:-ml-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              className="tp-slider-3-button-next absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-12 w-10 h-10 sm:w-12 sm:h-12 bg-transparent border border-white/30 hover:bg-white hover:border-white text-white hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 z-20 ml-16 sm:ml-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </Swiper>

      <style jsx global>{`
        /* Custom pagination bullet styles */
        .tp-slider-3-dot {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tp-slider-3-dot .swiper-pagination-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 9999px;
          transition: all 0.3s ease;
          opacity: 1;
          margin: 0;
          cursor: pointer;
        }

        .tp-slider-3-dot .swiper-pagination-bullet:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }

        .tp-slider-3-dot .swiper-pagination-bullet-active {
          background-color: white;
          height: 2rem;
          border-radius: 9999px;
        }

        /* Smooth fade effect */
        .swiper-fade .swiper-slide {
          transition-property: opacity;
        }
      `}</style>
    </section>
  );
}