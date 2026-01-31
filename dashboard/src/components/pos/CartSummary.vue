<template>
    <div class="md:col-span-2 flex-1 border p-4 rounded-lg bg-white shadow-sm h-fit sticky top-8 w-full">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg">Cart Summary</h2>
            <button v-if="cartItems.length > 0 && !isLoading"
                    @click="$emit('clear-cart')"
                    class="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                <el-icon size="14">
                    <Delete />
                </el-icon>
                Clear
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading"
             class="space-y-4 animate-pulse">
            <div class="h-20 bg-gray-200 rounded"></div>
            <div class="h-20 bg-gray-200 rounded"></div>
            <div class="h-32 bg-gray-200 rounded mt-4"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="cartItems.length === 0"
             class="text-gray-400 italic text-center py-20">
            <el-icon size="48"
                     class="mb-4 text-gray-300">
                <ShoppingCart />
            </el-icon>
            <p class="text-gray-500">Cart items will appear here</p>
            <p class="text-sm text-gray-400 mt-2">Add products from the list to start a transaction</p>
        </div>

        <!-- Cart Items -->
        <div v-else
             class="space-y-4">
            <div class="max-h-[400px] overflow-y-auto pr-2">
                <div v-for="item in cartItems"
                     :key="item?.id"
                     class="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <!-- Product Image -->
                    <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img :src="item?.primary_photo"
                             :alt="item?.name"
                             class="w-full h-full object-cover" />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item?.name }}</h4>
                        <p class="text-xs text-gray-500">{{ item?.category?.name }}</p>
                        <div class="flex items-center justify-between mt-1">
                            <span
                                  class="text-sm font-bold text-gray-900">{{ formatCurrency(getItemPrice(item)) }}</span>
                            <div class="flex items-center gap-2">
                                <button @click="decreaseQuantity(item?.id)"
                                        class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="(item?.quantity ?? 1) <= 1">
                                    <el-icon size="12">
                                        <Minus />
                                    </el-icon>
                                </button>
                                <span class="text-sm font-medium w-8 text-center">{{ item?.quantity ?? 0 }}</span>
                                <button @click="increaseQuantity(item?.id)"
                                        class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="(item?.quantity ?? 0) >= (item?.inventory ?? 0)">
                                    <el-icon size="12">
                                        <Plus />
                                    </el-icon>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Remove Button -->
                    <button @click="$emit('remove-item', item?.id)"
                            class="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <el-icon size="16">
                            <Close />
                        </el-icon>
                    </button>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="border-t pt-4 space-y-3">
                <!-- Loading skeleton for tax calculation -->
                <div v-if="isCalculatingTax"
                     class="space-y-3 animate-pulse">
                    <div class="flex justify-between">
                        <div class="h-4 bg-gray-200 rounded w-32"></div>
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div class="flex justify-between">
                        <div class="h-4 bg-gray-200 rounded w-24"></div>
                        <div class="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div class="flex justify-between border-t pt-3">
                        <div class="h-6 bg-gray-200 rounded w-20"></div>
                        <div class="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>

                <!-- Actual summary -->
                <div v-else>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Subtotal ({{ totalItems }} items)</span>
                        <span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Tax</span>
                        <span class="font-semibold">{{ formatCurrency(tax) }}</span>
                    </div>

                    <!-- Show detailed tax breakdown if available from API -->
                    <div v-if="taxCalculation && taxCalculation.items && taxCalculation.items.length > 0"
                         class="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                        <div class="font-semibold text-gray-700 mb-1">Tax Breakdown:</div>
                        <div v-for="(item, index) in taxCalculation.items"
                             :key="index"
                             class="flex justify-between text-gray-600">
                            <span class="truncate max-w-[150px]">{{ item.product_name }}</span>
                            <span class="ml-2 flex-shrink-0">
                                {{ item.tax_rate }}% - {{ formatCurrency(item.tax_amount) }}
                            </span>
                        </div>
                    </div>

                    <div class="flex justify-between text-lg font-bold border-t pt-3">
                        <span>Total</span>
                        <span>{{ formatCurrency(total) }}</span>
                    </div>
                </div>

                <button @click="$emit('checkout')"
                        class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="cartItems.length === 0 || isCalculatingTax">
                    <span v-if="isCalculatingTax">Calculating...</span>
                    <span v-else>Checkout ({{ formatCurrency(total) }})</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    Close,
    Delete,
    Minus,
    Plus,
    ShoppingCart
} from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'
import store from '@/vuex/store'

const props = defineProps({
    cartItems: {
        type: Array,
        default: () => []
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update-quantity', 'remove-item', 'clear-cart', 'checkout'])

// Tax calculation state
const taxCalculation = ref(null)
const isCalculatingTax = ref(false)

// Helper to round amounts to 2 decimal places
const roundAmount = (amount) => {
    return Math.round((amount ?? 0) * 100) / 100
}

// Helper to get item price (handles sale price)
const getItemPrice = (item) => {
    if (item?.on_sale && (item?.sale_price ?? 0) > 0) {
        return item.sale_price
    }
    return item?.selling_price ?? 0
}

// Calculate tax via API
const calculateTax = async () => {
    if (props.cartItems.length === 0) {
        taxCalculation.value = null
        return
    }

    isCalculatingTax.value = true

    // Prepare items payload
    const items = props.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity ?? 0,
        purchase_price: getItemPrice(item).toString()
    }))

    try {
        const response = await store.dispatch('postData', {
            url: 'order/calculate-tax',
            data: {
                items,
                showSucccess: false  // Disable success message
            }
        })

        taxCalculation.value = response.data
    } catch (error) {
        console.error('Failed to calculate tax:', error)
        // Fallback to null - will use client-side calculation
        taxCalculation.value = null
    } finally {
        isCalculatingTax.value = false
    }
}

// Watch for cart changes and recalculate tax
watch(
    () => props.cartItems,
    () => {
        calculateTax()
    },
    { deep: true, immediate: true }
)

// Computed values from API response or fallback to client-side calculation
const subtotal = computed(() => {
    if (taxCalculation.value) {
        return parseFloat(taxCalculation.value.total_before_tax ?? 0)
    }

    // Fallback calculation
    const sum = props.cartItems.reduce((total, item) => {
        const price = getItemPrice(item)
        const quantity = item?.quantity ?? 0
        return total + (price * quantity)
    }, 0)
    return roundAmount(sum)
})

const tax = computed(() => {
    if (taxCalculation.value) {
        return parseFloat(taxCalculation.value.tax_total ?? 0)
    }

    // Fallback calculation
    return roundAmount(subtotal.value * 0.16)
})

const total = computed(() => {
    if (taxCalculation.value) {
        return parseFloat(taxCalculation.value.total_after_tax ?? 0)
    }

    // Fallback calculation
    return roundAmount(subtotal.value + tax.value)
})

const totalItems = computed(() => {
    return props.cartItems.reduce((sum, item) => sum + (item?.quantity ?? 0), 0)
})

// Helper methods
const increaseQuantity = (id) => {
    const item = props.cartItems.find(item => item?.id === id)
    const currentQuantity = item?.quantity ?? 0
    const maxStock = item?.inventory ?? 0

    if (item && currentQuantity < maxStock) {
        emit('update-quantity', { id, quantity: currentQuantity + 1 })
    }
}

const decreaseQuantity = (id) => {
    const item = props.cartItems.find(item => item?.id === id)
    const currentQuantity = item?.quantity ?? 1

    if (item && currentQuantity > 1) {
        emit('update-quantity', { id, quantity: currentQuantity - 1 })
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