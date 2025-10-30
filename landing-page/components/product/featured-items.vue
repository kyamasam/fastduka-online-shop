<template>
  <section class="tp-featured-slider-area bg-gray-50 py-16 md:py-24">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-sm md:text-base text-gray-600 font-medium mb-3 tracking-wide uppercase">
          Shop Featured Items
        </span>
        <h3 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
          This Week's Featured
        </h3>
        <p class="text-gray-600 text-sm md:text-base">
          For the best offers in Kenya
        </p>
      </div>

      <!-- Slider Container -->
      <div class="relative">
        <Swiper :slidesPerView="1"
                :spaceBetween="20"
                :navigation="{
                  nextEl: '.tp-featured-slider-button-next',
                  prevEl: '.tp-featured-slider-button-prev',
                }"
                :modules="[Navigation]"
                :breakpoints="{
                  '1200': {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  '992': {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  '768': {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  '640': {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  '0': {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                }"
                class="tp-featured-slider-active !pb-4">
          <SwiperSlide v-for="item in filteredProducts"
                       :key="item.id">
            <!-- Product Card -->
            <div
                 class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
              <!-- Product Image -->
              <div class="relative overflow-hidden bg-gray-100 aspect-square">
                <div class="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                     :style="`background-image: url(${item?.primary_photo})`"></div>

                <!-- Out of Stock Badge -->
                <div v-if="item.stock === 0"
                     class="absolute top-4 right-4 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded">
                  Out-Of-Stock
                </div>

                <!-- Sale Badge -->
                <div v-else-if="item.sale_price > 0"
                     class="absolute top-4 right-4 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded">
                  Sale
                </div>

                <!-- Action Icons -->
                <div
                     class="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button class="w-12 h-12 bg-gray-900 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                          title="Add to Cart">
                    <i class="fa-solid fa-shopping-cart text-sm"></i>
                  </button>
                  <button class="w-12 h-12 bg-white hover:bg-emerald-600 hover:text-white text-gray-900 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                          title="Quick View">
                    <i class="fa-solid fa-eye text-sm"></i>
                  </button>
                  <button class="w-12 h-12 bg-white hover:bg-pink-600 hover:text-white text-gray-900 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                          title="Add to Wishlist">
                    <i class="fa-solid fa-heart text-sm"></i>
                  </button>
                </div>
              </div>

              <!-- Product Content -->
              <div class="p-5 md:p-6 flex-1 flex flex-col">
                <!-- Category -->
                <p class="text-xs md:text-sm text-gray-600 mb-2 font-medium">
                  {{ item?.category?.name || 'Home Deco' }}
                </p>

                <!-- Product Title -->
                <h3 class="mb-3 flex-1">
                  <nuxt-link :href="`/product-details/${item?.name}/${item.id}`"
                             class="text-base md:text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors duration-200 line-clamp-2 leading-snug">
                    {{ item?.name }}
                  </nuxt-link>
                </h3>

                <!-- Stock Info -->
                <p v-if="item.stock !== undefined && item.stock > 0"
                   class="text-sm text-gray-600 mb-3">
                  {{ item.stock }} Left
                </p>

                <!-- Product Description Preview -->
                <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {{ item?.description || 'Discover timeless pieces that blend comfort, confidence, and class.' }}
                </p>

                <!-- Price & Rating Row -->
                <div class="flex items-center justify-between mb-4">
                  <!-- Price -->
                  <div class="flex items-baseline gap-2">
                    <span v-if="item.sale_price > 0"
                          class="text-sm text-gray-400 line-through">
                      {{ formatCurrency(item.selling_price) }}
                    </span>
                    <span class="text-xl md:text-2xl font-bold text-gray-900">
                      {{ formatCurrency(item.sale_price > 0 ? item.sale_price : item.selling_price) }}
                    </span>
                  </div>

                  <!-- Rating Stars -->
                  <div class="flex items-center gap-0.5">
                    <i v-for="n in 5"
                       :key="n"
                       class="fa-solid fa-star text-yellow-400 text-xs"></i>
                  </div>
                </div>

                <!-- Shop Now Button -->
                <nuxt-link :href="`/product-details/${item?.name}/${item.id}`"
                           class="w-full bg-gray-900 hover:bg-emerald-600 text-white text-sm md:text-base font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition-all duration-200 group/btn">
                  <span>Shop Now</span>
                  <svg-right-arrow class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </nuxt-link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- Navigation Arrows -->
        <div class="flex items-center justify-center gap-4 mt-8 md:mt-12">
          <button
                  class="tp-featured-slider-button-prev w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-gray-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-sm hover:shadow-md">
            <svg-slider-btn-prev class="w-5 h-5" />
          </button>
          <button
                  class="tp-featured-slider-button-next w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-gray-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 shadow-sm hover:shadow-md">
            <svg-slider-btn-next class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <!-- <div v-if="!filteredProducts?.length" class="text-center py-16 md:py-20">
        <p class="text-gray-600 text-base md:text-lg mb-6">
          We don't have any featured items at the moment
        </p>
        <nuxt-link
          href="/shop"
          class="inline-block bg-gray-900 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded transition-colors duration-200"
        >
          Go To Shop
        </nuxt-link>
      </div> -->
    </div>
  </section>
</template>

<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

const data = ref(null);
const error = ref(null);
const pending = ref(null);
let refreshProducts;
const filteredProducts = ref([]);

const fetchProducts = async () => {
  pending.value = true;

  try {
    const response = await getDataUnauthed(`/product?featured=` + 1);
    data.value = response.data.value;
    error.value = response.error.value;
    filteredProducts.value = response.data.value.results;
    refreshProducts = response.refresh;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

fetchProducts();
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Aspect ratio utility */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Ensure consistent card heights */
.swiper-slide {
  height: auto;
}

/* Smooth hover transitions */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Navigation button hover states */
.tp-featured-slider-button-prev:hover svg,
.tp-featured-slider-button-next:hover svg {
  transform: scale(1.1);
}
</style>