<script setup>
import BaseLoader from "@/components/BaseLoader.vue";
import store from "@/vuex/store";
import { ElNotification } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productObject = ref({});
const vendors = ref([]);
const inventoryBatches = ref([]);
const inventoryLoading = ref(false);
const selectedVendor = ref(null);
const vendorsLoading = ref(false);

// History modal state
const historyDialogVisible = ref(false);
const historyLoading = ref(false);
const inventoryHistory = ref([]);
const selectedBatchId = ref(null);

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
  vendorsLoading.value = true;
  try {
    const response = await store.dispatch("fetchList", { url: "vendors" });
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

const fetchInventoryBatches = async () => {
  if (!selectedVendor.value) return;

  inventoryLoading.value = true;
  try {
    const url = `inventory/unpaged?product=${route?.params.productId}&vendor_id=${selectedVendor.value}`;
    const response = await store.dispatch("fetchList", {
      url: url,
    });
    inventoryBatches.value = response?.data || [];
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to fetch inventory batches",
      type: "error",
    });
  } finally {
    inventoryLoading.value = false;
  }
};

const fetchInventoryHistory = async (inventoryId) => {
  selectedBatchId.value = inventoryId;
  historyDialogVisible.value = true;
  historyLoading.value = true;
  inventoryHistory.value = [];

  try {
    const response = await store.dispatch("fetchList", {
      url: `inventory-history/?inventory_id=${inventoryId}`,
    });
    inventoryHistory.value = response?.data?.results || response?.data || [];
  } catch (error) {
    ElNotification({
      title: "Error",
      message: "Failed to fetch inventory history",
      type: "error",
    });
  } finally {
    historyLoading.value = false;
  }
};

const totalQuantity = computed(() => {
  return inventoryBatches.value.reduce(
    (sum, batch) => sum + (batch.quantity || 0),
    0
  );
});

const getStatusType = (quantity) => {
  if (quantity <= 0) return "danger";
  if (quantity <= 10) return "warning";
  return "success";
};

const getStatusText = (quantity) => {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 10) return "Low Stock";
  return "In Stock";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActionTypeLabel = (actionType) => {
  const labels = {
    STOCK_ADDITION: "Stock Addition",
    STOCK_DEDUCTION: "Stock Deduction",
    ORDER_CANCELLED: "Order Cancelled",
    CUSTOMER_ORDER: "Customer Order",
    IN_TRANSIT: "In Transit",
    EXPIRY: "Expiry",
  };
  return labels[actionType] || actionType;
};

const getActionTypeClass = (actionType) => {
  const classes = {
    STOCK_ADDITION: "success",
    STOCK_DEDUCTION: "danger",
    ORDER_CANCELLED: "warning",
    CUSTOMER_ORDER: "info",
    IN_TRANSIT: "warning",
    EXPIRY: "danger",
  };
  return classes[actionType] || "info";
};

// Watch for vendor selection to fetch inventory
watch(
  () => selectedVendor.value,
  (newVendor) => {
    if (newVendor) {
      fetchInventoryBatches();
    } else {
      inventoryBatches.value = [];
    }
  }
);

