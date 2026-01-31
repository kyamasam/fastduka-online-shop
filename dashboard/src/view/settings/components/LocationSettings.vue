<template>
    <section class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Location Information</h2>
            <div class="space-y-4">
                <div>
                    <label for="location"
                           class="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                    <input id="location"
                           :value="settings.location"
                           @input="updateSetting('location', $event.target.value)"
                           type="text"
                           placeholder="e.g., Nairobi, Kenya"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="location_link"
                           class="block text-sm font-semibold text-gray-900 mb-2">Location Link (Google
                        Maps)</label>
                    <input id="location_link"
                           :value="settings.location_link"
                           @input="updateSetting('location_link', $event.target.value)"
                           type="url"
                           placeholder="https://maps.google.com/..."
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="google_maps_api_key"
                           class="block text-sm font-semibold text-gray-900 mb-2">Google Maps API Key</label>
                    <input id="google_maps_api_key"
                           :value="settings.google_maps_api_key"
                           @input="updateSetting('google_maps_api_key', $event.target.value)"
                           type="password"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="google_analytics_id"
                           class="block text-sm font-semibold text-gray-900 mb-2">Google Analytics ID
                        (Optional)</label>
                    <input id="google_analytics_id"
                           :value="settings.google_analytics_id"
                           @input="updateSetting('google_analytics_id', $event.target.value)"
                           type="text"
                           placeholder="G-XXXXXXXXXX"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'LocationSettings',
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
