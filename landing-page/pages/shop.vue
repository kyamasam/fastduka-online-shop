<template>
  <div>
    <!-- breadcrumb start -->
    <breadcrumb-1 title="Shop" subtitle="Shop" :full_width="true" />
    <!-- breadcrumb end -->

    <!-- shop area start -->
    <shop-area :full_width="true" />
    <!-- shop area end -->
  </div>
</template>

<script setup lang="ts">
// Use dynamic SEO with site settings
useDynamicSeo({
  title: "Shop",
  description: "Browse our wide selection of fresh meat products. Order online for home delivery in Kenya.",
  keywords: "shop meat online, butchery products, beef, chicken, goat meat, pork, Kenya",
});
</script>
