<template>
  <div class="flex flex-row gap-2 items-center w-full  justify-center">
    <loading class="h-4 w-4 animate-spin"></loading>
    <p>Give it a moment ...</p>
  </div>
</template>

<script>
import { Loading } from "@element-plus/icons-vue"

export default {
  name: "BaseLoader",
  components: { Loading }
};
</script>

<style scoped></style>
