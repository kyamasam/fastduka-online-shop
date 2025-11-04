<template>
  <BaseLoader v-if="categoryLoader" />
  <el-form ref="formRef"
           :model="formState"
           v-if="!categoryLoader"
           class="md:mt-0 grid gap-2 grid-cols-1"
           label-position="top"
           @submit.native.prevent="handleSubmit">
    <!-- Name Field -->
    <el-form-item :rules="[{ required: true, message: 'Please input the category name!' }]"
                  label="Name"
                  prop="name">
      <el-input v-model="formState.name"
                class="rounded-none"
                placeholder="Category name"
                size="large"
                style="border-radius:0" />
    </el-form-item>

    <!-- Category Type Field -->
    <el-form-item :rules="[{ required: true, message: 'Please select a category type!' }]"
                  label="Category Type"
                  prop="category_type_id">
      <div class="flex gap-2">
        <el-select v-model="formState.category_type_id"
                   :loading="categoryTypesLoader"
                   style="width: 305px;"
                   class="flex-1 rounded-none w-12"
                   placeholder="Select Category Type"
                   size="large"
                   @focus="fetchCategoryTypes">
          <el-option v-for="categoryType in categoryTypes"
                     :key="categoryType.value"
                     :label="categoryType.label"
                     :value="categoryType.value" />
        </el-select>
        <el-button type="primary"
                   size="large"
                   class="bg-green-500 hover:bg-green-600 border-green-500 px-3"
                   @click="showCategoryTypeDialog = true">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
      </div>
    </el-form-item>

    <!-- Parent Category Field -->
    <el-form-item label="Parent Category"
                  prop="parent">
      <el-select v-model="formState.parent"
                 :loading="parentCategoriesLoader"
                 class="w-full rounded-none"
                 placeholder="Select Parent Category (Optional)"
                 size="large"
                 clearable
                 @focus="fetchParentCategories">
        <el-option v-for="category in parentCategories"
                   :key="category.value"
                   :label="category.label"
                   :value="category.value" />
      </el-select>
    </el-form-item>

    <!-- Category Image Field -->
    <el-form-item class="w-full"
                  label="Category Image"
                  prop="photo">
      <a-upload v-model:file-list="fileList"
                :progress="{
                  showInfo: true,
                }"
                :show-upload-list="{
                  showPreviewIcon: true,
                  showRemoveIcon: false,
                }"
                accept=".jpg,.png,.jpeg"
                class="avatar-uploader w-full flex flex-col justify-center bg-gray-100 border border-dashed border-blue-400 p-4 rounded-lg"
                list-type="picture"
                name="photo"
                @remove="handleRemove">
        <div class="ant-upload-drag-icon text-blue-400 w-full flex justify-center py-4">
          <upload class="h-8 w-8"></upload>
        </div>
        <div class="flex flex-col items-center">
          <p class="ant-upload-text">
            Click or drag file to this area to upload
            <span class="font-bold"> category image</span>
          </p>
          <p class="ant-upload-hint">
            Support for single image upload. JPG, PNG formats only.
          </p>
        </div>

        <base-loader v-if="loadingPhotoUpload" />
      </a-upload>
    </el-form-item>

    <!-- Submit Button -->
    <el-form-item>
      <el-button :loading="registerLoading"
                 class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
                 size="large"
                 type="primary"
                 @click="handleSubmit">
        {{ isEdit ? 'Update Category' : 'Create Category' }}
      </el-button>
    </el-form-item>
  </el-form>

  <!-- Category Type Creation Dialog -->
  <el-dialog v-model="showCategoryTypeDialog"
             title="Create Category Type"
             width="500px">
    <el-form ref="categoryTypeFormRef"
             :model="categoryTypeForm"
             :rules="categoryTypeRules"
             label-position="top">
      <el-form-item label="Name"
                    prop="name">
        <el-input v-model="categoryTypeForm.name"
                  placeholder="Enter category type name" />
      </el-form-item>
      <el-form-item label="Description"
                    prop="description">
        <el-input v-model="categoryTypeForm.description"
                  type="textarea"
                  placeholder="Enter description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCategoryTypeDialog = false">Cancel</el-button>
        <el-button type="primary"
                   @click="createCategoryType"
                   :loading="creatingCategoryType">
          Create
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import BaseLoader from "@/components/BaseLoader";
import { baseUrl } from "@/utility/constants";
import store from "@/vuex/store";
import { Plus } from '@element-plus/icons-vue';
import axios from "axios";
import { ElNotification } from "element-plus";

