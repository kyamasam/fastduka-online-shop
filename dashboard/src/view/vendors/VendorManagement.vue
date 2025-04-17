<script setup>
import { onMounted, ref , watch} from "vue";
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
  { name: "edit-vendor", label: "Edit Vendor" },
  { name: "add-members", label: "Add Members" },
  { name: "list-members", label: "List Members" },
  { name: "mini-list-rider", label: "Riders" },
  { name: "mini-register-rider", label: "Register Rider" },
]);

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

watch(
    () => route.name,
    (newName, oldName) => {
      console.log(`Route changed from ${oldName} to ${newName}`);
      activeRoute.value = newName || "";
    },
    { immediate: true }
);
</script>

<template>
  <BaseDrawer close-route="vendors" :title="drawerTitle">
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
