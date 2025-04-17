<template>
  <div class="has-sticky">
    <div class="tp-product-details-category">
      <span>{{ product?.name }}</span>
    </div>
    <h3 class="tp-product-details-title">{{ product?.name }}</h3>

    <!-- inventory details -->
    <div class="tp-product-details-inventory w-full d-flex align-items-center">
      <div class="tp-product-details-stock mb-10">
        <div class="tp-product-badge">
          <span v-if="!product?.in_stock" class="product-hot"
            >out-of-stock</span
          >
        </div>
      </div>
      <div
        class="tp-product-details-rating-wrapper d-flex align-items-center mb-10"
      >
        <div class="tp-product-details-rating">
          <span
            v-for="item in parseInt(product?.review_stats?.average_rating)"
            :key="item"
            ><i class="fa-solid fa-star"></i
          ></span>
          <span
            v-for="item in 5 - parseInt(product?.review_stats?.average_rating)"
            ><i class="fa-regular fa-star"></i
          ></span>
        </div>
        <div class="tp-product-details-reviews">
          <span> {{ product?.review_stats?.rating_display }} </span>
        </div>
      </div>
    </div>
    <p>
      {{ product.description }}
    </p>

    <!-- price -->
    <div class="tp-product-details-price-wrapper">
      <div
        class="flex gap-2 items-center"
        v-if="product?.sale_price !== null || product?.sale_price > 0"
      >
        <span class="tp-product-details-price old-price">{{
          formatCurrency(product?.selling_price)
        }}</span>
        <span class="tp-product-details-price new-price">
          {{ formatCurrency(product?.sale_price) }}
        </span>
      </div>
      <span v-else class="tp-product-details-price">{{
        formatCurrency(product?.selling_price)
      }}</span>
    </div>

    <!-- actions -->
    <div class="flex items-center">
      <div class="tp-product-details-quantity">
        <h3 class="tp-product-details-action-title">Quantity</h3>

        <div
          class="tp-product-quantity mb-15 mr-15 flex justify-center items-center"
        >
          <span
            class="tp-cart-minus h-full flex flex-col justify-center items-center"
            @click="cartStore?.decrement"
          >
            <svg-minus />
          </span>
          <input
            class="tp-cart-input"
            type="text"
            :value="cartStore?.orderQuantity"
            disabled
          />
          <span
            class="tp-cart-plus flex flex-col justify-center items-center"
            @click="cartStore?.increment"
          >
            <svg-plus-sm />
          </span>
        </div>
      </div>

      <div class="tp-product-details-add-to-cart mb-15 w-100">
        <h3 class="tp-product-details-action-title text-white bg-white">
          Add to Cart
        </h3>

        <button
          @click="cartStore?.addCartProduct(product)"
          class="tp-product-details-add-to-cart-btn w-100"
        >
          Add To Cart
        </button>
      </div>
      <div
        class="tp-product-details-action-item-wrapper md:d-flex flex flex-col align-items-center"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/pinia/useCartStore";
import { useCompareStore } from "@/pinia/useCompareStore";
import { useProductStore } from "@/pinia/useProductStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";
import { type IProduct } from "@/types/product-type";

// store
const compareStore = useCompareStore();
const wishlistStore = useWishlistStore();
const productStore = useProductStore();
const cartStore = useCartStore();
// props
const props = withDefaults(
  defineProps<{ product: IProduct; isShowBottom?: boolean }>(),
  {
    isShowBottom: true,
  }
);
let textMore = ref<boolean>(false);

const hasColorData = computed(() =>
  props.product.imageURLs.some((item) => item?.color && item?.color?.name)
);

onMounted(() => {
  let found = false;

  cartStore?.cart_products.map((i) => {
    // if (i.id === props?.product?.id) {
    //   console.log(i.name);
    // }
    console.log("props", props?.product?.id);
    console.log("name", i.name, i.id);
    // cartStore.orderQuantity = 20;
    if (props?.product?.id === i.id) {
      cartStore.orderQuantity = i.orderQuantity;
      found = true;
      console.log("found", i.orderQuantity);
    }

    // console.log(i);
  });
  if (!found) {
    cartStore.orderQuantity = 1;
    console.log("not found", cartStore.orderQuantity);
    //could not find, so set value to 1
  }
});
</script>
