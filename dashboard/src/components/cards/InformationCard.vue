<template>
  <div class="shadow-sm w-fit bg-gray-50 flex items-center gap-4 rounded-lg p-2 h-12">
<!--    <span class="w-fit p-1 bg-gray-200 rounded">-->
<!--      <slot name="icon">-->

<!--      </slot>-->
<!--    </span>-->
    <h3 class="font-semibold">
      <slot name="title"></slot>
    </h3>
  </div>
</template>

<script>
export default {
  name: "InformationCard",
  props : {
    title: {
      type: String,
      default: 'Card Name'
    }
  }
}
</script>

<style scoped>

</style>