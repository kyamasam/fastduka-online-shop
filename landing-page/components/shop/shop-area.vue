<template>
  <section :class="`tp-shop-area pb-120 ${full_width ? 'tp-shop-full-width-padding' : ''}`">
    <div :class="`${full_width ? 'container-fluid' : shop_1600 ? 'container-shop' : 'container'}`">
      <div class="row">
        <div v-if="!shop_right_side && !shop_no_side"
             class="col-xl-3 col-lg-4">
          <shop-sidebar :shop_full="full_width"
                        :shop_1600="shop_1600" />
        </div>

        <div :class="`${shop_no_side ? 'col-xl-12' : 'col-xl-9 col-lg-8'}`">
          <div class="tp-shop-main-wrapper">
            <div class="tp-shop-top mb-45">
              <div class="row">
                <div class="col-xl-6">
                  <div class="tp-shop-top-left d-flex align-items-center">
                    <div class="tp-shop-top-tab tp-tab"></div>
                    <div class="tp-shop-top-result">
                      <p>
                        Showing 1–{{ filteredProducts?.length }} of
                        {{ totalCount }} results
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-xl-6">
                  <shop-sidebar-filter-select @handle-select-filter="filterStore.handleSelectFilter" />
                </div>
              </div>
            </div>

            <div class="tp-shop-items-wrapper tp-shop-item-primary">
              <!-- Loading State -->
              <div v-if="pending"
                   class="flex items-center justify-center min-h-[400px]">
                <div class="flex flex-col items-center space-y-4">
                  <div class="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  <p class="text-gray-600">Loading products...</p>
                </div>
              </div>

              <!-- Products Grid -->
              <div v-else>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <product-item v-for="item in filteredProducts"
                                :key="item.id"
                                :item="item" />

                  <div v-if="filteredProducts?.length === 0"
                       class="w-full flex items-center pl-6">
                    No Products Found
                  </div>
                </div>
              </div>
            </div>

            <div class="tp-shop-pagination mt-20">
              <div class="tp-pagination">
                <ui-pagination :total-items-count="totalCount"
                               :totalPages="10"
                               :items-per-page="15"
                               :data="filteredProducts || []"
                               @handle-paginate="handlePagination" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="shop_right_side && !shop_no_side"
             class="col-xl-3 col-lg-4">
          <shop-sidebar :shop_right="shop_right_side" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import { type IProduct } from "@/types/product-type";
import { ref, watch } from "vue";

const route = useRoute();
const props = defineProps<{
  list_style?: boolean;
  full_width?: boolean;
  shop_1600?: boolean;
  shop_right_side?: boolean;
  shop_no_side?: boolean;
}>();

const active_tab = ref<string>(props.list_style ? "list" : "grid");
const filteredProducts = ref<IProduct[]>([]);
const totalCount = ref<number>(0);
const filterStore = useProductFilterStore();
const pending = ref<boolean>(false);
const error = ref<any>(null);

const filterString = ref("");

// Normalize product to prevent hydration mismatch
const normalizeProduct = (product: IProduct) => {
  if (product.description) {
    product.description = product.description
      .replace(/\r\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();
  }
  return product;
};

const generateFilterString = () => {
  let tempFilterString = "";
  let isFirstParam = true;

  Object.keys(filterStore.filterObj).forEach((key, index) => {
    const filter_prefix = isFirstParam ? "?" : "&";

    if (key === "category") {
      const categories_list = filterStore.filterObj.category.join(",");
      if (categories_list) {
        tempFilterString += `${filter_prefix}category_id__in=${categories_list}`;
        isFirstParam = false;
      }
    }

    if (key === "priceValue") {
      tempFilterString += `${filter_prefix}selling_price__gte=${filterStore.filterObj.priceValue[0]}`;
      tempFilterString += `&selling_price__lte=${filterStore.filterObj.priceValue[1]}`;
      isFirstParam = false;
    }

    if (key === "status") {
      Object.keys(filterStore.filterObj.status).forEach((statusKey: any) => {
        if (filterStore.filterObj.status[statusKey]) {
          tempFilterString += `${isFirstParam ? "?" : "&"}${statusKey}=true`;
          isFirstParam = false;
        }
      });
    }

    if (key === "page") {
      tempFilterString += `${filter_prefix}page=${filterStore.filterObj?.page}`;
      isFirstParam = false;
    }
  });

  filterString.value = tempFilterString;
  return tempFilterString;
};

const fetchProducts = async () => {
  console.log("fetchProducts");
  pending.value = true;
  error.value = null;

  const product_type = route?.name === "shop" ? "MEAT" : "LIQUOR";

  try {
    console.log("filterString", filterString.value);

    const {
      data: responseData,
      error: fetchError,
      execute,
    } = getDataUnauthed(
      `/product${filterString.value}`
    );

    await execute();

    if (fetchError.value) {
      throw fetchError.value;
    }

    console.log("response", responseData.value);

    const normalizedProducts = (responseData.value?.results || []).map(normalizeProduct);

    filteredProducts.value = normalizedProducts;
    totalCount.value = responseData.value?.count || 0;

  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
    filteredProducts.value = [];
    totalCount.value = 0;
  } finally {
    pending.value = false;
  }
};

const handlePagination = (value: number) => {
  console.log("page number", value);
  filterStore.filterObj.page = value;
};

// Watch for filter changes
watch(() => filterStore.filterObj, () => {
  console.log("watch", filterStore.filterObj);
  generateFilterString();
  fetchProducts();
}, { deep: true });

// Watch for route changes
watch(
  () => route.query || route.params,
  () => {
    generateFilterString();
    fetchProducts();
  }
);

// Initial fetch
onMounted(async () => {
  generateFilterString();
  await fetchProducts();
});

function handleActiveTab(tab: string) {
  active_tab.value = tab;
}
</script>