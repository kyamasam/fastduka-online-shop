import { type IProduct } from "@/types/product-type";
import { nuxtStorage } from "nuxt-storage";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

export const useWishlistStore = defineStore("wishlist_product", () => {
  let wishlists = ref<IProduct[]>([]);

  // add_wishlist_product
  const add_wishlist_product = (payload: IProduct) => {
    const isAdded = wishlists.value.findIndex((p) => p.id === payload.id);
    if (isAdded !== -1) {
      wishlists.value = wishlists.value.filter((p) => p.id !== payload.id);
      toast.error(`${payload.title} remove to wishlist`);
    } else {
      wishlists.value.push(payload);
      toast.success(`${payload.title} added to wishlist`);
    }
    const wishlist_products_cookie: any = useCookie("wishlist_products");
    wishlist_products_cookie.value = wishlists.value;
  };
  // removeWishlist
  const removeWishlist = (payload: IProduct) => {
    wishlists.value = wishlists.value.filter((p) => p.id !== payload.id);
    toast.error(`${payload.title} remove to wishlist`);
    const wishlist_products_cookie = useCookie("wishlist_products");

    const compareData: any = wishlist_products_cookie.value;
  };

  // cart product initialize
  // In useWishlistStore.ts
  const initializeWishlistProducts = () => {
    if (import.meta.client) {
      const storedWishlists = localStorage.getItem("wishlists");

      if (storedWishlists) {
        try {
          const parsed = JSON.parse(storedWishlists);

          // Make sure it's an array
          if (Array.isArray(parsed)) {
            wishlists.value = parsed;
          } else {
            console.warn("Stored wishlists is not an array, resetting");
            wishlists.value = [];
            localStorage.setItem("wishlists", JSON.stringify([]));
          }
        } catch (error) {
          console.error("Failed to parse wishlists from localStorage:", error);
          wishlists.value = [];
          localStorage.removeItem("wishlists"); // Clear corrupted data
        }
      }
    }
  };

  // mounted to update cart products
  onMounted(() => {
    initializeWishlistProducts();
  });
  return {
    add_wishlist_product,
    removeWishlist,
    wishlists,
  };
});
