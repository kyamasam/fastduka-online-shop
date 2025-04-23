import { defineStore } from "pinia";
import type { IProduct } from "@/types/product-type";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

export const useCartStore = defineStore("cart_product", () => {
  const route = useRoute();
  let cart_products = ref<IProduct[]>([]);
  let orderQuantity = ref<number>(1);
  let cartOffcanvas = ref<boolean>(false);

  let activeOrder = ref({});

  const setActiveOrder = (order, isClear = false) => {
    if (isClear) {
      console.log("clearning");
      Object.assign(activeOrder.value, {});
    } else {
      console.log("setting", order);
      Object.assign(activeOrder.value, order);
    }
    return;
  };
  function clearActiveOrder() {
    console.log("calling");
    activeOrder = ref({});
  }
  // add_cart_product
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
              // Increment by 1 instead of setting to orderQuantity.value
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
    // No need to reset product count for the "+" button in cart
    // orderQuantity.value = 1;
  };
  const getNetPriceOfProductInCart = (id: number) => {
    let item: IProduct = null;
    let totalCost: number = 0;
    item = cart_products?.value.find((i: IProduct) => i?.id === id);
    if (item?.on_sale) {
      // is on sale
      totalCost = item?.sale_price;
    } else {
      totalCost = item?.selling_price;
    }

    return totalCost;
  };

  const getTotalPriceOfProductInCart = (id: number) => {
    let item: IProduct = null;
    let totalCost: number = 0;
    item = cart_products?.value.find((i: IProduct) => i?.id === id);
    console.log("qty", orderQuantity, item);
    if (item?.on_sale) {
      // is on sale
      totalCost = item?.sale_price * item?.orderQuantity;
    } else {
      totalCost = item?.selling_price * item?.orderQuantity;
    }

    return totalCost;
  };

  // quantity increment
  const increment = () => {
    return (orderQuantity.value = orderQuantity.value + 1);
  };

  // quantity decrement
  const decrement = () => {
    return (orderQuantity.value =
      orderQuantity.value > 1
        ? orderQuantity.value - 1
        : (orderQuantity.value = 1));
  };

  // quantityDecrement
  const quantityDecrement = (payload: IProduct) => {
    cart_products.value.map((item) => {
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
      cart_products.value = cartData;
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
    return (orderQuantity.value = 1);
  };

  // totalPriceQuantity
  const totalPriceQuantity = computed(() => {
    let totalCost = 0;
    let totalQuantity = 0;

    cart_products.value.map((item: IProduct) => {
      totalQuantity += item?.orderQuantity || 0;
      if (item?.sale_price !== null && item.sale_price > 0) {
        totalCost += item.sale_price * item?.orderQuantity || 1;
      } else {
        totalCost += item.selling_price * item?.orderQuantity || 1;
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
