<script setup>
import BaseTable from "@/components/BaseTable.vue";
import router from "@/routes";
import store from "@/vuex/store";
import { ArrowRight, Delete, Edit, Picture, Star } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";

const baseTableRef = ref(null);

const selectAction = (action, productId) => {
  router.push({ name: action, params: { productId: productId } });
};

const deleteProduct = async (productId, productName) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      'Delete Product',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    await store.dispatch('deleteData', {
      url: 'product',
      id: productId
    });

    ElMessage.success('Product deleted successfully');

    window.location.reload();

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete product');
      console.error('Delete error:', error);
    }
  }
};

const manageProductImages = (productId) => {
  router.push({
    name: 'product-images',
    params: { productId: productId },
    query: { manage: true }
  });
};

const toggleFeatured = async (productId, productName, currentFeaturedStatus) => {
  try {
    const newStatus = !currentFeaturedStatus;
    const action = newStatus ? 'feature' : 'unfeature';

    await ElMessageBox.confirm(
      `Are you sure you want to ${action} "${productName}"?`,
      `${newStatus ? 'Feature' : 'Unfeature'} Product`,
      {
        confirmButtonText: newStatus ? 'Feature' : 'Unfeature',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    );

    await store.dispatch('patchData', {
      url: 'product',
      id: productId,
      data: { featured: newStatus }
    });

    ElMessage.success(`Product ${newStatus ? 'featured' : 'unfeatured'} successfully`);

    baseTableRef.value?.refresh();

  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to update featured status');
      console.error('Toggle featured error:', error);
    }
  }
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
    title: "Featured",
    dataIndex: "featured",
    key: "featured",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);
</script>

<template>
  <router-view />
  <BaseTable ref="baseTableRef"
             :columns="columns"
             create-route-name="create-product"
             fetchUrl="product"
             title="Products">
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'name'">
        <div class="flex items-center gap-2">
          <img :alt="slotProps.text?.name"
               :src="slotProps.text?.primary_photo"
               class="h-10 w-auto" />
          {{ slotProps.text?.name }}
          <el-tag v-if="!slotProps.text?.in_stock"
                  type="danger">Out Of Stock</el-tag>
          <el-tag v-if="slotProps.text?.in_stock"
                  type="success">
            <span class="font-bold">{{ slotProps.text?.inventory }}</span>
            In Stock
          </el-tag>
        </div>
      </template>
      <template v-if="slotProps.column.key === 'category'">
        <div class="flex items-center gap-2">
          {{ slotProps.text["name"] }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'price'">
        <div v-if="slotProps.text?.on_sale && slotProps.text?.sale_price > 0"
             class="flex items-center gap-2">
          <div class="font-semibold">{{ slotProps.text?.sale_price }}</div>
          <div class="line-through text-primary-400">
            {{ slotProps.text?.selling_price }}
          </div>
        </div>
        <div v-else>
          {{ slotProps.text?.selling_price }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'featured'">
        <el-tag :type="slotProps.text?.featured ? 'success' : 'info'">
          {{ slotProps.text?.featured ? 'Featured' : 'Not Featured' }}
        </el-tag>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <div class="flex gap-2">
          <el-button class="bg-blue-500 border-none hover:bg-blue-600 focus:bg-blue-600 rounded-none"
                     type="primary"
                     size="default"
                     @click="selectAction('edit-product', slotProps.text?.id)"
                     title="Edit Product">
            <el-icon>
              <Edit />
            </el-icon>
          </el-button>

          <el-button class="bg-green-500 border-none hover:bg-green-600 focus:bg-green-600 rounded-none"
                     type="primary"
                     size="default"
                     @click="manageProductImages(slotProps.text?.id)"
                     title="Manage Images">
            <el-icon>
              <Picture />
            </el-icon>
          </el-button>

          <el-button class="bg-primary-400 border-none hover:bg-primary-500 focus:bg-primary-500 rounded-none"
                     type="primary"
                     size="default"
                     @click="selectAction('add-inventory', slotProps.text?.id)"
                     title="Add Inventory">
            <el-icon>
              <arrow-right />
            </el-icon>
          </el-button>

          <el-button :class="slotProps.text?.featured
            ? 'bg-yellow-500 border-none hover:bg-yellow-600 focus:bg-yellow-600 rounded-none'
            : 'bg-gray-500 border-none hover:bg-yellow-500 focus:bg-yellow-500 rounded-none'"
                     type="primary"
                     size="default"
                     @click="toggleFeatured(slotProps.text?.id, slotProps.text?.name, slotProps.text?.featured)"
                     :title="slotProps.text?.featured ? 'Unfeature Product' : 'Feature Product'">
            <el-icon>
              <Star />
            </el-icon>
          </el-button>

          <el-button class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600 rounded-none"
                     type="danger"
                     size="default"
                     @click="deleteProduct(slotProps.text?.id, slotProps.text?.name)"
                     title="Delete Product">
            <el-icon>
              <Delete />
            </el-icon>
          </el-button>
        </div>
      </template>
    </template>
  </BaseTable>
</template>

<style scoped></style>
