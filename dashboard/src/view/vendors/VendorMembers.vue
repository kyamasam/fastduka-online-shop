<template>
  <div class="w-full max-w-6xl mx-auto py-8">
    <!-- Element Plus Table for Members -->
    <el-table :data="members" style="width: 100%">
      <el-table-column label="Name" prop="user_name" width="180">
        <template #default="{ row }">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Email" prop="user_email" width="250">
        <template #default="{ row }">
          <span>{{ row.user_email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Role" prop="role" width="150">
        <template #default="{ row }">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="180">
        <template #default="{ row }">
          <el-button @click="handleAction(row)" size="mini" type="primary">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted , computed} from "vue";
import { ElTable, ElTableColumn, ElButton } from "element-plus";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "@/routes";

const store = useStore();
const route = useRoute();
const formState = ref({
  name: '',
  location: '',
  verification_status: '',
  members: [],
});

const fetchProduct = async () => {
  const res = await store.dispatch('fetchSingleItem', { url: 'vendors', id: route?.params.vendorId });
  formState.value = res?.data;
};

const handleAction = (row) => {
  // Implement your logic here for handling actions (e.g., edit member)
  router.push({name: 'edit-user', params: {userId: row.user}});
};

onMounted(() => {
  fetchProduct();
});

// Extracting members for easier usage in the template
const members = computed(() => formState.value.members);
</script>

<style scoped>
/* You can add custom styling here */
</style>
