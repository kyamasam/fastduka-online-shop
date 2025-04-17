<template>
  <el-button @click="confirmAction" class="w-full bg-blue-400" type="primary">{{
    props.confirmActionText
  }}</el-button>
</template>

<script setup>
import { ElButton } from "element-plus";
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["confirmAction", "cancelAction"]);

const confirmAction = () => {
  emit("confirmAction");
};

const cancelAction = () => {
  emit("cancelAction");
};

const props = defineProps({
  confirmActionText: {
    type: String,
    default: "Retry Upload",
  },
  confirmActionTitle: {
    type: String,
    default: "Yes",
  },
});
</script>
