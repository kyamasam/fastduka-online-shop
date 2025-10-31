// pinia/useCartStore.ts
import { defineStore } from "pinia";
import type { IProduct } from "@/types/product-type";
import { onMounted, ref, computed, watch } from "vue";
import { toast } from "vue3-toastify";

export const useCartStore = defineStore("cart_product", () => {
  const route = useRoute();
  const cart_products = ref<IProduct[]>([]);
  const orderQuantity = ref<number>(1);
  const cartOffcanvas = ref<boolean>(false);
  const activeOrder = ref({});

  const setActiveOrder = (order: any, isClear = false) => {
    if (isClear) {
      console.log("clearing");
      Object.assign(activeOrder.value, {});
    } else {
      console.log("setting", order);
      Object.assign(activeOrder.value, order);
    }
    return;
  };

  function clearActiveOrder() {
    console.log("calling");
    activeOrder.value = {};
  }

  // add_cart_product
  const addCartProduct = (payload: IProduct) => {
    const isExist = cart_products.value.some((i) => i.id === payload.id);
    if (!payload.in_stock) {
      toast.error(`Out of stock ${payload.name}`);
    } else if (!isExist) {
      //product is not in cart
      const newItem = {
        ...payload,
        orderQuantity: orderQuantity.value || 1,
      };
      cart_products.value.push(newItem);
      toast.success(`${payload?.name} added to cart`);
    } else {
      // product is in cart - increment the quantity by 1
      cart_products.value = cart_products.value.map((item) => {
        if (item.id === payload.id) {
          if (typeof item.orderQuantity !== "undefined") {
            if (item.inventory > item.orderQuantity) {
              item.orderQuantity = item.orderQuantity + 1;
              toast.success(`Added another ${item?.name} to cart`);
            } else {
              toast.error(`No more quantity available for this product!`);
            }
          }
        }
        return item;
      });
    }
    const cart_products_cookie = useCookie("cart_products");
    cart_products_cookie.value = cart_products.value;
  };

  const getNetPriceOfProductInCart = (id: number) => {
    let item: IProduct | undefined = undefined;
    let totalCost: number = 0;
    item = cart_products?.value.find((i: IProduct) => i?.id === id);
    if (item?.on_sale) {
      totalCost = item?.sale_price;
    } else if (item) {
      totalCost = item?.selling_price;
    }
    return totalCost;
  };

  const getTotalPriceOfProductInCart = (id: number) => {
    let item: IProduct | undefined = undefined;
    let totalCost: number = 0;
    item = cart_products?.value.find((i: IProduct) => i?.id === id);
    console.log("qty", orderQuantity, item);
    if (item?.on_sale) {
      totalCost = item?.sale_price * (item?.orderQuantity || 1);
    } else if (item) {
      totalCost = item?.selling_price * (item?.orderQuantity || 1);
    }
    return totalCost;
  };

  // quantity increment
  const increment = () => {
    orderQuantity.value = orderQuantity.value + 1;
    return orderQuantity.value;
  };

  // quantity decrement
  const decrement = () => {
    orderQuantity.value = orderQuantity.value > 1 ? orderQuantity.value - 1 : 1;
    return orderQuantity.value;
  };

  // quantityDecrement
  const quantityDecrement = (payload: IProduct) => {
    cart_products.value = cart_products.value.map((item) => {
      if (item.id === payload.id) {
        if (typeof item.orderQuantity !== "undefined") {
          if (item.orderQuantity > 1) {
            item.orderQuantity = item.orderQuantity - 1;
            toast.info(`Decrement Quantity For ${item?.name}`);
          }
        }
      }
      return { ...item };
    });
    const cart_products_cookie = useCookie("cart_products");
    cart_products_cookie.value = cart_products.value;
  };

  // remover_cart_products
  const removeCartProduct = (payload: IProduct) => {
    cart_products.value = cart_products.value.filter(
      (p) => p.id !== payload.id
    );
    toast.error(`${payload.name} removed from cart`);
    const cart_products_cookie = useCookie("cart_products");
    cart_products_cookie.value = cart_products.value;
  };

  // cart product initialize
  const initializeCartProducts = () => {
    const cart_products_cookie = useCookie("cart_products");
    const cartData = cart_products_cookie?.value;
    if (cartData) {
      cart_products.value = cartData as IProduct[];
    }
  };

  // clear cart
  const clear_cart = (show_confirm = true) => {
    if (show_confirm) {
      const confirmMsg = window.confirm(
        "Are you sure delete your all cart items ?"
      );
      if (confirmMsg) {
        cart_products.value = [];
      }
    } else {
      cart_products.value = [];
    }
    const cart_products_cookie = useCookie("cart_products");
    cart_products_cookie.value = cart_products.value;
  };

  // initialOrderQuantity
  const initialOrderQuantity = () => {
    orderQuantity.value = 1;
    return orderQuantity.value;
  };

  // totalPriceQuantity
  const totalPriceQuantity = computed(() => {
    let totalCost = 0;
    let totalQuantity = 0;

    cart_products.value.forEach((item: IProduct) => {
      totalQuantity += item?.orderQuantity || 0;
      if (item?.sale_price !== null && item.sale_price > 0) {
        totalCost += item.sale_price * (item?.orderQuantity || 1);
      } else {
        totalCost += item.selling_price * (item?.orderQuantity || 1);
      }
    });

    return {
      total: totalCost,
      quantity: totalQuantity,
    };
  });

  //handle cartOffcanvas
  const handleCartOffcanvas = () => {
    cartOffcanvas.value = !cartOffcanvas.value;
  };

  // set local storage product when project are mounted
  onMounted(() => {
    initializeCartProducts();
  });

  // when router change than order quantity will be 1
  watch(
    () => route.path,
    () => {
      orderQuantity.value = 1;
    }
  );

  return {
    addCartProduct,
    cart_products,
    quantityDecrement,
    removeCartProduct,
    clear_cart,
    initialOrderQuantity,
    totalPriceQuantity,
    handleCartOffcanvas,
    cartOffcanvas,
    orderQuantity,
    increment,
    decrement,
    getTotalPriceOfProductInCart,
    getNetPriceOfProductInCart,
    activeOrder,
    setActiveOrder,
    clearActiveOrder,
  };
});
