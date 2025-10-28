<template>
    <div class="flex min-h-screen bg-gray-50 px-4 py-4">
        <!-- Sidebar Navigation -->
        <aside class="w-72 bg-white border-r border-gray-200 overflow-y-auto sticky top-0 h-screen">
            <div class="flex items-center gap-3 p-4 border-b border-gray-200">
                <div
                     class="w-10 h-10 bg-gradient-to-br border-2 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    <img :src="settings?.site_logo"
                         alt="Site Logo"
                         class="w-8 h-8 object-contain" />
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-900">{{ settings?.title || 'Store Name' }}</h3>
                    <p class="text-xs text-gray-600">{{ settings?.site_link || 'store.fastduka.co.ke' }}</p>
                </div>
            </div>

            <nav class="py-2">
                <button v-for="section in sections"
                        :key="section.id"
                        @click="activeSection = section.id"
                        :class="[
                            'flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium text-left transition-colors',
                            activeSection === section.id
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700 hover:bg-gray-50'
                        ]">
                    <component :is="section.icon"
                               class="w-5 h-5" />
                    <span>{{ section.label }}</span>
                </button>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 p-8 max-w-5xl  w-full">
            <h1 class="text-3xl font-semibold text-gray-900 mb-8">{{ currentSectionLabel }}</h1>

            <!-- Site Information Section -->
            <SiteInfo v-if="activeSection === 'site-info'"
                      :settings="settings"
                      @update:settings="updateSettings" />

            <!-- Appearance Section -->
            <Appearance v-if="activeSection === 'appearance'"
                        :settings="settings"
                        @update:settings="updateSettings" />

            <!-- Social Media Section -->
            <SocialMedia v-if="activeSection === 'socials'"
                         :settings="settings"
                         @update:settings="updateSettings" />

            <!-- Payment Settings Section -->
            <PaymentSettings v-if="activeSection === 'payment'"
                             :settings="settings"
                             @update:settings="updateSettings" />

            <!-- Order Settings Section -->
            <OrderSettings v-if="activeSection === 'order'"
                           :settings="settings"
                           @update:settings="updateSettings" />

            <!-- Delivery Settings Section -->
            <section v-if="activeSection === 'delivery'"
                     class="space-y-5">
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-base font-semibold text-gray-900 mb-5">Delivery Configuration</h2>
                    <div class="space-y-4">
                        <div>
                            <label for="default_delivery_radius"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Default Delivery Radius
                                (km)</label>
                            <input id="default_delivery_radius"
                                   v-model="settings.default_delivery_radius"
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
                                       v-model="settings.estimated_delivery_time_min"
                                       type="number"
                                       class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                            </div>
                            <div>
                                <label for="estimated_delivery_time_max"
                                       class="block text-sm font-semibold text-gray-900 mb-2">Max Delivery Time
                                    (minutes)</label>
                                <input id="estimated_delivery_time_max"
                                       v-model="settings.estimated_delivery_time_max"
                                       type="number"
                                       class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="match_vendor"
                                   v-model="settings.match_user_to_closest_vendor"
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

            <!-- Location Settings Section -->
            <section v-if="activeSection === 'location'"
                     class="space-y-5">
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-base font-semibold text-gray-900 mb-5">Location Information</h2>
                    <div class="space-y-4">
                        <div>
                            <label for="location"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                            <input id="location"
                                   v-model="settings.location"
                                   type="text"
                                   placeholder="e.g., Nairobi, Kenya"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="location_link"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Location Link (Google
                                Maps)</label>
                            <input id="location_link"
                                   v-model="settings.location_link"
                                   type="url"
                                   placeholder="https://maps.google.com/..."
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="google_maps_api_key"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Google Maps API Key</label>
                            <input id="google_maps_api_key"
                                   v-model="settings.google_maps_api_key"
                                   type="password"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="google_analytics_id"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Google Analytics ID
                                (Optional)</label>
                            <input id="google_analytics_id"
                                   v-model="settings.google_analytics_id"
                                   type="text"
                                   placeholder="G-XXXXXXXXXX"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Email Settings Section -->
            <section v-if="activeSection === 'email'"
                     class="space-y-5">
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-base font-semibold text-gray-900 mb-5">SMTP Configuration</h2>
                    <div class="space-y-4">
                        <div>
                            <label for="smtp_host"
                                   class="block text-sm font-semibold text-gray-900 mb-2">SMTP Host</label>
                            <input id="smtp_host"
                                   v-model="settings.smtp_host"
                                   type="text"
                                   placeholder="smtp.gmail.com"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="smtp_port"
                                   class="block text-sm font-semibold text-gray-900 mb-2">SMTP Port</label>
                            <input id="smtp_port"
                                   v-model="settings.smtp_port"
                                   type="number"
                                   placeholder="587"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="smtp_user"
                                   class="block text-sm font-semibold text-gray-900 mb-2">SMTP Username</label>
                            <input id="smtp_user"
                                   v-model="settings.smtp_user"
                                   type="text"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="smtp_password"
                                   class="block text-sm font-semibold text-gray-900 mb-2">SMTP Password</label>
                            <input id="smtp_password"
                                   v-model="settings.smtp_password"
                                   type="password"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div>
                            <label for="default_from_email"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Default From Email</label>
                            <input id="default_from_email"
                                   v-model="settings.default_from_email"
                                   type="email"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- System Settings Section -->
            <section v-if="activeSection === 'system'"
                     class="space-y-5">
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-base font-semibold text-gray-900 mb-5">System Configuration</h2>
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center gap-3">
                                <input id="maintenance_mode"
                                       v-model="settings.maintenance_mode"
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
                                   v-model="settings.items_per_page"
                                   type="number"
                                   min="1"
                                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                        </div>
                        <div class="flex items-center gap-3">
                            <input id="enable_reviews"
                                   v-model="settings.enable_reviews"
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

            <!-- Hero Sliders Section -->
            <section v-if="activeSection === 'sliders'"
                     class="space-y-5">
                <SliderManagement />
            </section>

            <!-- Terms and Policies Section -->
            <section v-if="activeSection === 'policies'"
                     class="space-y-5">
                <div class="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 class="text-base font-semibold text-gray-900 mb-5">Legal Information</h2>
                    <div class="space-y-4">
                        <div>
                            <label for="terms_and_conditions"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Terms and Conditions</label>
                            <textarea id="terms_and_conditions"
                                      v-model="settings.terms_and_conditions"
                                      rows="8"
                                      placeholder="Enter your terms and conditions..."
                                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                        </div>
                        <div>
                            <label for="privacy_policy"
                                   class="block text-sm font-semibold text-gray-900 mb-2">Privacy Policy</label>
                            <textarea id="privacy_policy"
                                      v-model="settings.privacy_policy"
                                      rows="8"
                                      placeholder="Enter your privacy policy..."
                                      class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"></textarea>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Save Button -->
            <div class="mt-8 pt-5 border-t border-gray-200">
                <button @click="saveSettings"
                        class="px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors">
                    Save Changes
                </button>
            </div>
        </main>
    </div>
