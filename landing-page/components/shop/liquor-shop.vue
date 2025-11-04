<template>
  <section
    :class="`tp-shop-area pb-120 ${
      full_width ? 'tp-shop-full-width-padding' : ''
    }`"
  >
    <div
      :class="`${
        full_width
          ? 'container-fluid'
          : shop_1600
          ? 'container-shop'
          : 'container'
      }`"
    >
      <div class="row">
        <div v-if="!shop_right_side && !shop_no_side" class="col-xl-3 col-lg-4">
          <!-- shop sidebar start -->
          <shop-sidebar :shop_full="full_width" :shop_1600="shop_1600" />
          <!-- shop sidebar end -->
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
                        {{ data?.count }} results
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-xl-6">
                  <shop-sidebar-filter-select
                    @handle-select-filter="store.handleSelectFilter"
                  />
                </div>
              </div>
            </div>
            <div class="tp-shop-items-wrapper tp-shop-item-primary">
              <div>
                <div class="grid grid-cols-4 gap-4">
                  <p v-if="pending">loading...</p>
                  <template v-else>
                    <product-item
                      v-for="item in filteredProducts"
                      :key="item.id"
                      :item="item"
                    />

                    <div
                      v-if="filteredProducts?.length === 0"
                      class="w-full flex items-center pl-6"
                    >
                      No Products Found
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="tp-shop-pagination mt-20">
              <div class="tp-pagination">
                <ui-pagination
                  :items-per-page="9"
                  :data="filteredProducts || []"
                  @handle-paginate="handlePagination"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="shop_right_side && !shop_no_side" class="col-xl-3 col-lg-4">
          <!-- shop sidebar start -->
          <shop-sidebar :shop_right="shop_right_side" />
          <!-- shop sidebar end -->
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
const store = useProductFilterStore();

const filterString = ref("");
const generateFilterString = () => {
  console.log("filter obj", store.filterObj);
  let tempFilterString = "";
  let isFirstParam = true;

  Object.keys(store.filterObj).map((key, index) => {
    const filter_prefix = isFirstParam ? "?" : "&";
    if (key === "category") {
      store.filterObj.category.map((i: any) => {
        tempFilterString += `${filter_prefix}category_id=${i}`;
        isFirstParam = false;
      });
    }
    if (key === "priceValue") {
      tempFilterString += `${filter_prefix}selling_price__gte=${store.filterObj.priceValue[0]}`;
      tempFilterString += `&selling_price__lte=${store.filterObj.priceValue[1]}`;
      isFirstParam = false;
    }
    if (key === "status") {
      Object.keys(store.filterObj.status).map((key: any) => {
        if (store.filterObj.status[key]) {
          tempFilterString += `${isFirstParam ? "?" : "&"}${key}=` + true;
          isFirstParam = false;
        }
      });
    }
  });
  filterString.value = tempFilterString;
  console.log("not undefined", filterString.value);

  return tempFilterString;
};
watch(store.filterObj, () => {
  console.log("watch", store.filterObj);
  generateFilterString();
  fetchProducts();
});
const data = ref<object>({});
const error = ref<any>({});
const pending = ref<any>(false);
let refreshProducts;

const fetchProducts = async () => {
  console.log("fetchProducts");
  pending.value = true;

  try {
    const response = await getDataUnauthed(`/product/${filterString.value}`);
    console.log("response", response);
    data.value = response.data.value; // Directly set new data
    error.value = response.error.value;
    filteredProducts.value = response?.data?.value?.results;

    refreshProducts = response.refresh; // Update the refresh reference
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// // Watch for changes in filterString and fetch new products
// watch(filterString, async () => {
//   await fetchProducts();
// });
await fetchProducts();

function handleActiveTab(tab: string) {
  active_tab.value = tab;
}
watch(
  () => route.query || route.params,
  (newStatus) => {
    startIndex.value = 0;
    endIndex.value =
      store.filteredProducts && store.filteredProducts.length > 9
        ? 9
        : store.filteredProducts?.length!;
  }
);
</script>
