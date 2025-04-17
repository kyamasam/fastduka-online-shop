<template>
  <div class="tp-shop-widget-content">
    <div class="tp-shop-widget-checkbox">
      <ul class="filter-items filter-checkbox">
        <li
          v-for="(item, index) in status"
          :key="index"
          class="filter-item checkbox"
        >
          <input
            v-model="status_values[index]"
            :id="`on-sale${index}`"
            type="checkbox"
            :name="`on-sale${index}`"
          />
          <label :for="`on-sale${index}`">
            {{ item?.label }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductFilterStore } from "@/pinia/useProductFilterStore";
import { ref } from "vue";
const status = ref<object[]>([
  { label: "On sale", value: "on_sale" },
  { value: "in_stock", label: "In Stock" },
]);

const status_values = ref<string[]>([]);
const store = useProductFilterStore();

watch(status_values.value, () => {
  console.log("change", status_values.value);

  let vals = {};
  status_values.value.map((item, index) => {
    console.log("vals", status.value[index]?.value);
    if (item) {
      vals[status.value[index]?.value] = item;
    } else {
      vals[status.value[index]?.value] = undefined;
    }
  });
  store.handleSetFilterValue("status", vals);
});
</script>
