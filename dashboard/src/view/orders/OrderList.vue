<template>
  <PageHeaders class="ninjadash-page-header-main"
               title="Orders" />
  <router-view />

  <BaseTable :columns="columns"
             show0ther-items
             show-expanded-items
             :fetchUrl="fetchUrl"
             title="Orders">
    <template #filters>
      <el-radio-group class="rounded-none"
                      v-model="activeFilter"
                      size="large">
        <el-radio-button class="rounded-none"
                         label="All"
                         value="" />
        <el-radio-button class="rounded-none"
                         label="Delivered"
                         value="?status=DELIVERED" />
        <el-radio-button class="rounded-none"
                         label="In Transit"
                         value="?status=IN_TRANSIT" />
        <el-radio-button class="rounded-none"
                         label="Paid"
                         value="?status=PAID" />
        <el-radio-button class="rounded-none"
                         label="Placed"
                         value="?status=PLACED" />
        <el-radio-button class="rounded-none"
                         label="Processing"
                         value="?status=PROCESSING" />
      </el-radio-group>
    </template>

    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'user'">
        <div class="flex items-center gap-2">
          {{ slotProps?.text?.first_name }}
          {{ slotProps?.text?.last_name }} -
          {{ slotProps?.text?.phone_number }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'payment_transaction_obj'">
        <div class="flex items-center gap-2">
          {{ formatCurrency(slotProps?.text?.transaction_amount) }}
        </div>
      </template>
      <template v-if="slotProps.column.key === 'vendor_obj'">
        <div class="flex items-center gap-2">
          {{ slotProps?.text?.name }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'created_at'">
        {{ new Date(slotProps?.text)?.toLocaleTimeString() }}
        {{ formatDate(slotProps?.text) }}
      </template>

      <template v-if="slotProps.column.key === 'delivery_location'">
        <el-tag v-if="slotProps?.text === ''"
                type="danger">Null</el-tag>
        <div v-else>{{ slotProps?.text }}</div>
      </template>

      <template v-if="slotProps.column.key === 'order_items'">
        <div class="flex items-center gap-2 cursor-pointer"
             @click="toggleExpand(slotProps.text)">
          <el-icon class="transform transition-transform"
                   :class="{ 'rotate-90': expandedRows.includes(slotProps.text.id) }">
            <CaretRight />
          </el-icon>
          <span>View Items ({{
            slotProps?.text?.orderitem_set?.length || 0
          }})</span>
        </div>
      </template>
      <!-- {{ slotProps.text.status === ORDER_STATUS.DELIVERED }} -->
      <template v-if="slotProps.column.key === 'actions'">
        <div class="flex gap-2">

          <el-button v-if="slotProps.text.status !== ORDER_STATUS.DELIVERED"
                     class="border-none hover:ring-none rounded-none"
                     type="primary"
                     size="small"
                     @click="openMarkDeliveredModal(slotProps.text)">
            <span class="mr-2">Mark Delivered</span>
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="currentColor"
                 class="size-5">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </el-button>
          <el-button v-if="slotProps.text.status !== ORDER_STATUS.DELIVERED"
                     type="plain"
                     class=" hover:ring-none rounded-none"
                     size="small"
                     @click="selectAction('order-rider', slotProps.text?.id)">
            <span class="mr-2">Assign Rider</span>
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="currentColor"
                 class="size-5">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </el-button>
          <el-button v-if="slotProps.text.status === ORDER_STATUS.DELIVERED"
                     type="success"
                     class="border-none hover:ring-none rounded-none"
                     size="small"
                     @click="openDeliveryInfoModal(slotProps.text)">
            <span class="mr-2">View Delivery Info</span>
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke-width="1.5"
                 stroke="currentColor"
                 class="size-5">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </el-button>
        </div>
      </template>
    </template>

    <template v-slot:expandedRowRender="slotProps">
      <a-table :columns="innerColumns"
               :data-source="slotProps?.record?.orderitem_set"
               :pagination="false">
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'product'">
            <div class="flex items-center gap-2">
              <img height="40"
                   width="40"
                   :src="text?.product?.primary_photo"
                   :alt="text?.product?.name" />
              {{ text?.product?.name }}
            </div>
          </template>
        </template>
      </a-table>
    </template>
  </BaseTable>

  <!-- Mark Delivered Modal -->
  <el-dialog v-model="markDeliveredDialogVisible"
             title="Mark Order as Delivered"
             width="500px">
    <el-form ref="deliveryFormRef"
             :model="deliveryForm"
             :rules="deliveryFormRules"
             label-position="top"
             @submit.prevent="submitMarkDelivered">
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Order ID: <span class="font-semibold">#{{ selectedOrder?.id }}</span></p>
        <p class="text-sm text-gray-600">Customer: <span class="font-semibold">{{ selectedOrder?.user?.first_name }}
            {{ selectedOrder?.user?.last_name }}</span></p>
      </div>

      <el-form-item label="Status"
                    prop="status">
        <el-select v-model="deliveryForm.status"
                   placeholder="Select delivery status"
                   class="w-full"
                   size="large">
          <el-option v-for="status in ORDER_STATUSES"
                     :key="status.value"
                     :label="status.label"
                     :value="status.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="Delivery Location"
                    prop="delivery_location">
        <el-input v-model="deliveryForm.delivery_location"
                  placeholder="Enter delivery location"
                  size="large" />
      </el-form-item>

      <el-form-item label="Customer Signature"
                    prop="customer_signature">
        <el-input v-model="deliveryForm.customer_signature"
                  placeholder="Customer name/signature"
                  size="large" />
      </el-form-item>

      <el-form-item label="Rider Signature"
                    prop="rider_signature">
        <el-input v-model="deliveryForm.rider_signature"
                  placeholder="Rider name/signature"
                  size="large" />
      </el-form-item>

      <el-form-item label="Delivery Note"
                    prop="delivery_note">
        <el-input v-model="deliveryForm.delivery_note"
                  type="textarea"
                  :rows="3"
                  placeholder="Add any delivery notes (optional)"
                  size="large" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="markDeliveredDialogVisible = false">Cancel</el-button>
      <el-button type="primary"
                 :loading="markDeliveredLoading"
                 class="bg-blue-500 border-none"
                 @click="submitMarkDelivered">
        Mark as Delivered
      </el-button>
    </template>
  </el-dialog>

  <!-- Delivery Info Modal -->
  <el-dialog v-model="deliveryInfoDialogVisible"
             title="Delivery Information"
             width="500px">
    <div class="space-y-4">
      <div class="p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">Order ID: <span class="font-semibold">#{{ deliveryInfoOrder?.id }}</span></p>
        <p class="text-sm text-gray-600">Customer: <span class="font-semibold">{{ deliveryInfoOrder?.user?.first_name }}
            {{ deliveryInfoOrder?.user?.last_name }}</span></p>
        <p class="text-sm text-gray-600">Status: <el-tag type="success"
                  size="small">{{ deliveryInfoOrder?.status }}</el-tag></p>
      </div>

      <div class="border rounded-lg p-4 space-y-3">
        <div>
          <label class="text-sm font-medium text-gray-500">Delivery Location</label>
          <p class="text-gray-800">{{ deliveryInfoOrder?.delivery_location || 'Not specified' }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Delivery Completed At</label>
          <p class="text-gray-800">
            {{ deliveryInfoOrder?.delivery_completed_at ? dayjs(deliveryInfoOrder.delivery_completed_at, "HH:mm:ss DD/MM/YYYY")?.toDate() : 'Not recorded' }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Customer Signature</label>
          <p class="text-gray-800">{{ deliveryInfoOrder?.customer_signature || 'Not provided' }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Rider Signature</label>
          <p class="text-gray-800">{{ deliveryInfoOrder?.rider_signature || 'Not provided' }}</p>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-500">Delivery Note</label>
          <p class="text-gray-800 whitespace-pre-wrap">{{ deliveryInfoOrder?.delivery_note || 'No notes' }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="deliveryInfoDialogVisible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import BaseTable from "@/components/BaseTable.vue";
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import router from "@/routes";
import { formatCurrency, formatDate } from "@/utility/functions";
import store from "@/vuex/store";
import { CaretRight } from "@element-plus/icons-vue";
import { dayjs, ElNotification } from "element-plus";
import { ref, watch } from "vue";

// Order Status Constants
const ORDER_STATUS = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PAID: "PAID",
};

const ORDER_STATUSES = [
  { label: "Delivered", value: ORDER_STATUS.DELIVERED },
  { label: "Placed", value: ORDER_STATUS.PLACED },
  { label: "Processing", value: ORDER_STATUS.PROCESSING },
  { label: "In Transit", value: ORDER_STATUS.IN_TRANSIT },
  { label: "Cancelled", value: ORDER_STATUS.CANCELLED },
  { label: "Paid", value: ORDER_STATUS.PAID },
];

const columns = ref([
  {
    title: "Customer Name",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Order Date",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Amount Paid",
    dataIndex: "payment_transaction_obj",
    key: "payment_transaction_obj",
  },
  {
    title: "Vendor",
    dataIndex: "vendor_obj",
    key: "vendor_obj",
  },

  {
    title: "Delivery Location",
    dataIndex: "delivery_location",
    key: "delivery_location",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

const innerColumns = ref([
  {
    title: "Product",
    dataIndex: "",
    key: "product",
    sorter: true,
    width: "20%",
  },
  {
    title: "Purchase Price",
    dataIndex: "purchase_price",
    sorter: true,
    width: "20%",
  },
  {
    title: "Quantity Purchased",
    dataIndex: "quantity",
    sorter: true,
    width: "20%",
  },
]);

const activeFilter = ref("");
const fetchUrl = ref("order");
const expandedRows = ref([]);

// Mark Delivered Modal State
const markDeliveredDialogVisible = ref(false);
const markDeliveredLoading = ref(false);
const selectedOrder = ref(null);
const deliveryFormRef = ref(null);

// Delivery Info Modal State
const deliveryInfoDialogVisible = ref(false);
const deliveryInfoOrder = ref(null);
const deliveryForm = ref({
  status: ORDER_STATUS.DELIVERED,
  delivery_location: "",
  customer_signature: "",
  rider_signature: "",
  delivery_note: "",
});

const deliveryFormRules = {
  status: [
    { required: true, message: "Please select a status", trigger: "change" },
  ],
  delivery_location: [
    { required: true, message: "Please enter delivery location", trigger: "blur" },
  ],
};

const toggleExpand = (row) => {
  const index = expandedRows.value.indexOf(row.id);
  if (index === -1) {
    expandedRows.value.push(row.id);
  } else {
    expandedRows.value.splice(index, 1);
  }
};

const calculateOrderTotal = (items) => {
  return (
    items?.reduce((total, item) => {
      return total + item.purchase_price * item.quantity;
    }, 0) || 0
  );
};

const selectAction = (action, productId) => {
  router.push({ name: action, params: { orderId: productId } });
};

const openMarkDeliveredModal = (order) => {
  selectedOrder.value = order;
  deliveryForm.value = {
    status: ORDER_STATUS.DELIVERED,
    delivery_location: order?.delivery_location || "",
    customer_signature: "",
    rider_signature: "",
    delivery_note: "",
  };
  markDeliveredDialogVisible.value = true;
};
const openDeliveryInfoModal = (order) => {
  deliveryInfoDialogVisible.value = true
  deliveryInfoOrder.value = { ...order }

}
const submitMarkDelivered = async () => {
  if (!deliveryFormRef.value) return;

  try {
    await deliveryFormRef.value.validate();
  } catch (error) {
    return;
  }

  markDeliveredLoading.value = true;

  try {
    await store.dispatch("postData", {
      url: `order/${selectedOrder.value.id}/mark-delivered`,
      data: {
        status: deliveryForm.value.status,
        delivery_location: deliveryForm.value.delivery_location,
        customer_signature: deliveryForm.value.customer_signature,
        rider_signature: deliveryForm.value.rider_signature,
        delivery_note: deliveryForm.value.delivery_note,
      },
    });

    ElNotification({
      title: "Success",
      message: "Order marked as delivered successfully",
      type: "success",
    });

    markDeliveredDialogVisible.value = false;

    // Refresh the page to update the list
    window.location.reload();
  } catch (error) {
    ElNotification({
      title: "Error",
      message: error?.response?.data?.error || error?.message || "Failed to mark order as delivered",
      type: "error",
    });
  } finally {
    markDeliveredLoading.value = false;
  }
};

watch(
  activeFilter,
  (newFilter) => {
    fetchUrl.value = `order${newFilter || ""}`;
  },
  { immediate: true }
);
</script>

<style scoped>
.nested-table {
  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(.el-table__row) {
    background: transparent;
  }

  :deep(.el-table__cell) {
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.el-table__cell:last-child) {
    border-bottom: none;
  }
}

.el-image {
  border-radius: 4px;
  overflow: hidden;
}
</style>
