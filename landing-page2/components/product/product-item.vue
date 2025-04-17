<template>
  <div :class="`tp-product-item-2 `">
    <div
      class="tp-product-thumb-2 p-relative z-index-1 fix w-img rounded-md"
      style="background-color: #f2f3f5"
    >
      <nuxt-link :href="`/product-details/${item?.name}/${item?.id}`">
        <img
          class="object-cover h-64"
          :src="item?.primary_photo"
          :alt="item?.description"
        />
      </nuxt-link>

      <!-- product badge -->
      <div class="tp-product-badge">
        <span v-if="!item?.in_stock" class="product-hot">out-of-stock</span>
      </div>
      <div class="tp-product-badge">
        <span v-if="item?.on_sale" class="product-trending">Offer</span>
      </div>

      <!-- product action -->
      <div class="w-full border-t flex justify-between px-2 pt-2 pb-1">
        <button
          v-if="!isItemInCart(item)"
          @click="cartStore.addCartProduct(item)"
          type="button"
          :class="`tp-product-action-btn-2 flex justify-center items-center tp-product-add-cart-btn ${
            isItemInCart(item) ? 'active' : ''
          }`"
        >
          <svg-add-cart />
          <span class="tp-product-tooltip tp-product-tooltip-right"
            >Add to Cart</span
          >
        </button>
        <nuxt-link
          v-if="isItemInCart(item)"
          href="/cart"
          :class="` flex items-center justify-center tp-product-action-btn-2 tp-product-add-cart-btn ${
            isItemInCart(item) ? 'active' : ''
          }`"
        >
          <svg-add-cart />
          <span class="tp-product-tooltip tp-product-tooltip-right"
            >View Cart</span
          >
        </nuxt-link>

        <button
          type="button"
          class="flex items-center justify-center tp-product-action-btn-2 tp-product-quick-view-btn"
          data-bs-toggle="modal"
          :data-bs-target="`#${utilityStore.modalId}`"
          @click="
            utilityStore.handleOpenModal(`product-modal-${item.id}`, item)
          "
        >
          <svg-quick-view />
          <span class="tp-product-tooltip tp-product-tooltip-right"
            >Quick View</span
          >
        </button>

        <button
          @click="wishlistStore.add_wishlist_product(item)"
          type="button"
          :class="` flex items-center justify-center tp-product-action-btn-2 tp-product-add-to-wishlist-btn ${
            isItemInWishlist(item) ? 'active' : ''
          }`"
        >
          <svg-wishlist />
          <span class="tp-product-tooltip tp-product-tooltip-right">
            {{
              isItemInWishlist(item)
                ? "Remove From Wishlist"
                : "Add To Wishlist"
            }}
          </span>
        </button>
      </div>
    </div>
    <div class="tp-product-content-2 pt-15">
      <div class="tp-product-tag-2">
        <a href="#">{{ item?.category?.name }}</a>
      </div>
      <h3 class="tp-product-title-2">
        <nuxt-link :href="`/product-details/${item?.name}/${item?.id}`"
          >{{ item?.name }} -
          <span class="text-gray-400">{{ item?.inventory }} Left</span>
        </nuxt-link>
      </h3>

      <p :title="item?.description" class="text-truncate text-wrap w-full">
        <span class="">{{ item?.description?.slice(0, 250) }}...</span>
      </p>
      <div class="tp-product-rating-icon tp-product-rating-icon-2">
        <span v-for="item in parseInt(item?.review_stats?.average_rating)" :key="item"
          ><i class="fa-solid fa-star"></i
        ></span>
        <span v-for="item in 5 - parseInt(item?.review_stats?.average_rating)"
          ><i class="fa-regular fa-star"></i
        ></span>

        <span class="ml-2 text-black"
          >{{ item?.review_stats.average_rating }} / 5 Stars -
          {{ item?.review_stats.total_reviews }} Reviews</span
        >
      </div>
      <div class="tp-product-price-wrapper-2">
        <div v-if="item?.sale_price > 0">
          <span class="tp-product-price-2 new-price">
            {{ formatCurrency(Number(item?.sale_price)) }}
          </span>
          <span class="tp-product-price-2 old-price">
            {{ formatCurrency(item?.selling_price) }}
          </span>
        </div>
        <span v-else class="tp-product-price-2 new-price">
          {{ formatCurrency(item?.selling_price) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/pinia/useCartStore";
import { useCompareStore } from "@/pinia/useCompareStore";
import { useUtilityStore } from "@/pinia/useUtilityStore";
import { useWishlistStore } from "@/pinia/useWishlistStore";
import { type IProduct } from "@/types/product-type";
const config = useRuntimeConfig();
const route = useRoute();

const compareStore = useCompareStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilityStore = useUtilityStore();

function isItemInWishlist(product: IProduct) {
  return wishlistStore.wishlists.some((prd) => prd.id === product.id);
}
function isItemInCompare(product: IProduct) {
  return compareStore.compare_items.some((prd) => prd.id === product.id);
}
function isItemInCart(product: IProduct) {
  return cartStore.cart_products.some((prd: any) => prd.id === product.id);
}
const props = withDefaults(
  defineProps<{ item: IProduct; spacing?: boolean }>(),
  {
    spacing: true,
  }
);

const photos_list = props?.item?.photos?.map((item) => {
  return item?.photo;
});
photos_list.push(props?.item?.primary_photo);
const product = props.item;

const baseUrl =
  config.public.siteUrl || "https://shop.netlify.app/";
const currentUrl = `${baseUrl}${route.fullPath}`;
</script>
