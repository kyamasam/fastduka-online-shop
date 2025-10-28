<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Order Configuration</h2>
            <div class="space-y-4">
                <div>
                    <label for="default_tax_rate"
                           class="block text-sm font-semibold text-gray-900 mb-2">Default Tax Rate (%)</label>
                    <input id="default_tax_rate"
                           v-model="localSettings.default_tax_rate"
                           @input="updateSettings"
                           type="number"
                           step="0.01"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="minimum_order_amount"
                           class="block text-sm font-semibold text-gray-900 mb-2">Minimum Order Amount</label>
                    <input id="minimum_order_amount"
                           v-model="localSettings.minimum_order_amount"
                           @input="updateSettings"
                           type="number"
                           step="0.01"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="default_delivery_fee"
                           class="block text-sm font-semibold text-gray-900 mb-2">Default Delivery Fee</label>
                    <input id="default_delivery_fee"
                           v-model="localSettings.default_delivery_fee"
                           @input="updateSettings"
                           type="number"
                           step="0.01"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="free_delivery_threshold"
                           class="block text-sm font-semibold text-gray-900 mb-2">Free Delivery Threshold (Optional)</label>
                    <input id="free_delivery_threshold"
                           v-model="localSettings.free_delivery_threshold"
                           @input="updateSettings"
                           type="number"
                           step="0.01"
                           placeholder="Leave empty for no free delivery"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    <p class="mt-1.5 text-xs text-gray-600">Orders above this amount get free delivery</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderSettings',
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            localSettings: { ...this.settings }
        }
    },
    watch: {
        settings: {
            handler(newSettings) {
                this.localSettings = { ...newSettings }
            },
            deep: true
        }
    },
    methods: {
        updateSettings() {
            this.$emit('update:settings', this.localSettings)
        }
    }
}
</script>