<template>
    <section class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Legal Information</h2>
            <div class="space-y-4">
                <div>
                    <label for="terms_and_conditions"
                           class="block text-sm font-semibold text-gray-900 mb-2">Terms and Conditions</label>
                    <textarea id="terms_and_conditions"
                              :value="settings.terms_and_conditions"
                              @input="updateSetting('terms_and_conditions', $event.target.value)"
                              rows="8"
                              placeholder="Enter your terms and conditions..."
                              class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                </div>
                <div>
                    <label for="privacy_policy"
                           class="block text-sm font-semibold text-gray-900 mb-2">Privacy Policy</label>
                    <textarea id="privacy_policy"
                              :value="settings.privacy_policy"
                              @input="updateSetting('privacy_policy', $event.target.value)"
                              rows="8"
                              placeholder="Enter your privacy policy..."
                              class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'PoliciesSettings',
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
