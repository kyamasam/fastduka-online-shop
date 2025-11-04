<script setup>
import BaseTable from "@/components/BaseTable.vue";
import router from "@/routes";
import CategoryTypeManagement from "@/view/products/CategoryTypeManagement.vue";
import store from "@/vuex/store";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";

const currentView = ref('categories'); // 'categories' or 'category-types'

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
  }, {
    title: "Description",
    dataIndex: "category_type",
    key: "description",
  },
  {
    title: "Parent Category",
    dataIndex: "parent_obj",
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

  <div class="container py-8 px-4">

    <!-- View Switch -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ currentView === 'categories' ? 'Categories' : 'Category Types' }}
        </h1>
        <div class="ml-4  inline-flex rounded-lg border border-gray-300 overflow-hidden">
          <button :class="[
            'px-4 py-2 text-sm font-medium transition-colors',
            currentView === 'categories'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
                  @click="currentView = 'categories'">
            Categories
          </button>
          <button :class="[
            'px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300',
            currentView === 'category-types'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
                  @click="currentView = 'category-types'">
            Category Types
          </button>
        </div>
      </div>
    </div>

    <!-- Categories View -->
    <BaseTable v-if="currentView === 'categories'"
               :columns="columns"
               create-route-name="create-category"
               fetchUrl="category"
               title="Categories">
      <template v-slot:bodyCell="slotProps">
        <template v-if="slotProps.column.key === 'name'">
          <div class="flex items-center gap-2">
            <img v-if="slotProps.text?.photo"
                 :alt="slotProps.text?.name"
                 :src="slotProps.text?.photo"
                 class="h-8 w-8 object-cover rounded" />
            <div v-else
                 class="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
            {{ slotProps.text?.name }}
          </div>
        </template>

        <template v-if="slotProps.column.key === 'category_type'">
          <el-tag>
            {{ slotProps?.text?.name || '' }}
          </el-tag>
        </template>

        <template v-if="slotProps.column.key === 'description'">
          {{ slotProps?.text?.description || '' }}

        </template>

        <template v-if="slotProps.column.key === 'parent'">
          <span v-if="slotProps.text?.name">{{ slotProps.text?.name }}</span>
          <span v-else
                class="text-gray-400">No Parent</span>
        </template>

        <template v-if="slotProps.column.key === 'actions'">
          <div class="flex gap-2">
            <el-button class="bg-blue-500 border-none hover:bg-blue-600 focus:bg-blue-600 rounded-none"
                       type="primary"
                       size="default"
                       @click="selectAction('edit-category', slotProps.text?.id)"
                       title="Edit Category">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>

            <el-button class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600 rounded-none"
                       type="danger"
                       size="default"
                       @click="deleteCategory(slotProps.text?.id, slotProps.text?.name)"
                       title="Delete Category">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </template>
      </template>
    </BaseTable>

    <!-- Category Types View -->
    <CategoryTypeManagement v-if="currentView === 'category-types'" />
  </div>
</template>

<style scoped></style>