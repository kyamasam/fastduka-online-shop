<template>
  <section class="breadcrumb__area breadcrumb__style-2 include-bg pt-50 pb-20">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div class="breadcrumb__content p-relative z-index-1">
            <div class="flex gap-2 items-center">
              <span>
                <svg-dot class="h-4 w-4" />
              </span>
              <span><a href="/">Home</a></span>
              <span class="w-2 h-2 rounded-full bg-gray-300"> </span>
              <span>{{ product.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { type IProduct } from "@/types/product-type";

defineProps<{ product: IProduct }>();
</script>
