<template>
  <div
    :class="`offcanvas__area offcanvas__radius ${
      utilsStore.openMobileMenus ? 'offcanvas-opened' : ''
    }`"
  >
    <div class="offcanvas__wrapper">
      <div class="offcanvas__close">
        <button
          @click="utilsStore.handleOpenMobileMenu()"
          class=""
        >
          <svg-close-2 />
        </button>
      </div>
      <div class="offcanvas__content">
        <div
          class="offcanvas__top mb-70 d-flex justify-content-between align-items-center"
        >
          <div class="offcanvas__logo logo flex items-center">
            <nuxt-link href="/" class="flex items-center">
              <img class="w-12" :src="siteSettingsStore.logo" alt="logo" />
              <span class="ml-2 text-lg font-semibold text-gray-800">
                {{ siteSettingsStore?.settings?.logo_text || siteSettingsStore?.logo_text }}
              </span>
            </nuxt-link>
          </div>
        </div>
        <div class="w-full bg-gray-300 py-[0.5px]"></div>

        <!-- mobile search start -->
        <div class="mobile-search mb-6" v-click-outside="hideResults">
          <form @submit.prevent="handleSubmit" class="relative">
            <div class="search-input-wrapper relative">
              <input
                type="text"
                placeholder="Search for Products..."
                v-model="searchText"
                @keyup="searchProduct"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="resultsShown" class="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div v-if="pending" class="flex items-center justify-center p-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="ml-2 text-gray-600">Loading...</span>
              </div>

              <div v-else-if="!data?.results?.length" class="p-4 text-center text-gray-500">
                No Products Found
              </div>

              <div v-else class="divide-y divide-gray-100">
                <nuxt-link
                  :href="`/product-details/${product?.name}/${product?.id}`"
                  v-for="product in data?.results"
                  :key="product.id"
                  @click="utilsStore.handleOpenMobileMenu()"
                  class="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                >
                  <img
                    class="w-12 h-12 rounded-md object-cover border"
                    :src="product?.primary_photo"
                    :alt="product?.name"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ product?.name }}</p>
                    <p class="text-xs text-gray-500">{{ product?.category?.name }}</p>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-sm font-semibold text-blue-600">{{ formatCurrency(product?.selling_price) }}</span>
                      <span class="text-xs text-gray-400">{{ product?.inventory }} Left</span>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </form>
        </div>
        <!-- mobile search end -->

        <!-- mobile category end -->
        <div class="tp-main-menu-mobile fix d-lg-none mb-40">
          <!-- mobile menus start -->
          <header-component-mobile-menus />
          <!-- mobile menus end -->
        </div>

        <div class="offcanvas__contact align-items-center d-none">
          <div class="offcanvas__contact-icon mr-20">
            <span>
              <img src="/img/icon/contact.png" alt="contact_img" />
            </span>
          </div>
          <div class="offcanvas__contact-content">
            <h3 class="offcanvas__contact-title">
              <a href="tel:+254720296923">+254720296923</a>
            </h3>
          </div>
        </div>
        <!-- <div class="offcanvas__btn">
          <nuxt-link href="/contact" class="tp-btn-2 tp-btn-border-2"
            >Contact Us</nuxt-link
          >
        </div> -->
      </div>
    </div>
  </div>

  <div
    @click="utilsStore.handleOpenMobileMenu()"
    :class="`body-overlay ${utilsStore.openMobileMenus ? 'opened' : ''}`"
  ></div>
</template>

<script setup lang="ts">
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";
import debounce from "lodash.debounce";

const props = defineProps<{ productType: string }>();
const utilsStore = useUtilityStore();
const siteSettingsStore = useSiteSettingsStore();

let isToggleActive = ref<string>("");
// handle active
const handleToggleActive = (type: string) => {
  if (type === isToggleActive.value) {
    isToggleActive.value = "";
  } else {
    isToggleActive.value = type;
  }
};

// Search functionality
let searchText = ref("");
const data = ref({});
const error = ref({});
const pending = ref(null);
const resultsShown = ref(false);

const hideResults = () => {
  resultsShown.value = false;
};

const handleSubmit = () => {
  // Handle search submit if needed
  if (searchText.value.trim()) {
    navigateTo(`/shop?search=${encodeURIComponent(searchText.value)}`);
    utilsStore.handleOpenMobileMenu(); // Close mobile menu
  }
};

const searchProduct = debounce(async () => {
  if (!searchText.value.trim()) {
    resultsShown.value = false;
    return;
  }

  try {
    resultsShown.value = true;
    pending.value = true;
    const response = await getDataUnauthed(
      `/product?search=${searchText.value}`
    );
    data.value = response.data.value;
    error.value = response.error.value;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
}, 1000);

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};
</script>
