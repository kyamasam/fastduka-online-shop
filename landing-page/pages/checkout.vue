<template>
  <div>
      <!-- breadcrumb start -->
      <breadcrumb-4 title="Checkout" subtitle="Checkout" :bg_clr="true"/>
      <!-- breadcrumb end -->

      <!-- checkout area start -->
      <checkout-area/>
      <!-- checkout area end -->
  </div>
</template>

<script setup lang="ts">
// Use dynamic SEO with site settings
useDynamicSeo({
  title: "Checkout",
  description: "Complete your order for fresh meat delivery. Secure checkout and fast delivery in Kenya.",
  keywords: "checkout, meat delivery, online payment Kenya, butchery order",
});
</script>


