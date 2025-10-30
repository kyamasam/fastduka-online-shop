export default defineNuxtConfig({
  debug: true,

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_URL,
      googleMapsApiKey: process.env.GOOGLE_API_KEY,
    },
  },

  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
      },
    ],
    "@nuxtjs/tailwindcss",
  ],



  css: [
    "@/assets/css/tailwind.css",
    "bootstrap/scss/bootstrap.scss",
    "swiper/css/bundle",
    "@/assets/css/font-awesome-pro.css",
    "@/assets/css/flaticon_shofy.css",
    "@/assets/scss/main.scss",
  ],

  app: {
    head: {
      title: "Fastduka Online - The Best Meat In Kenya",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  compatibilityDate: "2025-09-20",
});
