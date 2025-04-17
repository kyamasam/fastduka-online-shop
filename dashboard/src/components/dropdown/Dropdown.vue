<template>
  <a-dropdown
    :overlayClassName="className"
    :placement="placement"
    :title="title"
    :trigger="action"
  >
    <template v-slot:overlay>
      <Content>
        <slot name="overlay">
          <a to="#">
            <span>Export to CSV</span>
          </a>
          <a to="#">
            <span>Export to XML</span>
          </a>
          <a to="#">
            <span>Export to Drive</span>
          </a>
        </slot>
      </Content>
    </template>
    <slot></slot>
  </a-dropdown>
</template>

<script>
import VueTypes from "vue-types";
import { Content } from "./dropdown-style";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Dropdown",
  components: {
    Content,
  },
  props: {
    placement: VueTypes.string.def("bottomRight"),
    title: VueTypes.string,
    action: VueTypes.array.def(["hover"]),
    class: VueTypes.string.def("ninjadash-dropdown"),
  },
  data() {
    return {
      className: this.class,
    };
  },
});
</script>
