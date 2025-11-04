<template>
  <div class="container py-8 px-4">
    <!-- Header with bulk actions -->
    <div class="mb-6 flex justify-end items-center">
      <!-- <h1 class="text-2xl font-bold text-gray-900">Category Types</h1> -->
      <div class="flex gap-2">
        <el-button v-if="selectedCategoryTypes.length > 0"
                   type="danger"
                   class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600"
                   @click="deleteSelectedCategoryTypes">
          <el-icon class="mr-2">
            <Delete />
          </el-icon>
          Delete Selected ({{ selectedCategoryTypes.length }})
        </el-button>
        <el-button type="primary"
                   class="bg-blue-600 hover:bg-blue-700 border-blue-600"
                   @click="showCreateDialog = true">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Add Category Type
        </el-button>
      </div>
    </div>

    <!-- Category Types Table -->
    <BaseTable :columns="columns"
               fetchUrl="category-type"
               title=""
               :enableSelection="true"
               @selection-change="selectedCategoryTypes = $event">
      <template v-slot:bodyCell="slotProps">
        <template v-if="slotProps.column.key === 'name'">
          <span class="font-medium">{{ slotProps.text }}</span>
        </template>

        <template v-if="slotProps.column.key === 'description'">
          <span class="text-gray-600">{{ slotProps.text || 'No description' }}</span>
        </template>

        <template v-if="slotProps.column.key === 'status'">
          <el-tag :type="slotProps.text ? 'success' : 'danger'">
            {{ slotProps.text ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>

        <template v-if="slotProps.column.key === 'created_at'">
          <span class="text-gray-500">
            {{ new Date(slotProps.text).toLocaleDateString() }}
          </span>
        </template>

        <template v-if="slotProps.column.key === 'actions'">
          <div class="flex gap-2">
            <el-button class="bg-blue-500 border-none hover:bg-blue-600 focus:bg-blue-600 rounded-none"
                       type="primary"
                       size="default"
                       @click="selectAction('edit', slotProps.text?.id)"
                       title="Edit Category Type">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>

            <el-button class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600 rounded-none"
                       type="danger"
                       size="default"
                       @click="deleteSingleCategoryType(slotProps.text?.id, slotProps.text?.name)"
                       title="Delete Category Type">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </template>
      </template>
    </BaseTable>

    <!-- Create/Edit Dialog -->
    <el-dialog v-model="showCreateDialog"
               :title="editingCategoryType ? 'Edit Category Type' : 'Create Category Type'"
               width="500px">
      <el-form ref="formRef"
               :model="form"
               :rules="rules"
               label-position="top">
        <el-form-item label="Name"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="Enter category type name" />
        </el-form-item>
        <el-form-item label="Description"
                      prop="description">
          <el-input v-model="form.description"
                    type="textarea"
                    placeholder="Enter description" />
        </el-form-item>
        <el-form-item label="Status"
                      prop="is_active">
          <el-switch v-model="form.is_active"
                     active-text="Active"
                     inactive-text="Inactive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">Cancel</el-button>
          <el-button type="primary"
                     @click="submitForm"
                     :loading="submitting">
            {{ editingCategoryType ? 'Update' : 'Create' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import BaseTable from "@/components/BaseTable.vue"
import store from '@/vuex/store'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const submitting = ref(false)
const showCreateDialog = ref(false)
const editingCategoryType = ref(null)
const formRef = ref()
const selectedCategoryTypes = ref([])

const form = reactive({
  name: '',
  description: '',
  is_active: true
})

const rules = {
  name: [
    { required: true, message: 'Please input category type name', trigger: 'blur' }
  ]
}

const columns = ref([
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "status",
  },
  {
    title: "Created",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
])


const selectAction = async (action, categoryTypeId) => {
  if (action === 'edit') {
    try {
      const response = await store.dispatch('fetchSingle', { url: 'category-type', id: categoryTypeId })
      editCategoryType(response.data)
    } catch (error) {
      ElNotification({
        title: 'Error',
        message: 'Failed to fetch category type details',
        type: 'error'
      })
    }
  }
}

const deleteSingleCategoryType = async (categoryTypeId, categoryTypeName) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${categoryTypeName}"? This action cannot be undone.`,
      'Delete Category Type',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    await store.dispatch('deleteData', {
      url: 'category-type',
      id: categoryTypeId
    })

    ElMessage.success('Category type deleted successfully')
    // BaseTable will automatically refresh

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete category type')
      console.error('Delete error:', error)
    }
  }
}

const deleteSelectedCategoryTypes = async () => {
  if (selectedCategoryTypes.value.length === 0) {
    ElMessage.warning('Please select category types to delete')
    return
  }

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedCategoryTypes.value.length} category type(s)? This action cannot be undone.`,
      'Delete Category Types',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const deletePromises = selectedCategoryTypes.value.map(id =>
      store.dispatch('deleteData', {
        url: 'category-type',
        id: id
      })
    )

    await Promise.all(deletePromises)
    ElMessage.success(`${selectedCategoryTypes.value.length} category type(s) deleted successfully`)
    selectedCategoryTypes.value = []
    // BaseTable will automatically refresh

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete some category types')
      console.error('Bulk delete error:', error)
    }
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.is_active = true
  editingCategoryType.value = null
}

const editCategoryType = (categoryType) => {
  editingCategoryType.value = categoryType
  form.name = categoryType.name
  form.description = categoryType.description
  form.is_active = categoryType.is_active
  showCreateDialog.value = true
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const payload = {
          name: form.name,
          description: form.description,
          is_active: form.is_active
        }

        if (editingCategoryType.value) {
          await store.dispatch('updateItem', {
            url: 'category-type',
            id: editingCategoryType.value.id,
            data: payload
          })
          ElNotification({
            title: 'Success',
            message: 'Category type updated successfully',
            type: 'success'
          })
        } else {
          await store.dispatch('createItem', {
            url: 'category-type',
            data: payload
          })
          ElNotification({
            title: 'Success',
            message: 'Category type created successfully',
            type: 'success'
          })
        }

        showCreateDialog.value = false
        resetForm()
        // BaseTable will automatically refresh
      } catch (error) {
        ElNotification({
          title: 'Error',
          message: 'Failed to save category type',
          type: 'error'
        })
      } finally {
        submitting.value = false
      }
    }
  })
}


onMounted(() => {
  // fetchCategoryTypes() - BaseTable will handle fetching
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>