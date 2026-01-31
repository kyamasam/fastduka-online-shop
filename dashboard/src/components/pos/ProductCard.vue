<template>
    <div
         class="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
        <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden max-h-[200px] relative">
            <img :src="product?.primary_photo"
                 :alt="product?.name"
                 class="w-[100%] mx-auto h-full object-cover mix-blend-multiply transition-transform hover:scale-105 duration-500" />
            <div v-if="product?.on_sale"
                 class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                SALE
            </div>
            <div v-if="product?.featured"
                 class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <el-icon size="12">
                    <StarFilled />
                </el-icon>
                Featured
            </div>
        </div>

        <div class="flex flex-col gap-3 p-4">
            <div>
                <h3 class="text-md font-bold text-gray-800 leading-tight truncate">
                    {{ product?.name }}
                </h3>
                <p class="text-xs text-gray-400 font-light uppercase">
                    {{ product?.category?.name }}
                </p>
            </div>

            <div>
                <div class="flex items-center gap-2">
                    <el-icon v-if="(product?.inventory ?? 0) > 10"
                             class="text-green-500"
                             size="12">
                        <CircleCheckFilled />
                    </el-icon>
                    <el-icon v-else
                             class="text-orange-500"
                             size="12">
                        <WarningFilled />
                    </el-icon>
                    <span class="text-xs font-semibold text-gray-600">
                        {{ product?.inventory ?? 0 }} in stock
                    </span>
                </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div class="flex flex-col gap-1">
                    <div v-if="product?.on_sale && (product?.sale_price ?? 0) > 0"
                         class="flex items-center gap-2">
                        <span class="text-md font-bold text-red-600">{{ formatCurrency(product?.sale_price) }}</span>
                        <span
                              class="text-xs text-gray-400 line-through">{{ formatCurrency(product?.selling_price) }}</span>
                    </div>
                    <span v-else
                          class="text-md font-bold text-gray-900">{{ formatCurrency(product?.selling_price) }}</span>
                    <span v-if="product?.sku"
                          class="text-xs text-gray-400 font-mono">SKU: {{ product?.sku }}</span>
                </div>
                <button @click="handleAddToCart"
                        :disabled="(product?.inventory ?? 0) === 0"
                        :class="[
                            'px-4 py-2 text-xs font-bold border rounded-lg transition-all active:scale-95',
                            (product?.inventory ?? 0) === 0
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-200 bg-white hover:bg-gray-900 hover:text-white hover:border-gray-900'
                        ]">
                    {{ (product?.inventory ?? 0) === 0 ? 'Out of Stock' : 'Add to cart' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CircleCheckFilled, StarFilled, WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
    if ((props.product?.inventory ?? 0) > 0) {
        emit('add-to-cart', props.product)
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