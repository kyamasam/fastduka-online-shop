<script setup>
import BaseDialog from "@/components/BaseDialog.vue";
import store from "@/vuex/store";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import BaseLoader from "@/components/BaseLoader.vue";
import { ElNotification } from "element-plus";
import BaseDrawer from "@/BaseDrawer.vue";

/**
 * Variables
 */
const router = useRouter();
const route = useRoute();
const userId = route.params.userId || null; // Get userId from route
const isEditing = !!userId; // Check if editing or creating
const formState = ref({
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  phone_code: "+254",
  phone_number: "",
  email: "",
  user_type: "RIDER",
}); // Form model
const submitLoading = ref(false);
const formRef = ref(null); // Reference to the form

/**
 * Validation Rules
 */
const rules = {
  first_name: [{ required: true, message: "First name is required", trigger: "blur" }],
  last_name: [{ required: true, message: "Last name is required", trigger: "blur" }],
  username: [{ required: true, message: "Username is required", trigger: "blur" }],
  password: [{ required: !isEditing, message: "Password is required", trigger: "blur" }],
  phone_number: [{ required: true, message: "Phone number is required", trigger: "blur" }],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Please enter a valid email address", trigger: "blur" },
  ],
};

/**
 * Functions
 */

// Load user data if editing
const loadUserData = async () => {
  if (isEditing) {
    try {
      const { data } = await store.dispatch("fetchSingleItem", {
        url: "users",
        id: userId,
      });
      Object.assign(formState.value, data); // Populate form
    } catch (error) {
      ElNotification({
        title: "Error",
        message: "Failed to load user data.",
        type: "error",
        duration: 3000,
      });
    }
  }
};

// Handle form submission
const attemptSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;

      try {
        if (isEditing) {
          // Update user
          delete formState.value?.password
          await store.dispatch("patchData", {
            url: "users",
            id: userId,
            data: formState.value,
          });
          ElNotification({
            title: "Success",
            message: "User updated successfully!",
            type: "success",
            duration: 3000,
          });
        } else {
          // Create user
          await store.dispatch("postData", {
            url: "users",
            data: formState.value,
          });
          ElNotification({
            title: "Success",
            message: "User created successfully!",
            type: "success",
            duration: 3000,
          });
        }

        router.push({ name: "users" }); // Navigate to users list
      } catch {
        ElNotification({
          title: "Error",
          message: "An error occurred during submission.",
          type: "error",
          duration: 3000,
        });
      } finally {
        submitLoading.value = false;
      }
    } else {
      ElNotification({
        title: "Validation Error",
        message: "Please fill out all required fields.",
        type: "error",
        duration: 3000,
      });
    }
  });
};

/**
 * Lifecycle Hooks
 */
onMounted(loadUserData);
</script>
<template>
  <BaseDrawer :title="isEditing ? 'Edit User' : 'Create User'">
    <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        label-position="top"
        @submit.native.prevent="attemptSubmit"
    >
      <!-- First Name -->
      <el-form-item label="First Name" prop="first_name">
        <el-input v-model="formState.first_name" placeholder="Enter first name" size="large" />
      </el-form-item>

      <!-- Last Name -->
      <el-form-item label="Last Name" prop="last_name">
        <el-input v-model="formState.last_name" placeholder="Enter last name" size="large" />
      </el-form-item>

      <!-- Username -->
      <el-form-item label="Username" prop="username">
        <el-input v-model="formState.username" placeholder="Enter username" size="large" />
      </el-form-item>

      <!-- UserType -->
      <el-form-item label="User Type" prop="user_type">
        <el-select v-model="formState.user_type" placeholder="Select Usertype" size="large">
          <el-option value="RIDER">RIDER</el-option>
          <el-option value="CUSTOMER">CUSTOMER</el-option>
          <el-option value="BUSINESS_OWNER">BUSINESS_OWNER</el-option>
          <el-option value="BUSINESS_MANAGER">BUSINESS_MANAGER</el-option>
        </el-select>
      </el-form-item>

      <!-- Password -->
      <el-form-item v-if="!isEditing" label="Password" prop="password">
        <el-input
            v-model="formState.password"
            placeholder="Enter password"
            size="large"
            type="password"
        />
      </el-form-item>

      <!-- Phone Code -->
      <el-form-item label="Phone Code">
        <el-input v-model="formState.phone_code" placeholder="Enter phone code" size="large" />
      </el-form-item>

      <!-- Phone Number -->
      <el-form-item label="Phone Number" prop="phone_number">
        <el-input v-model="formState.phone_number" placeholder="Enter phone number" size="large" />
      </el-form-item>

      <!-- Email -->
      <el-form-item label="Email" prop="email">
        <el-input v-model="formState.email" placeholder="Enter email" size="large" />
      </el-form-item>

      <!-- Submit Button -->
      <el-form-item class="col-span-2">
        <el-button
            :loading="submitLoading"
            class="w-full bg-blue-400 border-none hover:bg-blue-500 focus:bg-blue-500 rounded-none p-0 my-6 text-sm font-medium"
            size="large"
            type="primary"
            @click="attemptSubmit"
        >
          {{ isEditing ? "Update" : "Submit" }}
          <template #loading>
            <BaseLoader />
          </template>
        </el-button>
      </el-form-item>
    </el-form>
  </BaseDrawer>
</template>
