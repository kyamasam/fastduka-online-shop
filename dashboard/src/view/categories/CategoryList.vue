<template>
  <PageHeaders class="ninjadash-page-header-main" title="Orders" />
  <router-view />

  <CategoryForm :visible="showDialog"/>
  

  <BaseTable
    :columns="columns"
    show0ther-items
    create-route-name="create-category"
    :show-expanded-items="false"
    fetchUrl="category"
    title="Orders"
  >
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'photo'">
        <div class="flex items-center gap-2">
          <template v-if="editableId !== slotProps.text.id">
            <img
              height="40"
              width="40"
              class="rounded object-cover"
              :src="slotProps?.text?.photo"
              :alt="slotProps?.text?.name"
            />
          </template>
          <input
            v-else
            type="file"
            accept="image/*"
            @change="handleFileUpload($event, slotProps.text)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </template>

      <template v-if="slotProps.column.key === 'name'">
        <template v-if="editableId !== slotProps.text.id">
          {{ slotProps.text.name }}
        </template>
        <el-input
          v-else
          v-model="editableData.name"
          placeholder="Category name"
          size="small"
        />
      </template>

      <template v-if="slotProps.column.key === 'children'">
        <div
          class="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
          @click="openChildrenModal(slotProps.text)"
        >
          <el-icon>
            <Document />
          </el-icon>
          <span class="font-medium">
            View Items ({{ slotProps?.text?.children?.length || 0 }})
          </span>
        </div>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <div class="flex gap-2">
          <template v-if="editableId !== slotProps.text.id">
            <el-button
              class="bg-blue-500 text-white hover:bg-blue-600 border-none hover:ring-none rounded-md"
              type="primary"
              size="large"
              @click="startEditing(slotProps.text)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              class="bg-red-500 text-white hover:bg-red-600 border-none hover:ring-none rounded-md"
              type="primary"
              size="large"
              @click="handleDelete(slotProps.text.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
          <template v-else>
            <el-button
              class="bg-green-500 text-white hover:bg-green-600 border-none hover:ring-none rounded-md"
              type="primary"
              size="large"
              @click="saveChanges(slotProps.text)"
            >
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button
              class="bg-gray-500 text-white hover:bg-gray-600 border-none hover:ring-none rounded-md"
              type="primary"
              size="large"
              @click="cancelEditing"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </template>
        </div>
      </template>
    </template>
  </BaseTable>

  <!-- Children Modal -->
  <el-dialog
    v-model="childrenModalVisible"
    :title="selectedParent?.name || 'Items'"
    width="80%"
    center
    :close-on-click-modal="false"
  >
    <a-table
      :columns="innerColumns"
      :data-source="selectedChildren"
      :pagination="false"
      class="rounded-lg shadow-sm"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.key === 'photo'">
          <div class="flex items-center gap-2">
            <img
              height="40"
              width="40"
              class="rounded object-cover"
              :src="text?.photo"
              :alt="text?.name"
            />
          </div>
        </template>
      </template>
    </a-table>

    <template #footer>
      <el-button
        type="primary"
        @click="childrenModalVisible = false"
        class="px-6 py-3"
      >
        Close
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Document, Edit, Delete, Check, Close } from "@element-plus/icons-vue";
import BaseTable from "@/components/BaseTable.vue";
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import router from "@/routes";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { baseUrl } from "@/utility/constants";
import store from "@/vuex/store";

const columns = ref([
  {
    title: "Name",
    dataIndex: "",
    key: "name",
  },
  {
    title: "Photo",
    dataIndex: "",
    key: "photo",
  },
  {
    title: "Sub Items",
    dataIndex: "",
    key: "children",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

const innerColumns = ref([
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "30%",
  },
  {
    title: "Photo",
    dataIndex: "",
    key: "photo",
    width: "70%",
  },
]);

const childrenModalVisible = ref(false);
const selectedChildren = ref([]);
const selectedParent = ref(null);
const editableId = ref(null);
const editableData = reactive({
  name: "",
  photo: null,
});

const openChildrenModal = (parent) => {
  selectedParent.value = parent;
  selectedChildren.value = parent.children || [];
  childrenModalVisible.value = true;
};

const startEditing = (category) => {
  editableId.value = category.id;
  editableData.name = category.name;
  editableData.photo = null;
};

const cancelEditing = () => {
  editableId.value = null;
  editableData.name = "";
  editableData.photo = null;
};

const handleFileUpload = (event, category) => {
  const file = event.target.files[0];
  if (file) {
    editableData.photo = file;
  }
};

const showDialog = ref(false);
const showCreateCategoryDialog = () => {
  showDialog.value = true;
};

const saveChanges = async (category) => {
  try {
    const formData = new FormData();
    formData.append("name", editableData.name);
    if (editableData.photo) {
      formData.append("photo", editableData.photo);
    }

    const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
    
    const response = await axios.patch(
      `${baseUrl}category/${category.id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authData?.access,
        },
      }
    );

    ElMessage.success("Category updated successfully");
    store.dispatch("fetchList", { url: "category" });
    cancelEditing();
  } catch (error) {
    console.error("Update error:", error);
    ElMessage.error(error.response?.data?.message || "Failed to update category");
  }
};

const handleDelete = (categoryId) => {
  ElMessageBox.confirm(
    "This will permanently delete the category. Continue?",
    "Warning",
    {
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  ).then(async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
      await axios.delete(`${baseUrl}category/${categoryId}/`, {
        headers: {
          Authorization: "Bearer " + authData?.access,
        },
      });
      
      ElMessage.success("Category deleted successfully");
      store.dispatch("fetchList", { url: "category" });
    } catch (error) {
      console.error("Delete error:", error);
      ElMessage.error(error.response?.data?.message || "Failed to delete category");
    }
  }).catch(() => {});
};
</script>

<style scoped>
:deep(.el-dialog__header) {
  @apply border-b border-gray-200 mb-4;
}

:deep(.el-dialog__title) {
  @apply text-lg font-semibold text-gray-800;
}

:deep(.el-dialog__body) {
  @apply py-6;
}

.el-image {
  border-radius: 4px;
  overflow: hidden;
}

.flex.gap-2 .el-button {
  padding: 8px 12px;
}

.el-icon {
  vertical-align: middle;
}
</style>