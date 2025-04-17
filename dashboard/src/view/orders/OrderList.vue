<template>
  <PageHeaders class="ninjadash-page-header-main" title="Orders" />
  <router-view />

  <BaseTable
    :columns="columns"
    show0ther-items
    show-expanded-items
    :fetchUrl="fetchUrl"
    title="Orders"
  >
    <template #filters>
      <el-radio-group class="rounded-none" v-model="activeFilter" size="large">
        <el-radio-button class="rounded-none" label="All" value="" />
        <el-radio-button
          class="rounded-none"
          label="Delivered"
          value="?status=DELIVERED"
        />
        <el-radio-button
          class="rounded-none"
          label="In Transit"
          value="?status=IN_TRANSIT"
        />
        <el-radio-button
          class="rounded-none"
          label="Paid"
          value="?status=PAID"
        />
        <el-radio-button
          class="rounded-none"
          label="Placed"
          value="?status=PLACED"
        />
        <el-radio-button
          class="rounded-none"
          label="Processing"
          value="?status=PROCESSING"
        />
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
        <el-tag v-if="slotProps?.text === ''" type="danger">Null</el-tag>
        <div v-else>{{ slotProps?.text }}</div>
      </template>

      <template v-if="slotProps.column.key === 'order_items'">
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="toggleExpand(slotProps.text)"
        >
          <el-icon
            class="transform transition-transform"
            :class="{ 'rotate-90': expandedRows.includes(slotProps.text.id) }"
          >
            <CaretRight />
          </el-icon>
          <span
            >View Items ({{
              slotProps?.text?.orderitem_set?.length || 0
            }})</span
          >
        </div>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <el-button
          class="bg-red-500 text-white hover:bg-red-600 border-none hover:ring-none rounded-none"
          type="primary"
          size="large"
          @click="selectAction('order-rider', slotProps.text?.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </el-button>

        <!--        <el-button-->
        <!--            class="bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none"-->
        <!--            type="primary"-->
        <!--            size="large"-->
        <!--            @click="selectAction('order-rider', slotProps.text?.id)"-->
        <!--        >-->
        <!--          <el-icon>-->
        <!--            <arrow-right/>-->
        <!--          </el-icon>-->
        <!--        </el-button>-->
      </template>
    </template>

    <template v-slot:expandedRowRender="slotProps">
      <a-table
        :columns="innerColumns"
        :data-source="slotProps?.record?.orderitem_set"
        :pagination="false"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'product'">
            <div class="flex items-center gap-2">
              <img
                height="40"
                width="40"
                :src="text?.product?.primary_photo"
                :alt="text?.product?.name"
              />
              {{ text?.product?.name }}
            </div>
          </template>
        </template>
      </a-table>
    </template>
  </BaseTable>
</template>

<script setup>
import { ref, watch } from "vue";
import { ArrowRight, Picture, CaretRight } from "@element-plus/icons-vue";
import BaseTable from "@/components/BaseTable.vue";
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import { formatDate } from "@/utility/functions";
import { formatCurrency } from "@/utility/functions";
import router from "@/routes";

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
