<template>
  <div class="tp-tab flex flex-wrap gap-2 w-full">
    <nav class="w-1/4">
      <div
        class="flex flex-col gap-1 justify-start items-start"
        id="productDetailsNavThumb"
        role="tablist"
      >
        <button
          @click="productStore.handleImageActive(product?.primary_photo)"
          :class="`nav-link  ${
            product?.primary_photo === productStore.activeImg ? 'active' : ''
          }`"
        >
          <img
            :src="product?.primary_photo"
            class="object-cover h-32"
            alt="nav-img"
          />
        </button>
        <button
          v-for="(item, i) in product.photos"
          :key="i"
          @click="productStore.handleImageActive(item?.photo)"
          :class="`nav-link   ${
            item?.photo === productStore.activeImg ? 'active' : ''
          }`"
        >
          <img :src="item?.photo" class="object-cover h-32" alt="nav-img" />
        </button>
      </div>
    </nav>
    <img
      class="w-2/3 object-cover"
      :src="productStore.activeImg"
      alt="prd-image"
    />

    <!-- <div class="tab-content m-img" id="productDetailsNavContent">
      <div>
        <div
          class="tp-product-details-nav-main-thumb"
          style="background-color: #f5f6f8"
        >
          <img :src="productStore.activeImg" alt="prd-image" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from "@/pinia/useProductStore";
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { type IProduct } from "@/types/product-type";
// props
const props = defineProps<{ product: IProduct }>();

const productStore = useProductStore();
const utilsStore = useUtilityStore();

onMounted(() => {
  productStore.handleImageActive(props?.product?.primary_photo);
});
</script>
