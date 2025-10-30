// pinia/useProductStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { IProduct } from "@/types/product-type";

export const useProductStore = defineStore("product", () => {
  // Existing state
  let activeImg = ref<string>("");
  let openFilterDropdown = ref<boolean>(false);
  let openFilterOffcanvas = ref<boolean>(false);

  // New state for products
  const products = ref<IProduct[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref<any>(null);

  // Existing methods
  const handleImageActive = (img: string) => {
    activeImg.value = img;
  };

  const handleOpenFilterDropdown = () => {
    openFilterDropdown.value = !openFilterDropdown.value;
  };

  const handleOpenFilterOffcanvas = () => {
    openFilterOffcanvas.value = !openFilterOffcanvas.value;
  };

  // New method: Normalize product data to prevent hydration mismatch
  const normalizeProduct = (product: IProduct) => {
    if (product.description) {
      product.description = product.description
        .replace(/\r\n/g, " ")
        .replace(/\r/g, " ")
        .trim();
    }
    return product;
  };

  // New method: Fetch products
  const fetchProducts = async (
    productType: string,
    filterString: string = ""
  ) => {
    loading.value = true;
    error.value = null;

    try {
     
       const {
         data,
         error: fetchError,
         execute,
       } = getDataUnauthed(
         `/product?${filterString}`
        );
      await execute(); 
      
      


      if (fetchError.value) {
        throw fetchError.value;
      }

      // Normalize all products to prevent hydration mismatch
      const normalizedProducts = (data.value?.results || []).map(
        normalizeProduct
      );

      products.value = normalizedProducts;
      totalCount.value = data.value?.count || 0;

      console.log("Products fetched and normalized:", products.value.length);
    } catch (err) {
      console.error("Error fetching products:", err);
      error.value = err;
      products.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    // Existing
    activeImg,
    handleImageActive,
    handleOpenFilterDropdown,
    openFilterDropdown,
    openFilterOffcanvas,
    handleOpenFilterOffcanvas,

    // New
    products,
    totalCount,
    loading,
    error,
    fetchProducts,
  };
});
