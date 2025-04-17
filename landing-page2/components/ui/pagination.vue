<template>
  <nav>
    <ul>
      <li
        @click="setPage(currentPage - 1)"
        :class="currentPage === 1 ? 'disable' : ''"
      >
        <a
          class="tp-pagination-prev prev page-numbers cursor-pointer items-center flex flex-col justify-center"
        >
          <svg-paginate-prev />
        </a>
      </li>

      <li v-for="n in totalPages" :key="n" @click="setPage(n)">
        <a :class="`cursor-pointer ${currentPage === n ? 'current' : ''}`">{{
          n
        }}</a>
      </li>

      <li
        @click="setPage(currentPage + 1)"
        :class="currentPage === totalPages ? 'disable' : ''"
      >
        <a
          class="next page-numbers cursor-pointer items-center flex flex-col justify-center"
        >
          <svg-paginate-next />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import { type IBlogType } from "@/types/blog-type";
import { type IProduct } from "@/types/product-type";
import { computed, onMounted, ref, watch } from "vue";
const emit = defineEmits(["handlePaginate"]);
const route = useRoute();
const store = useProductFilterStore();

type ItemDataType<T> = {
  data: T[];
  itemsPerPage: number;
  totalItemsCount: number;
};
const props = defineProps<ItemDataType<IProduct | IBlogType>>();
const currentPage = ref<number>(1);

const totalPages = computed(() =>
  Math.ceil(props.totalItemsCount / props.itemsPerPage)
);
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);
const endIndex = computed(() => startIndex.value + props.itemsPerPage);

const setPage = (idx: number) => {
  if (idx <= 0 || idx > totalPages.value) {
    return;
  }
  window.scrollTo(0, 0);
  currentPage.value = idx;
  store.handleSetFilterValue("page", currentPage.value);

  emit("handlePaginate", currentPage.value);
};

onMounted(() => {
  emit("handlePaginate", currentPage.value);
});
watch(
  () => route.query || route.params,
  (newStatus) => {
    currentPage.value = 1;
  }
);
</script>
