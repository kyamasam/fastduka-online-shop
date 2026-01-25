<template>
    <div
        class="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden max-h-[200px]">
            <img :src="product.image" :alt="product.name"
                class="w-[100%] mx-auto h-full object-cover mix-blend-multiply transition-transform hover:scale-105 duration-500" />
        </div>

        <div class="flex flex-col gap-3 p-4">
            <div>
                <h3 class="text-md font-bold text-gray-800 leading-tight truncate">
                    {{ product.name }}
                </h3>
                <p class="text-xs text-gray-400 font-light uppercase">
                    {{ product.category }}
                </p>
            </div>

            <div>
                <div class="flex items-center gap-2">
                    <el-icon v-if="product.stock > 10" class="text-green-500" size="12">
                        <CircleCheckFilled />
                    </el-icon>
                    <el-icon v-else class="text-orange-500" size="12">
                        <WarningFilled />
                    </el-icon>
                    <span class="text-xs font-semibold text-gray-600">
                        {{ product.stock }} in stock
                    </span>
                </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <span class="text-md font-bold text-gray-900">{{ formatCurrency(product?.price) }}</span>
                <button @click="handleAddToCart" :disabled="product.stock === 0" :class="[
                    'px-4 py-2 text-xs font-bold border rounded-lg transition-all active:scale-95',
                    product.stock === 0
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900'
                ]">
                    {{ product.stock === 0 ? 'Out of Stock' : 'Add to cart' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CircleCheckFilled, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
    if (props.product.stock > 0) {
        emit('add-to-cart', props.product)
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