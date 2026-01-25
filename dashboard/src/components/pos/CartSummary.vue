<template>
    <div class="md:col-span-2 flex-1 border p-4 rounded-lg bg-white shadow-sm h-fit sticky top-8 w-full">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-lg">Cart Summary</h2>
            <button v-if="cartItems.length > 0 && !isLoading" @click="$emit('clear-cart')"
                class="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                <el-icon size="14">
                    <Delete />
                </el-icon>
                Clear
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4 animate-pulse">
            <div class="h-20 bg-gray-200 rounded"></div>
            <div class="h-20 bg-gray-200 rounded"></div>
            <div class="h-32 bg-gray-200 rounded mt-4"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="cartItems.length === 0" class="text-gray-400 italic text-center py-20">
            <el-icon size="48" class="mb-4 text-gray-300">
                <ShoppingCart />
            </el-icon>
            <p class="text-gray-500">Cart items will appear here</p>
            <p class="text-sm text-gray-400 mt-2">Add products from the list to start a transaction</p>
        </div>

        <!-- Cart Items -->
        <div v-else class="space-y-4">
            <div class="max-h-[400px] overflow-y-auto pr-2">
                <div v-for="item in cartItems" :key="item.id"
                    class="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <!-- Product Image -->
                    <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.name }}</h4>
                        <p class="text-xs text-gray-500">{{ item.category }}</p>
                        <div class="flex items-center justify-between mt-1">
                            <span class="text-sm font-bold text-gray-900">{{ formatCurrency(item.price) }}</span>
                            <div class="flex items-center gap-2">
                                <button @click="decreaseQuantity(item.id)"
                                    class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="item.quantity <= 1">
                                    <el-icon size="12">
                                        <Minus />
                                    </el-icon>
                                </button>
                                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                                <button @click="increaseQuantity(item.id)"
                                    class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    :disabled="item.quantity >= item.stock">
                                    <el-icon size="12">
                                        <Plus />
                                    </el-icon>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Remove Button -->
                    <button @click="$emit('remove-item', item.id)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <el-icon size="16">
                            <Close />
                        </el-icon>
                    </button>
                </div>
            </div>

            <!-- Cart Summary -->
            <div class="border-t pt-4 space-y-3">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Subtotal ({{ totalItems }} items)</span>
                    <span class="font-semibold">{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tax (16%)</span>
                    <span class="font-semibold">{{ formatCurrency(tax) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span>{{ formatCurrency(total) }}</span>
                </div>

                <button
                    class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="cartItems.length === 0">
                    Checkout ({{ formatCurrency(total) }})
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {
    ShoppingCart,
    Delete,
    Minus,
    Plus,
    Close
} from '@element-plus/icons-vue'

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

const emit = defineEmits(['update-quantity', 'remove-item', 'clear-cart'])

// Computed values
const subtotal = computed(() => {
    return props.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const tax = computed(() => {
    return subtotal.value * 0.16 // 16% tax
})

const total = computed(() => {
    return subtotal.value + tax.value
})

const totalItems = computed(() => {
    return props.cartItems.reduce((sum, item) => sum + item.quantity, 0)
})

// Helper methods
const increaseQuantity = (id) => {
    const item = props.cartItems.find(item => item.id === id)
    if (item && item.quantity < item.stock) {
        emit('update-quantity', { id, quantity: item.quantity + 1 })
    }
}

const decreaseQuantity = (id) => {
    const item = props.cartItems.find(item => item.id === id)
    if (item && item.quantity > 1) {
        emit('update-quantity', { id, quantity: item.quantity - 1 })
    }
}

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 2
    })
    return formatter.format(amount)
}
</script>