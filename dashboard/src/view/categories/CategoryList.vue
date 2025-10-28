<script setup>
import BaseTable from "@/components/BaseTable.vue";
import router from "@/routes";
import { Edit, Delete, Picture } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import store from "@/vuex/store";

const selectAction = (action, categoryId) => {
  router.push({ name: action, params: { categoryId: categoryId } });
};

const deleteCategory = async (categoryId, categoryName) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      'Delete Category',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    await store.dispatch('deleteData', {
      url: 'category',
      id: categoryId
    });

    ElMessage.success('Category deleted successfully');
    window.location.reload();

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete category');
      console.error('Delete error:', error);
    }
  }
};

const columns = ref([
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "category_type",
    key: "category_type",
  },
  {
    title: "Parent Category",
    dataIndex: "parent",
    key: "parent",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);
</script>

<template>
  <router-view />
  <BaseTable
    :columns="columns"
    create-route-name="create-category"
    fetchUrl="category"
    title="Categories"
  >
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'name'">
        <div class="flex items-center gap-2">
          <img
            v-if="slotProps.text?.photo"
            :alt="slotProps.text?.name"
            :src="slotProps.text?.photo"
            class="h-8 w-8 object-cover rounded"
          />
          <div
            v-else
            class="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs"
          >
            No Image
          </div>
          {{ slotProps.text?.name }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'category_type'">
        <el-tag :type="slotProps.text === 'liquor' ? 'warning' : 'success'">
          {{ slotProps.text?.toUpperCase() }}
        </el-tag>
      </template>

      <template v-if="slotProps.column.key === 'parent'">
        <span v-if="slotProps.text?.name">{{ slotProps.text.name }}</span>
        <span v-else class="text-gray-400">No Parent</span>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <div class="flex gap-2">
          <el-button
            class="bg-blue-500 border-none hover:bg-blue-600 focus:bg-blue-600 rounded-none"
            type="primary"
            size="default"
            @click="selectAction('edit-category', slotProps.text?.id)"
            title="Edit Category"
          >
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>

          <el-button
            class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600 rounded-none"
            type="danger"
            size="default"
            @click="deleteCategory(slotProps.text?.id, slotProps.text?.name)"
            title="Delete Category"
          >
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </template>
    </template>
  </BaseTable>
</template>

<style scoped></style>