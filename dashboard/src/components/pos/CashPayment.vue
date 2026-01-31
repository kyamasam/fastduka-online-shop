<template>
    <div class="cash-payment">
        <div class="bg-gray-50 border rounded p-4 mb-4">
            <h4 class="font-semibold mb-2">Cash Payment Instructions:</h4>
            <ol class="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Collect {{ formatCurrency(total) }} from customer</li>
                <li>Click "Confirm Cash Payment" below</li>
                <li>Order will be marked as paid</li>
                <li>Provide receipt to customer</li>
            </ol>
        </div>

        <!-- Amount Received Input -->
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Amount Received</label>
            <input v-model.number="amountReceived"
                   type="number"
                   :min="total"
                   step="0.01"
                   class="border rounded px-3 py-2 w-full"
                   :placeholder="formatCurrency(total)" />
            <div v-if="change > 0"
                 class="mt-2 p-2 bg-blue-50 rounded">
                <span class="font-semibold">Change to give: {{ formatCurrency(change) }}</span>
            </div>
            <div v-if="amountReceived > 0 && amountReceived < total"
                 class="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                Amount received is less than total
            </div>
        </div>

        <!-- Success State -->
        <div v-if="paymentSuccess"
             class="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p class="font-semibold text-green-700">Cash Payment Recorded Successfully!</p>
            <p class="text-sm text-green-600">Transaction Code: {{ transactionCode }}</p>
            <p class="text-sm text-green-600">Order ID: {{ orderId }}</p>
        </div>

        <!-- Error State -->
        <div v-if="errorMessage"
             class="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p class="text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- Confirm Button -->
        <el-button v-if="!paymentSuccess"
                   type="primary"
                   :loading="loading"
                   @click="confirmCashPayment"
                   :disabled="amountReceived > 0 && amountReceived < total"
                   class="w-full">
            Confirm Cash Payment ({{ formatCurrency(total) }})
        </el-button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/vuex/store'
import { ElMessage } from 'element-plus'

const props = defineProps({
    cartItems: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['payment-success', 'payment-failed'])

const loading = ref(false)
const paymentSuccess = ref(false)
const transactionCode = ref('')
const orderId = ref('')
const errorMessage = ref('')
const amountReceived = ref(props.total)

const change = computed(() => {
    return amountReceived.value > props.total ? amountReceived.value - props.total : 0
})

// Helper function to round amounts to 2 decimal places
const roundAmount = (amount) => {
    return Math.round((amount ?? 0) * 100) / 100
}

const confirmCashPayment = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        // Step 1: Create order
        const orderItems = props.cartItems.map(item => {
            const price = item.on_sale && item.sale_price > 0 ? item.sale_price : item.selling_price
            return {
                product_id: item.id,
                quantity: item.quantity,
                purchase_price: roundAmount(price)
            }
        })

        const orderPayload = {
            url: 'order',
            data: {
                order_client: 'pos_web',
                delivery_location: 'In-Store Pickup',
                orderitem_set: orderItems
            }
        }

        const orderResponse = await store.dispatch('postData', orderPayload)
        const order = orderResponse.data
        orderId.value = order.id

        // Step 2: Create cash transaction using POS-specific endpoint
        const timestamp = new Date().getTime()
        const cashTransactionCode = `CASH-${order.id}-${timestamp}`

        const transactionPayload = {
            url: 'pos-transaction',
            data: {
                customer_account_number: 'CASH',
                transaction_amount: roundAmount(props.total),
                transaction_currency: 'KES',
                payment_method: 'cash',
                transaction_code: cashTransactionCode,
                transaction_type: 'purchase',
                transaction_status: 'processed'
            }
        }

        const transactionResponse = await store.dispatch('postData', transactionPayload)
        const transaction = transactionResponse.data

        // Step 3: Link transaction to order and update status
        const updateOrderPayload = {
            url: 'order',
            id: order.id,
            data: {
                payment_transaction: transaction.id,
                status: 'PAID'
            }
        }

        const updatedOrderResponse = await store.dispatch('patchData', updateOrderPayload)
        const updatedOrder = updatedOrderResponse.data

        // Success
        paymentSuccess.value = true
        transactionCode.value = cashTransactionCode

        ElMessage.success('Cash payment recorded successfully!')
        emit('payment-success', updatedOrder)

    } catch (error) {
        console.error('Cash payment error:', error)
        errorMessage.value = error?.response?.data?.message || 'Failed to process cash payment. Please try again.'
        emit('payment-failed', error)
    } finally {
        loading.value = false
    }
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
/* Add any component-specific styles here */
</style>
