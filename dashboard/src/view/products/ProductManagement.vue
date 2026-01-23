<script setup>
import BaseDrawer from "@/BaseDrawer.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Variables
 */
const route = useRoute();
const router = useRouter();
const drawerTitle = ref("Quick Actions");
const activeRoute = ref("");
const availableTabs = ref([
  { name: "edit-product", label: "Edit Product" },
  { name: "add-inventory", label: "Manage Inventory" },
  { name: "product-images", label: "Add Product Images" },
]);
const activeName = ref("create-product");

/**
 * Functions
 */
const getCurrentRoute = () => {
  activeRoute.value = route?.name || "";
};

const handleClick = (tabName) => {
  router.push({ name: tabName?.props?.name })
};

/**
 * Hooks
 */
onMounted(() => {
  getCurrentRoute();
});
</script>

<template>
  <BaseDrawer close-route="products"
              :title="drawerTitle">
    <el-tabs v-model="activeRoute"
             type="border-card"
             class="demo-tabs"
             @tab-click="handleClick">
      <el-tab-pane v-for="tab in availableTabs"
                   :key="tab.name"
                   :label="tab.label"
                   :name="tab.name">
        <router-view />
      </el-tab-pane>
    </el-tabs>
  </BaseDrawer>
</template>

<style scoped></style>
