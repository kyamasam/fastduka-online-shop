<template>
  <div>
    <nuxt-layout name="layout-two">
      <!-- hero banner start -->
      <hero-banner-three />
      <!-- hero banner end -->

      <!-- products section start -->
      <ProductsSection />
      <!-- products section end -->

      <!-- popular product items start -->
      <!-- <product-popular-items /> -->
      <!-- popular product items end -->

      <!-- all products start -->
      <!-- <product-all-products /> -->
      <!-- all products end -->

      <!-- featured products start -->
      <product-featured-items />
      <!-- featured products end -->

      <!-- testimonial start -->
      <!-- <testimonial-fashion /> -->
      <!-- testimonial end -->
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
import ProductsSection from "@/components/product/products-section.vue";

definePageMeta({
  layout: false,
});

// Use dynamic SEO with site settings
useDynamicSeo({
  title: "Home",
  keywords: "Order Beef online, Fish online, Chicken online, Mutton online, Steak Nairobi, meat home delivery",
});
</script>
