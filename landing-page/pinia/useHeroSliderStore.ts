import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getData, getDataUnauthed } from "../composables/api";

export interface HeroSlider {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  background_image: string;
  background_image_url: string;
  button_text: string;
  button_link: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroSliderStore = defineStore("heroSlider", () => {
  const sliders = ref<HeroSlider[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties (getters)
  const activeSliders = computed(() =>
    (sliders.value || []).filter((slider) => slider.is_active)
  );

  const orderedSliders = computed(() =>
    (sliders.value || [])
      .filter((slider) => slider.is_active)
      .sort((a, b) => a.order - b.order)
  );

  // Actions
  const fetchSliders = async () => {
    // Only fetch if not already loaded
    // if (sliders.value.length > 0) return sliders.value;

    loading.value = true;
    error.value = null;

    try {
      const response = await getDataUnauthed("/hero-sliders/");
      console.log("Hero sliders response:", response);
      console.log("Hero sliders data:", response.data?.results);

      // Handle both possible response structures
      const slidersData = response.data.value?.results || [];

      sliders.value = Array.isArray(slidersData) ? slidersData : [];

      return sliders.value;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch hero sliders";
      console.error("Error fetching hero sliders:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createSlider = async (sliderData: Partial<HeroSlider>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getData("/hero-sliders/", {
        method: "POST",
        body: sliderData,
      });
      sliders.value.push(response.data.value);
      return response.data.value;
    } catch (err: any) {
      error.value = err.message || "Failed to create hero slider";
      console.error("Error creating hero slider:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSlider = async (id: number, sliderData: Partial<HeroSlider>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getData(`/hero-sliders/${id}/`, {
        method: "PATCH",
        body: sliderData,
      });

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = response.data.value;
      }
      return response.data.value;
    } catch (err: any) {
      error.value = err.message || "Failed to update hero slider";
      console.error("Error updating hero slider:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSlider = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await getData(`/hero-sliders/${id}/`, {
        method: "DELETE",
      });

      sliders.value = sliders.value.filter((slider) => slider.id !== id);
    } catch (err: any) {
      error.value = err.message || "Failed to delete hero slider";
      console.error("Error deleting hero slider:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const uploadSliderImage = async (id: number, file: File) => {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append("background_image", file);

      const response = await getData(`/hero-sliders/${id}/upload_image/`, {
        method: "POST",
        body: formData,
      });

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = response.data.value;
      }
      return response.data.value;
    } catch (err: any) {
      error.value = err.message || "Failed to upload slider image";
      console.error("Error uploading slider image:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeSliderImage = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await getData(`/hero-sliders/${id}/remove_image/`, {
        method: "DELETE",
      });

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = response.data.value;
      }
      return response.data.value;
    } catch (err: any) {
      error.value = err.message || "Failed to remove slider image";
      console.error("Error removing slider image:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const refreshSliders = async () => {
    sliders.value = [];
    return await fetchSliders();
  };

  return {
    // State
    sliders,
    loading,
    error,

    // Getters
    activeSliders,
    orderedSliders,

    // Actions
    fetchSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    uploadSliderImage,
    removeSliderImage,
    clearError,
    refreshSliders,
  };
});
