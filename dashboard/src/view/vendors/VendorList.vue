<script setup>

import BaseTable from "@/components/BaseTable.vue";
import {ref} from "vue";
import {formatDate} from "@/utility/functions"
import {ArrowRight} from "@element-plus/icons-vue";
import router from "@/routes";
import TrueOrFalse from "@/components/TrueOrFalse.vue";

/**
 * Variables
 * @type {Ref<UnwrapRef<[{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, key: string},null,null]>>}
 */
const columns = ref([
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Is Verified",
    dataIndex: "verification_status",
    key: "verification_status",
  },
  {
    title: "Is Active",
    dataIndex: "is_active",
    key: "is_active",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

/**
 * Functions
 */
const selectAction = (action , productId) => {
  router.push({name: action, params: {vendorId: productId}});
};

</script>

<template>
  <router-view/>
  <BaseTable
      :columns="columns"
      fetchUrl="vendors"
      create-route-name="create-vendor"
      title="Vendors">

    <template #otherItems>
      <!--
         FILTERS
         1. Payment Status
         2. Order Date (From & To)
         3. Order Status
         4. Vendor
      -->
    </template>

    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'verification_status'">
        <div class="flex items-center gap-2">
          <TrueOrFalse v-if="slotProps.text !== 'PENDING'" :is-true-or-false="(slotProps.text !== 'REJECTED')"/>
          <span class="text-orange-500" v-else>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          </span>
        </div>
      </template>
      <template v-if="slotProps.column.key === 'is_active'">
        <TrueOrFalse :is-true-or-false="slotProps.text"/>
      </template>

      <template v-if="slotProps.column.key === 'created_at'">
        {{ formatDate(slotProps?.text) }}
      </template>

      <template v-if="slotProps.column.key === 'delivery_location'">
        <el-tag v-if="slotProps?.text === ''" type="danger">Null</el-tag>
        <div v-else>{{ slotProps?.text }}</div>
      </template>


      <template v-if="slotProps.column.key === 'order_items'">
        <div class="flex flex-col gap-2">
          <div v-for="item in slotProps?.text?.orderitem_set" class="flex gap-2 flex-wrap items-center capitalize">
            <img :alt="item?.product?.name" :src="item?.product?.primary_photo" height="40" width="40"/>
            {{ item?.product?.name }}
            {{ item?.quantity }}
          </div>
        </div>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <el-button
            class="bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none"
            type="primary"
            size="large"
            @click="selectAction('edit-vendor', slotProps.text?.id)"
        >
          <el-icon>
            <arrow-right/>
          </el-icon>
        </el-button>

      </template>


    </template>
  </BaseTable>
</template>

<style scoped>

</style>