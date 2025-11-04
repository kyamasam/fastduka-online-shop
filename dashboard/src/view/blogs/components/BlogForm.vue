<template>
  <div class="blog-form">
    <el-card v-if="!isModal" class="form-card">
      <template #header>
        <div class="card-header">
          <h2 class="text-xl font-semibold">{{ isEditing ? 'Edit Blog' : 'Create New Blog' }}</h2>
          <div class="header-actions">
            <el-button @click="goBack" class="mr-2">
              Cancel
            </el-button>
            <el-button
              type="primary"
              @click="saveBlog"
              :loading="loading"
              class="bg-blue-600 hover:bg-blue-700"
            >
              {{ isEditing ? 'Update Blog' : 'Create Blog' }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="blog-form-content"
      >
        <div class="form-row">
          <div class="form-col-2">
            <el-form-item label="Title" prop="title" required>
              <el-input
                v-model="form.title"
                placeholder="Enter blog title"
                :maxlength="500"
                show-word-limit
                @input="generateSlug"
              />
            </el-form-item>
          </div>
          <div class="form-col-2">
            <el-form-item label="Slug" prop="slug">
              <el-input
                v-model="form.slug"
                placeholder="URL slug (auto-generated)"
                :maxlength="500"
              />
              <div class="text-sm text-gray-500 mt-1">
                Preview URL: /blog/{{ form.slug || 'your-blog-slug' }}
              </div>
            </el-form-item>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col-2">
            <el-form-item label="Category" prop="category" required>
              <el-select
                v-model="form.category"
                placeholder="Select a category"
                class="w-full"
                :loading="categoriesLoading"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
              <div class="text-sm text-blue-600 mt-1">
                <router-link :to="{ name: 'blog-categories' }" class="hover:underline">
                  Manage categories →
                </router-link>
              </div>
            </el-form-item>
          </div>
          <div class="form-col-2">
            <el-form-item label="Cover Image">
              <div class="cover-image-section">
                <div v-if="form.cover_photo" class="current-image">
                  <img :src="getImageUrl(form.cover_photo)" alt="Cover" class="cover-preview" />
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeCoverImage"
                    class="remove-image-btn"
                  >
                    Remove
                  </el-button>
                </div>
                <div v-else class="upload-area">
                  <el-upload
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleImageSuccess"
                    :on-error="handleImageError"
                    :before-upload="beforeImageUpload"
                    accept="image/*"
                    drag
                  >
                    <div class="upload-content">
                      <i class="el-icon-upload text-3xl text-gray-400"></i>
                      <div class="text-gray-600">
                        Drop image here or <em>click to upload</em>
                      </div>
                      <div class="text-sm text-gray-500">
                        Supports: JPG, PNG, GIF (max 5MB)
                      </div>
                    </div>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="Content" prop="content" required class="content-form-item">
          <RichTextEditor
            v-model="form.content"
            placeholder="Write your blog content here..."
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="Tags" class="tags-form-item">
          <div class="tags-section">
            <div class="current-tags">
              <el-tag
                v-for="tag in form.tags"
                :key="tag"
                closable
                @close="removeTag(tag)"
                class="mr-2 mb-2"
              >
                {{ tag }}
              </el-tag>
            </div>
            <el-input
              v-if="showTagInput"
              ref="tagInput"
              v-model="newTag"
              size="small"
              class="w-24"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button
              v-else
              size="small"
              @click="showTagInputField"
              class="new-tag-btn"
            >
              + Add Tag
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Modal Form -->
    <div v-else class="modal-form">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="blog-form-content"
      >
        <div class="form-row">
          <div class="form-col-2">
            <el-form-item label="Title" prop="title" required>
              <el-input
                v-model="form.title"
                placeholder="Enter blog title"
                :maxlength="500"
                show-word-limit
                @input="generateSlug"
              />
            </el-form-item>
          </div>
          <div class="form-col-2">
            <el-form-item label="Slug" prop="slug">
              <el-input
                v-model="form.slug"
                placeholder="URL slug (auto-generated)"
                :maxlength="500"
              />
              <div class="text-sm text-gray-500 mt-1">
                Preview URL: /blog/{{ form.slug || 'your-blog-slug' }}
              </div>
            </el-form-item>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col-2">
            <el-form-item label="Category" prop="category" required>
              <el-select
                v-model="form.category"
                placeholder="Select a category"
                class="w-full"
                :loading="categoriesLoading"
              >
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
              <div class="text-sm text-blue-600 mt-1">
                <router-link :to="{ name: 'blog-categories' }" class="hover:underline">
                  Manage categories →
                </router-link>
              </div>
            </el-form-item>
          </div>
          <div class="form-col-2">
            <el-form-item label="Cover Image">
              <div class="cover-image-section">
                <div v-if="form.cover_photo" class="current-image">
                  <img :src="getImageUrl(form.cover_photo)" alt="Cover" class="cover-preview" />
                  <el-button
                    type="danger"
                    size="small"
                    @click="removeCoverImage"
                    class="remove-image-btn"
                  >
                    Remove
                  </el-button>
                </div>
                <div v-else class="upload-area">
                  <el-upload
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleImageSuccess"
                    :on-error="handleImageError"
                    :before-upload="beforeImageUpload"
                    accept="image/*"
                    drag
                  >
                    <div class="upload-content">
                      <i class="el-icon-upload text-3xl text-gray-400"></i>
                      <div class="text-gray-600">
                        Drop image here or <em>click to upload</em>
                      </div>
                      <div class="text-sm text-gray-500">
                        Supports: JPG, PNG, GIF (max 5MB)
                      </div>
                    </div>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="Content" prop="content" required class="content-form-item">
          <RichTextEditor
            v-model="form.content"
            placeholder="Write your blog content here..."
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="Tags" class="tags-form-item">
          <div class="tags-section">
            <div class="current-tags">
              <el-tag
                v-for="tag in form.tags"
                :key="tag"
                closable
                @close="removeTag(tag)"
                class="mr-2 mb-2"
              >
                {{ tag }}
              </el-tag>
            </div>
            <el-input
              v-if="showTagInput"
              ref="tagInput"
              v-model="newTag"
              size="small"
              class="w-24"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button
              v-else
              size="small"
              @click="showTagInputField"
              class="new-tag-btn"
            >
              + Add Tag
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <el-button @click="goBack" class="mr-2">
          Cancel
        </el-button>
        <el-button
          type="primary"
          @click="saveBlog"
          :loading="loading"
          class="bg-blue-600 hover:bg-blue-700"
        >
          Create Blog
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/vuex/store'
import RichTextEditor from '@/components/RichTextEditor.vue'

// Props and emits for modal support
const props = defineProps({
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['blog-created', 'cancel'])

const route = useRoute()
const router = useRouter()

// Form state
const formRef = ref(null)
const loading = ref(false)
const categoriesLoading = ref(false)
const categories = ref([])

// Tag input state
const showTagInput = ref(false)
const newTag = ref('')
const tagInput = ref(null)

// Form data
const form = reactive({
  title: '',
  slug: '',
  content: '',
  category: null,
  cover_photo: null,
  tags: []
})

// Computed
const isEditing = computed(() => {
  if (props.isModal) return false // Modal is always for creating new blogs
  return !!route.params.blogId
})
const blogId = computed(() => route.params.blogId)

// Upload configuration
const uploadUrl = computed(() => {
  const baseUrl = store.getters.getApiUrl
  return `${baseUrl}/upload/image/`
})

const uploadHeaders = computed(() => {
  const token = store.getters.getToken
  return {
    'Authorization': `Bearer ${token}`
  }
})

// Form validation rules
const rules = {
  title: [
    { required: true, message: 'Please enter blog title', trigger: 'blur' },
    { min: 5, max: 500, message: 'Title should be 5-500 characters', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: 'Slug is required', trigger: 'blur' },
    { min: 3, max: 500, message: 'Slug should be 3-500 characters', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: 'Slug can only contain lowercase letters, numbers, and hyphens', trigger: 'blur' }
  ],
  content: [
    { required: true, message: 'Please enter blog content', trigger: 'blur' }
  ],
  category: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ]
}

// Methods
const generateSlug = () => {
  if (!form.slug && form.title) {
    form.slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }
}

const loadCategories = async () => {
  try {
    categoriesLoading.value = true
    const res = await store.dispatch('fetchList', { url: 'blog-categories' })
    categories.value = res?.data?.results || res?.data || []
  } catch (error) {
    ElMessage.error('Failed to load categories')
    console.error('Categories error:', error)
  } finally {
    categoriesLoading.value = false
  }
}

const loadBlog = async () => {
  if (!isEditing.value) return

  try {
    loading.value = true
    const res = await store.dispatch('fetchList', {
      url: `blogs/${blogId.value}`
    })

    const blog = res?.data

    if (blog) {
      Object.assign(form, {
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        category: blog.category?.id || null,
        cover_photo: blog.cover_photo || null,
        tags: blog.tags || []
      })
    }
  } catch (error) {
    ElMessage.error('Failed to load blog')
    console.error('Load blog error:', error)
  } finally {
    loading.value = false
  }
}

const saveBlog = async () => {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    const blogData = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      category: form.category,
      cover_photo: form.cover_photo,
      tags: form.tags
    }

    if (isEditing.value) {
      await store.dispatch('updateData', {
        url: 'blogs',
        id: blogId.value,
        data: blogData
      })
      ElMessage.success('Blog updated successfully')
    } else {
      await store.dispatch('createData', {
        url: 'blogs',
        data: blogData
      })
      ElMessage.success('Blog created successfully')
    }

    if (props.isModal) {
      emit('blog-created')
    } else {
      router.push({ name: 'blogs' })
    }

  } catch (error) {
    ElMessage.error(isEditing.value ? 'Failed to update blog' : 'Failed to create blog')
    console.error('Save blog error:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (props.isModal) {
    emit('cancel')
  } else {
    router.push({ name: 'blogs' })
  }
}

