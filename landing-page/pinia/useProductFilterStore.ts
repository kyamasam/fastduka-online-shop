import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useProductFilterStore = defineStore("product_filter", () => {
  const route = useRoute();
  const router = useRouter();
  let selectVal = ref<string>("");

  const handleSelectFilter = (e: { value: string; text: string }) => {
    console.log("handle selec", e);
    selectVal.value = e.value;
  };

  const maxProductPrice = 10000000;
  let priceValues = [100, maxProductPrice];
  const handlePriceChange = (value: number[]) => {
    console.log("cjage", value);
    filterObj.value["priceValue"] = value;
  };

  const handleResetFilter = () => {
    filterObj.value["priceValue"] = [0, maxProductPrice];
  };

  let filterObj = ref<any>({
    priceValue: [1, maxProductPrice],
  });
  const handleSetFilterValue = (key: any, value: any) => {
    filterObj.value[key] = value;
  };

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
  };
});
