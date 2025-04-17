<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-filter price__slider">
      <div id="slider-range" class="mb-10">
        <Slider
          :value="store.filterObj.priceValue"
          :tooltips="false"
          @change="store.handlePriceChange"
          :max="store.maxProductPrice"
        />
      </div>
      <div
        class="tp-shop-widget-filter-info d-flex align-items-center justify-content-between"
      >
        <span class="input-range">
          {{ formatCurrency(store?.filterObj.priceValue[0]) }} -
          {{ formatCurrency(store?.filterObj.priceValue[1]) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import Slider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const store = useProductFilterStore();
const router = useRouter();
const route = useRoute();

const handlePriceFilter = () => {
  const price_query = `minPrice=${store.priceValues[0]}&maxPrice=${store.priceValues[1]}`;
};

onMounted(() => {
  // if (route.query.minPrice && route.query.maxPrice) {
  //   store.priceValues = [
  //     Number(route.query.minPrice),
  //     Number(route.query.maxPrice),
  //   ];
  // }
});
</script>
