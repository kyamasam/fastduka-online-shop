<template>
  <BaseLoader v-if="productLoader" />
  <el-form ref="formRef"
           :model="formState"
           v-if="!productLoader"
           class="md:mt-0 grid gap-2 grid-cols-1 md:grid-cols-2"
           label-position="top"
           @submit.native.prevent="handleSubmit">
    <!-- Name Field -->
    <el-form-item :rules="[{ required: true, message: 'Please input the product name!' }]"
                  label="Name"
                  prop="name">
      <el-input v-model="formState.name"
                class="rounded-none"
                placeholder="Product name"
                size="large"
                style="border-radius:0" />
    </el-form-item>

    <!-- Description Field -->
    <el-form-item label="Description"
                  prop="description">
      <el-input v-model="formState.description"
                class="rounded-none"
                placeholder="Product Description"
                size="small"
                type="textarea" />
    </el-form-item>

    <!-- Selling Price Field -->
    <el-form-item :rules="[{ required: true, message: 'Selling Price is required' }]"
                  label="Selling Price"
                  prop="selling_price">
      <el-input-number v-model="formState.selling_price"
                       class="rounded-none w-full"
                       placeholder="Price"
                       size="large" />
    </el-form-item>

    <!-- Buying Price Field -->
    <el-form-item label="Buying Price"
                  prop="buying_price">
      <el-input-number v-model="formState.buying_price"
                       class="rounded-none w-full"
                       placeholder="Price"
                       size="large" />
    </el-form-item>

    <!-- Sale / Offer Price Field -->
    <el-form-item label="Sale / Offer Price"
                  prop="sale_price">
      <el-input-number v-model="formState.sale_price"
                       class="rounded-none w-full"
                       placeholder="Price"
                       size="large" />
    </el-form-item>

    <!-- Allowable Discount Field -->
    <el-form-item label="Allowable Discount"
                  prop="allowable_discount">
      <el-input-number v-model="formState.allowable_discount"
                       class="rounded-none w-full"
                       placeholder="100"
                       size="large" />
    </el-form-item>

    <!-- Product Type Field -->
    <div class="z-50">
      <el-form-item :rules="[{ required: true, message: 'Please select a product type', trigger: 'blur' }]"
                    label="Product Type"
                    prop="product_type_id">
        <el-select v-model="formState.product_type_id"
                   :loading="productTypeLoader"
                   class="w-full rounded-none z-50"
                   placeholder="Select Product Type"
                   size="large"
                   @focus="fetchProductTypes">
          <el-option v-for="productType in productTypes"
                     :key="productType.value"
                     :label="productType.label"
                     :value="productType.value" />
        </el-select>
      </el-form-item>
    </div>

    <!-- Category Field -->
    <div class="z-50">
      <el-form-item :rules="[{ required: true, message: 'Please select a product category', trigger: 'blur' }]"
                    label="Category"
                    prop="category_id">
        <el-select v-model="formState.category_id"
                   :loading="categoryLoader"
                   class="w-full rounded-none z-50"
                   placeholder="Select Category"
                   size="large"
                   @focus="fetchCategories">
          <el-option v-for="category in categories"
                     :key="category.value"
                     :label="category.label"
                     :value="category.value" />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item class="col-span-2 w-full"
                  label="Product Image"
                  prop="primary_photo">
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
                name="teaser"
                @remove="handleRemove">
        <div class="ant-upload-drag-icon text-blue-400 w-full flex justify-center py-4">
          <upload class="h-8 w-8"></upload>
        </div>
        <div class="flex flex-col items-center">
          <p class="ant-upload-text">
            Click or drag file to this area to upload
            <span class="font-bold"> product primary photo</span>
          </p>
          <p class="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </div>

        <base-loader v-if="loadingCoverPhotoUpload" />
      </a-upload>

      <!--        <div class="file-upload-container w-full hidden">-->
      <!--          <input-->
      <!--              accept=".jpg,.png,.jpeg"-->
      <!--              class="file-input w-full h-full"-->
      <!--              type="file"-->
      <!--              @change="handlePhotoChange"-->
      <!--          />-->
      <!--          <div class="file-upload-content">-->
      <!--            <el-icon>-->
      <!--              <upload-filled/>-->
      <!--            </el-icon>-->
      <!--            <div class="file-upload-text">-->
      <!--              <span>Drop file here or <em>click to upload</em></span>-->
      <!--              <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
    </el-form-item>

    <!-- Submit Button -->
    <el-form-item class="md:col-span-2">
      <el-button :loading="registerLoading"
                 class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
                 size="large"
                 type="primary"
                 @click="handleSubmit">
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import BaseDrawer from "@/BaseDrawer.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import BaseLoader from "@/components/BaseLoader";
import { baseUrl } from "@/utility/constants";
import store from "@/vuex/store";
import axios from "axios";
import { ElNotification } from "element-plus";

