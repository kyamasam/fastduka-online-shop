import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useProductFilterStore = defineStore("product_filter", () => {
  const route = useRoute();
  const router = useRouter();

  const maxProductPrice = 10000000;

  // Define initial state
  const getInitialState = () => ({
    selectVal: "",
    priceValues: [100, maxProductPrice],
    filterObj: {
      priceValue: [1, maxProductPrice],
    },
  });

  // Create refs with initial state
  const initialState = getInitialState();
  let selectVal = ref<string>(initialState.selectVal);
  let priceValues = ref([...initialState.priceValues]);
  let filterObj = ref<any>({ ...initialState.filterObj });

  const handleSelectFilter = (e: { value: string; text: string }) => {
    console.log("handle selec", e);
    selectVal.value = e.value;
  };

  const handlePriceChange = (value: number[]) => {
    console.log("cjage", value);
    filterObj.value["priceValue"] = value;
  };

  const handleResetFilter = () => {
    filterObj.value["priceValue"] = [0, maxProductPrice];
  };

  const handleSetFilterValue = (key: any, value: any) => {
    filterObj.value[key] = value;
  };

  // Custom $reset implementation
  function $reset() {
    const initial = getInitialState();
    selectVal.value = initial.selectVal;
    priceValues.value = [...initial.priceValues];
    filterObj.value = { ...initial.filterObj };
  }

  watch(
    () => route.query || route.path,
    () => {}
  );

  return {
    maxProductPrice,
    filterObj,
    handleSetFilterValue,
    handleSelectFilter,
    handlePriceChange,
    handleResetFilter,
    selectVal,
    priceValues,
    $reset, // Export the custom reset method
  };
});
