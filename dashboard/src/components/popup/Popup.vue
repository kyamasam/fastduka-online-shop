<template>
  <a-popover
    class="className"
    v-model="visible"
    :placement="placement"
    :title="title && title"
    :trigger="action"
  >
    <template v-if="title" v-slot:title>
      <Title>{{ title }}</Title>
    </template>
    <template v-slot:content>
      <Content>
        <slot name="content">
          <a to="#">
            <unicon name="check" width="16"></unicon>
            <span>Btn Dropdown one</span>
          </a>
          <a to="#">
            <unicon name="check" width="16"></unicon>
            <span>Btn Dropdown two</span>
          </a>
          <a to="#">
            <unicon name="check" width="16"></unicon>
            <span>Btn Dropdown three</span>
          </a>
        </slot>
      </Content>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script>
import { Content, Title } from "./style";
import VueTypes from "vue-types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popover",
  props: {
    placement: VueTypes.string.def("bottom"),
    title: VueTypes.string,
    class: VueTypes.string,
    action: VueTypes.string.def("hover"),
  },
  data() {
    return {
      visible: false,
      className: this.class,
    };
  },
  components: {
    Content,
    Title,
  },
});
</script>
<style>
@import "./style.css";
</style>
