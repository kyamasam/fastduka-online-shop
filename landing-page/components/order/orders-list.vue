<template>
      <div
        v-if="orders_data.length === 0"
        className="text-center pt-50"
      >
        <h3>No Orders Found</h3>
        <nuxt-link href="/shop" className="tp-cart-checkout-btn mt-20"
          >Continue Shopping
          </nuxt-link>
      </div>
      <div v-else class="row">
        <div class="col-xl-9 col-lg-8">
          <div class="flex flex-col gap-4 mb-25 mr-30">
            <div
              class="border shadow-md rounded-md w-full  "
              v-for="data in orders_data"
              :key="data?.id"
            >
              <div class="w-full flex justify-between px-4 p-2 bg-gray-100">
                <div class="flex flex-col gap-1">
                  <p class="font-semibold">Order Placed on</p>
                  <div class="flex gap-1">
                    {{ new Date(data?.created_at)?.toLocaleDateString() }}
                    {{ new Date(data?.created_at)?.toLocaleTimeString() }}
                  </div>

                  by

                  {{ data?.payment_transaction_obj?.customer_account_number }}
                </div>
                <div class="flex flex-col gap-1">
                  <p class="font-semibold">Delivered on</p>
                  {{ new Date(data?.created_at)?.toLocaleDateString() }} at
                  {{ data?.delivery_location }}
                </div>
                <div class="flex flex-col gap-1">
                  <p class="font-semibold">Status</p>
                  <p :class="data?.status ==='processed'?'text-green-400':''">{{ data?.status }}</p>
                </div>
                <div>
                  <p class="font-semibold">
                    Payment Status:
                    {{
                      data?.payment_transaction_obj?.transaction_status || "N/A"
                    }}
                    <span>
                        {{ data?.payment_transaction_obj?.transaction_code }}
                    </span>
                    <!-- {{data?.id}} {{ data?.payment_transaction_obj?.id }} -->
                    <button  @click="refreshPayment(data?.id, data?.payment_transaction_obj?.id)" v-if="data?.payment_transaction_obj?.transaction_status !== 'processed' && data?.payment_transaction_obj?.id && data?.id" class="btn btn-primary"> Refresh Payment</button>
                  </p>
                  <p>
                    {{
                      formatCurrency(
                        data?.payment_transaction_obj?.transaction_amount
                      )
                    }}
                  </p>
                </div>
              </div>

              <div class="flex  flex-col px-3 gap-2 py-2 ">
                <div class="grid grid-cols-3 ">
                    <p class="font-semibold">Product</p>
                    <p class="font-semibold">Purchase Price</p>
                    <p class="font-semibold">Total</p>
                </div>
                <div class="grid grid-cols-3 justify-between" v-for="order_item in data?.orderitem_set" :key="item?.id">
                    <div>{{ order_item?.product?.name }} x {{order_item?.quantity }}</div>
                    <p>@ {{ formatCurrency(order_item?.purchase_price) }}</p> 
                    <p> {{ formatCurrency(order_item?.quantity * order_item?.purchase_price) }}</p>
                </div>
              </div>
            </div>

            <!-- order item start -->
            <!-- order item end -->
          </div>
        </div>
      </div>

</template>

<script setup >
import { useCartStore } from "@/pinia/useCartStore";
import { toast } from "vue3-toastify";
const cartStore = useCartStore();
let shipCost = ref(0);
let couponCode = ref("");
// handleCouponSubmit
const handleCouponSubmit = () => {
  console.log(couponCode.value);
};

const orders_data = ref([]);
const fetchOrders= async()=>{
  const { data: orders_response, error } = await getData("/order/");
  orders_data.value =[]
  if (!error.value) {
    orders_data.value = [...orders_response.value.results];
  }

}

const loadingConfirmPayment = ref(false)
const refreshPayment = async (order_id, transaction_id) => {
  loadingConfirmPayment.value = true;

  const { data: verifyPaymentData, error: verifyPaymentError } = await getData(
    "/order/confirm-payment/",
    {
      method: "POST",
      body: {
        order_id: order_id,
        transaction_id: transaction_id,
      },
    }
  );
  if (!verifyPaymentError?.value) {
    loadingConfirmPayment.value = false;
    if(verifyPaymentData?.value?.payment_transaction_obj?.transaction_status==='processed'){
      toast.success(`Payment Verified`);
    }else{
      toast.error(`Could not verify payment `);
    }
    cartStore.setActiveOrder(verifyPaymentData?.value);
  } else {
    loadingConfirmPayment.value = false;
    console.log(`Payment failed`, verifyPaymentError);
  }
};
await fetchOrders()


</script>