onMounted(() => {
  Promise.all([fetchProduct(), fetchVendors()]);
});
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- Product Info -->
    <div class="flex flex-col gap-2 pb-4 border-b">
      <h3 class="text-gray-500 text-sm">Product</h3>
      <p class="text-gray-700 font-medium text-lg">
        {{ productObject?.name || `Product ${route?.params?.productId}` }}
      </p>
    </div>

    <!-- Vendor Selection -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">Select Vendor</label>
      <el-select v-model="selectedVendor"
                 placeholder="Select a vendor to view their inventory"
                 class="w-full"
                 size="large"
                 :loading="vendorsLoading"
                 filterable
                 clearable>
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
    </div>

    <!-- Summary Stats -->
    <div v-if="selectedVendor && inventoryBatches.length > 0"
         class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-blue-600 text-sm font-medium">Total Batches</p>
        <p class="text-2xl font-bold text-blue-700">
          {{ inventoryBatches.length }}
        </p>
      </div>
      <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-green-600 text-sm font-medium">Total Quantity</p>
        <p class="text-2xl font-bold text-green-700">{{ totalQuantity }}</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg">
        <p class="text-purple-600 text-sm font-medium">Avg per Batch</p>
        <p class="text-2xl font-bold text-purple-700">
          {{
            inventoryBatches.length > 0
              ? Math.round(totalQuantity / inventoryBatches.length)
              : 0
          }}
        </p>
      </div>
    </div>

    <!-- Inventory Batches List -->
    <div v-if="selectedVendor"
         class="mt-4">
      <h2 class="text-lg font-semibold mb-4">Inventory Batches</h2>

      <div v-if="inventoryLoading"
           class="flex justify-center py-12">
        <BaseLoader />
      </div>

      <div v-else-if="inventoryBatches.length === 0"
           class="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-12 h-12 mx-auto mb-4 text-gray-400">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        <p>No inventory batches found for this vendor</p>
      </div>

      <div v-else
           class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3">Batch ID</th>
              <th class="px-4 py-3">Quantity</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Variant</th>
              <th class="px-4 py-3">Created At</th>
              <th class="px-4 py-3">Updated At</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="batch in inventoryBatches"
                :key="batch.id"
                class="bg-white border-b hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">
                #{{ batch.id }}
              </td>
              <td class="px-4 py-3">
                <span class="font-semibold text-lg">{{ batch.quantity }}</span>
                <span class="text-gray-500 text-xs ml-1">units</span>
              </td>
              <td class="px-4 py-3">
                <el-tag :type="getStatusType(batch.quantity)"
                        size="small">
                  {{ getStatusText(batch.quantity) }}
                </el-tag>
              </td>
              <td class="px-4 py-3">
                <span v-if="batch.product_variant">
                  {{ batch.product_variant?.value || batch.product_variant }}
                </span>
                <el-tag v-else
                        type="info"
                        size="small">Default</el-tag>
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ formatDate(batch.created_at) }}
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ formatDate(batch.updated_at) }}
              </td>
              <td class="px-4 py-3">
                <el-button type="primary"
                           size="small"
                           class="bg-blue-500 border-none hover:bg-blue-600"
                           @click="fetchInventoryHistory(batch.id)">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke-width="1.5"
                       stroke="currentColor"
                       class="w-4 h-4 mr-1">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  History
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State when no vendor selected -->
    <div v-else
         class="text-center py-12 bg-gray-50 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           stroke-width="1.5"
           stroke="currentColor"
           class="w-12 h-12 mx-auto mb-4 text-gray-400">
        <path stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
      <p class="text-gray-500">Select a vendor to view inventory batches</p>
    </div>

    <!-- History Dialog -->
    <el-dialog v-model="historyDialogVisible"
               :title="`Inventory History - Batch #${selectedBatchId}`"
               width="700px"
               class="history-dialog">
      <div v-if="historyLoading"
           class="flex justify-center py-8">
        <BaseLoader />
      </div>

      <div v-else-if="inventoryHistory.length === 0"
           class="text-center py-8 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-12 h-12 mx-auto mb-4 text-gray-400">
          <path stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p>No history records found for this batch</p>
      </div>

      <div v-else
           class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th class="px-4 py-3">Action</th>
              <th class="px-4 py-3">Previous</th>
              <th class="px-4 py-3">Change</th>
              <th class="px-4 py-3">New</th>
              <th class="px-4 py-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in inventoryHistory"
                :key="index"
                class="bg-white border-b hover:bg-gray-50">
              <td class="px-4 py-3">
                <el-tag :type="getActionTypeClass(record.action_type)"
                        size="small">
                  {{ getActionTypeLabel(record.action_type) }}
                </el-tag>
              </td>
              <td class="px-4 py-3 text-gray-600">
                {{ record.previous_value }}
              </td>
              <td class="px-4 py-3">
                <span :class="{
                  'text-green-600': (record?.new_value > record?.previous_value),
                  'text-red-600': (record?.new_value < record?.previous_value),
                }"
                      class="font-semibold">
                  {{ (record?.new_value > record?.previous_value) ? '+' : '-' }}{{ record.quantity }}
                </span>
              </td>
              <td class="px-4 py-3 font-medium">
                {{ record.new_value }}
              </td>
              <td class="px-4 py-3 text-gray-500">
                {{ record.reason || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <el-button @click="historyDialogVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
