<template>
  <div>
    <!-- Show main dashboard layout if onboarding is complete -->
    <Div :darkMode="darkMode" class="min-h-screen w-full">
      <Layout
        class="layout h-[90%] w-full"
        style="width: 100%; padding: 0; margin: 0; height: 150px"
      >
        <Header
          :style="{
            position: 'fixed',
            width: '100%',
            top: 0,
            [!rtl ? 'left' : 'right']: 0,
          }"
          class="border-b border-1"
          style="width: 100%; padding: 0; margin: 0; background-color: #cf000f"
        >
          <div class="w-full flex justify-between items-center bg-primary h-16">
            <div class="bg-primary px-4">
              <div
                class="navbar-brand align-center-v flex items-center flex-wrap gap-8 justify-center bg-transparent"
              >
                <div
                  :class="topMenu && innerWidth > 991 ? ' top-menu' : ''"
                  class="flex flex-row gap-2 items-center text-primary text-xl"
                >
                  <img
                    v-if="settingsData?.site_logo"
                    alt="logo"
                    :style="logoStyle"
                    :src="settingsData?.site_logo"
                  />
                  <p v-else>{{ siteData?.title }}</p>
                  <p v-if="settingsData?.logo_text" class="text-white font-medium ml-2">{{ settingsData?.logo_text }}</p>
                </div>
                <div
                  v-if="!topMenu || innerWidth <= 991"
                  class="h-8 w-8 cursor-pointer text-white"
                  @click="toggleCollapsed"
                >
                  <svg
                    class="size-6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <el-select
                  placeholder="vendor"
                  @focus="fetchVendors"
                  v-model="vendorStore"
                  style="width: 100px"
                >
                  <el-option
                    v-for="vendor in vendorList"
                    :key="vendor?.id"
                    :value="vendor"
                  >
                    {{ vendor?.name }}
                    <span
                      class="text-green-500"
                      v-if="vendor?.verification_status === 'APPROVED'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                        />
                      </svg>
                    </span>
                    <span class="text-primary-400" v-else>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
                    </span>
                  </el-option>
                </el-select>
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
          </div>
        </Header>

        <div class="header-more">
          <a-row>
            <a-col :md="0" :sm="24" :xs="24">
              <div class="small-screen-headerRight">
                <SmallScreenSearch :darkMode="darkMode" :hide="searchHide">
                  <HeaderSearch />
                </SmallScreenSearch>

                <SmallScreenAuthInfo :darkMode="darkMode" :hide="hide">
                  <AuthInfo :rtl="rtl" />
                </SmallScreenAuthInfo>
              </div>
            </a-col>
          </a-row>
        </div>

        <Layout class="h-full">
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

          <Layout class="ninjadash-main-layout h-full relative">
            <Content class="h-full w-full">
              <Suspense>
                <template #default>
                  <div class="min-h-screen pb-32">
                    <!-- Show loader while checking onboarding status -->
                    <div
                      v-if="isLoading"
                      class="flex justify-center items-center h-screen"
                    >
                      <base-loader />
                    </div>

                    <!-- Show onboarding component if needed -->
                    <onboarding-flow
                      :settingsData="settingsData"
                      v-else-if="needsOnboarding"
                      @complete="onboardingComplete"
                    />
                    <router-view v-else></router-view>
                  </div>
                </template>
                <template #fallback>
                  <div class="spin">
                    <a-spin />
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
                class="admin-footer fixed bottom-0 w-full"
              >
                <a-row class="w-full">
                  <a-col :md="12" :xs="24">
                    <span class="admin-footer__copyright">
                      {{ new Date().getFullYear() }} ©
                      <a class="" href="#" style="color: red">{{
                        settingsData?.title
                      }}</a>
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
  </div>
</template>

<script setup>
import { updateTheme } from "@/utility/theme";
import OnboardingFlow from "@/view/onboarding/OnboardingFlow";
import store from "@/vuex/store";
import { Layout } from "ant-design-vue";
import { ElNotification } from "element-plus";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { useStore } from "vuex";
import HeaderSearch from "../components/header-search/HeaderSearch";
import AuthInfo from "../components/utilities/auth-info/info";
import AsideItems from "./Aside";
import {
  Div,
  SmallScreenAuthInfo,
  SmallScreenSearch,
  TopMenuSearch,
} from "./style";
import TopMenu from "./TopMenuItems";

const { Header, Footer, Sider, Content } = Layout;

const router = useRouter();
const storeObj = useStore();

// Reactive variables
const collapsed = ref(false);
const hide = ref(true);
const searchHide = ref(true);
const activeSearch = ref(false);
const vendorList = ref([]);

