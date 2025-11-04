<template>
    <div class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Brand Colors</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="primary_color"
                           class="block text-sm font-semibold text-gray-900 mb-2">Primary Color</label>
                    <div class="flex gap-2">
                        <input id="primary_color"
                               v-model="localSettings.primary_color"
                               @input="updateSettings"
                               type="color"
                               class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer" />
                        <input v-model="localSettings.primary_color"
                               @input="updateSettings"
                               type="text"
                               placeholder="#FF5733"
                               class="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    </div>
                </div>
                <div>
                    <label for="secondary_color"
                           class="block text-sm font-semibold text-gray-900 mb-2">Secondary Color</label>
                    <div class="flex gap-2">
                        <input id="secondary_color"
                               v-model="localSettings.secondary_color"
                               @input="updateSettings"
                               type="color"
                               class="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer" />
                        <input v-model="localSettings.secondary_color"
                               @input="updateSettings"
                               type="text"
                               placeholder="#33C1FF"
                               class="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-5">Branding Assets</h2>
            <div class="space-y-4">
                <div>
                    <label for="site_logo"
                           class="block text-sm font-semibold text-gray-900 mb-2">Site Logo</label>
                    <input id="site_logo"
                           type="file"
                           accept="image/*"
                           @change="handleFileUpload($event, 'site_logo')"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    <p class="mt-1.5 text-xs text-gray-600">Recommended size: 200x60px</p>
                    <div v-if="localSettings.site_logo" class="mt-2">
                        <img :src="getImageUrl(localSettings.site_logo)" alt="Site Logo" class="h-16 object-contain" />
                    </div>
                </div>
                <div>
                    <label for="site_icon"
                           class="block text-sm font-semibold text-gray-900 mb-2">Site Icon (Favicon)</label>
                    <input id="site_icon"
                           type="file"
                           accept="image/*"
                           @change="handleFileUpload($event, 'site_icon')"
                           class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
                    <p class="mt-1.5 text-xs text-gray-600">Recommended size: 32x32px or 64x64px</p>
                    <div v-if="localSettings.site_icon" class="mt-2">
                        <img :src="getImageUrl(localSettings.site_icon)" alt="Site Icon" class="h-8 w-8 object-contain" />
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="logo_size_desktop"
                               class="block text-sm font-semibold text-gray-900 mb-2">Logo Size - Desktop</label>
                        <input id="logo_size_desktop"
                               v-model="localSettings.logo_size_desktop"
                               @input="validateAndUpdateSettings('logo_size_desktop')"
                               type="text"
                               placeholder="64,64"
                               class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                               :class="{ 'border-red-500': logoSizeErrors.desktop }" />
                        <p class="mt-1.5 text-xs text-gray-600">Format: width,height in pixels (e.g., 64,64)</p>
                        <p v-if="logoSizeErrors.desktop" class="mt-1 text-xs text-red-600">{{ logoSizeErrors.desktop }}</p>
                    </div>
                    <div>
                        <label for="logo_size_mobile"
                               class="block text-sm font-semibold text-gray-900 mb-2">Logo Size - Mobile</label>
                        <input id="logo_size_mobile"
                               v-model="localSettings.logo_size_mobile"
                               @input="validateAndUpdateSettings('logo_size_mobile')"
                               type="text"
                               placeholder="48,48"
                               class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                               :class="{ 'border-red-500': logoSizeErrors.mobile }" />
                        <p class="mt-1.5 text-xs text-gray-600">Format: width,height in pixels (e.g., 48,48)</p>
                        <p v-if="logoSizeErrors.mobile" class="mt-1 text-xs text-red-600">{{ logoSizeErrors.mobile }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Appearance',
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            localSettings: { ...this.settings },
            logoSizeErrors: {
                desktop: '',
                mobile: ''
            }
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
        },
        validateLogoSize(value) {
            if (!value) return 'This field is required'

            const pattern = /^\d+,\d+$/
            if (!pattern.test(value)) {
                return 'Format must be: width,height (e.g., 64,64)'
            }

            const [width, height] = value.split(',').map(v => parseInt(v.trim()))

            if (width < 10 || width > 500) {
                return 'Width must be between 10 and 500 pixels'
            }

            if (height < 10 || height > 500) {
                return 'Height must be between 10 and 500 pixels'
            }

            return ''
        },
        validateAndUpdateSettings(field) {
            const value = this.localSettings[field]
            const errorKey = field === 'logo_size_desktop' ? 'desktop' : 'mobile'

            this.logoSizeErrors[errorKey] = this.validateLogoSize(value)

            // Only update if validation passes
            if (!this.logoSizeErrors[errorKey]) {
                this.updateSettings()
            }
        },
        async handleFileUpload(event, field) {
            const file = event.target.files[0]
            if (file) {
                try {
                    const formData = new FormData()
                    formData.append(field, file)

                    const endpoint = field === 'site_logo' ? 'upload_site_logo' : 'upload_site_icon'
                    const response = await this.$store.dispatch('upload', {
                        url: `settings/${endpoint}/`,
                        data: formData
                    })

                    if (response.data) {
                        this.localSettings[field] = response.data[field]
                        this.updateSettings()
                        this.$message.success(`${field.replace('_', ' ')} uploaded successfully`)
                    }
                } catch (error) {
                    console.error(`Error uploading ${field}:`, error)
                    this.$message.error(`Failed to upload ${field.replace('_', ' ')}`)
                }
            }
        },
        getImageUrl(imagePath) {
            if (!imagePath) return ''
            if (imagePath.startsWith('http')) return imagePath
            return `${process.env.VUE_APP_API_BASE_URL || ''}${imagePath}`
        }
    }
}
</script>