// Image handling
const getImageUrl = (image) => {
  if (!image) return ''
  return typeof image === 'string' ? image : image.url || ''
}

const handleImageSuccess = (response) => {
  form.cover_photo = response.url || response.file_url
  ElMessage.success('Image uploaded successfully')
}

const handleImageError = (error) => {
  ElMessage.error('Failed to upload image')
  console.error('Upload error:', error)
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('Only image files are allowed')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('Image size must be smaller than 5MB')
    return false
  }
  return true
}

const removeCoverImage = () => {
  form.cover_photo = null
}

// Tag handling
const showTagInputField = () => {
  showTagInput.value = true
  nextTick(() => {
    tagInput.value?.focus()
  })
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
  }
  newTag.value = ''
  showTagInput.value = false
}

const removeTag = (tag) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

// Lifecycle
onMounted(() => {
  loadCategories()
  if (isEditing.value) {
    loadBlog()
  }
})
</script>

<style scoped>
.blog-form {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.blog-form-content {
  padding: 20px 0;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-col-2 {
  flex: 1;
}

.content-form-item {
  margin-bottom: 30px;
}

.tags-form-item {
  margin-bottom: 20px;
}

.cover-image-section {
  width: 100%;
}

.current-image {
  position: relative;
  display: inline-block;
}

.cover-preview {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
}

.upload-area {
  width: 100%;
}

.upload-content {
  padding: 40px;
  text-align: center;
}

.tags-section {
  width: 100%;
}

.current-tags {
  margin-bottom: 10px;
}

.new-tag-btn {
  border: 1px dashed #d1d5db;
  background: transparent;
  color: #6b7280;
}

.new-tag-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.modal-form {
  padding: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .modal-form {
    padding: 10px;
  }
}
</style>