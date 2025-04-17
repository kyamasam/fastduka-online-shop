<script>
import VueTypes from "vue-types"
import { PageHeaderStyle } from "./style"
import routes from "../../routes/index"

export default {
  components: {
    PageHeaderStyle
  },
  data () {
    return {
      cssPropsBg: {
        backgroundColor: this.bgColor || "#F4F5F7"
      }
    }
  },
  props: {
    title: { type: String, default: "" },
    subTitle: VueTypes.oneOfType([VueTypes.string, VueTypes.object]),
    bgColor: VueTypes.string,
    class: VueTypes.string,
    routesList: {
      type: Array, default: [
        {
          path: "#",
          verboseName: "Home"
        }
      ]
    },
    buttons: VueTypes.array,
    ghost: VueTypes.bool,
    breadcrumb: VueTypes.object
  }
}
</script>

<template>
  <div>
    <div
      class=" h-full w-full bg-red-200"
    >
      <PageHeaderStyle
        :breadcrumb='this.routesList.length && { routes: this.routesList }'
        :class="this.class"
        :extra='this.$slots.buttons && this.$slots.buttons()'
        :ghost=this.ghost
        :subTitle='this.subTitle ||(this.$slots.subTitle ? this.$slots.subTitle() : null)'
        :title='this.title'
        class=" h-full w-full bg-red-200"
      >

        <a-breadcrumb v-if="routesList.length">
          <a-breadcrumb-item v-for="(item, key) in routesList" :key=key>
            <router-link :key=key :to="item?.path">
              {{ item.verboseName }}
            </router-link>
          </a-breadcrumb-item>
        </a-breadcrumb>

      </PageHeaderStyle>
    </div>
  </div>
</template>
