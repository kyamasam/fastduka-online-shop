<script setup>
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import { allowedUsers } from "@/utility/functions";
import store from "@/vuex/store";
import { onMounted, ref } from "vue";

const formState = ref({});

const handleSubmit = () => {
  store.dispatch("postData", {
    url: "photography-specialty",
    data: formState.value,
  });
};

onMounted(() => {
  allowedUsers("all");
});
</script>

<template>
  <page-headers />
  <div class="p-4 bg-blue-200">
    <a-form :model="formState" @finish="handleSubmit">
      <a-form-item>
        <a-input
          placeholder="Type Of Photography"
          v-model:value="formState.name"
        />
        {{ formState }}
      </a-form-item>

      <a-button type="primary" html-type="submit" class="bg-blue-400 text-white"
        >Submit</a-button
      >
    </a-form>
  </div>
</template>

<style scoped></style>
