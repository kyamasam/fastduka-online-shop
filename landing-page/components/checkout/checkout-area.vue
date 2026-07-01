<template>
  <section class="tp-checkout-area pb-120" style="background-color: #eff1f5">
    <div class="container">
      <div
        v-if="cartStore.cart_products.length === 0"
        class="text-center pt-50"
      >
        <h3 class="py-2">No items found in cart to checkout</h3>
        <nuxt-link href="/shop" class="tp-checkout-btn">
          Return to shop
        </nuxt-link>
      </div>
      <div v-else class="checkout-single-card">
        <h3 class="tp-checkout-bill-title">Checkout</h3>

        <!-- 3-step indicator -->
        <div class="checkout-steps mb-4">
          <div class="steps-container">
            <div class="step-item" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
              <div class="step-circle">
                <span v-if="currentStep > 1">✓</span>
                <span v-else>1</span>
              </div>
              <div class="step-label">Account</div>
            </div>
            <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
            <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
              <div class="step-circle">
                <span v-if="currentStep > 2">✓</span>
                <span v-else>2</span>
              </div>
              <div class="step-label">Delivery</div>
            </div>
            <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
            <div class="step-item" :class="{ active: currentStep === 3 }">
              <div class="step-circle">3</div>
              <div class="step-label">Payment</div>
            </div>
          </div>
        </div>

        <!-- Steps 1 & 2: Account + Delivery -->
        <checkout-account-section
          v-show="currentStep < 3"
          ref="accountSectionRef"
          @step-changed="currentStep = $event"
          @completed="currentStep = 3"
        />

        <!-- Step 3: Payment -->
        <div v-show="currentStep === 3" class="checkout-step-payment">
          <checkout-payment-section ref="paymentSectionRef" />
          <div class="step-nav-row mt-3">
            <button
              type="button"
              class="tp-checkout-btn tp-checkout-btn-secondary step-nav-back"
              @click="goBackToDelivery"
            >
              ← Back
            </button>
            <button
              type="button"
              class="tp-checkout-btn step-nav-next"
              :disabled="!paymentConfirmed"
              @click="paymentSectionRef?.proceedToOrders()"
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tp-checkout-area {
  display: flow-root;
}

.checkout-single-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 40px;
  max-width: 680px;
  margin: 40px auto;
}

.tp-checkout-bill-title {
  margin-bottom: 24px;
}

/* Step indicator */
.checkout-steps {
  padding: 8px 0 24px;
}

.steps-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 480px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 6px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.step-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 8px;
  margin-bottom: 26px;
  transition: background-color 0.3s ease;
}

.step-line.completed {
  background-color: #28a745;
}

.step-item.active .step-circle {
  background-color: #0989ff;
  color: white;
}

.step-item.active .step-label {
  color: #0989ff;
  font-weight: 600;
}

.step-item.completed .step-circle {
  background-color: #28a745;
  color: white;
}

.step-item.completed .step-label {
  color: #28a745;
}

.tp-checkout-btn-secondary {
  background-color: #6c757d;
}

.tp-checkout-btn-secondary:hover {
  background-color: #5a6268;
}

.step-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.step-nav-back,
.step-nav-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 150px;
  width: 150px;
  min-height: 52px;
  padding: 10px 20px;
  margin: 0;
  line-height: 1.2;
}

.step-nav-next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 575px) {
  .tp-checkout-area .container {
    padding-right: 12px;
    padding-left: 12px;
  }

  .checkout-single-card {
    width: 100%;
    margin: 16px auto;
    padding: 24px 16px;
    border-radius: 8px;
  }

  .step-nav-row {
    gap: 12px;
  }

  .step-nav-back,
  .step-nav-next {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }
}
</style>

<script setup lang="ts">
import { useCartStore } from "@/pinia/useCartStore";

const cartStore = useCartStore();
const currentStep = ref(1);
const accountSectionRef = ref<any>(null);
const paymentSectionRef = ref<any>(null);

const paymentConfirmed = computed(
  () => cartStore.activeOrder?.payment_transaction_obj?.transaction_status === 'processed'
);

watch(currentStep, async () => {
  await nextTick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const goBackToDelivery = () => {
  currentStep.value = 2;
  accountSectionRef.value?.setStep(2);
};
</script>
