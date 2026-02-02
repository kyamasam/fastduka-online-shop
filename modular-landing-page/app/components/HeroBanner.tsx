import apiService from '@/services/api.service';
import { HeroSliderApiResponse } from '@/types/hero-slider';
import HeroBannerSlider from '@/components/banner/HeroBannerSlider';

/**
 * Server Component for Hero Banner
 * Fetches slider data on the server and passes to client component for SSR
 */
export default async function HeroBanner() {
  let sliders = [];

  try {
    const response = await apiService.get<HeroSliderApiResponse>('hero-sliders/', {
      requiresAuth: false,
    });

    // Filter active sliders and sort by order
    sliders = response.data.results
      .filter((slider) => slider.is_active)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to fetch hero sliders on server:', error);
    // Fallback: component will try to fetch client-side
  }

  return <HeroBannerSlider initialSliders={sliders} />;
}