export default {
  name: "CategoryForm",
  components: {
    BaseLoader,
    Plus
  },
  data() {
    return {
      formState: {
        name: '',
        category_type_id: '',
        parent: null
      },
      formStateCopy: {},
      registerLoading: false,
      parentCategories: [],
      parentCategoriesLoader: false,
      categoryTypes: [],
      categoryTypesLoader: false,
      categoryLoader: false,
      loadingPhotoUpload: false,
      fileList: [],
      isEdit: false,
      showCategoryTypeDialog: false,
      creatingCategoryType: false,
      categoryTypeForm: {
        name: '',
        description: ''
      },
      categoryTypeRules: {
        name: [
          { required: true, message: 'Please input category type name', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    fetchParentCategories() {
      this.parentCategoriesLoader = true;
      store.dispatch("fetchList", { url: "category" })
        .then((res) => {
          // Filter out the current category if editing to prevent circular references
          const categories = res.data.results.filter(cat =>
            !this.isEdit || cat.id !== parseInt(this.$route.params.categoryId)
          );

          this.parentCategories = categories.map((category) => ({
            label: category.name,
            value: category.id
          }));
          this.parentCategoriesLoader = false;
        })
        .catch(() => {
          this.parentCategoriesLoader = false;
        });
    },

    fetchCategoryTypes() {
      this.categoryTypesLoader = true;
      store.dispatch("fetchList", { url: "category-type" })
        .then((res) => {
          this.categoryTypes = res.data.results.map((categoryType) => ({
            label: categoryType.name,
            value: categoryType.id
          }));
          this.categoryTypesLoader = false;
        })
        .catch(() => {
          this.categoryTypesLoader = false;
        });
    },

    async createCategoryType() {
      if (!this.$refs.categoryTypeFormRef) return;

      await this.$refs.categoryTypeFormRef.validate(async (valid) => {
        if (valid) {
          this.creatingCategoryType = true;
          try {
            const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
            const response = await axios.post(`${baseUrl}category-type/`, this.categoryTypeForm, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authData?.access,
              },
            });

            ElNotification({
              title: "Success",
              message: "Category type created successfully",
              type: "success",
            });

            // Add new category type to the list and select it
            const newCategoryType = {
              label: response.data.name,
              value: response.data.id
            };
            this.categoryTypes.push(newCategoryType);
            this.formState.category_type_id = response.data.id;

            // Reset and close dialog
            this.categoryTypeForm = { name: '', description: '' };
            this.showCategoryTypeDialog = false;

          } catch (error) {
            ElNotification({
              title: "Error",
              message: "Failed to create category type",
              type: "error",
            });
          } finally {
            this.creatingCategoryType = false;
          }
        }
      });
    },

    fetchCategory() {
      if (!this.$route.params.categoryId) return;

      this.categoryLoader = true;
      const categoryId = this.$route.params.categoryId;
      store.dispatch("fetchSingleItem", { url: "category", id: categoryId })
        .then((res) => {
          this.formState = {
            name: res.data.name,
            category_type_id: res.data.category_type?.id || res.data.category_type_id,
            parent: res.data.parent?.id || null
          };
          this.formStateCopy = { ...this.formState };
          this.categoryLoader = false;
          this.isEdit = true;
        })
        .catch(() => {
          this.categoryLoader = false;
        });
    },

    handleRemove() {
      this.fileList = [];
    },

    async handleSubmit() {
      const formData = new FormData();

      // Append image file if uploaded
      if (this.fileList.length > 0) {
        const attachment = this.fileList[0];
        if (attachment?.originFileObj.size <= 4 * 1024 * 1024) {
          formData.append('photo', attachment?.originFileObj);
        } else {
          ElNotification({
            title: "Error",
            message: `${attachment?.name} exceeds 4MB size limit`,
            type: "error",
          });
          return;
        }
      }

      // Append form fields
      for (let key in this.formState) {
        if (this.formState[key] !== null && this.formState[key] !== undefined && this.formState[key] !== '') {
          formData.append(key, this.formState[key]);
        }
      }

      this.registerLoading = true;

      try {
        const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

        if (this.isEdit) {
          const categoryId = this.$route?.params?.categoryId;
          await axios.patch(`${baseUrl}category/${categoryId}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authData?.access,
            },
          });
          ElNotification({
            title: "Success",
            message: "Category updated successfully",
            type: "success",
          });
        } else {
          await axios.post(`${baseUrl}category/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authData?.access,
            },
          });
          ElNotification({
            title: "Success",
            message: "Category created successfully",
            type: "success",
          });
        }

        // Navigate back to categories list
        this.$router.push({ name: 'categories' });

      } catch (err) {
        ElNotification({
          title: "Error",
          message: "Failed to save category",
          type: "error",
        });
        console.error("Error:", err);
      } finally {
        this.registerLoading = false;
      }
    }
  },
  mounted() {
    this.fetchCategory();
    this.fetchParentCategories();
    this.fetchCategoryTypes();
  }
};
</script>

<style scoped>
.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>