<template>
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

      <div v-if="!filteredProducts.length">
        <p class="capitalize">No Products Match your criteria</p>
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
</template>

<script setup>
import { ref } from "vue";
// tabs
const tabs = ref([]);
const activeTab = ref(tabs[0]);

// handleActiveTab
const handleActiveTab = async (tab) => {
  activeTab.value = tab;
  generateFilterString();
  await fetchProducts();
  //await fetchProducts();
};
const filterString = ref("");
const generateFilterString = () => {
  let filter_obj = {
    // on_sale: true,
    // product_type: "MEAT",
    category_id: activeTab.value,
  };
  console.log("filter obj", filter_obj);
  let tempFilterString = "";

  Object.keys(filter_obj).map((key, index) => {
    let filter_prefix = "?";
    if (index === 0) {
      filter_prefix = "?";
    } else {
      filter_prefix = "&";
    }

    if (filter_obj[key] !== undefined) {
      tempFilterString += `${filter_prefix}${key}=${filter_obj[key]}`;
    }
  });
  filterString.value = tempFilterString;
  console.log("not undefined", filterString.value);

  return tempFilterString;
};

const loadingProducts = ref(false);

// Reactive references for API response
const data = ref(null);
const error = ref(null);
const pending = ref(null);
let refreshProducts;
const filteredProducts = ref([]);

const fetchProducts = async () => {
  generateFilterString();
  pending.value = true;

  try {
    const response = await getDataUnauthed(`/product/${filterString.value}`);
    data.value = response.data.value; // Directly set new data
    error.value = response.error.value;
    filteredProducts.value = response.data.value.results;

    refreshProducts = response.refresh; // Update the refresh reference
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// Watch for changes in filterString and fetch new products
watch(filterString, async () => {
  await fetchProducts();
});

// Initial fetch
await fetchProducts();

if (!error.value) {
  console.log("success");
  console.log("reutnr", filteredProducts.value);
} else {
  console.error("Error fetching products:", error.value);
}

// Fetch categories
const { data: filtersData, error: filtersError } = await getDataUnauthed(
  "/category?category_type=MEAT"
);
console.log("Fetch categories", filtersData?.value?.results);
if (filtersError.value) {
  console.error("Error fetching categories:");
}
tabs.value = [
  { value: undefined, name: "All" },
  ...filtersData?.value?.results,
];
</script>
