/**
 * Hero Slider Types
 * Defines the structure for hero slider/banner data
 */

export interface HeroSlide {
  id: number;
  background_image_url: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  title: string;
  subtitle: string;
  description: string;
  background_image: string;
  button_text: string;
  button_link: string;
  order: number;
}

export interface HeroSliderApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HeroSlide[];
}

export interface HeroSliderState {
  sliders: HeroSlide[];
  loading: boolean;
  error: string | null;
  fetchSliders: () => Promise<void>;
  setSliders: (sliders: HeroSlide[]) => void;
}