// Onboarding check variables
const needsOnboarding = ref(false);
const isLoading = ref(true);

// Get state from Vuex
const rtl = computed(() => storeObj.state.themeLayout.rtlData);
const darkMode = computed(() => storeObj.state.themeLayout.data);
const topMenu = computed(() => storeObj.state.themeLayout.topMenu);
const vendorStore = computed({
  get: () => storeObj.state.mainRequests.vendor,
  set: (value) => (storeObj.state.mainRequests.vendor = value),
});

// Logo size computed property
const logoStyle = computed(() => {
  const isMobile = innerWidth.value <= 768;
  const sizeStr = isMobile
    ? settingsData.value?.logo_size_mobile || "64,64"
    : settingsData.value?.logo_size_desktop || "64,64";

  const [width, height] = sizeStr.split(',').map(s => s.trim());

  return {
    width: `${width}px`,
    height: `${height}px`,
    objectFit: 'contain'
  };
});

// Set initial collapsed state based on window width
collapsed.value = window.innerWidth <= 1200;
const innerWidth = ref(window.innerWidth);

// Toggle sidebar collapse state
const toggleCollapsed = (e) => {
  e.preventDefault();
  collapsed.value = !collapsed.value;
};

// Handle search and auth info display
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

// Mobile sidebar behavior
const toggleCollapsedMobile = () => {
  if (innerWidth.value <= 990) {
    collapsed.value = !collapsed.value;
  }
};

// Theme and layout actions
const onRtlChange = () => {
  const html = document.querySelector("html");
  html.setAttribute("dir", "rtl");
  storeObj.dispatch("changeRtlMode", true);
};

const onLtrChange = () => {
  const html = document.querySelector("html");
  html.setAttribute("dir", "ltr");
  storeObj.dispatch("changeRtlMode", false);
};

const modeChangeDark = () => {
  storeObj.dispatch("changeLayoutMode", true);
};

const modeChangeLight = () => {
  storeObj.dispatch("changeLayoutMode", false);
};

const modeChangeTopNav = () => {
  storeObj.dispatch("changeMenuMode", true);
};

const modeChangeSideNav = () => {
  storeObj.dispatch("changeMenuMode", false);
};

// Group event handlers for child components
const onEventChange = {
  onRtlChange,
  onLtrChange,
  modeChangeDark,
  modeChangeLight,
  modeChangeTopNav,
  modeChangeSideNav,
};

// Fetch vendors for dropdown
const fetchVendors = () => {
  store.dispatch("fetchList", { url: "vendors" }).then((res) => {
    vendorList.value = res?.data?.results || res?.data;
  });
};

const settingsData = ref({});
// Check if onboarding is needed
const checkOnboardingStatus = () => {
  // Check if user is logged in
  const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
  if (!authData?.access) {
    router.push({ name: "login" });
    return;
  }

  // Check if settings exist
  store
    .dispatch("fetchList", { url: "settings" })
    .then((resp) => {
      const settings = resp.data;
      settingsData.value = settings;
      localStorage.setItem("settingsData", JSON.stringify(settings));
      updateTheme(settings);

      // If basic settings (title, description, industry) exist,
      // we consider onboarding completed
      if (
        settings &&
        settings.title &&
        settings.description &&
        settings.industry
      ) {
        needsOnboarding.value = false;
      } else {
        needsOnboarding.value = true;
      }

      isLoading.value = false;
    })
    .catch((error) => {
      console.error("Error checking onboarding status:", error);

      // If we get a 404, it means settings don't exist yet - require onboarding
      if (error.response?.status === 404) {
        needsOnboarding.value = true;
      } else {
        // For other errors, show notification and redirect to login
        ElNotification({
          title: "Error",
          message: "Failed to check onboarding status. Please try again.",
          type: "error",
        });

        router.push({ name: "login" });
      }

      isLoading.value = false;
    });
};

const onboardingComplete = () => {
  console.log("Onboarding completed");
  needsOnboarding.value = false;
};

// Mobile sidebar click outside behavior
if (innerWidth.value <= 990) {
  document.body.addEventListener("click", (e) => {
    if (
      !e.target.closest(".ant-layout-sider") &&
      !e.target.closest(".navbar-brand .ant-btn")
    ) {
      collapsed.value = true;
    }
  });
}

// Window resize handler
const handleResize = () => {
  innerWidth.value = window.innerWidth;
  if (innerWidth.value <= 1200) {
    collapsed.value = true;
  }
};

// Lifecycle hooks
onMounted(() => {
  checkOnboardingStatus();
  window.addEventListener("resize", handleResize);
});

// Clean up event listeners
// Would use onUnmounted here to clean up event listeners, but it's not needed for the main layout
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
