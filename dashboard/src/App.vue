<template>
  <div v-if="isLoading" class="spin">
    <a-spin />
  </div>
  <ThemeProvider
    v-else
    :theme="{
      rtl,
      topMenu,
      darkMode,
      mainContent,
      ...themeColor,
    }"
    class="font-Jost"
  >

<!--    <Suspense>-->
      <template #default>

        <router-view></router-view>
      </template>
      <template #fallback>
        <div class="spin">
          <a-spin />
        </div>
      </template>
<!--    </Suspense>-->
  </ThemeProvider>
</template>
<script>
import { ThemeProvider } from "vue3-styled-components";
import { themeColor } from "./config/theme/themeVariables";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router"

export default defineComponent({
  name: "App",
  components: {
    ThemeProvider,
  },
  setup() {
    const { state } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const isLoading = computed(() => state.themeLayout.loading);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);
    const mainContent = computed(() => state.themeLayout.main);

    let userType = JSON.parse(localStorage.getItem("piczanguUserDetails"))?.user_type

    const whichPage = () => {
      let route = useRouter();
      let allowedRoles = route?.currentRoute?.value?.meta?.allowed_roles;
      let routeName = route?.currentRoute?.value?.name;
      let requiresAuth = route?.currentRoute?.value?.meta?.requiresAuth;

      // console.log(allowedRoles.length, 'types')

      if (requiresAuth && userType ) {
        if (allowedRoles != undefined){
          if (allowedRoles.includes(userType)) {
            console.log(`${userType} is found in the allowed roles.`);
          } else {
            console.log(`${userType} is not found in the allowed roles.`);
            route.push({name: 'unauthorised'})

          }
        }
      }
    };


    onMounted(() => {
      window.addEventListener("load", () => {
        const domHtml = document.getElementsByTagName("html")[0];
        rtl.value
          ? domHtml.setAttribute("dir", "rtl")
          : domHtml.setAttribute("dir", "ltr");
        darkMode.value ? document.body.classList.add("dark-mode") : "";
      });
      // whichPage()
    });

    return {
      themeColor,
      rtl,
      darkMode,
      topMenu,
      isLoading,
      mainContent,
    };
  },
});
</script>
