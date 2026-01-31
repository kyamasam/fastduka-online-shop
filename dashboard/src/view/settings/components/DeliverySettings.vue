<template>
    <section class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Delivery Configuration</h2>
            <div class="space-y-4">
                <div>
                    <label for="default_delivery_radius"
                           class="block text-sm font-semibold text-gray-900 mb-2">Default Delivery Radius
                        (km)</label>
                    <input id="default_delivery_radius"
                           :value="settings.default_delivery_radius"
                           @input="updateSetting('default_delivery_radius', $event.target.value)"
                           type="number"
                           step="0.1"
                           min="0.1"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="estimated_delivery_time_min"
                               class="block text-sm font-semibold text-gray-900 mb-2">Min Delivery Time
                            (minutes)</label>
                        <input id="estimated_delivery_time_min"
                               :value="settings.estimated_delivery_time_min"
                               @input="updateSetting('estimated_delivery_time_min', $event.target.value)"
                               type="number"
                               class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    </div>
                    <div>
                        <label for="estimated_delivery_time_max"
                               class="block text-sm font-semibold text-gray-900 mb-2">Max Delivery Time
                            (minutes)</label>
                        <input id="estimated_delivery_time_max"
                               :value="settings.estimated_delivery_time_max"
                               @input="updateSetting('estimated_delivery_time_max', $event.target.value)"
                               type="number"
                               class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <input id="match_vendor"
                           :checked="settings.match_user_to_closest_vendor"
                           @change="updateSetting('match_user_to_closest_vendor', $event.target.checked)"
                           type="checkbox"
                           class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600" />
                    <label for="match_vendor"
                           class="text-sm font-medium text-gray-900 cursor-pointer">
                        Match users to closest vendor automatically
                    </label>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'DeliverySettings',
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    methods: {
        updateSetting(key, value) {
            this.$emit('update:settings', { ...this.settings, [key]: value });
        }
    }
}
</script>
