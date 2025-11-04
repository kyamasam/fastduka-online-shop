<script setup>
import BaseTable from "@/components/BaseTable.vue";
import BlogForm from "./components/BlogForm.vue";
import router from "@/routes";
import store from "@/vuex/store";
import { ArrowRight, Delete, Edit, Picture, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, computed, onMounted } from "vue";

const baseTableRef = ref(null);
const blogList = ref([]);
const loading = ref(false);
const showCreateModal = ref(false);

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
  const landingPageUrl = process.env.VUE_APP_LANDING_PAGE_URL || 'http://localhost:3000';
  window.open(`${landingPageUrl}/blog/${blogSlug}`, '_blank');
};

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
  loading.value = true;
  store.dispatch("fetchList", { url: "blogs" }).then((res) => {
    blogList.value = res?.data?.results || res?.data || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
};

onMounted(() => {
  loading.value = true;
  store.dispatch("fetchList", { url: "blogs" }).then((res) => {
    blogList.value = res?.data?.results || res?.data || [];
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
});
</script>

<template>
  <div class="blog-list">
    <!-- Create Blog Modal -->
    <el-dialog v-model="showCreateModal"
               title="Create New Blog"
               :width="'80%'"
               class="blog-modal"
               :before-close="closeCreateModal">
      <BlogForm @blog-created="handleBlogCreated" />
    </el-dialog>

    <BaseTable ref="baseTableRef"
               fetch-url="blogs"
               :columns="columns"
               :data-source="dataSource"
               :loading="loading"
               :show-search="true"
               :show0therItems="true"
               title="Blogs">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'cover_photo'">
          <div class="flex justify-center">
            <img v-if="text"
                 :src="text"
                 :alt="'Blog cover'"
                 class="w-16 h-16 object-cover rounded-lg border" />
            <div v-else
                 class="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
              <Picture class="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'title'">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ truncateText(text, 40) }}</span>
            <span class="text-sm text-gray-500">{{ record?.slug }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'category'">
          <el-tag v-if="text"
                  type="info"
                  size="small"
                  class="rounded-full">
            {{ text.name }}
          </el-tag>
          <span v-else
                class="text-gray-400">No Category</span>
        </template>

        <template v-else-if="column.key === 'author'">
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ text?.first_name }} {{ text?.last_name }}</span>
            <span class="text-xs text-gray-500">{{ text?.email || '' }}</span>
          </div>
        </template>

        <template v-else-if="column.key === 'created_at'">
          <span class="text-sm text-gray-600">{{ formatDate(text) }}</span>
        </template>

        <template v-else-if="column.key === 'updated_at'">
          <span class="text-sm text-gray-600">{{ formatDate(text) }}</span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <el-tooltip content="View Blog"
                        placement="top">
              <el-button type="primary"
                         size="small"
                         @click="viewBlog(record.slug)"
                         class="bg-blue-500 hover:bg-blue-600 border-none rounded-none">
                <el-icon>
                  <ArrowRight />
                </el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="Edit Blog"
                        placement="top">
              <el-button type="warning"
                         size="small"
                         @click="selectAction('edit-blog', record.id)"
                         class="bg-yellow-500 hover:bg-yellow-600 border-none rounded-none">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="Delete Blog"
                        placement="top">
              <el-button type="danger"
                         size="small"
                         @click="deleteBlog(record.id, record.title)"
                         class="bg-red-500 hover:bg-red-600 border-none rounded-none">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </template>

      <template #otherItems>
        <el-button type="primary"
                   size="large"
                   @click="openCreateModal"
                   class="bg-green-600 hover:bg-green-700 border-none rounded-lg">
          <template #icon>
            <Plus />
          </template>
          New Blog
        </el-button>

        <router-link :to="{ name: 'blog-categories' }">
          <el-button type="info"
                     size="large"
                     class="bg-gray-600 hover:bg-gray-700 border-none rounded-lg">
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