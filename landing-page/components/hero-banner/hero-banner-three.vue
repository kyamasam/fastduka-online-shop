<template>
  <section class="tp-slider-area p-relative z-index-1">
    <Swiper
      :slidesPerView="1"
      :spaceBetween="30"
      :loop="true"
      :effect="'fade'"
      :modules="[Pagination, Navigation, EffectFade]"
      :navigation="{
        nextEl: '.tp-slider-3-button-next',
        prevEl: '.tp-slider-3-button-prev',
      }"
      :pagination="{
        el: '.tp-slider-3-dot',
        clickable: true,
      }"
      class="tp-slider-active-3 swiper-container"
    >
      <SwiperSlide
        v-for="item in slider_data"
        :key="item.id"
        class="tp-slider-item-3 tp-slider-height-3 p-relative swiper-slide black-bg d-flex align-items-center"
      >
        <div
          class="tp-slider-thumb-3 include-bg"
          :style="`background-image:url(${item.bg})`"
        ></div>
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xl-6 col-lg-6 col-md-8">
              <div class="tp-slider-content-3">
                <span>{{ item?.subtitle }}</span>
                <h3 class="tp-slider-title-3">{{ item?.title }}</h3>
                <!-- <div
                  class="tp-slider-feature-3 d-flex flex-wrap align-items-center p-relative z-index-1 mb-15"
                >
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-cosmetic />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        High-end <br />
                        Cosmetics
                      </h3>
                    </div>
                  </div>
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-vegan-prd />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        Vegan <br />
                        Product
                      </h3>
                    </div>
                  </div>
                  <div class="tp-slider-feature-item-3 d-flex mb-30">
                    <div class="tp-slider-feature-icon-3">
                      <span>
                        <svg-make-up />
                      </span>
                    </div>
                    <div class="tp-slider-feature-content-3">
                      <h3 class="tp-slider-feature-title-3">
                        Express <br />
                        Make-up
                      </h3>
                    </div>
                  </div>
                </div> -->
                <div class="tp-slider-btn-3">
                  <nuxt-link
                    href="/shop"
                    class="tp-btn tp-btn-border tp-btn-border-white"
                  >
                    Shop Now
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <!-- dot style -->
      <div class="tp-swiper-dot tp-slider-3-dot d-sm-none"></div>
      <!-- arrow style -->
      <div class="tp-slider-arrow-3 d-none d-sm-block">
        <button type="button" class="tp-slider-3-button-prev">
          <svg-slider-btn-prev-2 />
        </button>
        <button type="button" class="tp-slider-3-button-next">
          <svg-slider-btn-next-2 />
        </button>
      </div>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

// slider data type
type ISlider = {
  id: number;
  bg: string;
  subtitle: string;
  title: string;
};
// slider data
const slider_data: ISlider[] = [
  {
    id: 1,
    bg: "/img/slider/slider-img-1.jpg",
    subtitle: "Premium meats",
    title: "Savor the flavor, experience the quality",
  },
  {
    id: 2,
    bg: "/img/slider/slider-img-2.jpg",
    subtitle: "Customize your order",
    title: "Your meat, your way",
  },
  {
    id: 3,
    bg: "/img/slider/slider-img-3.jpg",
    subtitle: "Exceptional quality, every time",
    title: "Cut above the rest.",
  },
];
</script>
