<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Social Media Links</h2>
            <div class="space-y-4">
                <div>
                    <label for="facebook_url"
                           class="block text-sm font-semibold text-gray-900 mb-2">Facebook URL</label>
                    <input id="facebook_url"
                           v-model="localSettings.facebook_url"
                           @input="updateSettings"
                           type="url"
                           placeholder="https://facebook.com/yourpage"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="twitter_url"
                           class="block text-sm font-semibold text-gray-900 mb-2">Twitter URL</label>
                    <input id="twitter_url"
                           v-model="localSettings.twitter_url"
                           @input="updateSettings"
                           type="url"
                           placeholder="https://twitter.com/yourhandle"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="instagram_url"
                           class="block text-sm font-semibold text-gray-900 mb-2">Instagram URL</label>
                    <input id="instagram_url"
                           v-model="localSettings.instagram_url"
                           @input="updateSettings"
                           type="url"
                           placeholder="https://instagram.com/yourhandle"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="youtube_url"
                           class="block text-sm font-semibold text-gray-900 mb-2">YouTube URL</label>
                    <input id="youtube_url"
                           v-model="localSettings.youtube_url"
                           @input="updateSettings"
                           type="url"
                           placeholder="https://youtube.com/yourchannel"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SocialMedia',
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