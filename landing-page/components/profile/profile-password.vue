<template>
  <div class="profile__password">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-xxl-12">
          <div class="tp-profile-input-box">
            <div class="tp-contact-input">
              <input
                v-model="formData.current_password"
                name="old_pass"
                id="old_pass"
                type="password"
                required
              />
            </div>
            <div class="tp-profile-input-title">
              <label for="old_pass">Old Password</label>
            </div>
          </div>
        </div>
        <div class="col-xxl-6 col-md-6">
          <div class="tp-profile-input-box">
            <div class="tp-profile-input">
              <input
                v-model="formData.new_password"
                name="new_pass"
                id="new_pass"
                type="password"
                required
              />
            </div>
            <div class="tp-profile-input-title">
              <label for="new_pass">New Password</label>
            </div>
          </div>
        </div>
        <div class="col-xxl-6 col-md-6">
          <div class="tp-profile-input-box">
            <div class="tp-profile-input">
              <input
                v-model="confirmPassword"
                name="con_new_pass"
                id="con_new_pass"
                type="password"
                required
              />
            </div>
            <div class="tp-profile-input-title">
              <label for="con_new_pass">Confirm Password</label>
            </div>
          </div>
        </div>
        <div class="col-xxl-6 col-md-6">
          <div class="profile__btn">
            <button type="submit" class="tp-btn" :disabled="isLoading">
              {{ isLoading ? "Updating..." : "Update" }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";

const isLoading = ref(false);
const confirmPassword = ref("");

const formData = reactive({
  current_password: "",
  new_password: "",
});

const handleSubmit = async () => {
  try {
    // Only validate passwords match
    if (formData.new_password !== confirmPassword.value) {
      toast.error("New passwords don't match");
      return;
    }

    isLoading.value = true;

    const { data, error } = await getData("/users/change-password/", {
      method: "POST",
      body: formData,
    });

    if (error.value) {
      throw error.value;
    }

    // Success
    toast.success("Password updated successfully");

    // Reset form
    formData.current_password = "";
    formData.new_password = "";
    confirmPassword.value = "";
  } catch (error) {
    console.error("Change password error:", error);
    toast.error(error?.data?.msg || "Failed to update password");
  } finally {
    isLoading.value = false;
  }
};
</script>
