<template>
  <Div :darkMode="darkMode">
    <Layout class="layout">
      <Header
        :style="{
          position: 'fixed',
          width: '100%',
          top: 0,
          [!rtl ? 'left' : 'right']: 0,
        }"
      >
        <div class="ninjadash-header-content d-flex">
          <div class="ninjadash-header-content__left">
            <div class="navbar-brand align-cener-v">
              <router-link
                :class="
                  topMenu && innerWidth > 991
                    ? 'ninjadash-logo top-menu'
                    : 'ninjadash-logo'
                "
                to="/"
              >
                <img
                  :src="
                    !darkMode
                      ? require(`../static/img/Logo_Dark.svg`)
                      : require(`../static/img/Logo_White.svg`)
                  "
                  alt="logo"
                />
              </router-link>
              <sdButton
                v-if="!topMenu || innerWidth <= 991"
                @click="toggleCollapsed"
                type="white"
              >
                <img
                  :src="
                    require(`../static/img/icon/${
                      collapsed ? 'right.svg' : 'left.svg'
                    }`)
                  "
                  alt="menu"
                />
              </sdButton>
            </div>
          </div>
          <div class="ninjadash-header-content__right d-flex">
            <div class="ninjadash-navbar-menu d-flex align-center-v">
              <TopMenu v-if="topMenu && innerWidth > 991" />
            </div>
            <div class="ninjadash-nav-actions">
              <TopMenuSearch v-if="topMenu && innerWidth > 991">
                <div class="top-right-wrap d-flex">
                  <AuthInfo />
                </div>
              </TopMenuSearch>
              <AuthInfo v-else />
            </div>
          </div>
          <div class="ninjadash-header-content__fluid">
            <div class="ninjadash-header-content__fluid__action">
              <a
                class="btn-search"
                @click="handleSearchHide(searchHide)"
                href="#"
              >
                <unicon name="search" v-if="searchHide"></unicon>
                <unicon name="times" v-else></unicon>
              </a>
              <a class="btn-auth" @click="onShowHide(hide)" href="#">
                <unicon name="ellipsis-v"></unicon>
              </a>
            </div>
          </div>
          <!-- <a-col :lg="!topMenu ? 14 : 15" :md="8" :sm="0" :xs="0">

            <HeaderSearch v-else />
          </a-col> -->

          <!-- <a-col :style="{ position: 'static' }" :md="0" :sm="18" :xs="12">
            <div class="mobile-action">
              <a class="btn-search" @click="handleSearchHide(searchHide)" href="#">
                <unicon name="search" v-if="searchHide"></unicon>
                <unicon name="x" v-else></unicon>
              </a>
              <a class="btn-auth" @click="onShowHide(hide)" href="#">
                <unicon name="ellipsis-v"><unicon>
              </a>
            </div>
          </a-col> -->
        </div>
      </Header>
      <div class="header-more">
        <a-row>
          <a-col :md="0" :sm="24" :xs="24">
            <div class="small-screen-headerRight">
              <SmallScreenSearch :hide="searchHide" :darkMode="darkMode">
              </SmallScreenSearch>
              <SmallScreenAuthInfo :hide="hide" :darkMode="darkMode">
                <AuthInfo :rtl="rtl" />
              </SmallScreenAuthInfo>
            </div>
          </a-col>
        </a-row>
      </div>
      <Layout>
        <template v-if="!topMenu || innerWidth <= 991">
          <Sider
            :width="280"
            :style="{
              margin: '72px 0 0 0',
              padding: `${!rtl ? '20px 20px 55px 0px' : '20px 0px 55px 20px'}`,
              overflowY: 'auto',
              height: '100vh',
              position: 'fixed',
              [!rtl ? 'left' : 'right']: 0,
              zIndex: 998,
            }"
            :collapsed="collapsed"
            :theme="!darkMode ? 'light' : 'dark'"
          >
            <perfect-scrollbar
              :options="{
                wheelSpeed: 1,
                swipeEasing: true,
                suppressScrollX: true,
              }"
            >
              <AsideItems
                :toggleCollapsed="toggleCollapsedMobile"
                :topMenu="topMenu"
                :rtl="rtl"
                :darkMode="darkMode"
                :events="onEventChange"
              />
            </perfect-scrollbar>
          </Sider>
        </template>
        <Layout class="ninjadash-main-layout">
          <Content>
            <Suspense>
              <template #default>
                <router-view></router-view>
              </template>
              <template #fallback>
                <div class="spin">
                  <a-spin />
                </div>
              </template>
            </Suspense>

            <Footer
              class="admin-footer"
              :style="{
                padding: '20px 30px 18px',
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, .90)',
                width: '100%',
                boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
              }"
            >
              <a-row>
                <a-col :md="12" :xs="24">
                  <span class="admin-footer__copyright"
                    >2022 ©
                    <a href="http://www.sovware.com" style="">SovWare</a>
                  </span>
                </a-col>
                <a-col :md="12" :xs="24">
                  <div class="admin-footer__links">
                    <router-link to="#">Profile</router-link>
                    <router-link to="#">Team</router-link>
                    <router-link to="#">Contacts</router-link>
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
import { Layout } from "ant-design-vue";
import {
  Div,
  SmallScreenSearch,
  SmallScreenAuthInfo,
  TopMenuSearch,
} from "./style";

import AuthInfo from "../components/utilities/auth-info/info.vue";
import AsideItems from "./Aside";
import TopMenu from "./TopMenuItems";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { computed, ref, defineComponent } from "vue";
import { useStore } from "vuex";
const { Header, Footer, Sider, Content } = Layout;

export default defineComponent({
  name: "WithAdminLayout",
  components: {
    Div,
    Header,
    Layout,
    Footer,
    Sider,
    Content,
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
    const activeSearch = ref(false);

    // const store = useStore();
    const { dispatch, state } = useStore();

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
      activeSearch,
      innerWidth: window.innerWidth,
      rtl,
      darkMode,
      topMenu,
      onEventChange,
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
</style>