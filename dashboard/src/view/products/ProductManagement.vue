<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseDrawer from "@/BaseDrawer.vue";

/**
 * Variables
 */
const route = useRoute();
const router = useRouter();
const drawerTitle = ref("Quick Actions");
const activeRoute = ref("");
const availableTabs = ref([
  { name: "add-inventory", label: "Add Inventory" },
  { name: "product-images", label: "Add Product Images" },
  { name: "edit-product", label: "Edit Product" },
]);
const activeName = ref("create-product");

/**
 * Functions
 */
const getCurrentRoute = () => {
  activeRoute.value = route?.name || "";
};

const handleClick = (tabName) => {
  router.push({name: tabName?.props?.name })
};

/**
 * Hooks
 */
onMounted(() => {
  getCurrentRoute();
});
</script>

<template>
  <BaseDrawer close-route="products" :title="drawerTitle">
    <el-tabs v-model="activeRoute" type="border-card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane
          v-for="tab in availableTabs"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
      >
        <router-view/>
      </el-tab-pane>
    </el-tabs>
  </BaseDrawer>
</template>

<style scoped>
</style>
