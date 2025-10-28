<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Store Details</h2>
            <div class="space-y-4">
                <div>
                    <label for="title"
                           class="block text-sm font-semibold text-gray-900 mb-2">Store Name</label>
                    <input id="title"
                           v-model="localSettings.title"
                           @input="updateSettings"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="site_link"
                           class="block text-sm font-semibold text-gray-900 mb-2">Store Link</label>
                    <input id="site_link"
                           v-model="localSettings.site_link"
                           @input="updateSettings"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="description"
                           class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                    <textarea id="description"
                              v-model="localSettings.description"
                              @input="updateSettings"
                              rows="4"
                              class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                </div>
                <div>
                    <label for="footer_description"
                           class="block text-sm font-semibold text-gray-900 mb-2">Footer Description</label>
                    <textarea id="footer_description"
                              v-model="localSettings.footer_description"
                              @input="updateSettings"
                              rows="3"
                              class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                </div>
                <div>
                    <label for="industry"
                           class="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                    <input id="industry"
                           v-model="localSettings.industry"
                           @input="updateSettings"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Contact Information</h2>
            <div class="space-y-4">
                <div>
                    <label for="contact_email"
                           class="block text-sm font-semibold text-gray-900 mb-2">Contact Email</label>
                    <input id="contact_email"
                           v-model="localSettings.contact_email"
                           @input="updateSettings"
                           type="email"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="contact_phone"
                           class="block text-sm font-semibold text-gray-900 mb-2">Contact Phone</label>
                    <input id="contact_phone"
                           v-model="localSettings.contact_phone"
                           @input="updateSettings"
                           type="tel"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SiteInfo',
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