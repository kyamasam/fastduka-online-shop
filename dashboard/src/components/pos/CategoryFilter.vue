<template>
    <div class="flex justify-between items-center bg-white p-2 border rounded-lg shadow-sm flex-wrap gap-2">
        <div class="flex gap-1 flex-wrap">
            <button v-for="category in categories" :key="category" @click="$emit('filter', category)"
                :disabled="isLoading" :class="[
                    'px-6 py-2 rounded-md text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    category === activeCategory
                        ? 'bg-white shadow border font-semibold text-gray-800 border-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:border-gray-300 border border-transparent'
                ]">
                {{ category }}
                <span v-if="isLoading && category === activeCategory" class="ml-2">
                    <el-icon class="animate-spin">
                        <Loading />
                    </el-icon>
                </span>
            </button>
        </div>
        <div class="relative">
            <button
                class="flex items-center gap-2 border px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                @click="toggleSortDropdown" :disabled="isLoading">
                <el-icon>
                    <Sort />
                </el-icon>
                {{ sortLabels[selectedSort] }}
                <el-icon>
                    <ArrowDown />
                </el-icon>
            </button>

            <div v-if="showSortDropdown" v-click-outside="closeSortDropdown"
                class="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button v-for="(label, key) in sortLabels" :key="key" @click="selectSort(key)" :class="[
                    'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                    selectedSort === key ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
                ]">
                    {{ label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Sort, ArrowDown, Loading } from '@element-plus/icons-vue'

// Click outside directive
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value()
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
    }
}

defineProps({
    categories: {
        type: Array,
        default: () => []
    },
    activeCategory: {
        type: String,
        default: 'All'
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['filter', 'sort'])

const showSortDropdown = ref(false)
const selectedSort = ref('newest')
const sortLabels = {
    'newest': 'Newest',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    'name': 'Name: A to Z'
}

const toggleSortDropdown = () => {
    showSortDropdown.value = !showSortDropdown.value
}

const closeSortDropdown = () => {
    showSortDropdown.value = false
}

const selectSort = (sort) => {
    selectedSort.value = sort
    showSortDropdown.value = false
    emit('sort', sort)
}
</script>