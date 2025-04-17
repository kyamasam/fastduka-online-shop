<template>
  <div class="w-full flex flex-col gap-4 justify-center h-screen items-center">
    <h1 class="text-2xl text-red-400 font-bold">
      You are not authorised to access this page !!
    </h1>

    <a-button @click="goHome" type="primary" class="bg-blue-400 rounded">Home</a-button>
  </div>
</template>

<script setup>
  import router from "@/routes"

  const goHome = ()=>{
    router.push({name: 'galleries'})
  }
</script>
