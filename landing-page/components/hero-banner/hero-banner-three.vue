<template>
  <section class="relative z-10">
    <!-- Loader -->
    <div v-if="heroSliderStore.loading" 
         class="flex items-center justify-center min-h-[700px] lg:min-h-[650px] md:min-h-[600px] sm:min-h-[400px] bg-gray-900">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p class="text-white text-lg">Loading slides...</p>
      </div>
    </div>

    <!-- Swiper Slider -->
    <Swiper v-else
            :slidesPerView="1"
            :spaceBetween="30"
            :loop="true"
            :effect="'fade'"
            :modules="[Pagination, Navigation, EffectFade, Autoplay]"
            :autoplay="{
              delay: 5000,
              disableOnInteraction: false,
            }"
            :navigation="{
              nextEl: '.tp-slider-3-button-next',
              prevEl: '.tp-slider-3-button-prev',
            }"
            :pagination="{
              el: '.tp-slider-3-dot',
              clickable: true,
            }"
            class="swiper-container">
      <SwiperSlide v-for="item in heroSliderStore.orderedSliders"
                   :key="item.id"
                   class="relative bg-black flex items-center min-h-[700px] lg:min-h-[650px] md:min-h-[600px] sm:min-h-[400px]">
        <div class="absolute inset-0 bg-cover bg-center"
             :style="`background-image:url(${item.background_image_url || item.background_image})`">
          <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div class="container mx-auto px-4 relative z-10">
          <div class="flex items-center">
            <div class="w-full xl:w-1/2 lg:w-1/2 md:w-2/3">
              <div class="text-white space-y-6">
                <span class="text-3xl font-normal text-white block mb-2 font-serif italic">{{ item?.subtitle }}</span>
                <h3
                    class="text-7xl lg:text-6xl md:text-5xl sm:text-6xl xs:text-4xl font-normal text-white mb-6 leading-tight">
                  {{ item?.title }}</h3>
                <div v-if="item?.description"
                     class="mb-8">
                  <p class="text-white text-lg">{{ item.description }}</p>
                </div>
                <!-- <div
                  class="tp-slider-feature-3 d-flex flex-wrap align-items-center p-relative z-index-1 mb-15"
                >
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-cosmetic />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        High-end <br />
                        Cosmetics
                      </h3>
                    </div>
                  </div>
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-vegan-prd />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        Vegan <br />
                        Product
                      </h3>
                    </div>
                  </div>
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-make-up />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        Express <br />
                        Make-up
                      </h3>
                    </div>
                  </div>
                </div> -->
                <div class="mt-8">
                  <nuxt-link :href="item?.button_link || '/shop'"
                             class="inline-block px-8 py-3 border-2 text-white hover:bg-white hover:text-black transition-all duration-300 rounded-md"
                             :style="{
                              borderColor: siteSettingsStore.primaryColor,
                              color: siteSettingsStore.primaryColor
                            }">
                    {{ item?.button_text || 'Shop Now' }}
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <!-- Pagination dots -->
      <div
           class="tp-slider-3-dot absolute right-6 lg:right-12 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-2">
        <!-- Swiper will auto-generate pagination bullets here -->
      </div>

      <!-- Navigation arrows -->
      <button type="button"
              class="tp-slider-3-button-prev absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-sm">
        <svg class="w-6 h-6"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button type="button"
              class="tp-slider-3-button-next absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 backdrop-blur-sm">
        <svg class="w-6 h-6"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { useHeroSliderStore } from "@/pinia/useHeroSliderStore";
import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

const siteSettingsStore = useSiteSettingsStore();
const heroSliderStore = useHeroSliderStore();

// Fetch settings and sliders on component mount
onMounted(async () => {
  console.log("Fetching site settings and hero sliders...");
  await heroSliderStore.fetchSliders();
});
</script>

<style scoped>
/* Custom pagination bullet styles */
:deep(.tp-slider-3-dot .swiper-pagination-bullet) {
  @apply w-2 h-2 bg-white/30 rounded-full transition-all duration-300 opacity-100 m-0;
}

:deep(.tp-slider-3-dot .swiper-pagination-bullet-active) {
  @apply bg-white scale-125;
}

/* Navigation button hover effects */
.tp-slider-3-button-prev:hover,
.tp-slider-3-button-next:hover {
  @apply scale-110;
}

/* Spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>