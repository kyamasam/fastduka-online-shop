<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseDrawer from "@/BaseDrawer.vue";

/**
 * Variables
 */
const route = useRoute();
const router = useRouter();
const drawerTitle = ref("Category Actions");
const activeRoute = ref("");
const availableTabs = ref([
  { name: "edit-category", label: "Edit Category" },
]);
const activeName = ref("create-category");

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
  <BaseDrawer close-route="categories" :title="drawerTitle">
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