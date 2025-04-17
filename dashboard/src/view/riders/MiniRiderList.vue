<script setup>

import BaseTable from "@/components/BaseTable.vue";
import {ref} from "vue";
import {formatDate} from "@/utility/functions"
import {ArrowRight, DeleteFilled} from "@element-plus/icons-vue";
import router from "@/routes";
import TrueOrFalse from "@/components/TrueOrFalse.vue";
import {useRoute} from "vue-router";

/**
 * Variables
*/
const columns = ref([
  {
    title: "Name",
    dataIndex: "user_name",
    key: "user_name",
  },
  {
    title: "Email",
    dataIndex: "user_email",
    key: "user_email",
  },
  {
    title: "Is Verified",
    dataIndex: "approval_status",
    key: "approval_status",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

const route = useRoute()

/**
 * Functions
 */
const selectAction = (action, productId) => {
  console.log(route?.name, productId)
  if (route.name !== 'riders') {
    if (route?.params?.vendorId) {
      router.push({ name: action, params: { vendorId: route.params.vendorId, id: productId?.id } });
    } else {
      console.error('Vendor ID is missing');
    }
  } else {
    /**
     * This should edit user
     */
    router.push({ name: 'edit-user', params: { userId: productId.user} });
  }
};


const fetchUrl = () => {
  let url = 'rider';
  if (route.name === 'mini-list-rider' && route?.params?.vendorId) {
    url = `rider?vendorId=${route?.params?.vendorId}`;
  }
  return url;
};


</script>

<template>
  <router-view/>
  <BaseTable
      :columns="columns"
      :fetchUrl="fetchUrl()"
      :create-route-name="route?.name === 'mini-list-rider' ? 'mini-register-rider' : 'register-rider'"
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
      <template v-if="slotProps.column.key === 'approval_status'">
        <TrueOrFalse :is-true-or-false="(slotProps.text!=='PENDING')"/>
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
            class="rounded-none bg-transparent text-blue-500 "
            type="primary"
            size="large"
            @click="selectAction('mini-register-rider', slotProps.text)"
        >
          <el-icon>
            <arrow-right/>
          </el-icon>
        </el-button>

        <el-button
            class="rounded-none bg-transparent text-red-500 border-red-400 border focus:border-none hover:bg-red-500 focus:bg-red-500 "
            type="primary"
            size="large"
            @click="selectAction('mini-register-rider', slotProps.text?.id)"
        >
          <el-icon>
            <delete-filled/>
          </el-icon>
        </el-button>

      </template>


    </template>
  </BaseTable>
</template>

<style scoped>

</style>