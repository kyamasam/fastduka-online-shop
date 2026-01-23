<template>
    <PageHeaders class="ninjadash-page-header-main"
                 title="Inventory" />
    <router-view />

    <BaseTable :columns="columns"
               :fetchUrl="fetchUrl"
               title="Inventory">
        <template #filters>
            <div class="flex gap-4 items-center flex-wrap">
                <el-input v-model="searchQuery"
                          placeholder="Search by product name..."
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

                <el-select v-model="selectedVendor"
                           placeholder="Filter by Vendor"
                           clearable
                           size="large"
                           class="w-64"
                           @change="handleFilterChange">
                    <el-option v-for="vendor in vendors"
                               :key="vendor.id"
                               :label="vendor.name"
                               :value="vendor.id" />
                </el-select>

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
            <template v-if="slotProps.column.key === 'product'">
                <div class="flex items-center gap-3">
                    <img v-if="slotProps?.text?.primary_photo"
                         :src="slotProps?.text?.primary_photo"
                         :alt="slotProps?.text?.name"
                         class="w-12 h-12 object-cover rounded" />
                    <div class="flex flex-col">
                        <span class="font-medium">{{ slotProps?.text?.name || 'N/A' }}</span>
                        <span class="text-xs text-gray-500">SKU: {{ slotProps?.text?.id }}</span>
                    </div>
                </div>
            </template>

            <template v-if="slotProps.column.key === 'product_variant'">
                <div class="flex items-center gap-2">
                    <span v-if="slotProps?.text">{{ slotProps?.text?.value || slotProps?.text }}</span>
                    <el-tag v-else
                            type="info"
                            size="small">Default</el-tag>
                </div>
            </template>

            <template v-if="slotProps.column.key === 'quantity'">
                <el-tag :type="slotProps?.text <= 10 ? 'danger' : slotProps?.text <= 50 ? 'warning' : 'success'"
                        size="large">
                    {{ slotProps?.text }} units
                </el-tag>
            </template>

            <template v-if="slotProps.column.key === 'vendor'">
                <div class="flex flex-col gap-1">
                    <div class="font-medium">{{ slotProps?.text?.name }}</div>
                    <div class="text-xs text-gray-500">{{ slotProps?.text?.location }}</div>
                    <el-tag v-if="slotProps?.text?.is_default"
                            type="success"
                            size="small">Default Vendor</el-tag>
                </div>
            </template>

            <template v-if="slotProps.column.key === 'status'">
                <el-tag :type="slotProps?.text?.is_active ? 'success' : 'danger'"
                        size="large">
                    {{ slotProps?.text?.verification_status }}
                </el-tag>
            </template>

            <template v-if="slotProps.column.key === 'pricing'">
                <div class="flex flex-col gap-1">
                    <div class="text-sm">
                        <span class="text-gray-500">Buying:</span>
                        <span
                              class="font-medium ml-1">{{ formatCurrency(slotProps?.record?.product?.buying_price) }}</span>
                    </div>
                    <div class="text-sm">
                        <span class="text-gray-500">Selling:</span>
                        <span
                              class="font-medium ml-1">{{ formatCurrency(slotProps?.record?.product?.selling_price) }}</span>
                    </div>
                </div>
            </template>
        </template>
    </BaseTable>
</template>

<script setup>
import BaseTable from "@/components/BaseTable.vue";
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import { formatCurrency } from "@/utility/functions";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const columns = ref([
    {
        title: "Product",
        dataIndex: "product",
        key: "product",
        width: "30%",
    },
    {
        title: "Variant",
        dataIndex: "product_variant",
        key: "product_variant",
    },
    {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
    },
    {
        title: "Pricing",
        dataIndex: "",
        key: "pricing",
    },
    {
        title: "Vendor",
        dataIndex: "vendor",
        key: "vendor",
        width: "20%",
    },
    {
        title: "Status",
        dataIndex: "vendor",
        key: "status",
    },
]);

const searchQuery = ref("");
const selectedVendor = ref(null);
const featuredOnly = ref(false);
const inStockOnly = ref(false);
const onSaleOnly = ref(false);
const fetchUrl = ref("inventory");

// Get vendors from store
const vendors = computed(() => store.getters["vendors/vendors"]);

const buildFilterUrl = () => {
    const params = new URLSearchParams();

    if (searchQuery.value) {
        params.append("search", searchQuery.value);
    }

    if (selectedVendor.value) {
        params.append("vendor_id", selectedVendor.value);
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

    const queryString = params.toString();
    fetchUrl.value = queryString ? `inventory?${queryString}` : "inventory";
};

const handleFilterChange = () => {
    buildFilterUrl();
};

const loadVendors = async () => {
    try {
        // Dispatch action to fetch vendors (with caching)
        await store.dispatch("vendors/fetchVendors");
    } catch (error) {
        console.error("Error loading vendors:", error);
    }
};

onMounted(() => {
    loadVendors();
});
</script>

<style scoped>
.el-image {
    border-radius: 4px;
    overflow: hidden;
}
</style>