</template>

<script>
import Appearance from './components/Appearance.vue'
import OrderSettings from './components/OrderSettings.vue'
import PaymentSettings from './components/PaymentSettings.vue'
import SiteInfo from './components/SiteInfo.vue'
import SocialMedia from './components/SocialMedia.vue'
import SliderManagement from './components/SliderManagement.vue'

export default {
    name: 'SettingsPage',
    data() {
        return {
            activeSection: 'site-info',
            sections: [
                { id: 'site-info', label: 'Site Information', icon: 'info-icon' },
                { id: 'appearance', label: 'Appearance', icon: 'palette-icon' },
                { id: 'socials', label: 'Socials', icon: 'share-icon' },
                { id: 'payment', label: 'Payment Settings', icon: 'credit-card-icon' },
                { id: 'order', label: 'Order Settings', icon: 'shopping-cart-icon' },
                { id: 'delivery', label: 'Delivery Settings', icon: 'truck-icon' },
                { id: 'location', label: 'Location Settings', icon: 'map-pin-icon' },
                { id: 'email', label: 'Email Settings', icon: 'mail-icon' },
                { id: 'sliders', label: 'Hero Sliders', icon: 'image-icon' },
                { id: 'system', label: 'System Settings', icon: 'settings-icon' },
                { id: 'policies', label: 'Terms and Policies', icon: 'file-text-icon' }
            ],
            settings: {
                // Site Information
                title: '',
                site_link: '',
                description: '',
                footer_description: '',
                industry: '',
                contact_email: '',
                contact_phone: '',

                // Appearance
                primary_color: '#FF5733',
                secondary_color: '#33C1FF',
                site_icon: null,
                site_logo: null,

                // Social Media
                facebook_url: '',
                twitter_url: '',
                instagram_url: '',
                youtube_url: '',

                // Payment Settings
                currency_code: 'KES',
                currency_symbol: 'Ksh',
                mpesa_paybill_number: '',
                fastduka_orgid: '',
                fastduka_config_id: '',
                fastduka_api_key: '',

                // Order Settings
                default_tax_rate: 16.00,
                minimum_order_amount: 0.00,
                default_delivery_fee: 0.00,
                free_delivery_threshold: null,

                // Delivery Settings
                default_delivery_radius: 10.0,
                estimated_delivery_time_min: 30,
                estimated_delivery_time_max: 60,
                match_user_to_closest_vendor: false,

                // Location Settings
                location: '',
                location_link: '',
                google_maps_api_key: '',
                google_analytics_id: '',

                // Email Settings
                smtp_host: '',
                smtp_port: null,
                smtp_user: '',
                smtp_password: '',
                default_from_email: '',

                // System Settings
                maintenance_mode: false,
                items_per_page: 20,
                enable_reviews: true,

                // Terms and Policies
                terms_and_conditions: '',
                privacy_policy: ''
            }
        }
    },
    computed: {
        currentSectionLabel() {
            const section = this.sections.find(s => s.id === this.activeSection)
            return section ? section.label : ''
        }
    },
    async mounted() {
        await this.loadSettings()
    },
    methods: {
        async loadSettings() {
            try {
                const response = await this.$store.dispatch('fetchList', {
                    url: 'settings/'
                })
                if (response.data) {
                    this.settings = { ...this.settings, ...response.data }
                }
            } catch (error) {
                console.error('Error loading settings:', error)
                this.$message.error('Failed to load settings')
            }
        },
        async saveSettings() {
            try {
                // Exclude file fields from the regular save operation as they are handled separately
                const { site_icon, site_logo, ...settingsToSave } = this.settings

                const response = await this.$store.dispatch('patchData', {
                    url: 'settings',
                    id: this.settings.id || 1,
                    data: settingsToSave
                })

                if (response.data) {
                    this.settings = { ...this.settings, ...response.data }
                    this.$message.success('Settings saved successfully!')
                }
            } catch (error) {
                console.error('Error saving settings:', error)
                this.$message.error('Failed to save settings. Please try again.')
            }
        },
        updateSettings(updatedSettings) {
            this.settings = { ...this.settings, ...updatedSettings }
        }
    },
    components: {
        SiteInfo,
        Appearance,
        SocialMedia,
        PaymentSettings,
        OrderSettings,
        SliderManagement,
        'info-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      `
        },
        'palette-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
        </svg>
      `
        },
        'share-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
      `
        },
        'credit-card-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      `
        },
        'shopping-cart-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      `
        },
        'truck-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      `
        },
        'map-pin-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      `
        },
        'mail-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      `
        },
        'settings-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      `
        },
        'file-text-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      `
        },
        'image-icon': {
            template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
      `
        }
    }
}
</script>