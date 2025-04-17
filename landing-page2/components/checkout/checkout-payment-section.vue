<template>
  <div class="tp-checkout-place white-bg">
    <h3 class="tp-checkout-place-title">Your Order</h3>
    <div class="tp-order-info-list">
      <ul>
        <!-- header -->
        <li class="tp-order-info-list-header">
          <h4>Product</h4>
          <h4>Total</h4>
        </li>
        <!-- item list -->
        <li
          v-for="item in cartStore.cart_products"
          :key="item.id"
          class="tp-order-info-list-desc"
        >
          <p>
            {{ item.title }} <span> x {{ item.orderQuantity }}</span>
          </p>
          <span>{{ formatCurrency(item.price) }}</span>
        </li>

        <!-- subtotal -->
        <li class="tp-order-info-list-subtotal">
          <span>Subtotal</span>
          <span>{{ formatCurrency(cartStore.totalPriceQuantity.total) }}</span>
        </li>

        <!--shipping -->
        <!-- <li class="tp-order-info-list-shipping">
          <span>Shipping</span>
          <div
            class="tp-order-info-list-shipping-item d-flex flex-column align-items-end"
          >
            <span>
              <input id="flat_rate" type="radio" name="shipping" />
              <label @click="handleShippingCost(20)" for="flat_rate"
                >Flat rate: <span>$20.00</span></label
              >
            </span>
            <span>
              <input id="local_pickup" type="radio" name="shipping" />
              <label @click="handleShippingCost(25)" for="local_pickup"
                >Local pickup: <span>$25.00</span></label
              >
            </span>
            <span>
              <input id="free_shipping" type="radio" name="shipping" />
              <label @click="handleShippingCost('free')" for="free_shipping"
                >Free shipping</label
              >
            </span>
          </div>
        </li> -->

        <!-- total -->
        <li class="tp-order-info-list-total">
          <span>Total</span>
          <span>{{ formatCurrency(cartStore.totalPriceQuantity.total) }}</span>
        </li>
      </ul>
    </div>

    <p @click="clear()">clear</p>

    <div
      v-if="
        cartStore?.activeOrder?.payment_transaction_obj?.transaction_status ===
        'processed'
      "
      class="flex flex-col"
    >
      <p class="font-semibold">Payment Processed Successfully</p>
      <p class="font-semibold text-green-500">
        Mpesa Code :
        {{ cartStore?.activeOrder?.payment_transaction_obj?.transaction_code }}
      </p>
      <p>Your Order Has Been Placed. Click Proceed to view more details</p>
    </div>

    <div
      v-if="
        cartStore?.activeOrder?.payment_transaction_obj?.transaction_status !==
        'processed'
      "
      class="tp-checkout-payment"
    >
      <div class="col-md-12">
        <div class="tp-checkout-input">
          <label>Mpesa Phone <span>*</span></label>
          <div class="flex">
            <select required v-model="phone_code" class="border" type="select">
              <option value="+254" label="+254" />
            </select>

            <input required v-model="phone_number" type="text" placeholder="" />
          </div>
        </div>
      </div>
      <div class="tp-checkout-payment-item">
        <input
          type="radio"
          v-model="payment_method_name"
          value="mpesa_payment_paybill"
          id="mpesa_payment_paybill"
          name="mpesa_payment"
        />
        <label
          @click="handlePayment('mpesa_payment_paybill')"
          for="mpesa_payment_paybill"
          >MPesa Paybill</label
        >
        <div
          v-if="payment_method_name === 'mpesa_payment_paybill'"
          class="cheque-payment w-full flex flex-col items-start bg-gray-50 p-4"
        >
          <p>Make Payment to</p>

          <p class="font-semibold">Paybill Number : 23778</p>
          <p class="font-semibold">Account Number: 4233</p>

          <p>Once Complete, Click Verify Payment</p>
          <button class="tp-btn w-40">Verify Payment</button>
        </div>
      </div>
      <div class="tp-checkout-payment-item">
        <input
          type="radio"
          v-model="payment_method_name"
          id="mpesa_payment_express"
          value="mpesa_payment_express"
        />
        <label
          @click="handlePayment('mpesa_payment_express')"
          for="mpesa_payment_express"
          >MPesa Express (Prompt)</label
        >
        <div
          v-if="payment_method_name === 'mpesa_payment_express'"
          class="cheque-payment w-full flex flex-col items-start bg-gray-50 p-4"
        >
          <!-- <p>Make Payment to</p>

          <p class="font-semibold">Paybill Number : 23778</p>
          <p class="font-semibold">Account Number: 4233</p> -->
          <p>Click on the button below</p>
          <p class="font-semibold">You will receive a prompt on your device</p>
          <p class="font-semibold">Enter your pin to complete payment</p>

          <div class="flex flex-row gap-2">
            <button @click.prevent="createOrder" class="tp-btn w-40">
              Send Prompt
              <span v-if="loadingCreateOrder || loadingSendPrompt"
                >loading...</span
              >
            </button>
            <button
              @click.prevent="verifyPayment"
              class="tp-btn-green rounded-sm py-2 text-xs w-40"
            >
              Verify Payment
              <span v-if="loadingConfirmPayment">loading...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ cartStore }} -->
    <!-- {{ cartStore.activeOrder }} -->
    <!-- <div class="tp-checkout-agree">
      <div class="tp-checkout-option">
        <input required id="read_all" type="checkbox" />
        <label for="read_all">Agree to the terms of service</label>
      </div>
    </div> -->
    <div class="tp-checkout-btn-wrapper">
      <button
        :disabled="currentUserData?.value !== undefined"
        @click="proceedToOrders()"
        class="tp-checkout-btn w-100 disabled:bg-red-300 disabled:cursor-not-allowed"
      >
        Proceed
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from "vue3-toastify";

