<template>
    <div class="grid grid-cols-1 md:grid-cols-7 gap-6 container py-8 px-4 h-full min-w-full bg-gray-50">
        <!-- Products Section -->
        <div class="md:col-span-5 flex-1 flex flex-col gap-6">
            <div class="flex justify-between items-center flex-wrap">
                <h1 class="text-2xl font-bold">List Product</h1>
                <div class="flex gap-3 flex-wrap">

                    <div class="relative">
                        <input type="text"
                               placeholder="Search products..."
                               v-model="searchQuery"
                               @input="handleSearch"
                               class="border px-4 py-2 rounded-md pl-10 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <el-icon class="absolute left-3 top-2.5 text-gray-400 text-sm">
                            <Search />
                        </el-icon>
                    </div>
                </div>
            </div>

            <!-- Category Filter Component -->
            <CategoryFilter :categories="categories"
                            :activeCategory="activeCategory"
                            :isLoading="isLoading"
                            @filter="handleCategoryFilter"
                            @sort="handleSortChange" />

            <!-- Loading State -->
            <div v-if="isLoading"
                 class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <ProductCardSkeleton v-for="i in 8"
                                     :key="i" />
            </div>

            <!-- Empty State -->
            <EmptyState v-else-if="products.length === 0"
                        :searchQuery="searchQuery"
                        :activeCategory="activeCategory"
                        @clear-filters="clearFilters" />

            <!-- Products Grid -->
            <div v-else
                 class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <ProductCard v-for="item in products"
                             :key="item.id"
                             :product="item"
                             @add-to-cart="addToCart" />
            </div>

            <!-- Payment Details Display -->
            <div v-if="lastPaymentTransaction" class="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Last Payment Details</h3>
                <div class="space-y-2 text-sm text-gray-700">
                    <p><strong>Transaction ID:</strong> {{ lastPaymentTransaction.id }}</p>
                    <p><strong>Amount:</strong> {{ lastPaymentTransaction.transaction_amount }} {{ lastPaymentTransaction.transaction_currency }}</p>
                    <p><strong>Status:</strong> <span :class="{'text-red-600': lastPaymentTransaction.transaction_status === 'failed', 'text-green-600': lastPaymentTransaction.transaction_status === 'processed', 'text-yellow-600': lastPaymentTransaction.transaction_status === 'pending'}">{{ lastPaymentTransaction.transaction_status }}</span></p>
                    <p v-if="lastPaymentTransaction.transaction_code"><strong>Code:</strong> {{ lastPaymentTransaction.transaction_code }}</p>
                    <p><strong>Method:</strong> {{ lastPaymentTransaction.payment_method }}</p>
                    <p v-if="lastPaymentTransaction.customer_account_number"><strong>Customer Account:</strong> {{ lastPaymentTransaction.customer_account_number }}</p>
                    <p><strong>Time:</strong> {{ new Date(lastPaymentTransaction.created_at).toLocaleString() }}</p>
                </div>
                <button @click="lastPaymentTransaction = null" class="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Clear</button>
            </div>
        </div>

        <!-- Cart Summary Component -->
        <CartSummary :cartItems="cart"
                     :isLoading="isLoading"
                     @update-quantity="updateCartQuantity"
                     @remove-item="removeFromCart"
                     @clear-cart="clearCart"
                     @checkout="handleCheckout" />

        <!-- Checkout Modal -->
        <CheckoutModal v-model="showCheckoutModal"
                       :cartItems="cart"
                       :subtotal="subtotal"
                       :tax="tax"
                       :total="total"
                       :totalItems="totalItems"
                       @payment-success="handlePaymentSuccess"
                       @payment-failed="handlePaymentFailed" />
    </div>
</template>

<script setup>
import CartSummary from '@/components/pos/CartSummary.vue'
import CategoryFilter from '@/components/pos/CategoryFilter.vue'
import CheckoutModal from '@/components/pos/CheckoutModal.vue'
import EmptyState from '@/components/pos/EmptyState.vue'
import ProductCard from '@/components/pos/ProductCard.vue'
import ProductCardSkeleton from '@/components/pos/ProductCardSkeleton.vue'
import store from '@/vuex/store'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const vuexStore = useStore()

// Loading state
const isLoading = ref(true)

// Products data - using backend data directly
const products = ref([])

// Search state
const searchQuery = ref('')

// Cart state
const cart = ref([])

// Checkout state
const showCheckoutModal = ref(false)

// Filter state
const activeCategory = ref('All')
const sortOrder = ref('newest')

// Get categories from store
const categoriesData = computed(() => vuexStore.getters["vendors/categories"] || [])
const categories = computed(() => {
    const cats = ['All', ...categoriesData.value.map(cat => cat.name)]
    return cats
})

// Tax calculation state
const taxCalculation = ref(null)
const isCalculatingTax = ref(false)

// Last payment transaction details
const lastPaymentTransaction = ref(null);

// Helper function to round amounts to 2 decimal places
const roundAmount = (amount) => {
    return Math.round((amount ?? 0) * 100) / 100
}

// Helper to get item price (handles sale price)
const getItemPrice = (item) => {
    if (item.on_sale && item.sale_price > 0) {
        return item.sale_price
    }
    return item.selling_price
}

