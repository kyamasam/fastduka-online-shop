<template>
  <!--  Withdrawal UI-->
  <div>
    <el-dialog
        v-model="open"
        :title="title"
        class="w-10/12 md:w-8/12 xl:10/12"
        draggable
        @close="closeModal"
    >
      <slot/>
    </el-dialog>
  </div>
  <!--  Withdrawal UI-->
</template>

<script setup>
import {ElDialog} from "element-plus";
import {defineProps, ref} from "vue";
import router from "@/routes";

const open = ref(true);

const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  }
})

const closeModal = () => {
  router.go(-1)
};
</script>

<style scoped></style>
