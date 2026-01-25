<template>
    <div class="grid grid-cols-1 md:grid-cols-7 gap-6 container py-8 px-4 h-full min-w-full bg-gray-50">
        <!-- Products Section -->
        <div class="md:col-span-5 flex-1 flex flex-col gap-6">
            <div class="flex justify-between items-center flex-wrap">
                <h1 class="text-2xl font-bold">List Product</h1>
                <div class="flex gap-3 flex-wrap">
                    <button
                        class="flex items-center gap-2 border px-4 py-2 rounded-md bg-white text-sm hover:bg-gray-50 transition-colors">
                        <el-icon>
                            <Search />
                        </el-icon> Scan Barcode
                    </button>
                    <div class="relative">
                        <input type="text" placeholder="Search products..." v-model="searchQuery" @input="handleSearch"
                            class="border px-4 py-2 rounded-md pl-10 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        <el-icon class="absolute left-3 top-2.5 text-gray-400 text-sm">
                            <Search />
                        </el-icon>
                    </div>
                </div>
            </div>

            <!-- Category Filter Component -->
            <CategoryFilter :categories="categories" :activeCategory="activeCategory" :isLoading="isLoading"
                @filter="handleCategoryFilter" @sort="handleSortChange" />

            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <ProductCardSkeleton v-for="i in 8" :key="i" />
            </div>

            <!-- Empty State -->
            <EmptyState v-else-if="filteredProducts.length === 0" :searchQuery="searchQuery"
                :activeCategory="activeCategory" @clear-filters="clearFilters" />

            <!-- Products Grid -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <ProductCard v-for="item in filteredProducts" :key="item.id" :product="item" @add-to-cart="addToCart" />
            </div>
        </div>

        <!-- Cart Summary Component -->

        <CartSummary :cartItems="cart" :isLoading="isLoading" @update-quantity="updateCartQuantity"
            @remove-item="removeFromCart" @clear-cart="clearCart" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import CategoryFilter from '@/components/pos/CategoryFilter.vue'
import ProductCard from '@/components/pos/ProductCard.vue'
import ProductCardSkeleton from '@/components/pos/ProductCardSkeleton.vue'
import CartSummary from '@/components/pos/CartSummary.vue'
import EmptyState from '@/components/pos/EmptyState.vue'

// Loading state
const isLoading = ref(true)

// Mock Data
const products = ref([])

// Search state
const searchQuery = ref('')

// Cart state
const cart = ref([])

// Filter state
const activeCategory = ref('All')
const sortOrder = ref('newest')
const categories = ['All', 'Appetizers', 'Men', 'Women', 'Unisex', 'Kids', 'Accessories']

// Fetch products (simulated API call)
const fetchProducts = async () => {
    isLoading.value = true
    try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data
        products.value = [
            {
                id: 1,
                name: 'Torino Short-Sleeve',
                category: 'Men',
                price: 38.56,
                stock: 42,
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: 2,
                name: 'Crewneck Terkonrk',
                category: 'Men',
                price: 45.89,
                stock: 12,
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: 3,
                name: 'Tempest Blazer',
                category: 'Women',
                price: 20.00,
                stock: 5,
                image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: 4,
                name: 'Crewneck Terkonrk',
                category: 'Women',
                price: 18.94,
                stock: 85,
                image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: 5,
                name: 'Skirt dresses',
                category: 'Women',
                price: 34.78,
                stock: 0,
                image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: 6,
                name: 'Unique Owkegas',
                category: 'Accessories',
                price: 17.34,
                stock: 24,
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400'
            }
        ]
    } catch (error) {
        console.error('Failed to fetch products:', error)
    } finally {
        isLoading.value = false
    }
}

// Computed filtered products
const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Filter by category
    if (activeCategory.value !== 'All') {
        filtered = filtered.filter(item => item.category === activeCategory.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        )
    }

    // Sort products
    if (sortOrder.value === 'price-low') {
        filtered.sort((a, b) => a.price - b.price)
    } else if (sortOrder.value === 'price-high') {
        filtered.sort((a, b) => b.price - a.price)
    } else if (sortOrder.value === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
})

// Event handlers
const handleCategoryFilter = (category) => {
    activeCategory.value = category
}

const handleSortChange = (sort) => {
    sortOrder.value = sort
}

const handleSearch = () => {
    // Debounce could be added here for performance
    // For now, it will re-compute on every input
}

const clearFilters = () => {
    activeCategory.value = 'All'
    searchQuery.value = ''
    sortOrder.value = 'newest'
}

const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1
        }
    } else {
        if (product.stock > 0) {
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

    if (item && product && quantity >= 0 && quantity <= product.stock) {
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
}

// Initialize
onMounted(() => {
    fetchProducts()
})
</script>