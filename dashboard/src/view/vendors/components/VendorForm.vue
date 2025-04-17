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
const formRef = ref(null) // Reference to the form

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

const attemptSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      if (route?.name === 'create-vendor'){
        store.dispatch('postData', {
          url: 'vendors',
          data: {
            ...formState.value,
          }
        })
            .catch(()=>{
              submitLoading.value = false;
            })
            .finally(() => {
              submitLoading.value = false;
              router.back();
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
      <!-- Quantity Field -->
      <el-form-item
          :rules="[{ required: true, message: 'Name is required' }]"
          label="Name"
          prop="name"
      >
        <el-input style="width: 100%" v-model="formState.name" class="rounded-none w-full" placeholder="Name"
                         size="large"/>
      </el-form-item>
      <el-form-item
          :rules="[{ required: true, message: 'Location is required' }]"
          label="Location"
          prop="location"
      >
        <el-input style="width: 100%" v-model="formState.location" class="rounded-none w-full" placeholder="location eg Kileleshwa"
                         size="large"/>
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
          <BaseLoader/>
        </template>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>