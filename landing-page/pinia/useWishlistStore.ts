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
    const wishlist_products_cookie:any = useCookie('wishlist_products')
    wishlist_products_cookie.value = wishlists.value
    
   
  };
  // removeWishlist
  const removeWishlist = (payload: IProduct) => {
    wishlists.value = wishlists.value.filter((p) => p.id !== payload.id);
    toast.error(`${payload.title} remove to wishlist`);
    const wishlist_products_cookie = useCookie("wishlist_products");

    const compareData: any = wishlist_products_cookie.value;
    
  };

  // cart product initialize
  const initializeWishlistProducts = () => {
    const compare_products_cookie = useCookie("wishlist_products");

    const wishlistData = compare_products_cookie?.value;
    if (wishlistData) {
      wishlists.value = JSON.parse(wishlistData);
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
