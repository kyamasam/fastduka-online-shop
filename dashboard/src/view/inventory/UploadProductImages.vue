<script setup>
import BaseDialog from "@/components/BaseDialog.vue";
import store from "@/vuex/store";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import BaseLoader from "@/components/BaseLoader.vue";
import { ElNotification } from "element-plus";
import { baseUrl } from "@/utility/constants";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const productObject = ref({});
const imageFiles = ref([]);
const imagePreviews = ref([]);
const submitLoading = ref(false);
const uploadRef = ref(null);
const dragOver = ref(false);

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILES = 5;
const MIN_WIDTH = 800;
const MIN_HEIGHT = 800;

const fetchProduct = () => {
  store
    .dispatch("fetchSingleItem", {
      url: "product",
      id: route?.params.productId,
    })
    .then((res) => {
      productObject.value = res?.data;
    });
};

const validateImage = async (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP files are allowed");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      // if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
      //   reject(new Error(`Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT}px`));
      // }
      resolve(true);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
  });
};

const handleFiles = async (files) => {
  if (imageFiles.value.length + files.length > MAX_FILES) {
    ElNotification({
      title: "Error",
      message: `Maximum ${MAX_FILES} images allowed`,
      type: "error",
    });
    return;
  }

  for (const file of files) {
    try {
      await validateImage(file);
      imageFiles.value.push(file);
      imagePreviews.value.push({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    } catch (error) {
      ElNotification({
        title: "Error",
        message: error.message,
        type: "error",
      });
    }
  }
};

const handleFileInput = async (event) => {
  const files = Array.from(event.target.files);
  await handleFiles(files);
  event.target.value = "";
};

const handleDrop = async (event) => {
  event.preventDefault();
  dragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  await handleFiles(files);
};

const handleDragOver = (event) => {
  event.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  dragOver.value = false;
};

const removeImage = (index) => {
  URL.revokeObjectURL(imagePreviews.value[index].url);
  imagePreviews.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
};
const deletePhoto = async (photoId) => {
  store
    .dispatch("deleteData", { url: "product-photo", id: photoId })
    .then(() => {
      // Refresh product data to update photos
      fetchProduct();
    })
    .catch((err) => {
      ElNotification({
        title: "Error",
        message: "Failed to delete photo",
        type: "error",
      });
    });
};
const uploadImages = async () => {
  if (imageFiles.value.length === 0) {
    ElNotification({
      title: "Error",
      message: "Please select at least one image",
      type: "error",
    });
    return;
  }

  submitLoading.value = true;
  const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));

  console.log("clicked");
  if (imageFiles.value.length === 0) {
    ElNotification({
      title: "Error",
      message: "Please select at least one image",
      type: "error",
    });
    return;
  }

  imageFiles.value.map((file) => {
    const formData = new FormData();
    submitLoading.value = true;
    console.log("here");
    formData.append("photo", file);
    formData.append("product", route?.params.productId);
    axios
      .post(`${baseUrl}product-photo/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + authData?.access,
        },
      })
      .then((resp) => {
        ElNotification({
          title: "Success",
          message: "Images uploaded successfully",
          type: "success",
        });
        submitLoading.value = false;
      })
      .catch((err) => {
        ElNotification({
          title: "Error",
          message: "Failed to upload some images",
          type: "error",
        });
        submitLoading.value = false;
      });
  });
  fetchProduct();
};

onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- existing photos grid-->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div
        v-for="photo in productObject?.photos"
        :key="photo.id"
        class="relative aspect-square group"
      >
        <img
          :src="photo.photo"
          :alt="'Product photo ' + photo.id"
          class="w-full h-full object-cover rounded-lg"
        />
        <button
          @click="deletePhoto(photo.id)"
          class="absolute top-2 right-2 p-2 text-white bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    </div>
    <!-- existing photos grid-->
    <!-- Preview Grid -->
    <div
      v-if="imagePreviews.length"
      class="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <div
        v-for="(preview, index) in imagePreviews"
        :key="index"
        class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
      >
        <img
          :src="preview.url"
          :alt="preview.name"
          class="w-full h-full object-cover"
        />

        <button
          @click="removeImage(index)"
          class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          ×
        </button>
        <div
          class="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-2 py-1 text-xs truncate"
        >
          {{ preview.name }}
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="relative min-h-[200px] border-2 border-dashed rounded-lg"
      :class="[
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        imagePreviews.length ? 'border-solid' : 'border-dashed',
      ]"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <input
        ref="uploadRef"
        type="file"
        accept="image/*"
        @change="handleFileInput"
        multiple
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div class="flex flex-col items-center justify-center p-6 text-center">
        <span class="text-4xl mb-4">📸</span>
        <p class="text-gray-700 mb-2">
          Drag and drop images here or click to browse
        </p>
        <p class="text-sm text-gray-500">
          JPG, PNG or WebP • Max {{ MAX_FILE_SIZE / 1024 / 1024 }}MB • Min
          {{ MIN_WIDTH }}x{{ MIN_HEIGHT }}px • Max {{ MAX_FILES }} images
        </p>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="flex justify-center">
      <button
        @click="uploadImages"
        :disabled="submitLoading || imageFiles.length === 0"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        <BaseLoader v-if="submitLoading" class="w-4 h-4" />
        <span>
          Upload {{ imageFiles.length }}
          {{ imageFiles.length === 1 ? "Image" : "Images" }}
        </span>
      </button>
    </div>
  </div>
</template>