import { useCartStore } from "@/pinia/useCartStore";
import { useUserStore } from "@/pinia/useUserDataStore";
import type { IProduct } from "@/types/product-type";
let shipCost = ref<number>(0);
let payment_method_name = ref<string>("mpesa_payment_express");
let userStore = useUserStore();
const cartStore = useCartStore();
const currentUserData = useCookie("userData");

const phone_code = ref(currentUserData?.value?.phone_code);
const phone_number = ref(currentUserData?.value?.phone_number);

watch(currentUserData, () => {
  console.log("Watching", userStore?.currentUserData?.phone_code);
  console.log("Watching", userStore?.currentUserData?.phone_number);
  phone_code.value = currentUserData?.value?.phone_code;
  phone_number.value = currentUserData?.value?.phone_number;
});

// onMounted(() => {
//   phone_code.value = ref(userStore?.currentUserData?.phone_code);
//   phone_number.value = ref(userStore?.currentUserData?.phone_number);
// });

// handle payment item
const handlePayment = (value: string) => {
  payment_method_name.value = value;
};

const promptSent = ref(false);
const loadingCreateOrder = ref(false);
const loadingSendPrompt = ref(false);
const loadingConfirmPayment = ref(false);
const checkAllRequiredFields = () => {
  console.log("deli", currentUserData?.value?.profile?.address);
  if (!currentUserData?.value?.profile?.address) {
    toast.warning(
      "You do not have a delivery location set. Enter Delivery Location and Click Update Profile"
    );
    return false;
  }
  return true;
};
const createOrder = async () => {
  loadingCreateOrder.value = true;
  if (checkAllRequiredFields()) {
    if (!Object.keys(cartStore.activeOrder).length) {
      console.log("jer");
      let orderItems: any = [];
      cartStore.cart_products.map((item: IProduct) => {
        orderItems.push({
          product_id: item?.id,
          quantity: item?.orderQuantity,
          purchase_price: cartStore.getNetPriceOfProductInCart(item?.id),
        });
      });
      const { data: orderData, error: orderError } = await getData("/order/", {
        method: "POST",
        body: {
          delivery_location: currentUserData?.value?.profile?.address,
          delivery_latitude: currentUserData?.value?.profile?.latitude,
          delivery_longitude: currentUserData?.value?.profile?.longitude,
          orderitem_set: orderItems,
        },
      });

      if (!orderError?.value) {
        console.log("order", orderData?.value);
        cartStore.setActiveOrder(orderData?.value);
        loadingCreateOrder.value = false;
        sendPrompt();
      } else {
        showErrors(orderError);
        loadingCreateOrder.value = false;
      }
    } else {
      loadingCreateOrder.value = false;
      // just send the prompt
      sendPrompt();
    }
  } else {
    loadingCreateOrder.value = false;
  }
};

