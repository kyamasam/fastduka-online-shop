<template>
  <ButtonStyled
    :squared="squared"
    :outlined="outlined"
    :ghost="ghost"
    :transparent="transparented"
    :raised="raised"
    :data="type"
    :size="size"
    :shape="shape"
    :type="type"
    :icon="icon"
    :color="color"
    :social="social"
    :click="() => load && enterLoading"
    :loading="loading"
    :block="block"
    :disabled="disabled"
    :class="`ant-btn ant-btn-${type} ant-btn-${size} ${
      shape && `ant-btn-${shape}`
    } ${block && `ant-btn-block`}`"
  >
    <slot></slot>
  </ButtonStyled>
</template>
<script>
import { ButtonStyled } from "./styled";
import VueTypes from "vue-types";
import { defineComponent } from "vue";

const Button = defineComponent({
  name: "Button",
  components: {
    ButtonStyled,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    enterLoading: function () {
      this.loading = true;
    },
  },
  props: {
    type: VueTypes.oneOf([
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "link",
      "dark",
      "light",
      "white",
      "dashed",
      "error",
      "default",
    ]).def("default"),
    shape: VueTypes.string,
    icon: VueTypes.string,
    size: VueTypes.oneOf(["lg", "default", "sm"]).def("default"),
    color: VueTypes.string,
    outlined: VueTypes.bool.def(false),
    block: VueTypes.bool.def(false),
    disabled: VueTypes.bool.def(false),
    transparented: VueTypes.bool.def(false),
    raised: VueTypes.bool.def(false),
    squared: VueTypes.bool.def(false),
    social: VueTypes.bool.def(false),
    load: VueTypes.bool.def(false),
    ghost: VueTypes.bool.def(false),
  },
});

export default Button;
</script>
