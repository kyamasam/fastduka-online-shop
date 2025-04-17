<script setup >
  import { useRoute } from 'vue-router'
  import { addToStorageFirst, checkLocalStorageItemExistence } from '@/utility/functions'
  import { onMounted, ref } from 'vue'
  import router from '@/routes'

  const route = useRoute()

  const galleryLoading = ref(false);

  const authDeterminer = ()=>{
    addToStorageFirst(route?.params?.galleryId,'galleryCodeToFetch')
      .then(()=>{
        router.push({name: 'login'})
      })
  }

  onMounted(()=>{
    authDeterminer()
  })


</script>

<template>

</template>

<style scoped>

</style>