<template>
  <section class="tp-seller-area pb-140">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="tp-section-title-wrapper-2 mb-50">
            <span class="tp-section-title-pre-2">
              Best Seller This Week’s
              <svg-section-line-2 />
            </span>
            <h3 class="tp-section-title-2">This Week's Featured</h3>
          </div>
        </div>
      </div>
      <div class="row">
        
        <div
          v-for="item in filteredProducts"
          :key="item.id"
          class="col-xl-3 col-lg-4 col-sm-6"
        >
          {{ item }}
        </div>
        <div
          v-for="item in filteredProducts"
          :key="item.id"
          class="col-xl-3 col-lg-4 col-sm-6"
        >
          {{ item }}
          <product-fashion-product-item :item="item" />
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="tp-seller-more text-center mt-10">
            <nuxt-link
              href="/shop"
              class="tp-btn tp-btn-border tp-btn-border-sm"
            >
              Shop All Product
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import product_data from "@/data/product-data";
const data = ref(null);
const error = ref(null);
const pending = ref(null);
let refreshProducts;
const filteredProducts = ref([]);
const products = product_data
  .filter((p) => p.productType === "fashion")
  .slice()
  .sort((a, b) => b.sellCount - a.sellCount)
  .slice(0, 4);

const fetchProducts = async () => {
  pending.value = true;

  try {
    const response = await getDataUnauthed(`/product/`);
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
</script>
