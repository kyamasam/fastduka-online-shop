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
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Jost: [300, 400, 500, 600, 700, 800, 900],
        },
        display: "swap",
      },
    ],
  ],

  css: [
    "bootstrap/scss/bootstrap.scss",
    "glightbox/dist/css/glightbox.min.css",
    "swiper/css/bundle",
    "@/assets/css/font-awesome-pro.css",
    "@/assets/css/flaticon_shofy.css",
    "@/assets/css/tailwind.css",
    "@/assets/scss/main.scss",
    "@fortawesome/fontawesome-free/css/all.min.css",
  ],

  app: {
    head: {
      title: "Loading...", // This will be replaced by dynamic SEO
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  compatibilityDate: "2025-09-20",
});
