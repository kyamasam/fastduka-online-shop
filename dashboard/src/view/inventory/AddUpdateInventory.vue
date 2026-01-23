<script setup>
import BaseLoader from "@/components/BaseLoader.vue";
import store from "@/vuex/store";
import { ElNotification } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const productObject = ref({});
const vendors = ref([]);
const existingInventory = ref([]);
const inventoryLoading = ref(false);
const selectSpecificBatch = ref(false);
const formState = ref({
  quantity: 1,
  vendor: null,
  action_type: "STOCK_ADDITION",
  reason: "",
  inventory_id: null,
});
const submitLoading = ref(false);
const formRef = ref(null);
const vendorsLoading = ref(false);

const actionTypes = [
  { label: "Stock Addition", value: "STOCK_ADDITION" },
  { label: "Stock Deduction", value: "STOCK_DEDUCTION" },
  { label: "Order Cancelled", value: "ORDER_CANCELLED" },
  { label: "Customer Order", value: "CUSTOMER_ORDER" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Expiry", value: "EXPIRY" },
];

const rules = {
  quantity: [
    { required: true, message: "Quantity is required", trigger: "blur" },
    {
      type: "number",
      min: 0.01,
      message: "Quantity must be at least 0.01",
      trigger: "blur",
    },
  ],
  vendor: [
    { required: true, message: "Vendor is required", trigger: "change" },
  ],
  action_type: [
    { required: true, message: "Action type is required", trigger: "change" },
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

const fetchExistingInventory = async () => {
  if (!formState.value.vendor) return;

  inventoryLoading.value = true;
  try {
    const url = `inventory/unpaged?product=${route?.params.productId}&vendor_id=${formState.value.vendor}`;
    const response = await store.dispatch("fetchList", {
      url: url,
    });
    existingInventory.value = response?.data || [];
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to fetch existing inventory",
      type: "error",
    });
  } finally {
    inventoryLoading.value = false;
  }
};

const attemptSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const payload = {
      product_id: parseInt(route?.params.productId),
      vendor_id: formState.value.vendor,
      quantity: formState.value.quantity,
      action_type: formState.value.action_type,
    };

    // Add reason if provided
    if (formState.value.reason) {
      payload.reason = formState.value.reason;
    }

    // Add inventory_id if specific batch is selected
    if (formState.value.inventory_id) {
      payload.inventory_id = formState.value.inventory_id;
    }

    await store.dispatch("postData", {
      url: "inventory/adjust",
      data: payload,
    });

    ElNotification({
      title: "Success",
      message: "Inventory adjusted successfully",
      type: "success",
    });

    // Refresh inventory list
    await fetchExistingInventory();

    // Reset form
    formState.value = {
      quantity: 1,
      vendor: null,
      action_type: "STOCK_ADDITION",
      reason: "",
      inventory_id: null,
    };

    selectSpecificBatch.value = false;
    formRef.value.resetFields();
  } catch (error) {
    ElNotification({
      title: "Error",
      message: error?.response?.data?.error || error?.message || "Failed to adjust inventory",
      type: "error",
    });
  } finally {
    submitLoading.value = false;
  }
};

// Watch for vendor selection to fetch inventory
watch(
  () => formState.value.vendor,
  (newVendor) => {
    if (newVendor) {
      fetchExistingInventory();
    } else {
      existingInventory.value = [];
    }
    // Reset batch selection when vendor changes
    formState.value.inventory_id = null;
    selectSpecificBatch.value = false;
  }
);

// Watch for batch selection toggle
watch(
  () => selectSpecificBatch.value,
  (newValue) => {
    if (!newValue) {
      formState.value.inventory_id = null;
    }
  }
);

onMounted(() => {
  Promise.all([fetchProduct(), fetchVendors()]);
});
</script>

