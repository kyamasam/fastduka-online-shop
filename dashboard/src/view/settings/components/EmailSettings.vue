<template>
    <section class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">SMTP Configuration</h2>
            <div class="space-y-4">
                <div>
                    <label for="smtp_host"
                           class="block text-sm font-semibold text-gray-900 mb-2">SMTP Host</label>
                    <input id="smtp_host"
                           :value="settings.smtp_host"
                           @input="updateSetting('smtp_host', $event.target.value)"
                           type="text"
                           placeholder="smtp.gmail.com"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="smtp_port"
                           class="block text-sm font-semibold text-gray-900 mb-2">SMTP Port</label>
                    <input id="smtp_port"
                           :value="settings.smtp_port"
                           @input="updateSetting('smtp_port', $event.target.value)"
                           type="number"
                           placeholder="587"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="smtp_user"
                           class="block text-sm font-semibold text-gray-900 mb-2">SMTP Username</label>
                    <input id="smtp_user"
                           :value="settings.smtp_user"
                           @input="updateSetting('smtp_user', $event.target.value)"
                           type="text"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="smtp_password"
                           class="block text-sm font-semibold text-gray-900 mb-2">SMTP Password</label>
                    <input id="smtp_password"
                           :value="settings.smtp_password"
                           @input="updateSetting('smtp_password', $event.target.value)"
                           type="password"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
                <div>
                    <label for="default_from_email"
                           class="block text-sm font-semibold text-gray-900 mb-2">Default From Email</label>
                    <input id="default_from_email"
                           :value="settings.default_from_email"
                           @input="updateSetting('default_from_email', $event.target.value)"
                           type="email"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'EmailSettings',
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
