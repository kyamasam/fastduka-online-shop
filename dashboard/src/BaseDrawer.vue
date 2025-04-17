<template>
  <!--  Withdrawal UI-->
  <div class="hidden md:flex">
    <el-drawer
        v-model="open"
        :title="title"
        size="50%"
        rtl
        @close="closeModal"
    >
      <slot/>
    </el-drawer>
  </div>
  <div class="md:hidden">
    <el-drawer
        v-model="open"
        :title="title"
        size="90%"
        ttb
        @close="closeModal"
    >
      <slot/>
    </el-drawer>
  </div>
  <!--  Withdrawal UI-->
</template>

<script setup>
import {ElDrawer} from "element-plus";
import {defineProps, ref} from "vue";
import router from "@/routes";

const open = ref(true);

const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  },
  closeRoute: {
    type: String,
    default: ''
  }
})

const closeModal = () => {
  if (props.closeRoute === '') {
    router.go(-1)
  }else {
    router.push({name: props.closeRoute})
  }

};
</script>

<style scoped></style>
