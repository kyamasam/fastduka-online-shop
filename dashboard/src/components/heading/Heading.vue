<template>
  <H1 :style="styles" :className="className" :id="id" v-if="as.toUpperCase() === 'H1'"><slot></slot></H1>
  <H2 :style="styles" :className="className" :id="id" v-else-if="as.toUpperCase() === 'H2'"><slot></slot></H2>
  <H3 :style="styles" :className="className" :id="id" v-else-if="as.toUpperCase() === 'H3'"><slot></slot></H3>
  <H4 :style="styles" :className="className" :id="id" v-else-if="as.toUpperCase() === 'H4'"><slot></slot></H4>
  <H5 :style="styles" :className="className" :id="id" v-else-if="as.toUpperCase() === 'H5'"><slot></slot></H5>
  <H6 :style="styles" :className="className" :id="id" v-else><slot></slot></H6>
</template>

<script>
import { H1, H2, H3, H4, H5, H6 } from './style';
import VueTypes from 'vue-types';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Heading',
  props: {
    as: VueTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).def('h1'),
    className: VueTypes.string,
    id: VueTypes.string,
    styles: VueTypes.object.def({}),
  },
  components: {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
  },
});
</script>
