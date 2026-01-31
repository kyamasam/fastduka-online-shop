<template>
    <section class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">System Configuration</h2>
            <div class="space-y-4">
                <div>
                    <div class="flex items-center gap-3">
                        <input id="maintenance_mode"
                               :checked="settings.maintenance_mode"
                               @change="updateSetting('maintenance_mode', $event.target.checked)"
                               type="checkbox"
                               class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600" />
                        <label for="maintenance_mode"
                               class="text-sm font-medium text-gray-900 cursor-pointer">
                            Enable Maintenance Mode
                        </label>
                    </div>
                    <p class="mt-1.5 ml-7 text-xs text-gray-600">When enabled, the site will show a maintenance
                        page to visitors</p>
                </div>
                <div>
                    <label for="items_per_page"
                           class="block text-sm font-semibold text-gray-900 mb-2">Items Per Page</label>
                    <input id="items_per_page"
                           :value="settings.items_per_page"
                           @input="updateSetting('items_per_page', $event.target.value)"
                           type="number"
                           min="1"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div class="flex items-center gap-3">
                    <input id="enable_reviews"
                           :checked="settings.enable_reviews"
                           @change="updateSetting('enable_reviews', $event.target.checked)"
                           type="checkbox"
                           class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600" />
                    <label for="enable_reviews"
                           class="text-sm font-medium text-gray-900 cursor-pointer">
                        Enable Product Reviews
                    </label>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'SystemSettings',
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
