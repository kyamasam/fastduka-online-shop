<script setup>
import { ref, onMounted } from 'vue';
import BaseTable from "@/components/BaseTable.vue";
import CategoryForm from "@/view/products/components/CategoryForm.vue";
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import store from "@/vuex/store";
import axios from "axios";
import { baseUrl } from "@/utility/constants";

// State management
const categories = ref([]);
const loading = ref(false);
const showCategoryForm = ref(false);
const currentCategory = ref(null);
const expandedRows = ref([]);

// Table columns configuration
const columns = ref([
  {
    title: "Name",
    dataIndex: "",
    key: "name",
  },
  {
    title: "Products",
    dataIndex: "product_count",
    key: "product_count",
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

// Fetch all categories with hierarchical data
const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await store.dispatch("fetchList", { url: "category" });
    categories.value = response.data.results;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching categories:", error);
    ElMessage.error("Failed to fetch categories. Please try again.");
    loading.value = false;
  }
};

// Open category form in create mode
const handleAddCategory = () => {
  currentCategory.value = null;
  showCategoryForm.value = true;
};

// Open category form in edit mode
const handleEditCategory = (category) => {
  currentCategory.value = category;
  showCategoryForm.value = true;
};

// Handle category deletion
const handleDeleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${category.name}? This may affect products using this category.`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
    
    await axios.delete(`${baseUrl}category/${category.id}/`, {
      headers: {
        Authorization: "Bearer " + authData?.access,
      },
    });
    
    ElMessage.success(`Category "${category.name}" deleted successfully`);
    fetchCategories(); // Refresh the list
  } catch (error) {
    if (error !== 'cancel') {
      console.error("Error deleting category:", error);
      ElMessage.error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  } finally {
    loading.value = false;
  }
};

// Handle newly added or updated category
const handleCategoryChange = () => {
  fetchCategories();
  showCategoryForm.value = false;
};

// Check if a category has children
const hasChildren = (categoryId) => {
  return categories.value.some(category => category.parent === categoryId);
};

// Toggle row expansion
const toggleExpand = (categoryId) => {
  const index = expandedRows.value.indexOf(categoryId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(categoryId);
  }
};

// Get children categories for a parent
const getChildCategories = (parentId) => {
  return categories.value.filter(category => category.parent === parentId);
};

// Format category name with proper indentation for hierarchy
const formatCategoryName = (category, level = 0) => {
  return {
    ...category,
    _level: level,
    _hasChildren: hasChildren(category.id)
  };
};

// Process categories to display proper hierarchy
const processCategories = () => {
  const processed = [];
  
  // First add all root categories (no parent)
  const rootCategories = categories.value.filter(c => !c.parent);
  rootCategories.forEach(category => {
    processed.push(formatCategoryName(category, 0));
    
    // If expanded, add children recursively
    if (expandedRows.value.includes(category.id)) {
      addChildrenRecursively(category.id, processed, 1);
    }
  });
  
  return processed;
};

// Helper function to add children categories recursively
const addChildrenRecursively = (parentId, result, level) => {
  const children = getChildCategories(parentId);
  children.forEach(child => {
    result.push(formatCategoryName(child, level));
    
    if (expandedRows.value.includes(child.id)) {
      addChildrenRecursively(child.id, result, level + 1);
    }
  });
};

// Initialize component
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="category-list-container">
    <div class="header flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Categories</h1>
      <el-button
        type="primary"
        size="large"
        class="bg-red-500 border-none hover:bg-red-500 focus:bg-red-600"
        @click="handleAddCategory"
      >
        <el-icon class="mr-1"><Plus /></el-icon>
        Add Category
      </el-button>
    </div>
    
    <el-card style="box-shadow: none;" v-loading="loading" class="w-full shadow-none border-none">
    
      <el-table 
        :data="processCategories()" 
        style="width: 100%"
        
        row-key="id"
      >
        <!-- Name Column -->
        <el-table-column label="Name" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center">
              <!-- Indentation based on level -->
              <div 
                v-if="row._level > 0" 
                :style="{ width: `${row._level * 20}px` }"
                class="inline-block"
              ></div>
              
              <!-- Expand/Collapse Icon -->
              <el-button
                v-if="row._hasChildren"
                type="text"
                @click.stop="toggleExpand(row.id)"
              >
                <el-icon>
                  <i :class="expandedRows.includes(row.id) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></i>
                </el-icon>
              </el-button>
              
              <!-- Category Image -->
              <img
                v-if="row.photo"
                :src="row.photo"
                class="h-8 w-8 mr-2 rounded-md object-cover"
                :alt="row.name"
              />
              
              <!-- Category Name -->
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        
        <!-- Product Count Column -->
        <el-table-column label="Products" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info">
              {{ row.product_count || 0 }}
            </el-tag>
          </template>
        </el-table-column>
        
        <!-- Parent Category Column -->
        <el-table-column label="Parent Category" min-width="180">
          <template #default="{ row }">
            <span v-if="row.parent_name">{{ row.parent_name }}</span>
            <span v-else class="text-gray-400">None</span>
          </template>
        </el-table-column>
        
        <!-- Actions Column -->
        <el-table-column label="Actions" width="150" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center space-x-2">
              <el-button
                type="primary"
                size="default"
                @click.stop="handleEditCategory(row)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              
              <el-button
                type="danger"
                size="default"
                @click.stop="handleDeleteCategory(row)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- Category Form Dialog -->
    <CategoryForm
      :visible="showCategoryForm"
      @close="showCategoryForm = false"
      @category-added="handleCategoryChange"
    />
  </div>
</template>

<style scoped>
.category-list-container {
  padding: 20px;
}
</style>