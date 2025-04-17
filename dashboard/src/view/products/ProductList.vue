<script setup>

import BaseTable from "@/components/BaseTable.vue";
import {ref} from "vue";
import {ArrowRight} from "@element-plus/icons-vue";
import router from "@/routes";
import BaseDrawer from "@/BaseDrawer.vue";

const selectAction = (action , productId) => {
  router.push({name: action, params: {productId: productId}});
};

const columns = ref([
  {
    title: "Name",
    dataIndex: "",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Price",
    dataIndex: "",
    key: "price",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);

</script>

<template>
  <router-view/>
  <BaseTable
      :columns="columns"
      create-route-name="create-product"
      fetchUrl="product"
      title="Products">
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'name'">
        <div class="flex items-center gap-2">
          <img :alt="slotProps.text?.name" :src="slotProps.text?.primary_photo" class="h-10 w-auto"/>
          {{ slotProps.text?.name }}
          <el-tag v-if="!slotProps.text?.in_stock" type="danger">Out Of Stock</el-tag>
          <el-tag v-if="slotProps.text?.in_stock" type="success">
            <span class="font-bold">{{ slotProps.text?.inventory }}</span>
            In Stock
          </el-tag>

        </div>
      </template>
      <template v-if="slotProps.column.key === 'category'">
        <div class="flex items-center gap-2">
          {{ slotProps.text['name'] }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'price'">
        <div v-if="slotProps.text?.on_sale && slotProps.text?.sale_price > 0" class="flex items-center gap-2">
          <div class="font-semibold">{{ slotProps.text?.sale_price }}</div>
          <div class="line-through text-red-400">
            {{ slotProps.text?.selling_price }}
          </div>
        </div>
        <div v-else>
          {{ slotProps.text?.selling_price }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <el-button
            class="bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none"
            type="primary"
            size="large"
            @click="selectAction('add-inventory', slotProps.text?.id)"
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