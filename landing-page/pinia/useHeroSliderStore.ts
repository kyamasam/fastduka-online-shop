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
    loading.value = true;
    error.value = null;

    try {
      const {
        data,
        error: fetchError,
        execute,
      } = getDataUnauthed("/hero-sliders/");
      await execute(); 

      console.log("Hero sliders response:", data.value?.results);

      // Check for errors
      if (fetchError.value) {
        throw fetchError.value;
      }

      // Extract results from the response
      const slidersData = data.value?.results || [];
      sliders.value = Array.isArray(slidersData) ? slidersData : [];
      console.log("sliders data", sliders.value)

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
      const { data, error: fetchError } = await getData("/hero-sliders/", {
        method: "POST",
        body: sliderData,
      });

      if (fetchError.value) {
        throw fetchError.value;
      }

      sliders.value.push(data.value);
      return data.value;
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
      const { data, error: fetchError } = await getData(
        `/hero-sliders/${id}/`,
        {
          method: "PATCH",
          body: sliderData,
        }
      );

      if (fetchError.value) {
        throw fetchError.value;
      }

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = data.value;
      }
      return data.value;
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
      const { error: fetchError } = await getData(`/hero-sliders/${id}/`, {
        method: "DELETE",
      });

      if (fetchError.value) {
        throw fetchError.value;
      }

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

      const { data, error: fetchError } = await getData(
        `/hero-sliders/${id}/upload_image/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (fetchError.value) {
        throw fetchError.value;
      }

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = data.value;
      }
      return data.value;
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
      const { data, error: fetchError } = await getData(
        `/hero-sliders/${id}/remove_image/`,
        {
          method: "DELETE",
        }
      );

      if (fetchError.value) {
        throw fetchError.value;
      }

      const index = sliders.value.findIndex((slider) => slider.id === id);
      if (index !== -1) {
        sliders.value[index] = data.value;
      }
      return data.value;
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
