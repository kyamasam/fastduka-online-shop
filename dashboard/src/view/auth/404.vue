<template>
  <div :style="{ backgroundImage: 'url(/404.jpg)' }"
      class="w-full flex flex-col gap-4 justify-center h-screen items-center bg-no-repeat bg-contain bg-center border-red-800]">
    <a-button @click="goHome" size="large" type="primary" class="rounded-none border-none">Go Home</a-button>
  </div>
</template>

<script setup>
import router from "@/routes"

const goHome = ()=>{
  router.push({name: 'products'})
}
</script>
