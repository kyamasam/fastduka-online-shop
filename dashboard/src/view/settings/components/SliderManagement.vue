<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Hero Sliders</h2>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            class="w-4 h-4 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add New Slider
        </button>
      </div>
      <p class="text-sm text-gray-600">
        Manage your website's hero sliders. These images will be displayed prominently on your homepage.
      </p>
    </div>

    <!-- Sliders List -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-sm text-gray-600">Loading sliders...</p>
      </div>

      <div v-else-if="sliders.length === 0" class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No sliders</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new hero slider.</p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Slider
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="slider in sliders"
          :key="slider.id"
          class="border border-gray-200 rounded-lg overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-center space-x-4">
              <!-- Image preview -->
              <div class="flex-shrink-0">
                <div
                  v-if="slider.background_image_url || slider.background_image"
                  class="w-20 h-12 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    :src="slider.background_image_url || slider.background_image"
                    :alt="slider.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="w-20 h-12 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Slider info -->
              <div class="flex-grow">
                <h3 class="text-lg font-medium text-gray-900">{{ slider.title }}</h3>
                <p v-if="slider.subtitle" class="text-sm text-gray-600">{{ slider.subtitle }}</p>
                <p v-if="slider.description" class="text-sm text-gray-500 mt-1">{{ slider.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="text-xs text-gray-500">Order: {{ slider.order }}</span>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      slider.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ slider.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex-shrink-0 flex space-x-2">
                <button
                  @click="editSlider(slider)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit slider"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(slider)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete slider"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showAddModal ? 'Add New Slider' : 'Edit Slider' }}
          </h3>

          <form @submit.prevent="saveSlider" class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                v-model="sliderForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Subtitle -->
            <div>
              <label for="subtitle" class="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                id="subtitle"
                v-model="sliderForm.subtitle"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="sliderForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Background Image -->
            <div>
              <label for="background_image" class="block text-sm font-medium text-gray-700 mb-1">
                Background Image
              </label>
              <input
                id="background_image"
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="imagePreview" class="mt-2">
                <img :src="imagePreview" alt="Preview" class="w-32 h-20 object-cover rounded-md" />
              </div>
            </div>

            <!-- Button Text -->
            <div>
              <label for="button_text" class="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                id="button_text"
                v-model="sliderForm.button_text"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Button Link -->
            <div>
              <label for="button_link" class="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                id="button_link"
                v-model="sliderForm.button_link"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Order and Active Status -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="order" class="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  id="order"
                  v-model.number="sliderForm.order"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="flex items-center">
                <input
                  id="is_active"
                  v-model="sliderForm.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="is_active" class="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : showAddModal ? 'Add Slider' : 'Update Slider' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showDeleteModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              class="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">Delete Slider</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete "{{ sliderToDelete?.title }}"? This action cannot be undone.
            </p>
          </div>
          <div class="flex justify-center space-x-3 px-4 py-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              @click="deleteSlider"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white border border-transparent rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SliderManagement',
  data() {
    return {
      sliders: [],
      loading: false,
      saving: false,
      deleting: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      sliderToDelete: null,
      editingSlider: null,
      imageFile: null,
      imagePreview: null,
      sliderForm: {
        title: '',
        subtitle: '',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        order: 0,
        is_active: true
      }
    }
  },
  async mounted() {
    await this.fetchSliders()
  },
  methods: {
    async fetchSliders() {
      this.loading = true
      try {
        const response = await this.$store.dispatch('fetchList', {
          url: 'hero-sliders'
        })
        this.sliders = response?.data?.results || response?.data || []
      } catch (error) {
        console.error('Error fetching sliders:', error)
        this.$message.error('Failed to fetch sliders')
      } finally {
        this.loading = false
      }
    },

    async saveSlider() {
      this.saving = true
      try {
        let response
        const formData = new FormData()

        // Add form fields to FormData
        Object.keys(this.sliderForm).forEach(key => {
          if (this.sliderForm[key] !== null && this.sliderForm[key] !== undefined) {
            formData.append(key, this.sliderForm[key])
          }
        })

        if (this.showAddModal) {
          // Create new slider
          response = await this.$store.dispatch('postData', {
            url: 'hero-sliders',
            data: this.sliderForm
          })

          // If there's an image, upload it
          if (this.imageFile && response.data) {
            await this.uploadSliderImage(response.data.id, this.imageFile)
          }
        } else {
          // Update existing slider
          response = await this.$store.dispatch('patchData', {
            url: 'hero-sliders',
            id: this.editingSlider.id,
            data: this.sliderForm
          })

          // If there's a new image, upload it
          if (this.imageFile && this.editingSlider) {
            await this.uploadSliderImage(this.editingSlider.id, this.imageFile)
          }
        }

        this.$message.success(
          this.showAddModal ? 'Slider created successfully!' : 'Slider updated successfully!'
        )

        this.closeModal()
        await this.fetchSliders()
      } catch (error) {
        console.error('Error saving slider:', error)
        this.$message.error('Failed to save slider. Please try again.')
      } finally {
        this.saving = false
      }
    },

    async uploadSliderImage(sliderId, file) {
      const formData = new FormData()
      formData.append('background_image', file)

      await this.$store.dispatch('upload', {
        url: `hero-sliders/${sliderId}/upload_image/`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    editSlider(slider) {
      this.editingSlider = slider
      this.sliderForm = {
        title: slider.title || '',
        subtitle: slider.subtitle || '',
        description: slider.description || '',
        button_text: slider.button_text || 'Shop Now',
        button_link: slider.button_link || '/shop',
        order: slider.order || 0,
        is_active: slider.is_active
      }
      this.imagePreview = slider.background_image_url || slider.background_image || null
      this.showEditModal = true
    },

    confirmDelete(slider) {
      this.sliderToDelete = slider
      this.showDeleteModal = true
    },

    async deleteSlider() {
      if (!this.sliderToDelete) return

      this.deleting = true
      try {
        await this.$store.dispatch('deleteData', {
          url: 'hero-sliders',
          id: this.sliderToDelete.id
        })

        this.$message.success('Slider deleted successfully!')
        this.showDeleteModal = false
        this.sliderToDelete = null
        await this.fetchSliders()
      } catch (error) {
        console.error('Error deleting slider:', error)
        this.$message.error('Failed to delete slider. Please try again.')
      } finally {
        this.deleting = false
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFile = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.editingSlider = null
      this.imageFile = null
      this.imagePreview = null
      this.sliderForm = {
        title: '',
        subtitle: '',
        description: '',
        button_text: 'Shop Now',
        button_link: '/shop',
        order: 0,
        is_active: true
      }
    }
  }
}
</script>