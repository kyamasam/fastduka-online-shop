<template>
  <header>
    <div
      :class="`tp-header-area bg-primary-red-500 tp-header-style-primary w-full tp-header-height`"
    >
      <!-- header top start  -->
      <!-- header bottom start -->
      <div
        id="header-sticky"
        :class="`tp-header-bottom-2 tp-header-sticky ${
          isSticky ? 'header-sticky' : ''
        }`"
      >
        <div class="container">
          <div class="tp-mega-menu-wrapper p-relative">
            <div class="row align-items-center">
              <div class="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
                <div class="logo">
                  <nuxt-link href="/">
                    <img class="w-10/12" src="/img/logo/logo.svg" alt="logo" />
                  </nuxt-link>
                </div>
              </div>
              <div class="col-xl-5 d-none d-xl-block">
                <div class="main-menu menu-style-2">
                  <nav class="tp-main-menu-content">
                    <!-- menus start -->
                    <header-component-menus />
                    <!-- menus end -->
                  </nav>
                </div>
              </div>
              <div class="col-xl-5 col-lg-7 col-md-7 col-sm-8 col-6">
                <div
                  v-click-outside="hideResults"
                  class="tp-header-bottom-right d-flex align-items-center md:justify-content-end md:pl-30"
                >
                  <div class="tp-header-search-2 d-none d-sm-block relative">
                    <form @submit.prevent="handleSubmit">
                      <input
                        type="text"
                        placeholder="Search for Products..."
                        v-model="searchText"
                        @keyup="searchProduct"
                      />
                    </form>
                    <div
                      v-if="resultsShown"
                      class="absolute mt-4 flex flex-col gap-2 rounded-sm h-auto max-h-72 overflow-y-scroll px-2 w-full border bg-white"
                    >
                      <div class="flex flex-row" v-if="pending">
                        <p>Loading ...</p>
                      </div>
                      <div
                        class="flex flex-row pt-3"
                        v-if="!data?.results?.length"
                      >
                        <p>No Products Found</p>
                      </div>
                      <nuxt-link
                        :href="`/product-details/${product?.name}/${product?.id}`"
                        v-for="product in data?.results"
                        class="flex cursor-pointer gap-2 border-b h-min items-center justify-between p-2 w-full"
                      >
                        <img
                          class="border rounded-md w-12 h-12"
                          :src="product?.primary_photo"
                        />
                        <p class="leading-0 mb-0">{{ product?.name }}</p>
                        <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                        <p class="leading-0 mb-0">
                          {{ product?.category?.name }}
                        </p>
                        <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                        <p class="leading-0 mb-0">
                          {{ formatCurrency(product?.selling_price) }}
                        </p>
                        <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                        <p class="leading-0 mb-0">
                          {{ product?.inventory }} Left
                        </p>
                      </nuxt-link>
                    </div>
                  </div>
                  <div
                    class="tp-header-action d-flex align-items-center text-white ml-4 md:ml-30"
                  >
                    <div class="tp-header-action-item d-none d-lg-block">
                      <nuxt-link href="/wishlist" class="tp-header-action-btn">
                        <svg-wishlist />
                        <span class="tp-header-action-badge">{{
                          wishlistStore.wishlists.length
                        }}</span>
                      </nuxt-link>
                    </div>
                    <div class="tp-header-action-item">
                      <button
                        @click="cartStore?.handleCartOffcanvas"
                        class="tp-header-action-btn cartmini-open-btn"
                      >
                        <svg-cart-bag />
                        <span class="tp-header-action-badge">{{
                          cartStore?.totalPriceQuantity.quantity
                        }}</span>
                      </button>
                    </div>
                    <div class="tp-header-action-item">
                      <nuxt-link
                        href="/profile"
                        class="tp-header-action-btn cartmini-open-btn"
                      >
                        <svg-profile />
                      </nuxt-link>
                    </div>
                    <div
                      class="tp-header-action-item tp-header-hamburger ml-12 md:mr-20 d-xl-none"
                    >
                      <button
                        @click="utilsStore.handleOpenMobileMenu()"
                        type="button"
                        class="tp-offcanvas-open-btn"
                      >
                        <svg-menu-icon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- cart offcanvas start -->
  <offcanvas-cart-sidebar />
  <!-- cart offcanvas end -->

  <!-- cart offcanvas start -->
  <offcanvas-mobile-sidebar product-type="fashion" />
  <!-- cart offcanvas end -->
</template>

<script setup>
const router = useRouter();
const { isSticky } = useSticky();
import { useCartStore } from "@/pinia/useCartStore";
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";
import debounce from "lodash.debounce";
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilsStore = useUtilityStore();

defineProps({});

let searchText = ref("");
const data = ref({});
const error = ref({});
const pending = ref(null);
const resultsShown = ref(false);
const hideResults = () => {
  resultsShown.value = false;
};

const searchProduct = debounce(async () => {
  console.log("searched");
  try {
    resultsShown.value = true;
    pending.value = true;
    console.log("here");
    const response = await getDataUnauthed(
      `/product?search=${searchText.value}`
    );
    console.log("response", response);
    data.value = response.data.value; // Directly set new data
    error.value = response.error.value;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
}, 1000);
</script>
