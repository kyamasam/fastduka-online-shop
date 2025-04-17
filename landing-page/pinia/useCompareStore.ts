import { type IProduct } from "@/types/product-type";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

export const useCompareStore = defineStore("compare_product", () => {
  let compare_items = ref<IProduct[]>([]);

  // add_compare_product
  const add_compare_product = (payload: IProduct) => {
    const isAdded = compare_items.value.findIndex((p) => p.id === payload.id);
    if (isAdded !== -1) {
      compare_items.value = compare_items.value.filter(
        (p) => p.id !== payload.id
      );
      toast.error(`${payload.title} remove to compare`);
    } else {
      compare_items.value.push(payload);
      toast.success(`${payload.title} added to compare`);
    }
    const compare_products_cookie: any = useCookie("cart_products");
    compare_products_cookie.value = compare_items.value;
  };
  // removeCompare
  const removeCompare = (payload: IProduct) => {
    compare_items.value = compare_items.value.filter(
      (p) => p.id !== payload.id
    );
    toast.error(`${payload.title} remove to compare`);
    const compare_products_cookie: any = useCookie("compare_products");
    compare_products_cookie.value = compare_items.value;
  };

  // cart product initialize
  const initializeCompareProducts = () => {
    const compare_products_cookie = useCookie("compare_products");

    const compareData: any = compare_products_cookie.value;
    if (compareData) {
      compare_items.value = compareData;
    }
  };

  // mounted to update cart products
  onMounted(() => {
    initializeCompareProducts();
  });
  return {
    add_compare_product,
    removeCompare,
    compare_items,
  };
});
