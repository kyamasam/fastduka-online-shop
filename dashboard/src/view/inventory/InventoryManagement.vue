<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseDrawer from "@/BaseDrawer.vue";

/**
 * Variables
 */
const route = useRoute();
const router = useRouter();
const drawerTitle = ref("Inventory Details");
const activeTab = ref("manage-inventory");
const availableTabs = ref([
  { name: "manage-inventory", label: "Manage Inventory" },
  { name: "inventory-batches", label: "Batches" },
]);

/**
 * Functions
 */
const getCurrentRoute = () => {
  activeTab.value = route?.name || "manage-inventory";
};

const handleClick = (tabName) => {
  const targetRoute = tabName?.props?.name;
  if (targetRoute) {
    router.push({
      name: targetRoute,
      params: { productId: route.params.productId },
    });
  }
};

/**
 * Hooks
 */
watch(
  () => route.name,
  (newName) => {
    if (newName) {
      activeTab.value = newName;
    }
  }
);

onMounted(() => {
  getCurrentRoute();
});
</script>

<template>
  <BaseDrawer close-route="inventory" :title="drawerTitle">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="tab in availableTabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <router-view />
      </el-tab-pane>
    </el-tabs>
  </BaseDrawer>
</template>

<style scoped>
</style>
