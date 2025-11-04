<script setup>
import BaseTable from "@/components/BaseTable.vue";
import router from "@/routes";
import store from "@/vuex/store";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, computed, onMounted } from "vue";

const baseTableRef = ref(null);
const showCreateForm = ref(false);
const editingCategory = ref(null);
const categoryForm = ref({
  name: ''
});

const formRef = ref(null);

const selectAction = (action, categoryId) => {
  if (action === 'edit') {
    const category = dataSource.value.find(cat => cat.id === categoryId);
    if (category) {
      editingCategory.value = category;
      categoryForm.value.name = category.name;
      showCreateForm.value = true;
    }
  }
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
      url: 'blog-categories',
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

const saveCategory = async () => {
  try {
    if (!categoryForm.value.name.trim()) {
      ElMessage.error('Category name is required');
      return;
    }

    if (editingCategory.value) {
      // Update existing category
      await store.dispatch('updateData', {
        url: 'blog-categories',
        id: editingCategory.value.id,
        data: categoryForm.value
      });
      ElMessage.success('Category updated successfully');
    } else {
      // Create new category
      await store.dispatch('createData', {
        url: 'blog-categories',
        data: categoryForm.value
      });
      ElMessage.success('Category created successfully');
    }

    cancelForm();
    window.location.reload();

  } catch (error) {
    ElMessage.error(editingCategory.value ? 'Failed to update category' : 'Failed to create category');
    console.error('Save category error:', error);
  }
};

const cancelForm = () => {
  showCreateForm.value = false;
  editingCategory.value = null;
  categoryForm.value.name = '';
};

const createNewCategory = () => {
  editingCategory.value = null;
  categoryForm.value.name = '';
  showCreateForm.value = true;
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 250,
  },
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
  },
  {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
  },
];

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const categoryList = ref([]);
const loading = ref(false);

onMounted(() => {
  loading.value = true;
  store.dispatch("fetchList", { url: "blog-categories" }).then((res) => {
    categoryList.value = res?.data?.results || res?.data || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
});

const dataSource = computed(() => {
  return categoryList.value;
});
</script>

<template>
  <div class="blog-category-list">
    <!-- Create/Edit Form Modal -->
    <el-dialog
      v-model="showCreateForm"
      :title="editingCategory ? 'Edit Category' : 'Create New Category'"
      width="500px"
      :before-close="cancelForm"
    >
      <el-form
        ref="formRef"
        :model="categoryForm"
        label-width="100px"
        @submit.prevent="saveCategory"
      >
        <el-form-item label="Name" required>
          <el-input
            v-model="categoryForm.name"
            placeholder="Enter category name"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelForm">Cancel</el-button>
          <el-button type="primary" @click="saveCategory">
            {{ editingCategory ? 'Update' : 'Create' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <BaseTable
      ref="baseTableRef"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :show-search="true"
      :show-other-items="true"
      title="Blog Categories"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'name'">
          <span class="font-medium text-gray-900">{{ record.name }}</span>
        </template>

        <template v-else-if="column.key === 'created_at'">
          <span class="text-sm text-gray-600">{{ formatDate(record.created_at) }}</span>
        </template>

        <template v-else-if="column.key === 'updated_at'">
          <span class="text-sm text-gray-600">{{ formatDate(record.updated_at) }}</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <el-tooltip content="Edit Category" placement="top">
              <el-button
                type="warning"
                size="small"
                circle
                @click="selectAction('edit', record.id)"
                class="bg-yellow-500 hover:bg-yellow-600"
              >
                <Edit class="w-4 h-4" />
              </el-button>
            </el-tooltip>

            <el-tooltip content="Delete Category" placement="top">
              <el-button
                type="danger"
                size="small"
                circle
                @click="deleteCategory(record.id, record.name)"
                class="bg-red-500 hover:bg-red-600"
              >
                <Delete class="w-4 h-4" />
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </template>

      <template #otherItems>
        <el-button
          type="primary"
          size="large"
          @click="createNewCategory"
          class="bg-green-600 hover:bg-green-700 border-none rounded-lg"
        >
          <template #icon>
            <Plus />
          </template>
          New Category
        </el-button>

        <router-link :to="{ name: 'blogs' }">
          <el-button
            type="info"
            size="large"
            class="bg-gray-600 hover:bg-gray-700 border-none rounded-lg"
          >
            Back to Blogs
          </el-button>
        </router-link>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped>
.blog-category-list {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>