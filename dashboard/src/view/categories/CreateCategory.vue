<template>
    <BaseDrawer
      title="Add New Category"
      :closeRoute="closeRoute"
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
            @focus="fetchParentCategories"
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
      
      <div>
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
      </div>
    </BaseDrawer>
  </template>
  
  <script>
  import store from "@/vuex/store";
  import { notification } from "ant-design-vue";
  import axios from "axios";
  import { baseUrl } from "@/utility/constants";
  import { Upload } from '@element-plus/icons-vue';
  import BaseDrawer from "@/BaseDrawer.vue";
  import router from "@/routes";
  
  export default {
    name: "CategoryForm",
    components: {
      Upload,
      BaseDrawer
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      closeRoute: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogVisible: false,
        categoryForm: {
          name: "",
          parent: null,
          photo: null
        },
        submitLoading: false,
        parentCategoriesLoading: false,
        loadingPhotoUpload: false,
        fileList: [],
        parentCategories: []
      };
    },
    watch: {
      visible(newVal) {
        this.dialogVisible = newVal;
        if (newVal) {
          this.fetchParentCategories();
        }
      },
      dialogVisible(newVal) {
        if (!newVal) {
          this.$emit('close');
        }
      }
    },
    methods: {
      fetchParentCategories() {
        this.parentCategoriesLoading = true;
        store.dispatch("fetchList", { url: "category" })
          .then((res) => {
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
  
      handleRemove() {
        this.fileList = [];
        this.categoryForm.photo = null;
      },
  
      handleClose() {
        this.resetForm();
        this.navigateAway();
      },
  
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
  
      navigateAway() {
        if (this.closeRoute) {
          router.push({ name: this.closeRoute });
        } else {
          router.go(-1);
        }
      },
  
      async handleSubmit() {
        try {
          await this.$refs.categoryFormRef.validate();
        } catch (error) {
          return;
        }
  
        const formData = new FormData();
        formData.append('name', this.categoryForm.name);
        
        if (this.categoryForm.parent !== null) {
          formData.append('parent', this.categoryForm.parent);
        }
        
        if (this.fileList.length > 0) {
          const photo = this.fileList[0].originFileObj;
          
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
          const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
          const response = await axios.post(`${baseUrl}category/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + authData?.access,
            },
          });
  
          notification["success"]({
            message: "Success",
            description: "Category created successfully",
          });
          
          this.resetForm();
          this.$emit('category-added', response.data);
          router.go(-1);
        } catch (error) {
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