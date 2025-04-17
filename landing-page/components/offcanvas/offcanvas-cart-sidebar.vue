<template>
  <div
    :class="`cartmini__area tp-all-font-roboto ${
      cartStore.cartOffcanvas ? 'cartmini-opened' : ''
    }`"
  >
    <div class="cartmini__wrapper d-flex justify-content-between flex-column">
      <div class="cartmini__top-wrapper">
        <div class="cartmini__top p-relative">
          <div class="cartmini__top-title">
            <h4>Shopping cart</h4>
          </div>
          <div class="cartmini__close">
            <button
              @click="cartStore.handleCartOffcanvas"
              type="button"
              class="cartmini__close-btn cartmini-close-btn"
            >
              <i class="fal fa-times"></i>
            </button>
          </div>
        </div>

        <div
          v-if="cartStore.cart_products.length > 0"
          class="bg-white rounded-lg"
        >
          <div
            v-for="item in cartStore?.cart_products"
            :key="item?.id"
            class="flex items-center justify-between py-2 border-b last:border-b-0"
          >
            <div class="flex items-center space-x-4">
              <nuxt-link
                :to="`/product-details/${item?.name}/${item?.id}`"
                class="flex-shrink-0"
              >
                <img
                  :src="item?.primary_photo"
                  alt="cart-img"
                  class="w-16 h-14 object-cover rounded"
                />
              </nuxt-link>
              <div class="flex flex-col gap-0">
                <h5 class="text-sm font-medium">
                  <nuxt-link
                    :to="`/product-details/${item?.name}/${item?.id}`"
                    class="hover:text-blue-600 transition-colors duration-200"
                  >
                    {{ item?.name }}
                    <span class="text-gray-600 text-sm"
                      >x{{ item.orderQuantity }}</span
                    >
                  </nuxt-link>
                </h5>
                <div class="flex items-center mt-1">
                  <span class="text-gray-900 font-semibold mr-2">
                    <span
                      v-if="item?.sale_price !== null && item?.sale_price > 0"
                    >
                      {{
                        formatCurrency(item?.sale_price * item.orderQuantity)
                      }}
                    </span>
                    <span v-else>
                      {{
                        formatCurrency(item?.selling_price * item.orderQuantity)
                      }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              @click="cartStore.removeCartProduct(item)"
              class="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <i class="fa-regular fa-xmark"></i>
            </button>
          </div>
        </div>
        <!-- if no item in cart  -->
        <div
          v-if="cartStore.cart_products.length === 0"
          class="cartmini__empty text-center"
        >
          <img
            src="/img/product/cartmini/empty-cart.png"
            alt="empty-cart-img"
          />
          <p>Your Cart is empty</p>
          <nuxt-link href="/shop" class="tp-btn">Go to Shop</nuxt-link>
        </div>
      </div>
      <div v-if="cartStore.cart_products.length > 0" class="cartmini__checkout">
        <div class="cartmini__checkout-title mb-30">
          <h4>Subtotal:</h4>
          <span>{{ formatCurrency(cartStore.totalPriceQuantity.total) }}</span>
        </div>
        <div class="cartmini__checkout-btn">
          <nuxt-link
            href="/cart"
            @click="cartStore.handleCartOffcanvas"
            class="tp-btn mb-10 w-100"
          >
            view cart
          </nuxt-link>
          <nuxt-link
            href="/checkout"
            @click="cartStore.handleCartOffcanvas"
            class="tp-btn tp-btn-border w-100"
          >
            checkout
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
  <!-- overlay start  -->
  <div
    @click="cartStore.handleCartOffcanvas"
    :class="`body-overlay ${cartStore.cartOffcanvas ? 'opened' : ''}`"
  ></div>
  <!-- overlay end  -->
</template>

<script setup lang="ts">
import { useCartStore } from "@/pinia/useCartStore";

const cartStore = useCartStore();
</script>
