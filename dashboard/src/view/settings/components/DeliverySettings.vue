<template>
  <section class="space-y-5">
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-base font-semibold text-gray-900 mb-5">Delivery Configuration</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Location selection</label>
          <select :value="settings.delivery_location_type"
                  @change="updateSetting('delivery_location_type', $event.target.value)"
                  class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg">
            <option value="map">Map selector</option>
            <option value="predefined">Predefined cities and locations</option>
          </select>
        </div>

        <div v-if="settings.delivery_location_type === 'map'" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Default delivery fee</label>
            <input :value="settings.default_delivery_fee"
                   @input="updateSetting('default_delivery_fee', $event.target.value)"
                   type="number" min="0" step="0.01"
                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Default delivery radius (km)</label>
            <input :value="settings.default_delivery_radius"
                   @input="updateSetting('default_delivery_radius', $event.target.value)"
                   type="number" min="0.1" step="0.1"
                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Min delivery time (minutes)</label>
            <input :value="settings.estimated_delivery_time_min"
                   @input="updateSetting('estimated_delivery_time_min', $event.target.value)"
                   type="number" min="0"
                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Max delivery time (minutes)</label>
            <input :value="settings.estimated_delivery_time_max"
                   @input="updateSetting('estimated_delivery_time_max', $event.target.value)"
                   type="number" min="0"
                   class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg" />
          </div>
        </div>
        <label class="flex items-center gap-3 text-sm font-medium text-gray-900">
          <input :checked="settings.match_user_to_closest_vendor"
                 @change="updateSetting('match_user_to_closest_vendor', $event.target.checked)"
                 type="checkbox" class="w-4 h-4" />
          Match users to the closest vendor automatically
        </label>
      </div>
    </div>

    <div v-if="settings.delivery_location_type === 'predefined'"
         class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-base font-semibold text-gray-900">Predefined locations</h2>
          <p class="text-xs text-gray-600 mt-1">Location coordinates take priority over city coordinates for vendor matching.</p>
        </div>
        <div class="flex gap-2">
          <button @click="seedKenya" :disabled="seeding" type="button"
                  class="px-4 py-2 border border-blue-600 text-blue-600 text-sm rounded-lg disabled:opacity-50">
            {{ seeding ? 'Seeding…' : 'Seed Kenya' }}
          </button>
          <button @click="startCity()" type="button"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">Add city</button>
        </div>
      </div>

      <div v-if="cityForm" class="border rounded-lg p-4 mb-5 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input v-model="cityForm.name" placeholder="City name" class="px-3 py-2 border rounded-lg" />
          <input v-model="cityForm.latitude" type="number" step="any" placeholder="Latitude" class="px-3 py-2 border rounded-lg" />
          <input v-model="cityForm.longitude" type="number" step="any" placeholder="Longitude" class="px-3 py-2 border rounded-lg" />
          <input v-model="cityForm.display_order" type="number" min="0" placeholder="Order" class="px-3 py-2 border rounded-lg" />
        </div>
        <div class="flex gap-2 mt-3">
          <button @click="saveCity" type="button" class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Save city</button>
          <button @click="cityForm = null" type="button" class="px-4 py-2 border text-sm rounded-lg">Cancel</button>
        </div>
      </div>

      <p v-if="loading" class="text-sm text-gray-600">Loading locations…</p>
      <p v-else-if="!cities.length" class="text-sm text-gray-600 py-6 text-center">No cities configured yet.</p>

      <div v-for="city in cities" :key="city.id" class="border rounded-lg mb-4 overflow-hidden">
        <div class="p-4 bg-gray-50 flex items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-gray-900">{{ city.name }}</h3>
            <p class="text-xs text-gray-600">{{ city.latitude || 'No latitude' }}, {{ city.longitude || 'No longitude' }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="startLocation(city)" type="button" class="text-sm text-blue-600">Add location</button>
            <button @click="startCity(city)" type="button" class="text-sm text-gray-700">Edit</button>
            <button @click="removeCity(city)" type="button" class="text-sm text-red-600">Delete</button>
          </div>
        </div>

        <div v-if="locationForm && locationForm.city === city.id" class="p-4 border-b bg-blue-50">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input v-model="locationForm.name" placeholder="Location name" class="px-3 py-2 border rounded-lg" />
            <input v-model="locationForm.delivery_fee" type="number" min="0" step="0.01" placeholder="Delivery fee" class="px-3 py-2 border rounded-lg" />
            <input v-model="locationForm.latitude" type="number" step="any" placeholder="Latitude (optional)" class="px-3 py-2 border rounded-lg" />
            <input v-model="locationForm.longitude" type="number" step="any" placeholder="Longitude (optional)" class="px-3 py-2 border rounded-lg" />
            <input v-model="locationForm.display_order" type="number" min="0" placeholder="Order" class="px-3 py-2 border rounded-lg" />
          </div>
          <div class="flex gap-2 mt-3">
            <button @click="saveLocation" type="button" class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Save location</button>
            <button @click="locationForm = null" type="button" class="px-4 py-2 border text-sm rounded-lg">Cancel</button>
          </div>
        </div>

        <div v-if="!city.locations.length" class="p-4 text-sm text-gray-500">No locations in this city.</div>
        <div v-for="location in city.locations" :key="location.id"
             class="p-4 border-t flex items-center justify-between gap-3">
          <div>
            <span class="font-medium">{{ location.name }}</span>
            <span class="ml-3 text-sm text-green-700">{{ settings.currency_symbol }} {{ location.delivery_fee }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="startLocation(city, location)" type="button" class="text-sm text-gray-700">Edit</button>
            <button @click="removeLocation(location)" type="button" class="text-sm text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'DeliverySettings',
  props: { settings: { type: Object, required: true } },
  data() {
    return { cities: [], loading: false, seeding: false, cityForm: null, locationForm: null }
  },
  mounted() { this.loadCities() },
  methods: {
    updateSetting(key, value) {
      this.$emit('update:settings', { ...this.settings, [key]: value })
      if (key === 'delivery_location_type' && value === 'predefined') this.loadCities()
    },
    normalizeNumber(value) { return value === '' || value === null ? null : Number(value) },
    async loadCities() {
      this.loading = true
      try {
        const response = await this.$store.dispatch('fetchList', { url: 'delivery-cities/' })
        this.cities = response.data.results || response.data || []
      } finally { this.loading = false }
    },
    async seedKenya() {
      if (!window.confirm('Add all 47 Kenyan counties and their delivery locations? Existing fees will not be changed.')) return
      this.seeding = true
      try {
        await this.$store.dispatch('postData', {
          url: 'delivery-cities/seed-kenya',
          data: {}
        })
        await this.loadCities()
      } finally { this.seeding = false }
    },
    startCity(city = null) {
      this.cityForm = city ? { ...city } : { name: '', latitude: '', longitude: '', display_order: 0, is_active: true }
    },
    async saveCity() {
      const data = { ...this.cityForm, latitude: this.normalizeNumber(this.cityForm.latitude), longitude: this.normalizeNumber(this.cityForm.longitude) }
      if (data.id) await this.$store.dispatch('patchData', { url: 'delivery-cities', id: data.id, data })
      else await this.$store.dispatch('postData', { url: 'delivery-cities', data })
      this.cityForm = null
      await this.loadCities()
    },
    async removeCity(city) {
      if (!window.confirm(`Delete ${city.name} and all its locations?`)) return
      await this.$store.dispatch('deleteData', { url: 'delivery-cities', id: city.id })
      await this.loadCities()
    },
    startLocation(city, location = null) {
      this.locationForm = location
        ? { ...location, city: city.id }
        : { city: city.id, name: '', delivery_fee: '', latitude: '', longitude: '', display_order: 0, is_active: true }
    },
    async saveLocation() {
      const data = { ...this.locationForm, latitude: this.normalizeNumber(this.locationForm.latitude), longitude: this.normalizeNumber(this.locationForm.longitude) }
      if (data.id) await this.$store.dispatch('patchData', { url: 'delivery-locations', id: data.id, data })
      else await this.$store.dispatch('postData', { url: 'delivery-locations', data })
      this.locationForm = null
      await this.loadCities()
    },
    async removeLocation(location) {
      if (!window.confirm(`Delete ${location.name}?`)) return
      await this.$store.dispatch('deleteData', { url: 'delivery-locations', id: location.id })
      await this.loadCities()
    }
  }
}
</script>
