<script setup>
import BaseDialog from "@/components/BaseDialog.vue";
import store from "@/vuex/store";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import BaseLoader from "@/components/BaseLoader.vue";
import { ElNotification } from "element-plus";

const route = useRoute();
const router = useRouter();
const productObject = ref({});
const vendors = ref([]);
const formState = ref({
  quantity: 1,
  vendor: null,
});
const submitLoading = ref(false);
const formRef = ref(null);
const vendorsLoading = ref(false);

const rules = {
  quantity: [
    { required: true, message: "Quantity is required", trigger: "blur" },
    {
      type: "number",
      min: 1,
      message: "Quantity must be at least 1",
      trigger: "blur",
    },
  ],
  vendor: [
    { required: true, message: "Vendor is required", trigger: "change" },
  ],
};

const fetchProduct = async () => {
  try {
    const response = await store.dispatch("fetchSingleItem", {
      url: "product",
      id: route?.params.productId,
    });
    productObject.value = response?.data;
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to fetch product details",
      type: "error",
    });
  }
};

const fetchVendors = async () => {
  console.log("here");
  vendorsLoading.value = true;
  try {
    const response = await store.dispatch("fetchList", { url: "vendors" });
    // vendors.value = response?.data?.filter(
    //   (vendor) => vendor.verification_status === "APPROVED" && vendor.is_active
    // );
    vendors.value = response?.data;
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to fetch vendors",
      type: "error",
    });
  } finally {
    vendorsLoading.value = false;
  }
};

const attemptSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    await store.dispatch("postData", {
      url: "inventory",
      data: {
        quantity: formState.value.quantity,
        product: route?.params.productId,
        vendor_id: formState.value.vendor,
      },
    });

    ElNotification({
      title: "Success",
      message: "Inventory updated successfully",
      type: "success",
    });

    router.back();
  } catch (error) {
    ElNotification({
      title: "Error",
      message: error?.message || "Failed to update inventory",
      type: "error",
    });
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  Promise.all([fetchProduct(), fetchVendors()]);
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    class="w-full flex flex-col gap-4"
    label-position="top"
    @submit.prevent="attemptSubmit"
  >
    <div class="flex flex-col gap-2">
      <h3 class="text-gray-500">Product</h3>
      <p class="text-gray-700">
        {{ productObject?.name || `Product ${route?.params?.productId}` }}
      </p>
    </div>

    <!-- Vendor Selection -->
    <el-form-item label="Select Vendor" prop="vendor">
      <!-- {{ vendors?.results[0]?.name }}
      {{ vendors?.results[0]?.id }} -->
      <el-select
        v-model="formState.vendor"
        placeholder="Select a vendor"
        class="w-full"
        size="large"
        :loading="vendorsLoading"
        filterable
      >
        <el-option
          v-for="vendor in vendors?.results"
          :key="vendor.id"
          :label="vendor.name"
          :value="vendor.id"
        >
          <div class="flex justify-between items-center">
            <span>{{ vendor.name }}</span>
            <span class="text-gray-400 text-sm">{{ vendor.location }}</span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>

    <!-- Quantity Field -->
    <el-form-item label="Amount" prop="quantity">
      <el-input-number
        v-model="formState.quantity"
        class="w-full"
        :min="1"
        placeholder="Enter quantity"
        size="large"
        controls-position="right"
      />
    </el-form-item>

    <!-- Submit Button -->
    <el-form-item class="md:col-span-2">
      <el-button
        :loading="submitLoading"
        class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
        size="large"
        type="primary"
        @click="attemptSubmit"
      >
        Update Inventory
        <template #loading>
          <BaseLoader />
        </template>
      </el-button>
    </el-form-item>
  </el-form>
</template>