export default {
  name: "ProductForm",
  components: {
    BaseDrawer,
    BaseDialog,
    BaseLoader
  },
  data() {
    return {
      formState: {
      },
      formStateCopy: {},
      registerLoading: false,
      categories: [],
      categoryLoader: false,
      productTypes: [],
      productTypeLoader: false,
      productLoader: false,
      counter: 0,
      loadingProfilePhotoUpload: false,
      fileList: [],
      info: {
        file: {
          status: "uploading",
        },
      },
      uploadUrl: ''
    };
  },
  methods: {
    fetchCategories() {
      this.categoryLoader = true;
      store.dispatch("fetchList", { url: "category" })
        .then((res) => {
          this.categories = res.data.results.map((category) => ({
            label: category.name,
            value: category.id
          }));
          this.categoryLoader = false;
        })
        .catch(() => {
          this.categoryLoader = false;
        });
    },
    fetchProductTypes() {
      this.productTypeLoader = true;
      store.dispatch("fetchList", { url: "category-type" })
        .then((res) => {
          this.productTypes = res.data.results.map((productType) => ({
            label: productType.name,
            value: productType.id
          }));
          this.productTypeLoader = false;
        })
        .catch(() => {
          this.productTypeLoader = false;
        });
    },
    fetchProduct() {
      this.productLoader = true;
      const productId = this.$route.params.productId;
      store.dispatch("fetchSingleItem", { url: "product", id: productId })
        .then((res) => {
          this.formState = res.data
          this.formStateCopy = res.data
          this.productLoader = false;
        })
        .catch(() => {
          this.productLoader = false;
        });
    },
    handlePhotoChange(event) {
      this.fileList = event.target.files[0];
    },
    saveChanges() {
      const changes = {};

      const isEqual = (a, b) => {
        // Handle arrays or objects recursively
        if (typeof a === 'object' && typeof b === 'object' && a && b) {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          if (keysA.length !== keysB.length) return false;

          return keysA.every(key => isEqual(a[key], b[key]));
        }
        // Fallback for primitive values
        return a === b;
      };

      for (const key in this.formStateCopy) {
        if (!isEqual(this.formState[key], this.formStateCopy[key])) {
          changes[key] = this.formState[key];
        }
      }

      console.log('Detected changes:', changes);

      return changes;
    },
    async handleSubmit() {
      const formData = new FormData();

      // Append each file to the formData if it meets the size condition
      if (this.fileList.length > 0) {
        for (let attachment of this.fileList) {
          if (attachment?.originFileObj.size <= 4 * 1024 * 1024) {
            formData.append('primary_photo', attachment?.originFileObj);
          } else {
            ElNotification({
              title: "Error",
              message: `${attachment?.name} exceeds 4MB size limit and won't be uploaded`,
              type: "error",
            });
            continue;
          }
        }
      }

      if (this.$route.name === 'edit-product') {
        // this.formState = this.saveChanges();
        delete this.formState.primary_photo;
      }

      for (let key in this.formState) {
        if (this.formState[key] === null || this.formState[key] === undefined) {
          continue; // Skip null or undefined values
        }
        formData.append(key, this.formState[key]);
      }

      // Log the formData content for debugging
      console.log("FormData entries:", Array.from(formData.entries()));

      this.registerLoading = true;

      try {
        // Retrieve auth data from localStorage
        const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

        const routeName = this.$route.name;
        if (routeName === "edit-product") {
          const productId = this.$route?.params?.productId;
          const resp = await axios.patch(`${baseUrl}product/${productId}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure multipart form-data header
              Authorization: "Bearer " + authData?.access, // Include authorization token
            },
          });
          ElNotification({
            title: "Success",
            message: "Product updated successfully",
            type: "success",
            position: "bottom-right",

          });
        } else {
          const resp = await axios.post(`${baseUrl}product/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure multipart form-data header
              Authorization: "Bearer " + authData?.access, // Include authorization token
            },
          });
          ElNotification({
            title: "Success",
            message: "Product created successfully",
            type: "success",
          });
        }



        console.log("Success:", resp);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        this.registerLoading = false;
        // router.go(-1)
      }
    }


  },
  mounted() {
    this.fetchProduct();
  }
};
</script>

<style scoped>
.file-upload-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}

.file-input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  /* Prevent clicks on styled content */
}

.file-upload-text {
  margin-top: 8px;
  color: #666;
}

.el-upload__tip {
  font-size: 12px;
  color: #999;
}
</style>
