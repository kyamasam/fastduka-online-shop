<template>
  <div>
    <!-- about area start -->
    <about-area/>
    <!-- about area end -->

    <!-- counter area start -->
    <counter-area/>
    <!-- counter area end -->

    <!-- history area start -->
    <history-area/>
    <!-- history area end -->

    <!-- work area start -->
    <work-area/>
    <!-- work area end -->

    <!-- author area start -->
    <author-area/>
    <!-- author area end -->
  </div>
</template>

<script setup lang="ts">
// Use dynamic SEO with site settings
useDynamicSeo({
  title: "About Us",
  description: "Learn about our journey to bring fresh, quality meat to your doorstep across Kenya.",
  keywords: "about fastduka, online butchery Kenya, meat delivery service, quality meat",
});
</script>
