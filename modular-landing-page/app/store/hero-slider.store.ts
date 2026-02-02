import { create } from 'zustand';
import apiService, { ApiError } from '@/services/api.service';
import { HeroSlide, HeroSliderApiResponse, HeroSliderState } from '@/types/hero-slider';

/**
 * Hero Slider Store
 * Manages hero slider/banner data fetched from /api/hero-sliders/
 */
export const useHeroSliderStore = create<HeroSliderState>()((set) => ({
  sliders: [],
  loading: false,
  error: null,

  /**
   * Fetch hero sliders from the API
   * Filters only active sliders and sorts by order
   */
  fetchSliders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<HeroSliderApiResponse>('hero-sliders/', {
        requiresAuth: false,
      });

      // Filter active sliders and sort by order
      const activeSliders = response.data.results
        .filter((slider) => slider.is_active)
        .sort((a, b) => a.order - b.order);

      set({ sliders: activeSliders, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false,
      });
      console.error('Failed to fetch hero sliders:', apiError);
    }
  },

  /**
   * Set sliders directly (useful for SSR)
   */
  setSliders: (sliders: HeroSlide[]) => {
    set({ sliders, loading: false, error: null });
  },
}));