// Calculate tax via API
const calculateTax = async () => {
    if (cart.value.length === 0) {
        taxCalculation.value = null
        return
    }

    isCalculatingTax.value = true

    // Prepare items payload
    const items = cart.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        purchase_price: getItemPrice(item).toString()
    }))

    try {
        const response = await store.dispatch('postData', {
            url: 'order/calculate-tax',
            data: {
                items,
                showSucccess: false
            }
        })

        taxCalculation.value = response.data
    } catch (error) {
        console.error('Failed to calculate tax:', error)
        taxCalculation.value = null
    } finally {
        isCalculatingTax.value = false
    }
}

// Cart totals computed properties - use API calculation or fallback
const subtotal = computed(() => {
    if (taxCalculation.value) {
        return parseFloat(taxCalculation.value.total_before_tax ?? 0)
    }

    // Fallback calculation
    const sum = cart.value.reduce((total, item) => {
        const price = getItemPrice(item)
        return total + (price * item.quantity)
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
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

// Fetch categories from API
const fetchCategories = async () => {
    try {
        await vuexStore.dispatch("vendors/fetchCategories")
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

// Build URL with filters
const buildFilterUrl = () => {
    const params = new URLSearchParams()

    // Add search filter
    if (searchQuery.value.trim()) {
        params.append("search", searchQuery.value)
    }

    // Add category filter
    if (activeCategory.value !== 'All') {
        const selectedCat = categoriesData.value.find(cat => cat.name === activeCategory.value)
        if (selectedCat) {
            params.append("category_id", selectedCat.id)
        }
    }

    // Add ordering
    if (sortOrder.value === 'price-low') {
        params.append("ordering", "selling_price")
    } else if (sortOrder.value === 'price-high') {
        params.append("ordering", "-selling_price")
    } else if (sortOrder.value === 'name') {
        params.append("ordering", "name")
    } else if (sortOrder.value === 'newest') {
        params.append("ordering", "-created_at")
    } else if (sortOrder.value === 'oldest') {
        params.append("ordering", "created_at")
    }

    const queryString = params.toString()
    return queryString ? `product?${queryString}` : 'product'
}

// Fetch products from API
const fetchProducts = async () => {
    isLoading.value = true
    try {
        const url = buildFilterUrl()
        console.log("filter url", url)
        const response = await store.dispatch('fetchList', { url })
        console.log("url", url, "data", response)
        products.value = response?.data?.results
    } catch (error) {
        console.error('Failed to fetch products:', error)
        products.value = []
    } finally {
        isLoading.value = false
    }
}

// Event handlers
const handleCategoryFilter = (category) => {
    activeCategory.value = category
    fetchProducts()
}

const handleSortChange = (sort) => {
    sortOrder.value = sort
    fetchProducts()
}

const handleSearch = () => {
    fetchProducts()
}

const clearFilters = () => {
    activeCategory.value = 'All'
    searchQuery.value = ''
    sortOrder.value = 'newest'
    fetchProducts()
}

const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)

    if (existingItem) {
        if (existingItem.quantity < product.inventory) {
            existingItem.quantity += 1
        }
    } else {
        if (product.inventory > 0) {
            cart.value.push({
                ...product,
                quantity: 1
            })
        }
    }
}

const updateCartQuantity = ({ id, quantity }) => {
    const item = cart.value.find(item => item.id === id)
    const product = products.value.find(p => p.id === id)

    if (item && product && quantity >= 0 && quantity <= product.inventory) {
        if (quantity === 0) {
            removeFromCart(id)
        } else {
            item.quantity = quantity
        }
    }
}

const removeFromCart = (id) => {
    cart.value = cart.value.filter(item => item.id !== id)
}

const clearCart = () => {
    cart.value = []
    lastPaymentTransaction.value = null; // Clear payment details on new cart
}

// Checkout handlers
const handleCheckout = () => {
    if (cart.value.length === 0) {
        ElMessage.warning('Cart is empty')
        return
    }
    lastPaymentTransaction.value = null; // Clear previous payment details before new checkout
    showCheckoutModal.value = true
}

const handlePaymentSuccess = (order) => {
    ElMessage.success('Payment successful! Order placed.')
    lastPaymentTransaction.value = order.payment_transaction_obj; // Store for display
    showCheckoutModal.value = false
    clearCart()
}

const handlePaymentFailed = (order) => { // Assuming order object is passed here
    if (order && order.payment_transaction_obj) {
        lastPaymentTransaction.value = order.payment_transaction_obj; // Store for display
        if (order.payment_transaction_obj.transaction_status === 'failed') {
            ElMessage.error('Payment failed. Please try again.')
        } else {
            // Payment might be pending, processed with issues, etc.
            ElMessage.warning(`Payment status: ${order.payment_transaction_obj.transaction_status}. Please check details.`)
        }
    } else {
        // Generic error if no order/transaction details are available
        ElMessage.error('An unknown payment error occurred. Please try again.')
    }
    showCheckoutModal.value = false
    // Do not clear cart on non-failed payment for user to review
}

// Watch cart for changes and recalculate tax
watch(
    cart,
    () => {
        calculateTax()
    },
    { deep: true }
)

// Initialize
onMounted(async () => {
    await fetchCategories()
    await fetchProducts()
})
</script>