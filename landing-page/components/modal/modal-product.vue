<template>
  <div
    v-if="utilityStore.modalId && utilityStore.product"
    class="modal fade tp-product-modal"
    :id="utilityStore.modalId"
    tabindex="-1"
    :aria-labelledby="utilityStore.modalId"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="flex items-start gap-1 p-4 justify-center">
          <button
            type="button"
            class="tp-product-modal-close-btn"
            data-bs-toggle="modal"
            :data-bs-target="`#${utilityStore.modalId}`"
          >
            <i class="fa-regular fa-xmark"></i>
          </button>
          <!-- product details thumb start -->
          <product-details-thumb
            class="w-1/2"
            :product="utilityStore.product"
          />
          <!-- product details thumb end -->
          <!-- product details wrapper -->
          <product-details-wrapper
            class="w-1/2"
            :product="utilityStore.product"
            :is-show-bottom="false"
          />
          <!-- product details wrapper -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUtilityStore } from "@/pinia/useUtilityStore";
const utilityStore = useUtilityStore();
</script>
