<template>
  <div class="tp-product-details-review-rating-item d-flex align-items-center">
    <span>{{ star }} Star</span>
    <div class="tp-product-details-review-rating-bar">
      <span
        class="tp-product-details-review-rating-bar-inner"
        :data-width="`${percentage}%`"
        :style="`width: ${percentage}%;`"
      ></span>
    </div>
    <div class="tp-product-details-review-rating-percent">
      <span>{{ count }} ({{ percentage }})%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ star: number; percentage: number; count: number }>();
</script>
