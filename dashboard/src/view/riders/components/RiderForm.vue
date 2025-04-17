<script setup>

import BaseDialog from "@/components/BaseDialog.vue";
import store from "@/vuex/store";
import {useRoute,useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import BaseLoader from "@/components/BaseLoader.vue";
import {ElNotification} from "element-plus";

/**
 * Variables
 */
const route = useRoute()
const router = useRouter()
const vendorObject = ref({})
const formState = ref({})
const submitLoading = ref(false)
const userLoader = ref(false)
const vendorLoader = ref(false)
const userList = ref([])
const vendorList = ref([])
const formRef = ref(null)

/**
 * Validation Rules
 */
const rules = {
  quantity: [{ required: true, message: 'Quantity is required', trigger: 'blur' }]
};


/**
 * Functions
 */
const fetchProduct = () => {
  if (route?.name === 'edit-vendor'){
    store.dispatch('fetchSingleItem', {url:'vendors', id:route?.params.vendorId})
        .then(res => {
          formState.value = res?.data;
        });
  }
}

const fetchUsers = () => {
  userLoader.value = true;
  store.dispatch('fetchList', {url:'users'})
      .then(res => {
        userList.value = res?.data?.results;
        userLoader.value = false;
      })
      .catch(err => {
        userLoader.value = false;
      });
}

const fetchVendors = () => {
  vendorLoader.value = true;
  store.dispatch('fetchList', {url:'vendors'})
      .then(res => {
        vendorList.value = res?.data?.results;
        vendorLoader.value = false;
      })
      .catch(err => {
        vendorLoader.value = false;
      });
}

const attemptSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;

      let payload = {
        user : formState.value.user?.id,
        vendor:route?.params.vendorId,
      }

      if (route?.name === 'mini-register-rider'){
        store.dispatch('postData', {
          url: `rider`,
          data: {...payload, vendor: formState.value.vendor?.id}
        })
            .catch(()=>{
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
            });
      }
      if (route?.name === 'register-rider'){
        store.dispatch('postData', {
          url: `rider`,
          data: payload
        })
            .catch(()=>{
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
            });
      }
      if (route?.name === 'edit-vendor') {
        store.dispatch('patchData', {
          url: 'vendors',
          data: {
            ...formState.value,
          },
          id : route?.params.vendorId
        })
            .catch(()=>{
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
              router.back();
            });
      }
    } else {
      ElNotification({
        title: 'Validation Error',
        message: 'Please fill out all required fields.',
        type: 'error',
        duration: 3000
      });
    }
  });
}

/**
 * Hooks
 */
onMounted(()=>{
  fetchProduct();
})

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
      <!-- User Field -->
      <el-form-item
          :rules="[{ required: true, message: 'User is required' }]"
          label="User"
          prop="user"
      >
        <el-select
            @focus="fetchUsers"
            :loading="userLoader"
            size="large"
            style="width: 100%"
            v-model="formState.user"
            clearable
            placeholder="Select a User"
            value-key="id"
        >
        <el-option
            v-for="user in userList"
            :key="user.id"
            :value="user"
            :label="user?.first_name ? `${user.first_name || ''} ${user.last_name || ''}`: user?.username"
        />
        </el-select>
      </el-form-item>

      <!-- Vendor Field -->
      <el-form-item
          v-if="route?.name === 'register-rider'"
          :rules="[{ required: true, message: 'Vendor is required' }]"
          label="Vendor"
          prop="vendor"
      >
        <el-select
            @focus="fetchVendors"
            :loading="vendorLoader"
            size="large"
            style="width: 100%"
            v-model="formState.vendor"
            clearable
            placeholder="Select a Vendor"
            value-key="id"
        >
          <el-option
              v-for="vendor in vendorList"
              :key="vendor"
              :value="vendor"
              :label="vendor?.name"
          />
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
        Register Rider
        <template #loading>
          <BaseLoader/>
        </template>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>