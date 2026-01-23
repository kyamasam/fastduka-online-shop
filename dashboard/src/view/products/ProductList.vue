<script setup>
import BaseTable from "@/components/BaseTable.vue";
import router from "@/routes";
import store from "@/vuex/store";
import { Delete, Edit, Picture, Plus, Star } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const vuexStore = useStore();
const baseTableRef = ref(null);

// Filter states
const searchQuery = ref("");
const selectedCategories = ref([]);
const selectedProductType = ref(null);
const featuredOnly = ref(false);
const inStockOnly = ref(false);
const onSaleOnly = ref(false);
const minPrice = ref(null);
const maxPrice = ref(null);
const fetchUrl = ref("product");

// Get data from store
const categories = computed(() => vuexStore.getters["vendors/categories"]);
const categoryTypes = computed(() => vuexStore.getters["vendors/categoryTypes"]);

const buildFilterUrl = () => {
  const params = new URLSearchParams();

  if (searchQuery.value) {
    params.append("search", searchQuery.value);
  }

  if (selectedCategories.value.length > 0) {
    params.append("category_id", selectedCategories.value.join(","));
  }

  if (selectedProductType.value) {
    params.append("product_type", selectedProductType.value);
  }

  if (featuredOnly.value) {
    params.append("featured", "true");
  }

  if (inStockOnly.value) {
    params.append("in_stock", "true");
  }

  if (onSaleOnly.value) {
    params.append("on_sale", "true");
  }

  if (minPrice.value !== null && minPrice.value !== "") {
    params.append("selling_price__gte", minPrice.value);
  }

  if (maxPrice.value !== null && maxPrice.value !== "") {
    params.append("selling_price__lte", maxPrice.value);
  }

  const queryString = params.toString();
  fetchUrl.value = queryString ? `product?${queryString}` : "product";
};

const handleFilterChange = () => {
  buildFilterUrl();
};

const loadFilterData = async () => {
  try {
    await Promise.all([
      vuexStore.dispatch("vendors/fetchCategories"),
      vuexStore.dispatch("vendors/fetchCategoryTypes"),
    ]);
  } catch (error) {
    console.error("Error loading filter data:", error);
  }
};

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
    title: "SKU",
    dataIndex: "sku",
    key: "sku",
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

onMounted(() => {
  loadFilterData();
});
</script>

<template>
  <router-view />
  <BaseTable ref="baseTableRef"
             :columns="columns"
             create-route-name="create-product"
             :fetchUrl="fetchUrl"
             title="Products">
    <template #filters>
      <div class="flex gap-4 items-center flex-wrap mb-4">
        <el-input v-model="searchQuery"
                  placeholder="Search by name, SKU..."
                  clearable
                  size="large"
                  class="w-64"
                  @input="handleFilterChange">
          <template #prefix>
            <el-icon>
              <svg xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke-width="1.5"
                   stroke="currentColor"
                   class="size-4">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </el-icon>
          </template>
        </el-input>

        <el-select v-model="selectedCategories"
                   placeholder="Filter by Categories"
                   clearable
                   multiple
                   size="large"
                   class="w-64"
                   @change="handleFilterChange">
          <el-option v-for="category in categories"
                     :key="category.id"
                     :label="category.name"
                     :value="category.id" />
        </el-select>

        <el-select v-model="selectedProductType"
                   placeholder="Filter by Product Type"
                   clearable
                   size="large"
                   class="w-64"
                   @change="handleFilterChange">
          <el-option v-for="type in categoryTypes"
                     :key="type.id"
                     :label="type.name"
                     :value="type.id" />
        </el-select>

        <el-input v-model.number="minPrice"
                  placeholder="Min Price"
                  type="number"
                  clearable
                  size="large"
                  class="w-40"
                  @input="handleFilterChange">
          <template #prefix>$</template>
        </el-input>

        <el-input v-model.number="maxPrice"
                  placeholder="Max Price"
                  type="number"
                  clearable
                  size="large"
                  class="w-40"
                  @input="handleFilterChange">
          <template #prefix>$</template>
        </el-input>

        <el-checkbox v-model="featuredOnly"
                     size="large"
                     @change="handleFilterChange">
          Featured Only
        </el-checkbox>

        <el-checkbox v-model="inStockOnly"
                     size="large"
                     @change="handleFilterChange">
          In Stock Only
        </el-checkbox>

        <el-checkbox v-model="onSaleOnly"
                     size="large"
                     @change="handleFilterChange">
          On Sale Only
        </el-checkbox>
      </div>
    </template>
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
      <template v-if="slotProps.column.key === 'sku'">
        <span v-if="slotProps.text" class="font-mono text-sm text-gray-600">
          {{ slotProps.text }}
        </span>
        <span v-else class="text-gray-400 text-sm">-</span>
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
          <el-tooltip content="Edit Product"
                      placement="top">
            <el-button class="bg-blue-500 border-none hover:bg-blue-600 focus:bg-blue-600 rounded-none"
                       type="primary"
                       size="small"
                       @click="selectAction('edit-product', slotProps.text?.id)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip content="Manage Images"
                      placement="top">
            <el-button class="bg-green-500 border-none hover:bg-green-600 focus:bg-green-600 rounded-none"
                       type="primary"
                       size="small"
                       @click="manageProductImages(slotProps.text?.id)">
              <el-icon>
                <Picture />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="slotProps.text?.featured ? 'Unfeature Product' : 'Feature Product'"
                      placement="top">
            <el-button :class="slotProps.text?.featured
              ? 'bg-yellow-500 border-none hover:bg-yellow-600 focus:bg-yellow-600 rounded-none'
              : 'bg-gray-500 border-none hover:bg-yellow-500 focus:bg-yellow-500 rounded-none'"
                       type="primary"
                       size="small"
                       @click="toggleFeatured(slotProps.text?.id, slotProps.text?.name, slotProps.text?.featured)">
              <el-icon>
                <Star />
              </el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip content="Add Inventory"
                      placement="top">
            <el-button class="bg-primary-400 border-none hover:bg-primary-500 focus:bg-primary-500 rounded-none"
                       type="primary"
                       size="small"
                       @click="selectAction('add-inventory', slotProps.text?.id)">

              <el-icon>
                <Plus />
              </el-icon>

            </el-button>
          </el-tooltip>



          <el-tooltip content="Delete Product"
                      placement="top">
            <el-button class="bg-red-500 border-none hover:bg-red-600 focus:bg-red-600 rounded-none"
                       type="danger"
                       size="small"
                       @click="deleteProduct(slotProps.text?.id, slotProps.text?.name)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </template>
  </BaseTable>
</template>

<style scoped></style>
