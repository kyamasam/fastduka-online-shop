<template>
  <ButtonStyledGroup><slot></slot></ButtonStyledGroup>
</template>
<script>
import { ButtonStyledGroup } from "./styled";

import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ButtonStyledGroup,
  },
});
</script>
