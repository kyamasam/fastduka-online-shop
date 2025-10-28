<template>
  <section class="tp-featured-slider-area grey-bg-6 fix pt-95 pb-120">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="tp-section-title-wrapper-2 mb-50">
            <span class="tp-section-title-pre-2">
              Shop Featured Items
              <svg-section-line-2 />
            </span>
            <h3 class="tp-section-title-2">This Week's Featured</h3>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="tp-featured-slider">
            <Swiper :slidesPerView="3"
                    :spaceBetween="10"
                    :navigation="{
                      nextEl: '.tp-featured-slider-button-next',
                      prevEl: '.tp-featured-slider-button-prev',
                    }"
                    :modules="[Navigation]"
                    :breakpoints="{
                      '1200': {
                        slidesPerView: 3,
                      },
                      '992': {
                        slidesPerView: 3,
                      },
                      '768': {
                        slidesPerView: 2,
                      },
                      '576': {
                        slidesPerView: 1,
                      },
                      '0': {
                        slidesPerView: 1,
                      },
                    }"
                    class="tp-featured-slider-active swiper-container">
              <SwiperSlide v-for="item in filteredProducts"
                           :key="item.id"
                           class="tp-featured-item white-bg p-relative z-index-1">
                <div class="tp-featured-thumb include-bg"
                     :style="`background-image:url(${item?.primary_photo})`"></div>
                <div class="tp-featured-content">
                  <h3 class="tp-featured-title">
                    <nuxt-link :href="`/product-details/${item.id}`">{{
                      item?.name
                    }}</nuxt-link>
                  </h3>
                  <div class="tp-featured-price-wrapper">
                    <div class="flex md:flex-row flex-col gap-2"
                         v-if="item.sale_price > 0">
                      <span class="tp-featured-price old-price">{{
                        formatCurrency(item.selling_price)
                      }}</span>
                      <span class="tp-featured-price new-price">
                        {{ formatCurrency(item?.sale_price) }}
                      </span>
                    </div>
                    <span v-else
                          class="tp-featured-price new-price">{{
                            formatCurrency(item?.selling_price)
                          }}</span>
                  </div>
                  <div class="tp-product-rating-icon tp-product-rating-icon-2">
                    <span><i class="fa-solid fa-star"></i></span>
                    <span><i class="fa-solid fa-star"></i></span>
                    <span><i class="fa-solid fa-star"></i></span>
                    <span><i class="fa-solid fa-star"></i></span>
                    <span><i class="fa-solid fa-star"></i></span>
                  </div>
                  <div class="tp-featured-btn">
                    <nuxt-link :href="`/product-details/${item.id}`"
                               class="tp-btn tp-btn-border tp-btn-border-sm flex gap-1 items-center w-[120px] md:w-[150px]">
                      <span>Shop Now</span> <svg-right-arrow />
                    </nuxt-link>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <p></p>
            <div class="tp-featured-slider-arrow mt-45">
              <button class="tp-featured-slider-button-prev">
                <svg-slider-btn-prev />
              </button>
              <button class="tp-featured-slider-button-next">
                <svg-slider-btn-next />
              </button>
            </div>
          </div>
        </div>
        <!-- <p>We don't have any featured items at the moment</p>
        <button class="btn btn-outline-secondary w-64">Go To Shop</button> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

const data = ref(null);
const error = ref(null);
const pending = ref(null);
let refreshProducts;
const filteredProducts = ref([]);

const fetchProducts = async () => {
  pending.value = true;

  try {
    const response = await getDataUnauthed(`/product?featured=` + 1);
    data.value = response.data.value; // Directly set new data
    error.value = response.error.value;
    filteredProducts.value = response.data.value.results;

    refreshProducts = response.refresh; // Update the refresh reference
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }

  // if (!filteredProducts?.length) {
  //   try {
  //     const response = await getDataUnauthed(`/product`);
  //     data.value = response.data.value; // Directly set new data
  //     error.value = response.error.value;
  //     filteredProducts.value = response.data.value.results;

  //     refreshProducts = response.refresh; // Update the refresh reference
  //   } catch (err) {
  //     console.error("Error fetching products:", err);
  //     error.value = err;
  //   } finally {
  //     pending.value = false;
  //   }
  // }
};
fetchProducts();
</script>
