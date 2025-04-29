<template>
  <Div :darkMode="darkMode" class="min-h-screen w-full">
    <Layout class="layout h-[90%] bg-red-300 w-full"
            style="width: 100%; border:2px red; padding: 0; margin:0; background-color: blue; height:150px">
      <Header
          :style="{
          position: 'fixed',
          width: '100%',
          top: 0,
          [!rtl ? 'left' : 'right']: 0,
        }"
          class="border-b border-1 "
          style="width: 100%; border:2px red; padding: 0; margin:0; background-color: blue;"
      >
        <div class="w-full flex justify-between  items-center bg-red-600 h-16">
          <div class="bg-red-600 px-4">
            <div class="navbar-brand bg-red-400 align-center-v flex items-center flex-wrap gap-8 justify-center bg-transparent">
              <div
                  :class="
                  topMenu && innerWidth > 991
                    ? ' top-menu'
                    : ''
                "
                  class="flex flex-row gap-2 items-center  text-primary text-xl"
              >
                <img v-if="darkMode" alt="logo" class="w-16" src="/logo-white.svg">
                <img v-else alt="logo" class="w-36" src="/logo-white.svg">
              </div>
              <div
                  v-if="!topMenu || innerWidth <= 991"
                  class="h-8 w-8 cursor-pointer text-white"
                  @click="toggleCollapsed"
              >
                <svg class="size-6" fill="none" stroke="currentColor" stroke-width="1"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </div>
              <el-select placeholder="shops" @focus="fetchVendors" v-model="store.state.mainRequests.vendor" style="width: 100px">
                <el-option v-for="vendor in vendorList" :value="vendor" >
                  {{vendor?.name}}
                  <span class="text-green-500" v-if="vendor?.verification_status === 'APPROVED'">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  </span>
                  <span class="text-red-400" v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </span>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="ninjadash-header-content__right d-flex">
            <div class="ninjadash-navbar-menu d-flex align-center-v">
              <TopMenu v-if="topMenu && innerWidth > 991"/>
            </div>
            <div class="ninjadash-nav-actions">
              <TopMenuSearch v-if="topMenu && innerWidth > 991">
                <div class="top-right-wrap d-flex">
                  <AuthInfo/>
                </div>
              </TopMenuSearch>
              <AuthInfo v-else/>
            </div>
          </div>

        </div>
      </Header>

      <div class="header-more">
        <a-row>

          <a-col :md="0" :sm="24" :xs="24">
            <div class="small-screen-headerRight">
              <SmallScreenSearch :darkMode="darkMode" :hide="searchHide">
                <HeaderSearch/>

              </SmallScreenSearch>

              <SmallScreenAuthInfo :darkMode="darkMode" :hide="hide">
                <AuthInfo :rtl="rtl"/>
              </SmallScreenAuthInfo>
            </div>
          </a-col>
        </a-row>
      </div>

      <Layout class=" h-full">
        <template v-if="!topMenu || innerWidth <= 991">
          <Sider
              :collapsed="collapsed"
              :style="{

              overflowY: 'auto',

              position: 'fixed',
              [!rtl ? 'left' : 'right']: 0,
              zIndex: 998,
            }"
              :theme="!darkMode ? 'light' : 'dark'"
              :width="280"
              class="h-screen bg-white mt-2"
          >
            <perfect-scrollbar
                :options="{
                wheelSpeed: 1,
                swipeEasing: true,
                suppressScrollX: true,
              }"
            >
              <AsideItems
                  :darkMode="darkMode"
                  :events="onEventChange"
                  :rtl="rtl"
                  :toggleCollapsed="toggleCollapsedMobile"
                  :topMenu="topMenu"
              />
            </perfect-scrollbar>
          </Sider>
        </template>

        <Layout class="ninjadash-main-layout h-full relative ">
          <Content class="h-full  w-full">
            <Suspense>
              <template #default>
                <div class="min-h-screen pb-32 ">

                  <router-view></router-view>
                </div>
              </template>
              <template #fallback>
                <div class="spin">
                  <a-spin/>
                </div>
              </template>
            </Suspense>

            <Footer
                :style="{
                padding: '20px 30px 18px',
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, .90)',
                boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
              }"
                class="admin-footer fixed bottom-0 w-full "
            >
              <a-row class=" w-full">
                <a-col :md="12" :xs="24">
                  <span class="admin-footer__copyright "
                  >{{ new Date().getFullYear() }} ©
                    <a class="" href="#" style="color:red">Meatworld</a>
                  </span>
                </a-col>

                <a-col :md="12" :xs="24">
                  <div class="admin-footer__links">
                    <router-link to="#"
                    >Profile
                    </router-link
                    >
                    <router-link to="#">Team</router-link>
                    <router-link to="#"
                    >Contacts
                    </router-link
                    >
                  </div>
                </a-col>
              </a-row>
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </Div>
</template>
<script>
import {Layout} from "ant-design-vue";
import {Div, SmallScreenAuthInfo, SmallScreenSearch, TopMenuSearch,} from "./style";
import HeaderSearch from "../components/header-search/HeaderSearch.vue";

