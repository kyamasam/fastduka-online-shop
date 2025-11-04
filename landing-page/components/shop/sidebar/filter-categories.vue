<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-checkbox">
      <ul class="filter-items filter-checkbox">
        <li v-for="(category, index) in categories"
            :key="index"
            class="filter-item checkbox">
          <input v-model="selected_category_check_boxes[index]"
                 :id="`id${index}`"
                 :value="category?.id"
                 :name="`id${index}`"
                 type="checkbox" />
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
const categories = ref([]);

const setCheckBox = (value, index) => {
  if (selected_category_check_boxes.value[index] === undefined) {
    selected_category_check_boxes.value[index] = value;
  } else {
    selected_category_check_boxes.value[index] = undefined;
  }
};

// Fetch categories
// let category_type = route.name === "shop" ? "MEAT" : "LIQUOR";

// Add null check and default values
const response = await getDataUnauthed("/category");

// Handle the case where response might be undefined or null
const filtersData = response?.data || ref(null);
const filtersError = response?.error || ref(null);

console.log("Fetch categories", filtersData?.value?.results);

if (filtersError.value) {
  console.error("Error fetching categories:", filtersError.value);
} else if (filtersData?.value?.results) {
  categories.value = [...filtersData.value.results];
  selected_category_check_boxes.value = new Array(categories.value.length).fill(false);
}

watch(
  () => route.query,
  (newStatus) => {
    activeQuery.value = newStatus.category;
  }
);

// Watch the ref itself with deep option
watch(
  selected_category_check_boxes,
  (newVal) => {
    if (newVal.indexOf(false) === -1 && newVal.length > 0) {
      all_selected.value = true;
    } else {
      all_selected.value = false;
    }

    selected_category_values.value = [];
    newVal.forEach((val, index) => {
      if (val && categories.value[index]) {
        selected_category_values.value.push(categories.value[index].id);
      }
    });

    console.log("setting", selected_category_values.value);
    store.handleSetFilterValue("category", selected_category_values.value);
  },
  { deep: true }
);

onMounted(() => {
  activeQuery.value = route.query.category;
});
</script>