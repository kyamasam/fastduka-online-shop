<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Currency Settings</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="currency_code"
                           class="block text-sm font-semibold text-gray-900 mb-2">Currency Code</label>
                    <input id="currency_code"
                           v-model="localSettings.currency_code"
                           @input="updateSettings"
                           type="text"
                           placeholder="KES"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="currency_symbol"
                           class="block text-sm font-semibold text-gray-900 mb-2">Currency Symbol</label>
                    <input id="currency_symbol"
                           v-model="localSettings.currency_symbol"
                           @input="updateSettings"
                           type="text"
                           placeholder="Ksh"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">M-PESA Configuration</h2>
            <div>
                <label for="mpesa_paybill"
                       class="block text-sm font-semibold text-gray-900 mb-2">M-PESA Paybill Number</label>
                <input id="mpesa_paybill"
                       v-model="localSettings.mpesa_paybill_number"
                       @input="updateSettings"
                       type="text"
                       class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">FastDuka API Settings</h2>
            <div class="space-y-4">
                <div>
                    <label for="fastduka_orgid"
                           class="block text-sm font-semibold text-gray-900 mb-2">Organization ID</label>
                    <input id="fastduka_orgid"
                           v-model="localSettings.fastduka_orgid"
                           @input="updateSettings"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="fastduka_config_id"
                           class="block text-sm font-semibold text-gray-900 mb-2">Configuration ID</label>
                    <input id="fastduka_config_id"
                           v-model="localSettings.fastduka_config_id"
                           @input="updateSettings"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="fastduka_api_key"
                           class="block text-sm font-semibold text-gray-900 mb-2">API Key</label>
                    <input id="fastduka_api_key"
                           v-model="localSettings.fastduka_api_key"
                           @input="updateSettings"
                           type="password"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PaymentSettings',
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