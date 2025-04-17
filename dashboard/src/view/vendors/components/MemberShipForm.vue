<script setup>
import BaseDialog from "@/components/BaseDialog.vue";
import store from "@/vuex/store";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import BaseLoader from "@/components/BaseLoader.vue";
import { ElNotification } from "element-plus";

/**
 * Variables
 */
const route = useRoute();
const router = useRouter();
const vendorObject = ref({});
const formState = ref({
  user_id: null,
  role: null,
  selectBy: false,
  user_email: '',
});
const submitLoading = ref(false);
const userLoader = ref(false);
const userList = ref([]);
const formRef = ref(null);
const userName = ref('');

/**
 * Validation Rules
 */
const rules = {
  user: [{ required: true, message: "User is required", trigger: "blur" }],
  role: [{ required: true, message: "Role is required", trigger: "blur" }],
};

/**
 * Functions
 */
const fetchProduct = () => {
  if (route?.name === "edit-vendor") {
    store
        .dispatch("fetchSingleItem", { url: "vendors", id: route?.params.vendorId })
        .then((res) => {
          formState.value = res?.data;
          // Ensure the selected user is correctly bound
          const selectedUser = userList.value.find((u) => u.id === formState.value.user?.id);
          if (selectedUser) formState.value.user = selectedUser;
        });
  }
};

const fetchUsers = () => {
  userLoader.value = true;
  store
      .dispatch("fetchList", { url: "users" })
      .then((res) => {
        userList.value = res?.data?.results;
        userLoader.value = false;
      })
      .catch((err) => {
        userLoader.value = false;
      });
};

const getUserName = (userId) =>{
  const result = userList.value.find((u) => u.id === userId);
  return result?.first_name + "  " + result?.last_name + "  " + result?.email;
}

const attemptSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      let payload = {...formState.value};
      if (formState.value.selectBy ) {
        delete formState.value.user_id;
        console.log('true', formState.value);
      }else {
        // payload['user_email'] = formState.value.user_email;
        delete formState.value.user_email;

        console.log('false', formState.value);
      }

      if (route?.name === "add-members") {
        store
            .dispatch("postData", {
              url: `vendors/${route?.params.vendorId}/manage_member`,
              data: {
                ...formState.value,
              },
            })
            .catch(() => {
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
              router.back();
            });
      }
      if (route?.name === "edit-vendor") {
        store
            .dispatch("patchData", {
              url: "vendors",
              data: {
                ...formState.value,
              },
              id: route?.params.vendorId,
            })
            .catch(() => {
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
              router.back();
            });
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
 * Hooks
 */
onMounted(() => {
  fetchUsers();
  fetchProduct();
});
</script>

<template>
  <el-form
      ref="formRef"
      :model="formState"
      class="w-full flex flex-col gap-4"
      label-position="top"
      @submit.native.prevent="attemptSubmit"
  >
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <el-form-item
          :rules="[{ required: true, message: 'User is required' }]"
          label="Select By"
          prop="selectBy"
      >
        <el-switch size="large" active-text="By Email" inactive-text="By Search" v-model="formState.selectBy"/>
      </el-form-item>
      <!-- User Field -->
      <el-form-item
          v-if="!formState.selectBy"
          :rules="[{ required: true, message: 'User is required' }]"
          label="User"
          prop="user_id"
      >
        <el-select
            @focus="fetchUsers"
            :loading="userLoader"
            size="large"
            v-model="formState.user_id"
            clearable
            placeholder="Select User"
        >
          <el-option
              v-for="user in userList"
              :key="user.id"
              :value="user.id"
              :label="getUserName(user?.id)"
          />
        </el-select>
      </el-form-item>

      <el-form-item
          v-if="formState.selectBy"
          :rules="[{ required: true, message: 'Email required' , type: 'email' }]"
          label="Email"
          prop="user_email"
      >
        <el-input placeholder="email" size="large" v-model="formState.user_email" />
      </el-form-item>

      <!-- Role Field -->
      <el-form-item
          :rules="[{ required: true, message: 'Role is required' }]"
          label="Role"
          prop="role"
      >
        <el-select size="large" v-model="formState.role" clearable placeholder="Select Role">
          <el-option value="ADMIN">Admin</el-option>
          <el-option value="EDITOR">Editor</el-option>
        </el-select>
      </el-form-item>
    </div>

    <!-- Submit Button -->
    <el-form-item class="md:col-span-2">
      <el-button
          :loading="submitLoading"
          class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
          size="large"
          type="primary"
          @click="attemptSubmit"
      >
        Submit
        <template #loading>
          <BaseLoader />
        </template>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
