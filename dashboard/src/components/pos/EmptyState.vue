<template>
    <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div class="mb-6">
            <el-icon class="text-gray-300" size="80">
                <Box />
            </el-icon>
        </div>

        <h3 class="text-xl font-semibold text-gray-700 mb-2">
            <template v-if="searchQuery">
                No results found for "{{ searchQuery }}"
            </template>
            <template v-else-if="activeCategory !== 'All'">
                No {{ activeCategory }} products available
            </template>
            <template v-else>
                No products found
            </template>
        </h3>

        <p class="text-gray-500 mb-6 max-w-md">
            <template v-if="searchQuery">
                We couldn't find any products matching your search. Try different keywords or browse by category.
            </template>
            <template v-else-if="activeCategory !== 'All'">
                There are currently no products in the {{ activeCategory }} category. Check back soon!
            </template>
            <template v-else>
                No products are currently available. Please check back later.
            </template>
        </p>

        <div class="flex gap-3">
            <button v-if="searchQuery || activeCategory !== 'All'" @click="$emit('clear-filters')"
                class="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                <el-icon>
                    <Refresh />
                </el-icon>
                Clear Filters
            </button>
            <button @click="$emit('refresh')"
                class="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <el-icon>
                    <Refresh />
                </el-icon>
                Refresh Products
            </button>
        </div>
    </div>
</template>

<script setup>
import { Box, Refresh } from '@element-plus/icons-vue'

defineProps({
    searchQuery: {
        type: String,
        default: ''
    },
    activeCategory: {
        type: String,
        default: 'All'
    }
})

defineEmits(['clear-filters', 'refresh'])
</script>