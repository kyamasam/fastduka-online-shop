<template>
    <el-dialog
      v-model="dialogVisible"
      title="Add New Category"
      width="500px"
      :before-close="handleClose"
      destroy-on-close
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        label-position="top"
        @submit.native.prevent="handleSubmit"
      >
        <!-- Name Field -->
        <el-form-item
          :rules="[{ required: true, message: 'Please input the category name!' }]"
          label="Name"
          prop="name"
        >
          <el-input 
            v-model="categoryForm.name" 
            class="rounded-none" 
            placeholder="Category name" 
            size="large"
          />
        </el-form-item>
  
        <!-- Parent Category Field -->
        <el-form-item
          label="Parent Category (Optional)"
          prop="parent"
        >
          <el-select
            v-model="categoryForm.parent"
            :loading="parentCategoriesLoading"
            class="w-full rounded-none"
            placeholder="Select Parent Category (Optional)"
            size="large"
            clearable
          >
            <el-option 
              v-for="category in parentCategories" 
              :key="category.value" 
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
  
        <!-- Category Image Field -->
        <el-form-item label="Category Image (Optional)" prop="photo">
          <a-upload
            v-model:file-list="fileList"
            :progress="{
              showInfo: true,
            }"
            :show-upload-list="{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }"
            accept=".jpg,.png,.jpeg"
            class="avatar-uploader w-full flex flex-col justify-center bg-gray-100 border border-dashed border-blue-400 p-4 rounded-lg"
            list-type="picture"
            name="photo"
            @remove="handleRemove"
          >
            <div
              class="ant-upload-drag-icon text-blue-400 w-full flex justify-center py-4"
            >
              <el-icon><Upload /></el-icon>
            </div>
            <div class="flex flex-col items-center">
              <p class="ant-upload-text">
                Click or drag file to this area to upload
                <span class="font-bold">category photo</span>
              </p>
              <p class="ant-upload-hint">
                Support for a single upload. JPG, PNG or JPEG formats accepted.
              </p>
            </div>
  
            <el-loading v-if="loadingPhotoUpload" />
          </a-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button
            :loading="submitLoading"
            class="bg-red-400 border-none hover:bg-red-500 focus:bg-red-500"
            type="primary"
            @click="handleSubmit"
          >
            Add Category
          </el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import store from "@/vuex/store";
  import { notification } from "ant-design-vue";
  import axios from "axios";
  import { baseUrl } from "@/utility/constants";
  import { Plus, Upload } from '@element-plus/icons-vue';
  
  export default {
    name: "CategoryForm",
    components: {
      Upload
    },
    props: {
      // Controls visibility of the dialog
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // Dialog visibility - controlled by prop
        dialogVisible: false,
        // Form data for the category
        categoryForm: {
          name: "",
          parent: null,
          photo: null
        },
        // Loading states
        submitLoading: false,
        parentCategoriesLoading: false,
        loadingPhotoUpload: false,
        // File upload related data
        fileList: [],
        // List of parent categories for dropdown
        parentCategories: []
      };
    },
    watch: {
      // Watch for changes in the visible prop to update internal dialog state
      visible(newVal) {
        this.dialogVisible = newVal;
        if (newVal) {
          this.fetchParentCategories();
        }
      },
      // Watch for changes in internal dialog state to emit events
      dialogVisible(newVal) {
        if (!newVal) {
          this.$emit('close');
        }
      }
    },
    methods: {
      /**
       * Fetch all categories to populate parent dropdown
       */
      fetchParentCategories() {
        this.parentCategoriesLoading = true;
        store.dispatch("fetchList", { url: "category" })
          .then((res) => {
            // Map the response data to format needed for el-select
            this.parentCategories = res.data.results.map((category) => ({
              label: category.name,
              value: category.id
            }));
            this.parentCategoriesLoading = false;
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
            notification["error"]({
              message: "Error",
              description: "Failed to fetch categories. Please try again.",
            });
            this.parentCategoriesLoading = false;
          });
      },
  
      /**
       * Handle file removal from upload component
       */
      handleRemove() {
        this.fileList = [];
        this.categoryForm.photo = null;
      },
  
      /**
       * Close the dialog and reset the form
       */
      handleClose() {
        this.resetForm();
        this.dialogVisible = false;
      },
  
      /**
       * Reset form to initial state
       */
      resetForm() {
        if (this.$refs.categoryFormRef) {
          this.$refs.categoryFormRef.resetFields();
        }
        this.categoryForm = {
          name: "",
          parent: null,
          photo: null
        };
        this.fileList = [];
      },
  
      /**
       * Submit the form to create a new category
       */
      async handleSubmit() {
        // Validate the form before submission
        try {
          await this.$refs.categoryFormRef.validate();
        } catch (error) {
          return; // Stop if validation fails
        }
  
        // Create FormData to handle file upload
        const formData = new FormData();
        
        // Add category name
        formData.append('name', this.categoryForm.name);
        
        // Add parent category if selected
        if (this.categoryForm.parent !== null) {
          formData.append('parent', this.categoryForm.parent);
        }
        
        // Add photo if uploaded
        if (this.fileList.length > 0) {
          const photo = this.fileList[0].originFileObj;
          
          // Check file size (max 4MB)
          if (photo.size <= 4 * 1024 * 1024) {
            formData.append('photo', photo);
          } else {
            notification["error"]({
              message: "Error",
              description: `Image exceeds 4MB size limit and won't be uploaded`,
            });
            return;
          }
        }
  
        this.submitLoading = true;
  
        try {
          // Get auth token from localStorage
          const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
          
          // Send POST request to create category
          const response = await axios.post(`${baseUrl}category/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authData?.access,
            },
          });
  
          // Handle successful response
          notification["success"]({
            message: "Success",
            description: "Category created successfully",
          });
          
          // Reset form and close dialog
          this.resetForm();
          this.$emit('category-added', response.data);
          this.dialogVisible = false;
        } catch (error) {
          // Handle errors
          console.error("Error creating category:", error);
          const errorMessage = error.response?.data?.message || "Failed to create category";
          notification["error"]({
            message: "Error",
            description: errorMessage,
          });
        } finally {
          this.submitLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  </style>