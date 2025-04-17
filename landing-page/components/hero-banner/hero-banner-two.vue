<template>
  <section class="tp-slider-area p-relative z-index-1">
    <swiper
      :slidesPerView="1"
      :spaceBetween="30"
      :loop="false"
      :navigation="{
        nextEl: '.tp-slider-2-button-next',
        prevEl: '.tp-slider-2-button-prev',
      }"
      :pagination="{
        el: '.tp-slider-2-dot',
        clickable: true,
      }"
      :effect="'fade'"
      :modules="[Navigation, Pagination, EffectFade]"
      class="tp-slider-active-2 swiper-container"
    >
      <swiper-slide
        v-for="item in slider_data"
        :key="item.id"
        :class="`bg-[url('${item?.img}')]`"
        class="bg-no-repeat relative bg-cover bg-black tp-slider-item-2 tp-slider-height-2 p-relative grey-bg-5 d-flex"
      >
        <div class="tp-slider-2-shape z-50">
          <img
            class="tp-slider-2-shape-1"
            src="/img/slider/2/shape/shape-1.png"
            alt="shape"
          />
        </div>
        <div class="z-50">
          <div class="flex flex-col justify-center px-20 h-full">
            <span>{{ item.subtitle }}</span>
            <h3 class="tp-slider-title-2">{{ item.title }}</h3>
            <div class="tp-slider-btn-2">
              <nuxt-link href="/shop" class="tp-btn tp-btn-border"
                >Shop
              </nuxt-link>
            </div>
          </div>
        </div>
        <!-- <div class="absolute w-full h-full bg-black opacity-20 z-10"></div> -->
      </swiper-slide>
      <div class="tp-swiper-dot tp-slider-2-dot"></div>
    </swiper>
  </section>
</template>

<script setup lang="ts">
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

// slider data type
type ISliderData = {
  id: number;
  subtitle: string;
  title: string;
  img: string;
};
const slider_data: ISliderData[] = [
  {
    id: 1,
    subtitle: "New Arrivals 2023",
    title: "Best Stakes In Town",
    img: "/img/slider/slider-img-1.jpg",
  },
];
</script>
