<template>
  <div class="flex flex-row justify-center items-start sm:justify-between w-full  bg-regularBG font-Jost h-screen">
    <div class="hidden sm:hidden md:block md:w-5/12 bg-red-200 h-screen bg-center ">
      <a-carousel arrows
                  autoplay>
        <template #prevArrow>
          <div class="custom-slick-arrow"
               style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow"
               style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>
        <div class="h-screen">
          <div class="h-full text-white flex flex-col justify-end items-center pb-8 w-full bg-center bg-cover
          bg-[url('/delivery1.jpg')]">
            <p class="text-2xl text-red-500 font-bold">Online Shopping Made Easy</p>
          </div>
          <!--          <img-->
          <!--            class="h-screen"-->
          <!--            src='@/static/img/auth/photography-room.jpeg'-->
          <!--          />-->
        </div>
        <div class="h-screen">
          <div class="h-full text-white flex flex-col justify-end items-center pb-8 w-full bg-center bg-cover
               bg-[url('delivery2.jpg')]">
            <p class="text-2xl text-red-500 font-bold">Delivery Management</p>
          </div>
          <img class="h-screen"
               src="" />
        </div>
      </a-carousel>
    </div>

    <div class="xs:w-full  sm:w-full md:w-7/12 justify-center flex items-center h-screen"
         style="width: 100%">
      <div
           class="bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none md:w-10/12 h-fit  overflow-y-scroll p-4">
        <div class="px-5 py-4 text-center border-b border-gray-200 dark:border-white10 ">
          <div class="flex justify-center mb-4">
            <img src="/fastduka-logo.png"
                 class="md:w-[200px] height-auto">
          </div>
          <h2 class="mb-0 text-xl font-semibold text-dark dark:text-white87 capitalize">{{ title }} to Fastduka</h2>
        </div>

        <div class="px-4 pt-8 pb-6 w-full flex flex-row w-full  ">
          <slot class="w-full"
                name="default"></slot>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { AuthWrapper } from "./style";

export default {
  name: "BaseAuth",
  components: {
    AuthWrapper,
    LeftCircleOutlined,
    RightCircleOutlined
  },
  data() {
    return {
      formState: {
        email: "",
        password: ""
      },
      cssPropsBg: {
        backgroundImage: `url(${"@/static/img/auth/camera.png"})`
      }
    }
  }, props: {
    title: {
      default: "sign up",
      type: String
    },
    isRegistration: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSubmit() {
    }
  }
}
</script>
