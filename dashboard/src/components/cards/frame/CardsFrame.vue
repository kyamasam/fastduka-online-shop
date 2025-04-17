<template>
  <CardFrame
    v-if="!headless"
    :size="size"
    :title="title"
    :bodyStyle="bodyStyle && bodyStyle"
    :headStyle="headStyle && headStyle"
    :bordered="border"
    :bodypadding="bodypadding && bodypadding"
    :style="{ width: '100%' }"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot name="caption"></slot>
    <template v-slot:extra>
      <slot name="button"></slot>
      <sdDropdown v-if="more" :action="['click']" placement="bottomRight">
        <template v-slot:overlay>
          <slot name="more"></slot>
        </template>
        <router-link class="card-extra-link" v-if="!moreText" to="#"
          ><unicon name="ellipsis-h" width="24"></unicon
        ></router-link>
        <router-link v-else to="#">More</router-link>
      </sdDropdown>
    </template>
    <slot></slot>
  </CardFrame>

  <CardFrame
    :bodypadding="bodypadding && bodypadding"
    :bodyStyle="bodyStyle && bodyStyle"
    :size="size"
    :style="{ width: '100%' }"
    :bordered="border"
    :headless="true"
    v-else
  >
    <sdHeading v-if="title" as="h4">{{ title }}</sdHeading>
    <p v-if="caption">{{ caption }}</p>
    <slot></slot>
  </CardFrame>
</template>

<script>
import { CardFrame } from "./style";
import VueTypes from "vue-types";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Cards",
  components: {
    CardFrame,
  },
  props: {
    title: VueTypes.oneOfType([
      VueTypes.string,
      VueTypes.object,
      VueTypes.node,
    ]),
    size: VueTypes.oneOf(["default", "small"]).def("default"),
    more: VueTypes.bool.def(false),
    bodyStyle: VueTypes.object,
    headStyle: VueTypes.object,
    headless: VueTypes.bool.def(false),
    border: VueTypes.bool.def(false),
    caption: VueTypes.string,
    bodypadding: VueTypes.string,
    moreText: VueTypes.bool.def(false),
  },
});
</script>
