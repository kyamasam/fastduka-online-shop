<template>
  <BaseDrawer title="Edit Category" close-route="categories">
    <CategoryForm />
  </BaseDrawer>
</template>

<script setup>
import BaseDrawer from "@/BaseDrawer.vue";
import CategoryForm from "./components/CategoryForm.vue";
</script>

<style scoped>
</style>