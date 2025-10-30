<template>
  <div>
    <nuxt-layout name="layout-two">
      <!-- hero banner start -->
      <hero-banner-three />
      <!-- hero banner end -->

      <!-- products section start -->
      <section class="tp-product-area pb-24 md:pb-90 px-4 md:px-32">
        <div class="">
          <div class="row">
            <div class="col-xl-12">
              <div class="tp-section-title-wrapper-2 text-center mb-35">
                <span class="tp-section-title-pre-2">
                  <svg-section-line-2 />
                </span>
                <h1 class="tp-section-title-2">Our Offers For</h1>
                <h2 class="text-sm text-thin text-gray-400">
                  For the best offers in Kenya
                </h2>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="tp-product-tab-2 tp-tab mb-50 text-center">
                <nav>
                  <div class="nav nav-tabs justify-content-center"
                       id="nav-tab"
                       role="tablist">
                    <button v-for="(tab, i) in tabs"
                            :key="i"
                            :class="`nav-link ${activeTab === tab?.id ? 'active' : ''}`"
                            @click="handleActiveTab(tab?.id)">
                      {{ tab?.name }}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          <div v-if="!filteredProducts.length && !pending">
            <p class="capitalize">No Products Match your criteria</p>
          </div>

          <div v-if="pending"
               class="text-center">
            <p>Loading products...</p>
          </div>

          <div class="row">
            <div class="col-xl-12">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
                <div v-for="item in filteredProducts"
                     :key="item.id"
                     class="md:col-span-3 col-span-12 gap-2">
                  <product-item :item="item" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center">
            <nuxt-link href="/shop"
                       class="tp-btn tp-btn-border flex items-center gap-2">
              Go to Shop
              <svg-right-arrow />
            </nuxt-link>
          </div>
        </div>
      </section>
      <!-- products section end -->

      <!-- popular product items start -->
      <!-- <product-popular-items /> -->
      <!-- popular product items end -->

      <!-- all products start -->
      <!-- <product-all-products /> -->
      <!-- all products end -->

      <!-- featured products start -->
      <!-- <product-featured-items /> -->
      <!-- featured products end -->

      <!-- testimonial start -->
      <!-- <testimonial-fashion /> -->
      <!-- testimonial end -->
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Fastduka: Order Meat In Kenya Order Beer in Kenya",
  ogTitle: "Fastduka: Order Meat in Kenya and Order Liquor Kenya",
  keywords:
    "Order Beef online, Fish online, Chicken online, Mutton online, Steak Nairobi, meat home delivery",
  description:
    "Online butchery in Kenya - Order fresh meat. Goat, Beef, pork, chicken",
  ogDescription:
    "Online butchery in Kenya - Order fresh meat. Goat, Beef, pork, chicken",
  ogImage: "/public/images/logo-red.svg",
  twitterCard: "summary_large_image",
});

// Products section logic
const tabs = ref([]);
const activeTab = ref(undefined);
const filterString = ref("");
const pending = ref(false);
const filteredProducts = ref([]);
const error = ref(null);

// Generate filter string based on active tab
const generateFilterString = () => {
  let filter_obj = {
    category_id: activeTab.value,
  };

  console.log("filter obj", filter_obj);
  let tempFilterString = "";

  Object.keys(filter_obj).forEach((key, index) => {
    let filter_prefix = index === 0 ? "?" : "&";

    if (filter_obj[key] !== undefined) {
      tempFilterString += `${filter_prefix}${key}=${filter_obj[key]}`;
    }
  });

  filterString.value = tempFilterString;
  console.log("filter string", filterString.value);

  return tempFilterString;
};

const fetchProducts = async () => {
  generateFilterString();
  pending.value = true;
  error.value = null;

  try {
    const { data, error: fetchError, execute } = getDataUnauthed(
      `/product/${filterString.value}`
    );
    await execute();

    if (fetchError.value) {
      throw fetchError.value;
    }

    filteredProducts.value = (data.value?.results || []).map(product => {
      if (product.description) {
        product.description = product.description
          .replace(/\r\n/g, ' ')
          .replace(/\r/g, ' ')
          .trim();
      }
      return product;
    });

    console.log("Products fetched:", filteredProducts.value);
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
    filteredProducts.value = [];
  } finally {
    pending.value = false;
  }
};

// Handle tab change
const handleActiveTab = async (tab) => {
  activeTab.value = tab;
  await fetchProducts();
};

// Watch for changes in activeTab
watch(activeTab, async () => {
  await fetchProducts();
});

// Fetch categories first
const { data: filtersData, error: filtersError } = await getDataUnauthed(
  "/category?category_type=MEAT"
);

if (filtersError.value) {
  console.error("Error fetching categories:", filtersError.value);
} else {
  console.log("Fetch categories", filtersData?.value?.results);

  tabs.value = [
    { id: undefined, name: "All" },
    ...filtersData?.value?.results || [],
  ];

  // Set initial active tab to first tab (All)
  activeTab.value = tabs.value[0]?.id;
}

// Initial fetch of products
await fetchProducts();
</script>