import AuthInfo from "../components/utilities/auth-info/info.vue";
import AsideItems from "./Aside";
import TopMenu from "./TopMenuItems";
import {PerfectScrollbar} from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import {computed, defineComponent, ref} from "vue";
import {useStore} from "vuex";
import mainRequests from "@/vuex/modules/mainRequests";
import store from "@/vuex/store";

const {Header, Footer, Sider, Content} = Layout;

export default defineComponent({
  name: "WithAdminLayout",
  computed: {
    store() {
      return store
    },
    mainRequests() {
      return mainRequests
    }
  },
  components: {
    Div,
    Header,
    Layout,
    Footer,
    Sider,
    Content,
    HeaderSearch,
    SmallScreenSearch,
    SmallScreenAuthInfo,
    TopMenuSearch,
    AuthInfo,
    AsideItems,
    TopMenu,
    PerfectScrollbar,
  },
  setup() {
    const collapsed = ref(false);
    const hide = ref(true);
    const searchHide = ref(true);
    const customizerAction = ref(false);
    const activeSearch = ref(false);

    // const store = useStore();
    const {dispatch, state} = useStore();

    const rtl = computed(() => state.themeLayout.rtlData);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);

    collapsed.value = window.innerWidth <= 1200 && true;

    const toggleCollapsed = (e) => {
      e.preventDefault();
      collapsed.value = !collapsed.value;
    };
    const handleSearchHide = (search) => {
      searchHide.value = !search;
      hide.value = true;
    };
    const onShowHide = (h) => {
      hide.value = !h;
      searchHide.value = true;
    };
    const toggleSearch = () => {
      activeSearch.value = !activeSearch.value;
    };

    const toggleCollapsedMobile = () => {
      // const aside = document.querySelector(".ps--active-y");
      // aside.scrollTop = 0;

      if (innerWidth <= 990) {
        collapsed.value = !collapsed.value;
      }
    };
    if (innerWidth <= 990) {
      document.body.addEventListener("click", (e) => {
        if (
            !e.target.closest(".ant-layout-sider") &&
            !e.target.closest(".navbar-brand .ant-btn")
        ) {
          collapsed.value = true;
        }
      });
    }

    const onRtlChange = () => {
      const html = document.querySelector("html");
      html.setAttribute("dir", "rtl");
      dispatch("changeRtlMode", true);
    };

    const onLtrChange = () => {
      const html = document.querySelector("html");
      html.setAttribute("dir", "ltr");
      dispatch("changeRtlMode", false);
    };

    const modeChangeDark = () => {
      dispatch("changeLayoutMode", true);
    };

    const modeChangeLight = () => {
      dispatch("changeLayoutMode", false);
    };

    const modeChangeTopNav = () => {
      dispatch("changeMenuMode", true);
    };

    const modeChangeSideNav = () => {
      dispatch("changeMenuMode", false);
    };

    const vendorList = ref([]);

    const fetchVendors = () => {
      store.dispatch("fetchList", {url:'vendors'})
      .then(res => {
        vendorList.value = res?.data;
      });
    }

    const onEventChange = {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    };
    //console.log(topMenu.value);
    return {
      toggleCollapsed,
      handleSearchHide,
      toggleCollapsedMobile,
      onShowHide,
      collapsed,
      hide,
      searchHide,
      toggleSearch,
      customizerAction,
      activeSearch,
      innerWidth: window.innerWidth,
      rtl,
      darkMode,
      topMenu,
      onEventChange,
      vendorList,
      fetchVendors,
    };
  },
});
</script>
<style>
.ps {
  height: calc(100vh - 100px);
}

.ant-layout-sider-collapsed .ps {
  height: calc(100vh - 70px);
}
.el-select__wrapper {
  background: transparent !important;
  border-radius: 0 !important;
  border: none !important;
  color: #ffffff !important;
}
</style>
