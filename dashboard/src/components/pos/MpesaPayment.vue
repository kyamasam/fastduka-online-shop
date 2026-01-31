<template>
    <div class="mpesa-payment">
        <!-- Phone Number Input -->
        <div class="mb-4">
            <label class="block text-sm font-medium mb-2">M-Pesa Phone Number <span class="text-red-500">*</span></label>
            <div class="flex gap-2">
                <select v-model="phoneCode"
                        class="border rounded px-3 py-2 w-24">
                    <option value="+254">+254</option>
                </select>
                <input v-model="phoneNumber"
                       type="text"
                       placeholder="712345678"
                       class="border rounded px-3 py-2 flex-1"
                       maxlength="9" />
            </div>
            <p class="text-xs text-gray-500 mt-1">Enter phone number without leading zero</p>
        </div>

        <!-- Status Messages -->
        <div v-if="statusMessage"
             :class="['p-3 rounded mb-4', statusClass]">
            {{ statusMessage }}
        </div>

        <!-- Polling Indicator -->
        <div v-if="isPolling"
             class="text-blue-600 font-semibold mb-4 flex items-center gap-2">
            <el-icon class="animate-spin">
                <Loading />
            </el-icon>
            Verifying payment automatically... ({{ pollingAttempts }}/{{ MAX_POLLING_ATTEMPTS }})
        </div>

        <!-- Success State -->
        <div v-if="paymentSuccess"
             class="bg-green-50 border border-green-200 rounded p-4 mb-4">
            <p class="font-semibold text-green-700">Payment Processed Successfully!</p>
            <p class="text-sm text-green-600">M-Pesa Code: {{ transactionCode }}</p>
            <p class="text-sm text-green-600">Order ID: {{ orderId }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
            <el-button v-if="!order"
                       type="primary"
                       :loading="loadingOrder"
                       @click="createOrderAndSendPrompt"
                       :disabled="!isPhoneValid">
                Send M-Pesa Prompt
            </el-button>

            <el-button v-if="order && !paymentSuccess"
                       type="primary"
                       :loading="loadingPrompt"
                       @click="sendPrompt"
                       :disabled="!isPhoneValid">
                Resend Prompt
            </el-button>

            <el-button v-if="showManualVerifyButton"
                       type="success"
                       :loading="loadingVerify"
                       @click="verifyPayment">
                Verify Payment
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import store from '@/vuex/store'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

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

const emit = defineEmits(['payment-success', 'payment-failed', 'order-created'])

// Form state
const phoneCode = ref('+254')
const phoneNumber = ref('')
const order = ref(null)
const orderId = ref('')

// Loading states
const loadingOrder = ref(false)
const loadingPrompt = ref(false)
const loadingVerify = ref(false)

// Polling state
const POLLING_INTERVAL = 5000 // 5 seconds
const MAX_POLLING_ATTEMPTS = 5
const INITIAL_DELAY = 3000
let pollingInterval = null
const pollingAttempts = ref(0)
const isPolling = ref(false)
const showManualVerifyButton = ref(false)

// Status
const statusMessage = ref('')
const statusClass = ref('')
const paymentSuccess = ref(false)
const transactionCode = ref('')

// Validation
const isPhoneValid = computed(() => {
    return phoneNumber.value && phoneNumber.value.length >= 9
})

// Helper function to round amounts to 2 decimal places
const roundAmount = (amount) => {
    return Math.round((amount ?? 0) * 100) / 100
}

// Create order and send STK push
const createOrderAndSendPrompt = async () => {
    loadingOrder.value = true
    statusMessage.value = ''

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
        order.value = orderResponse.data
        orderId.value = order.value.id
        emit('order-created', order.value)

        ElMessage.success('Order created successfully')

        // Step 2: Send STK push
        await sendPrompt()

    } catch (error) {
        statusMessage.value = error?.response?.data?.message || 'Failed to create order. Please try again.'
        statusClass.value = 'bg-red-50 text-red-700 border border-red-200'
        emit('payment-failed', error)
    } finally {
        loadingOrder.value = false
    }
}

// Send STK push
const sendPrompt = async () => {
    loadingPrompt.value = true
    statusMessage.value = ''

    try {
        // Clean phone number
        let cleanPhone = phoneNumber.value
        if (cleanPhone[0] === '0') {
            cleanPhone = cleanPhone.substring(1)
        }

        const payload = {
            url: 'order/create-stk',
            data: {
                order_id: order.value.id,
                phone_number: `${phoneCode.value}${cleanPhone}`,
                amount: roundAmount(props.total)
            }
        }

        const response = await store.dispatch('postData', payload)
        order.value = response.data

        statusMessage.value = 'STK push sent! Check your phone and enter PIN.'
        statusClass.value = 'bg-blue-50 text-blue-700 border border-blue-200'

        showManualVerifyButton.value = false
        startPolling()

    } catch (error) {
        statusMessage.value = error?.response?.data?.message || 'Failed to send STK push. Please try again.'
        statusClass.value = 'bg-red-50 text-red-700 border border-red-200'
        emit('payment-failed', error)
    } finally {
        loadingPrompt.value = false
    }
}

// Verify payment
const verifyPayment = async () => {
    loadingVerify.value = true

    try {
        const payload = {
            url: 'order/confirm-payment',
            data: {
                order_id: order.value.id,
                transaction_id: order.value.payment_transaction
            }
        }

        const response = await store.dispatch('postData', payload)
        order.value = response.data

        const status = order.value?.payment_transaction_obj?.transaction_status

        if (status === 'processed') {
            paymentSuccess.value = true
            transactionCode.value = order.value.payment_transaction_obj.transaction_code
            statusMessage.value = ''
            stopPolling()
            ElMessage.success('Payment verified successfully!')
            emit('payment-success', order.value)
        } else if (status === 'failed') {
            statusMessage.value = 'Payment failed. Please try again.'
            statusClass.value = 'bg-red-50 text-red-700 border border-red-200'
            stopPolling()
            showManualVerifyButton.value = true
        } else {
            statusMessage.value = 'Payment still processing...'
            statusClass.value = 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }

    } catch (error) {
        statusMessage.value = error?.response?.data?.message || 'Failed to verify payment.'
        statusClass.value = 'bg-red-50 text-red-700 border border-red-200'
    } finally {
        loadingVerify.value = false
    }
}

// Polling logic
const startPolling = () => {
    stopPolling()
    pollingAttempts.value = 0
    isPolling.value = true

    setTimeout(() => {
        attemptVerification()
        pollingInterval = setInterval(() => {
            attemptVerification()
        }, POLLING_INTERVAL)
    }, INITIAL_DELAY)
}

const attemptVerification = async () => {
    pollingAttempts.value++
    await verifyPayment()

    const status = order.value?.payment_transaction_obj?.transaction_status

    if (status === 'processed' || status === 'failed') {
        stopPolling()
        return
    }

    if (pollingAttempts.value >= MAX_POLLING_ATTEMPTS) {
        stopPolling()
        showManualVerifyButton.value = true
        ElMessage.info('Automatic verification complete. Click "Verify Payment" if payment was successful.')
    }
}

const stopPolling = () => {
    if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
    }
    isPolling.value = false
    pollingAttempts.value = 0
}

onUnmounted(() => {
    stopPolling()
})
</script>

<style scoped>
/* Add any component-specific styles here */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
