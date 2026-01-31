<template>
    <el-dialog v-model="visible"
               title="Checkout"
               width="600px"
               :before-close="handleClose"
               @close="handleClose">
        <!-- Order Summary -->
        <div class="order-summary mb-6">
            <h3 class="font-bold text-lg mb-3">Order Summary</h3>
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span>Subtotal ({{ totalItems }} items)</span>
                    <span>{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span>Tax (16%)</span>
                    <span>{{ formatCurrency(tax) }}</span>
                </div>
                <div class="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{{ formatCurrency(total) }}</span>
                </div>
            </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="payment-methods mb-6">
            <h3 class="font-bold text-lg mb-3">Select Payment Method</h3>
            <div class="space-y-3">
                <div @click="paymentMethod = 'mpesa'"
                     :class="['payment-option border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors',
                              { 'active border-blue-500 bg-blue-50': paymentMethod === 'mpesa' }]">
                    <div class="flex items-center">
                        <input type="radio"
                               :checked="paymentMethod === 'mpesa'"
                               class="mr-3"
                               @click.stop />
                        <div>
                            <div class="font-semibold">M-Pesa Payment</div>
                            <div class="text-sm text-gray-500">Pay via M-Pesa STK Push</div>
                        </div>
                    </div>
                </div>

                <div @click="paymentMethod = 'cash'"
                     :class="['payment-option border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors',
                              { 'active border-blue-500 bg-blue-50': paymentMethod === 'cash' }]">
                    <div class="flex items-center">
                        <input type="radio"
                               :checked="paymentMethod === 'cash'"
                               class="mr-3"
                               @click.stop />
                        <div>
                            <div class="font-semibold">Cash Payment</div>
                            <div class="text-sm text-gray-500">Pay with cash at counter</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Component -->
        <div v-if="paymentMethod">
            <MpesaPayment v-if="paymentMethod === 'mpesa'"
                          :cartItems="cartItems"
                          :total="total"
                          @payment-success="handlePaymentSuccess"
                          @payment-failed="handlePaymentFailed" />

            <CashPayment v-if="paymentMethod === 'cash'"
                         :cartItems="cartItems"
                         :total="total"
                         @payment-success="handlePaymentSuccess"
                         @payment-failed="handlePaymentFailed" />
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import MpesaPayment from './MpesaPayment.vue'
import CashPayment from './CashPayment.vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    cartItems: {
        type: Array,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'payment-success', 'payment-failed'])

const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const paymentMethod = ref('mpesa') // Default to mpesa

const handleClose = () => {
    visible.value = false
}

const handlePaymentSuccess = (orderData) => {
    emit('payment-success', orderData)
    visible.value = false
}

const handlePaymentFailed = (error) => {
    emit('payment-failed', error)
}

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2
    })
    return formatter.format(amount ?? 0)
}
</script>

<style scoped>
.payment-option.active {
    border-color: #409eff;
    background-color: #f0f9ff;
}
</style>