<template>
  <el-form ref="formRef"
           :model="formState"
           :rules="rules"
           class="w-full flex flex-col gap-4"
           label-position="top"
           @submit.prevent="attemptSubmit">
    <div class="flex flex-col gap-2">
      <h3 class="text-gray-500">Product</h3>
      <p class="text-gray-700">
        {{ productObject?.name || `Product ${route?.params?.productId}` }}
      </p>
    </div>

    <!-- Action Type Selection -->
    <el-form-item label="Action Type"
                  prop="action_type">
      <el-select v-model="formState.action_type"
                 placeholder="Select action type"
                 class="w-full"
                 size="large">
        <el-option v-for="actionType in actionTypes"
                   :key="actionType.value"
                   :label="actionType.label"
                   :value="actionType.value" />
      </el-select>
    </el-form-item>

    <!-- Vendor Selection -->
    <el-form-item label="Select Vendor"
                  prop="vendor">
      <el-select v-model="formState.vendor"
                 placeholder="Select a vendor"
                 class="w-full"
                 size="large"
                 :loading="vendorsLoading"
                 filterable>
        <el-option v-for="vendor in vendors?.results"
                   :key="vendor.id"
                   :label="vendor.name"
                   :value="vendor.id">
          <div class="flex justify-between items-center">
            <span>{{ vendor.name }}</span>
            <span class="text-gray-400 text-sm">{{ vendor.location }}</span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>

    <!-- Batch Selection Toggle -->
    <div v-if="formState.vendor && existingInventory.length > 0"
         class="flex items-center gap-3 py-2">
      <el-switch v-model="selectSpecificBatch"
                 size="large" />
      <span class="text-sm text-gray-700">Select specific batch</span>
    </div>

    <!-- Specific Inventory Batch Selection -->
    <el-form-item v-if="selectSpecificBatch && existingInventory.length > 0"
                  label="Select Batch">
      <el-select v-model="formState.inventory_id"
                 placeholder="Select a specific inventory batch"
                 class="w-full"
                 size="large"
                 filterable
                 clearable>
        <el-option v-for="inventory in existingInventory"
                   :key="inventory.id"
                   :label="`Batch #${inventory.id} - Qty: ${inventory.quantity} - ${new Date(inventory.created_at).toLocaleDateString()}`"
                   :value="inventory.id" />
      </el-select>
    </el-form-item>

    <!-- Quantity Field -->
    <el-form-item label="Quantity"
                  prop="quantity">
      <el-input-number v-model="formState.quantity"
                       class="w-full"
                       :min="0.01"
                       :step="1"
                       placeholder="Enter quantity"
                       size="large"
                       controls-position="right" />
    </el-form-item>

    <!-- Reason Field -->
    <el-form-item label="Reason (Optional)">
      <el-input v-model="formState.reason"
                type="textarea"
                :rows="3"
                placeholder="Enter reason for this adjustment"
                size="large" />
    </el-form-item>

    <!-- Submit Button -->
    <el-form-item class="md:col-span-2">
      <el-button :loading="submitLoading"
                 class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
                 size="large"
                 type="primary"
                 @click="attemptSubmit">
        Adjust Inventory
        <template #loading>
          <BaseLoader />
        </template>
      </el-button>
    </el-form-item>
  </el-form>

  <!-- Existing Inventory Display -->
  <div v-if="formState.vendor"
       class="mt-8 bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Current Inventory</h2>
    <div v-if="inventoryLoading"
         class="flex justify-center py-8">
      <BaseLoader />
    </div>
    <div v-else-if="existingInventory.length === 0"
         class="text-gray-500 text-center py-8">
      No inventory records found for this product and vendor
    </div>
    <div v-else
         class="overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-4 py-3">Vendor</th>
            <th class="px-4 py-3">Quantity</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inventory in existingInventory"
              :key="inventory.id"
              class="bg-white border-b hover:bg-gray-50">
            <td class="px-4 py-3">
              {{ inventory?.vendor?.name }}
            </td>
            <td class="px-4 py-3 font-medium">
              {{ inventory.quantity }}
            </td>
            <td class="px-4 py-3">
              <span :class="{
                'text-green-600': inventory.quantity > 0,
                'text-red-600': inventory.quantity === 0,
              }">
                {{ inventory.quantity > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">
              {{ new Date(inventory.created_at).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
