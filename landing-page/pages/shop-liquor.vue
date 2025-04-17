<template>
  <div>
    <!-- breadcrumb start -->
    <breadcrumb-1 title="Liquor Shop" subtitle="Shop" :full_width="true" />
    <!-- breadcrumb end -->

    <!-- shop area start -->
    <shop-area :full_width="true" />
    <!-- shop area end -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "Shop Fastduka - liquor" });
</script>
