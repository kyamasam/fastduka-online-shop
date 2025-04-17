<script setup>
import BaseLoader from "@/components/BaseLoader.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import store from "@/vuex/store";

/**
 * Variables
 */
const router = useRouter();
const route = useRoute();
const formState = ref({
  order_id: route.params.orderId,
  rider_id: null,
  delivery_notes: "",
});
const riders = ref([]); // Array to hold riders
const submitLoading = ref(false);
const loadingRiders = ref(false);
const formRef = ref(null); // Reference to the form

/**
 * Validation Rules
 */
const rules = {
  order_id: [{ required: true, message: "Order ID is required", trigger: "blur" }],
  rider_id: [{ required: true, message: "Please select a rider", trigger: "change" }],
  delivery_notes: [{ required: true, message: "Delivery notes are required", trigger: "blur" }],
};

/**
 * Functions
 */

// Fetch riders by vendor_id
const fetchRiders = () => {
  // const vendorId = route.params.vendorId; // Assuming vendor_id is passed in the route params
  // if (!vendorId) return;

  loadingRiders.value = true;
  store
      .dispatch("fetchList", { url: `rider` }) // Adjust endpoint based on your API
      .then((response) => {
        riders.value = response.data?.results || [];
      })
      .catch(() => {
        ElNotification({
          title: "Error",
          message: "Failed to load riders. Please try again.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        loadingRiders.value = false;
      });
};

// Submit form
const attemptSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      store
          .dispatch("postData", {
            url: "order/assign-order-to-rider",
            data: formState.value,
          })
          .then(() => {
            ElNotification({
              title: "Success",
              message: "Rider assigned to the order successfully!",
              type: "success",
              duration: 3000,
            });
            router.push({ name: "orders" }); // Adjust route to navigate back to orders list or relevant page
          })
          .catch(() => {
            ElNotification({
              title: "Error",
              message: "An error occurred while assigning the rider.",
              type: "error",
              duration: 3000,
            });
          })
          .finally(() => {
            submitLoading.value = false;
          });
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
</script>

<template>
  <div>
    <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        label-position="top"
        @submit.native.prevent="attemptSubmit"
    >
      <!-- Rider Dropdown -->
      <el-form-item label="Rider" prop="rider_id">
        <el-select
            v-model="formState.rider_id"
            placeholder="Select a rider"
            @focus="fetchRiders"
            :loading="loadingRiders"
            clearable
            size="large"
        >
          <el-option
              v-for="rider in riders"
              :key="rider.id"
              :label="rider?.user_name"
              :value="rider.id"
          />
        </el-select>
      </el-form-item>

      <!-- Delivery Notes -->
      <el-form-item label="Delivery Notes" prop="delivery_notes">
        <el-input
            v-model="formState.delivery_notes"
            placeholder="Enter delivery notes"
            size="large"
            type="textarea"
        />
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
          Assign Rider
          <template #loading>
            <BaseLoader />
          </template>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>