const showErrors = (error: any) => {
  error?.value?.data?.errors.map((e: { attr: string; detail: any }) => {
    toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
  });
};

const sendPrompt = async () => {
  loadingSendPrompt.value = true;
  // clean phone
  let clean_phone = `${phone_number?.value}`;
  if (clean_phone[0] === "0") {
    clean_phone = clean_phone.substring(1, clean_phone.length);
  }
  const { data: transactionData, error: transactionError } = await getData(
    "/order/create-stk/",
    {
      method: "POST",
      body: {
        order_id: cartStore?.activeOrder?.id,
        phone_number: `${phone_code?.value}${clean_phone}`,
        amount: cartStore.totalPriceQuantity.total,
      },
    }
  );
  if (!transactionError?.value) {
    loadingSendPrompt.value = false;
    cartStore.setActiveOrder(transactionData?.value);

    toast.success(`Prompt sent. Check your Phone and Enter Pin`);
    // startPolling();
  } else {
    loadingSendPrompt.value = false;
    showErrors(transactionError);
  }
};

const verifyPayment = async () => {
  loadingConfirmPayment.value = true;

  const { data: verifyPaymentData, error: verifyPaymentError } = await getData(
    "/order/confirm-payment/",
    {
      method: "POST",
      body: {
        order_id: cartStore?.activeOrder?.id,
        transaction_id: cartStore.activeOrder?.payment_transaction,
      },
    }
  );
  if (!verifyPaymentError?.value) {
    loadingConfirmPayment.value = false;
    // toast.success(`Payment Verified`);

    if (
      verifyPaymentData?.value?.payment_transaction_obj?.transaction_status ===
      "failed"
    ) {
      toast.error(`Payment Failed, Please try again`);
    } else if (
      verifyPaymentData?.value?.payment_transaction_obj?.transaction_status ===
      "processed"
    ) {
      toast.success(`Payment Verified`);
    }
    cartStore.setActiveOrder(verifyPaymentData?.value);
  } else {
    loadingConfirmPayment.value = false;
    showErrors(verifyPaymentError);
  }
};
const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_POLLING_ATTEMPTS = 12; // 1 minute total (12 * 5 seconds)
let pollingInterval: any;

const startPolling = () => {
  let attempts = 0;

  // Clear any existing polling interval
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }

  pollingInterval = setInterval(async () => {
    attempts++;

    await verifyPayment();

    // Check payment status after verification
    if (
      cartStore?.activeOrder?.payment_transaction_obj?.transaction_status ===
      "processed"
    ) {
      stopPolling();
    } else if (
      cartStore?.activeOrder?.payment_transaction_obj?.transaction_status ===
      "failed"
    ) {
      stopPolling();
    }

    // Stop polling after max attempts
    if (attempts >= MAX_POLLING_ATTEMPTS) {
      toast.info(
        "Payment verification timed out. Please check your order status or try again."
      );
      stopPolling();
    }
  }, POLLING_INTERVAL);
};

const stopPolling = () => {
  if (pollingInterval) {
    window.clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const router = useRouter();
const proceedToOrders = () => {
  cartStore.clear_cart(false);
  // clear cart
  cartStore.setActiveOrder({});
  clear();

  router.push("/orders");
};
const clear = () => {
  console.log("clearing");
  cartStore.activeOrder = {};
  cartStore.setActiveOrder({}, true);
  // cartStore.setActiveOrder({});
  // Object.assign(cartStore.activeOrder, {});
  console.log("cleared", cartStore.activeOrder);
};

onUnmounted(() => {
  stopPolling();
});
</script>
