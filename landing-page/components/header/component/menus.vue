<template>
  <ul>
    <li
      v-for="(item, i) in menu_data"
      :key="i"
      :class="`${
        item.drop_down
          ? 'has-dropdown'
          : item.mega_menu
          ? 'has-dropdown has-mega-menu'
          : ''
      }`"
    >
      <nuxt-link :href="item.link">{{ item.title }}</nuxt-link>
      <div v-if="item.home_pages" class="home-menu tp-submenu tp-mega-menu">
        <div class="row row-cols-1 row-cols-lg-4 row-cols-xl-4">
          <div v-for="(home, i) in item.home_pages" :key="i" class="col">
            <div class="home-menu-item">
              <nuxt-link :href="home.link">
                <div class="home-menu-thumb p-relative fix">
                  <img :src="home.img" alt="image" />
                </div>
                <div class="home-menu-content">
                  <h5 class="home-menu-title text-white">{{ home.title }}</h5>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

    

      <ul
        v-if="item.product_menus"
        class="tp-submenu tp-mega-menu mega-menu-style-2"
      >
        <!-- first col -->
        <li
          v-for="(prd_m, i) in item.product_menus"
          :key="i"
          class="has-dropdown"
        >
          <nuxt-link href="/shop" class="mega-menu-title">Shop Page</nuxt-link>
          <ul class="tp-submenu">
            <li v-for="(prd_sm, i) in prd_m.dropdown_menus" :key="i">
              <nuxt-link :href="prd_sm.link">{{ prd_sm.title }}</nuxt-link>
            </li>
          </ul>
        </li>
      </ul>

      <ul v-if="item.drop_down" class="tp-submenu">
        <li v-for="(drop_m, i) in item.dropdown_menus" :key="i">
          <nuxt-link :href="drop_m.link">{{ drop_m.title }}</nuxt-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { menu_data } from "@/data/menu-data";
import { useCartStore } from "@/pinia/useCartStore";
const cartStore = useCartStore();
const loadingConfirmPayment = ref(true);
const verifyPayment = async () => {
  loadingConfirmPayment.value = true;

  const { data: verifyPaymentData, error: verifyPaymentError } = await getData(
    "/order/confirm-payment/",
    {
      method: "POST",
      body: {
        order_id: cartStore?.activeOrder?.id,
        transaction_id: cartStore.activeOrder?.payment_transaction,
      },
    }
  );
  if (!verifyPaymentError?.value) {
    loadingConfirmPayment.value = false;
    toast.success(`Payment Verified`);
    cartStore.setActiveOrder(verifyPaymentData?.value);
  } else {
    loadingConfirmPayment.value = false;
    showErrors(verifyPaymentError);
  }
};
</script>
