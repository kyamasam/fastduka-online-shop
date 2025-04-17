<template>
  <div class="tp-shop-sidebar mr-10">
    <!-- filter -->
    <div class="tp-shop-widget mb-35">
      <h3 class="tp-shop-widget-title no-border">Price Filter</h3>
      <!-- price filter start -->
      <shop-sidebar-price-filter
        :right_side="shop_right"
        :shop_full="shop_full"
        :shop_1600="shop_1600"
      />
      <!-- price filter end -->
    </div>
    <!-- status -->
    <div class="tp-shop-widget mb-50">
      <h3 class="tp-shop-widget-title">Product Status</h3>
      <!-- filter status start -->
      <shop-sidebar-filter-status
        :right_side="shop_right"
        :shop_full="shop_full"
        :shop_1600="shop_1600"
      />
      <!-- filter status end -->
    </div>
    <!-- categories -->
    <div class="tp-shop-widget mb-50">
      <h3 class="tp-shop-widget-title">Categories</h3>
      <!-- filter categories start -->
      <shop-sidebar-filter-categories
        :right_side="shop_right"
        :shop_full="shop_full"
        :shop_1600="shop_1600"
      />
      <!-- filter categories end -->
    </div>

    <!-- brand -->

    <!-- reset filter start -->
    <shop-sidebar-reset-filter
      :right_side="shop_right"
      :shop_full="shop_full"
      :shop_1600="shop_1600"
    />
    <!-- reset filter end -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  shop_right?: boolean;
  shop_full?: boolean;
  shop_1600?: boolean;
}>();
</script>
