<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-checkbox">
      <ul class="filter-items filter-checkbox">
        <!-- <li>
          <input
            v-model="all_selected"
            :id="`All`"
            :name="`All`"
            type="checkbox"
          />
          <label :for="`All`"> All </label>
        </li> -->

        <li
          v-for="(category, index) in categories"
          :key="index"
          class="filter-item checkbox"
        >
          <input
            v-model="selected_category_check_boxes[index]"
            :id="`id${index}`"
            :value="category?.id"
            :name="`id${index}`"
            type="checkbox"
          />
          <label :for="`id${index}`">
            {{ category?.name }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import { onMounted, ref, watch } from "vue";

const router = useRouter();
const route = useRoute();
const activeQuery = ref("");
const props = defineProps({});

const store = useProductFilterStore();

const all_selected = ref(false);
const selected_category_check_boxes = ref([]);

const selected_category_values = ref([]);

const setCheckBox = (value, index) => {
  if (selected_category_check_boxes.value[index] === undefined) {
    selected_category_check_boxes.value[index] = value;
  } else {
    selected_category_check_boxes.value[index] = undefined;
  }
};
// handle category route
// Fetch categories

const categories = ref([{ name: "All", id: undefined }]);
let category_type = route.name === "shop" ? "MEAT" : "LIQUOR";
const { data: filtersData, error: filtersError } = await getDataUnauthed(
  "/category?category_type=" + category_type
);
console.log("Fetch categories", filtersData?.value?.results);
if (filtersError.value) {
  console.error("Error fetching categories:");
}
categories.value = [...filtersData?.value?.results];
selected_category_check_boxes.value.length = categories?.value?.length;
selected_category_check_boxes.value.fill(false);

watch(
  () => route.query,
  (newStatus) => {
    activeQuery.value = newStatus.category;
  }
);
// watch(all_selected, (old_val, new_val) => {
//   if (old_val !== new_val) {
//     if (all_selected.value) {
//       selected_category_check_boxes.value.fill(true);
//     } else {
//       selected_category_check_boxes.value.fill(false);
//     }
//   }
// });
watch(selected_category_check_boxes.value, () => {
  if (selected_category_check_boxes.value.indexOf(false) === -1) {
    all_selected.value = true;
  } else {
    all_selected.value = false;
  }
  selected_category_values.value = [];
  selected_category_check_boxes?.value?.map((val, index) => {
    if (val) {
      selected_category_values?.value?.push(categories?.value[index]?.id);
    }
  });
  console.log("setiing", selected_category_values.value);
  store.handleSetFilterValue("category", selected_category_values.value);
});
onMounted(() => {
  activeQuery.value = route.query.category;
});
</script>
