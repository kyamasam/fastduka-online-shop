<script setup>
import BaseTable from "@/components/BaseTable.vue";
import BlogForm from "./components/BlogForm.vue";
import router from "@/routes";
import store from "@/vuex/store";
import { ArrowRight, Delete, Edit, Picture, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, computed, onMounted } from "vue";

const baseTableRef = ref(null);

const selectAction = (action, blogId) => {
  router.push({ name: action, params: { blogId: blogId } });
};

const deleteBlog = async (blogId, blogTitle) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`,
      'Delete Blog',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    await store.dispatch('deleteData', {
      url: 'blogs',
      id: blogId
    });

    ElMessage.success('Blog deleted successfully');
    window.location.reload();

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete blog');
      console.error('Delete error:', error);
    }
  }
};

const viewBlog = (blogSlug) => {
  // Open blog in new tab on landing page
  const landingPageUrl = process.env.VUE_APP_LANDING_PAGE_URL || 'http://localhost:3000';
  window.open(`${landingPageUrl}/blog/${blogSlug}`, '_blank');
};

const columns = [
  {
    title: 'Cover Image',
    dataIndex: 'cover_photo',
    key: 'cover_photo',
    width: 100,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 250,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 150,
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 150,
  },
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 120,
  },
  {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 120,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
  },
];

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const blogList = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);

onMounted(() => {
  // Load blogs data
  loading.value = true;
  store.dispatch("fetchList", { url: "blogs" }).then((res) => {
    blogList.value = res?.data?.results || res?.data || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
});

const dataSource = computed(() => {
  return blogList.value;
});

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const handleBlogCreated = () => {
  closeCreateModal();
  // Refresh the blog list
  loading.value = true;
  store.dispatch("fetchList", { url: "blogs" }).then((res) => {
    blogList.value = res?.data?.results || res?.data || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};
</script>

<template>
  <div class="blog-list">
    <!-- Create Blog Modal -->
    <el-dialog
      v-model="showCreateModal"
      title="Create New Blog"
      width="90%"
      :before-close="closeCreateModal"
      class="blog-modal"
    >
      <BlogForm :is-modal="true" @blog-created="handleBlogCreated" @cancel="closeCreateModal" />
    </el-dialog>

    <BaseTable ref="baseTableRef"
               fetchUrl="blogs"
               :columns="columns"
               :data-source="dataSource"
               :loading="loading"
               :show-search="true"
               :show0ther-items="true"
               title="Blogs">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'cover_photo'">
          <div class="flex justify-center">
            <img v-if="record.cover_photo"
                 :src="record.cover_photo"
                 :alt="record.title"
                 class="w-16 h-16 object-cover rounded-lg border" />
            <div v-else
                 class="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
              <Picture class="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'title'">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ truncateText(record.title, 40) }}</span>
            <span class="text-sm text-gray-500">{{ record.slug }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'category'">
          <el-tag v-if="record.category"
                  type="info"
                  size="small"
                  class="rounded-full">
            {{ record.category.name }}
          </el-tag>
          <span v-else
                class="text-gray-400">No Category</span>
        </template>

        <template v-else-if="column.key === 'author'">
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ record.author?.email?.split('@')[0] || 'Unknown' }}</span>
            <span class="text-xs text-gray-500">{{ record.author?.email || '' }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'created_at'">
          <span class="text-sm text-gray-600">{{ formatDate(record.created_at) }}</span>
        </template>

        <template v-else-if="column.key === 'updated_at'">
          <span class="text-sm text-gray-600">{{ formatDate(record.updated_at) }}</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <el-tooltip content="View Blog"
                        placement="top">
              <el-button type="primary"
                         size="small"
                         circle
                         @click="viewBlog(record.slug)"
                         class="bg-blue-500 hover:bg-blue-600">
                Show
              </el-button>
            </el-tooltip>

            <el-tooltip content="Edit Blog"
                        placement="top">
              <el-button type="warning"
                         size="small"
                         circle
                         @click="selectAction('edit-blog', record.id)"
                         class="bg-yellow-500 hover:bg-yellow-600">
                <Edit class="w-4 h-4" />
              </el-button>
            </el-tooltip>

            <el-tooltip content="Delete Blog"
                        placement="top">
              <el-button type="danger"
                         size="small"
                         circle
                         @click="deleteBlog(record.id, record.title)"
                         class="bg-red-500 hover:bg-red-600">
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
          @click="openCreateModal"
          class="bg-red-500 hover:bg-red-400 border-none rounded-lg"
        >
          <template #icon>
            <Plus />
          </template>
          Add New Blog
        </el-button>

        <router-link :to="{ name: 'blog-categories' }">
          <el-button type="info"
                     size="large"
                     class="bg-gray-600 hover:bg-gray-700 border-none rounded-lg">
            <template #icon>
              <ArrowRight />
            </template>
            Manage Categories
          </el-button>
        </router-link>
      </template>
    </BaseTable>
  </div>
</template>

<style scoped>
.blog-list {
  padding: 20px;
}

:deep(.blog-modal .el-dialog) {
  max-height: 90vh;
  overflow-y: auto;
}

:deep(.blog-modal .el-dialog__body) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  padding: 0;
}
</style>