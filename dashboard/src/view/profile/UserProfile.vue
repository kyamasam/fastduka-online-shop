<template>
  <div class="w-full  mx-auto p-4 bg-white">
    <div class="flex items-center space-x-6">
      <!-- Avatar and User Info -->
      <div class="flex-shrink-0">
        <!-- If profile photo exists, show it; otherwise, show default image -->
        <img
            :src="user.profile.profile_photo || '/default-avatar.png'"
            alt="User Avatar"
            class="w-24 h-24 rounded-full object-cover"
        />
      </div>

      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ fullName }}</h2>
        <p class="text-sm text-gray-600">@{{ user.username || 'No username' }}</p>
        <p class="text-sm text-gray-500 mt-1">Phone: {{ formattedPhoneNumber }}</p>
        <p class="text-sm text-gray-500 mt-1">Email: {{ user.email }}</p>
        <p class="text-sm text-gray-500 mt-1">Address: {{ user.profile.address }}</p>
        <p class="mt-2 text-sm text-gray-700">{{ user.profile.description || 'No description available' }}</p>

        <div class="mt-4 flex space-x-4">
          <button class="bg-red-500 text-white w-full flex items-center justify-center gap-2 px-4 py-2 text-sm hover:bg-red-600">
            Edit

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Information Section -->
    <div class="mt-8 bg-white shadow-sm rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800">Information</h3>
      <div class="mt-4 space-y-4">
        <p class="text-sm text-gray-600"><strong>Suite Number:</strong> {{ user.profile.suite_number }}</p>
        <p class="text-sm text-gray-600"><strong>Email:</strong> <span class="text-gray-800">{{ user.email }}</span></p>
        <p class="text-sm text-gray-600"><strong>Phone:</strong> <span class="text-gray-800">{{ formattedPhoneNumber }}</span></p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import store from "@/vuex/store";

const user = ref({
  id: null,
  first_name: "",
  last_name: "",
  username: null,
  email: "",
  phone_code: "",
  phone_number: "",
  profile: {
    suite_number: "",
    address: "",
    profile_photo: null,
    description: "",
  },
});

// Computed property for full name
const fullName = computed(() => `${user.value.first_name} ${user.value.last_name}`);

// Computed property for formatted phone number
const formattedPhoneNumber = computed(() => `${user.value.phone_code}${user.value.phone_number}`);

// Fetch User Data
const getUserData =  () => {
  store.dispatch("fetchList", {url:'users/get-current-user'}).then(response => {
    user.value = response.data;
  })
      .catch(error => {
        console.error("Failed to fetch user data", error);
      })
  ;
};

// Fetch user data on mounted
onMounted(() => {
  getUserData();
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
