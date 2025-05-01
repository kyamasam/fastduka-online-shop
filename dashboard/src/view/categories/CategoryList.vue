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

    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'photo'">
        <div class="flex items-center gap-2">
              <img
                height="40"
                width="40"
                :src="slotProps?.text?.photo"
                :alt="slotProps?.text?.name"
              />
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

      </template>
    </template>

    <template v-slot:expandedRowRender="slotProps">
      <a-table
        :columns="innerColumns"
        :data-source="slotProps?.record?.children"
        :pagination="false"
      >
        <template #bodyCell="{ column, text }">

          <template v-if="column.key === 'photo'">
            <div class="flex items-center gap-2">
              <img
                height="40"
                width="40"
                :src="text?.photo"
                :alt="text?.name"
              />
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
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Photo",
    dataIndex: "",
    key: "photo",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

const innerColumns = ref([
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: true,
    width: "20%",
  },
  {
    title: "Photo",
    dataIndex: "",
    key: "photo",
    sorter: true,
    width: "20%",
  }
]);

const activeFilter = ref("");
const fetchUrl = ref("category");
const expandedRows = ref([]);

const toggleExpand = (row) => {
  const index = expandedRows.value.indexOf(row.id);
  if (index === -1) {
    expandedRows.value.push(row.id);
  } else {
    expandedRows.value.splice(index, 1);
  }
};


const selectAction = (action, productId) => {
  router.push({ name: action, params: { orderId: productId } });
};

watch(
  activeFilter,
  (newFilter) => {
    fetchUrl.value = `category${newFilter || ""}`;
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
