<!--<template>-->
<!--    <a-menu  v-model:selectedKeys="selectedKeys" mode="inline">-->
<!--      <a-sub-menu key="dashboard">-->
<!--        <template #icon>-->
<!--          <unicon name="create-dashboard"></unicon>-->
<!--        </template>-->
<!--        <template #title>{{ t('dashboard') }}</template>-->
<!--        <a-menu-item @click="toggleCollapsed" key="home-one">-->
<!--          <router-link to="/demo-one">-->
<!--            {{ t('demo') }} {{ t('1') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="home-two">-->
<!--          <router-link to="/demo-two">-->
<!--            {{ t('demo') }} {{ t('2') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="home-three">-->
<!--          <router-link to="/demo-three">-->
<!--            {{ t('demo') }} {{ t('3') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="home-four">-->
<!--          <router-link to="/demo-four">-->
<!--            {{ t('demo') }} {{ t('4') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="home-five">-->
<!--          <router-link to="/demo-five">-->
<!--            {{ t('demo') }} {{ t('5') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="demo-six">-->
<!--          <router-link to="/demo-six">-->
<!--            {{ t('demo') }} {{ t('6') }}-->
<!--          </router-link>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="demo-seven">-->
<!--          <router-link to="/demo-seven"-->
<!--          >{{ t('demo') }} {{ t('7') }}</router-link-->
<!--          >-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="demo-eight">-->
<!--          <router-link to="/demo-eight"-->
<!--          >{{ t('demo') }} {{ t('8') }}</router-link-->
<!--          >-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="demo-nine">-->
<!--          <router-link to="/demo-nine"-->
<!--          >{{ t('demo') }} {{ t('9') }}</router-link-->
<!--          >-->
<!--        </a-menu-item>-->
<!--      </a-sub-menu>-->

<!--      <a-sub-menu key="layout">-->
<!--        <template #icon>-->
<!--          <unicon name="window-section"></unicon>-->
<!--        </template>-->
<!--        <template #title>{{ t('layouts') }}</template>-->
<!--        <a-menu-item @click="toggleCollapsed" key="light">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            modeChangeLight();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('light') }}{{ t('mode') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="dark">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            modeChangeDark();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('dark') }}{{ t('mode') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="topMenu">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            modeChangeTopNav();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('top') }}{{ t('menu') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="sideMenu">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            modeChangeSideNav();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('side') }}{{ t('menu') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="rtl">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            onRtlChange();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('rtl') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item @click="toggleCollapsed" key="ltr">-->
<!--          <a-->
<!--            @click="-->
<!--                        (e) => {-->
<!--                            e.preventDefault();-->
<!--                            toggleCollapsed();-->
<!--                            onLtrChange();-->
<!--                        }-->
<!--                    "-->
<!--            to="#"-->
<!--          >-->
<!--            {{ t('ltr') }}-->
<!--          </a>-->
<!--        </a-menu-item>-->
<!--      </a-sub-menu>-->

<!--      <a-menu-item @click="toggleCollapsed" key="changelog">-->
<!--        <template #icon>-->
<!--          <unicon name="arrow-growth"></unicon>-->
<!--        </template>-->
<!--        <router-link to="/changelog">-->
<!--          {{ t('changelog') }}-->
<!--          <span class="badge badge-primary menuItem">{{-->
<!--              versions[0].version-->
<!--            }}</span>-->
<!--        </router-link>-->
<!--      </a-menu-item>-->
<!--&lt;!&ndash;      <template v-for="item in sidebarRoutes" :key="item">&ndash;&gt;-->
<!--&lt;!&ndash;        <router-link&ndash;&gt;-->
<!--&lt;!&ndash;          v-if="&ndash;&gt;-->
<!--&lt;!&ndash;            !hasChildrenThatCanBeShown(item.children) && item?.meta?.level === 1&ndash;&gt;-->
<!--&lt;!&ndash;          "&ndash;&gt;-->
<!--&lt;!&ndash;          :to="{ name: item.name }"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <a-menu-item :key="item.name" class="capitalize">&ndash;&gt;-->
<!--&lt;!&ndash;            &lt;!&ndash;          <div class="flex items-center gap-2 capitalize">&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;            <template #icon>&ndash;&gt;-->
<!--&lt;!&ndash;              <div v-if="item?.meta?.icon" v-html="item?.meta?.icon" />&ndash;&gt;-->
<!--&lt;!&ndash;              <svg&ndash;&gt;-->
<!--&lt;!&ndash;                v-else&ndash;&gt;-->
<!--&lt;!&ndash;                class="w-4 h-4"&ndash;&gt;-->
<!--&lt;!&ndash;                fill="none"&ndash;&gt;-->
<!--&lt;!&ndash;                stroke="currentColor"&ndash;&gt;-->
<!--&lt;!&ndash;                stroke-width="1.5"&ndash;&gt;-->
<!--&lt;!&ndash;                viewBox="0 0 24 24"&ndash;&gt;-->
<!--&lt;!&ndash;                xmlns="http://www.w3.org/2000/svg"&ndash;&gt;-->
<!--&lt;!&ndash;              >&ndash;&gt;-->
<!--&lt;!&ndash;                <path&ndash;&gt;-->
<!--&lt;!&ndash;                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"&ndash;&gt;-->
<!--&lt;!&ndash;                  stroke-linecap="round"&ndash;&gt;-->
<!--&lt;!&ndash;                  stroke-linejoin="round"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->
<!--&lt;!&ndash;              </svg>&ndash;&gt;-->
<!--&lt;!&ndash;            </template>&ndash;&gt;-->
<!--&lt;!&ndash;            <span v-if="item?.meta?.verboseName === undefined">{{&ndash;&gt;-->
<!--&lt;!&ndash;                item?.name&ndash;&gt;-->
<!--&lt;!&ndash;              }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span v-else> {{ item?.meta?.verboseName }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;            &lt;!&ndash;          </div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          </a-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;        </router-link>&ndash;&gt;-->

<!--&lt;!&ndash;        <a-sub-menu&ndash;&gt;-->
<!--&lt;!&ndash;          v-if="&ndash;&gt;-->
<!--&lt;!&ndash;            item.children?.length > 0 &&&ndash;&gt;-->
<!--&lt;!&ndash;            item?.meta?.level &&&ndash;&gt;-->
<!--&lt;!&ndash;            hasChildrenThatCanBeShown(item?.children)&ndash;&gt;-->
<!--&lt;!&ndash;          "&ndash;&gt;-->
<!--&lt;!&ndash;          :key="item.name"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <template #icon>&ndash;&gt;-->
<!--&lt;!&ndash;            <div v-if="item?.meta?.icon" v-html="item?.meta?.icon" />&ndash;&gt;-->
<!--&lt;!&ndash;            <svg&ndash;&gt;-->
<!--&lt;!&ndash;              v-else&ndash;&gt;-->
<!--&lt;!&ndash;              class="w-4 h-4"&ndash;&gt;-->
<!--&lt;!&ndash;              fill="none"&ndash;&gt;-->
<!--&lt;!&ndash;              stroke="currentColor"&ndash;&gt;-->
<!--&lt;!&ndash;              stroke-width="1.5"&ndash;&gt;-->
<!--&lt;!&ndash;              viewBox="0 0 24 24"&ndash;&gt;-->
<!--&lt;!&ndash;              xmlns="http://www.w3.org/2000/svg"&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;              <path&ndash;&gt;-->
<!--&lt;!&ndash;                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"&ndash;&gt;-->
<!--&lt;!&ndash;                stroke-linecap="round"&ndash;&gt;-->
<!--&lt;!&ndash;                stroke-linejoin="round"&ndash;&gt;-->
<!--&lt;!&ndash;              />&ndash;&gt;-->
<!--&lt;!&ndash;            </svg>&ndash;&gt;-->
<!--&lt;!&ndash;          </template>&ndash;&gt;-->
<!--&lt;!&ndash;          <template #title>&ndash;&gt;-->
<!--&lt;!&ndash;            <span&ndash;&gt;-->
<!--&lt;!&ndash;              v-if="item?.meta?.verboseName === undefined"&ndash;&gt;-->
<!--&lt;!&ndash;              class="capitalize"&ndash;&gt;-->
<!--&lt;!&ndash;            >{{ item?.name }}</span&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;            <span v-else> {{ item?.meta?.verboseName }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </template>&ndash;&gt;-->
<!--&lt;!&ndash;          <a-menu-item&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="childRoute in item?.children"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="childRoute?.name"&ndash;&gt;-->
<!--&lt;!&ndash;            class="capitalize"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <router-link :to="{ name: childRoute.name }">&ndash;&gt;-->
<!--&lt;!&ndash;              <span v-if="childRoute?.meta?.verboseName === undefined">{{&ndash;&gt;-->
<!--&lt;!&ndash;                  childRoute?.name&ndash;&gt;-->
<!--&lt;!&ndash;                }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;              <span v-else>&ndash;&gt;-->
<!--&lt;!&ndash;                {{ childRoute?.meta?.verboseName }}</span&ndash;&gt;-->
<!--&lt;!&ndash;              ></router-link&ndash;&gt;-->
<!--&lt;!&ndash;            >&ndash;&gt;-->
<!--&lt;!&ndash;          </a-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;        </a-sub-menu>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--    </a-menu>-->


<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { onMounted, reactive, ref } from "vue";-->
<!--// eslint-disable-next-line @typescript-eslint/ban-ts-comment-->
<!--// @ts-ignore-->
<!--// noinspection ES6UnusedImports-->
<!--import { ThunderboltOutlined } from "@ant-design/icons-vue";-->

<!--import router from "@/routes/index.js";-->

<!--const selectedKeys = reactive([]);-->
<!--const collapsed = ref<boolean>(false);-->
<!--const sidebarRoutes: any = reactive([]);-->

<!--onMounted(() => {-->
<!--  const routes = router.getRoutes();-->
<!--  console.log("list routes", routes)-->
<!--  routes.forEach((singleRoute) => {-->
<!--    if (singleRoute.meta?.showInSideBar) {-->
<!--      const singleRouteProxy = { ...singleRoute };-->
<!--      const childRoutes: any[] = [];-->
<!--      if (singleRoute?.children) {-->
<!--        singleRoute?.children.forEach((childRoute) => {-->
<!--          if (childRoute?.meta?.showInSideBar) {-->
<!--            childRoutes.push(childRoute);-->
<!--          }-->
<!--        });-->
<!--      }-->
<!--      singleRouteProxy.children = [...childRoutes];-->
<!--      sidebarRoutes.push(singleRouteProxy);-->
<!--    }-->
<!--  });-->
<!--});-->
<!--const hasChildrenThatCanBeShown = function (item: any[] | undefined) {-->
<!--  if (item === undefined) return false;-->
<!--  let canBeShown = 0;-->
<!--  item.forEach((x: any) => {-->
<!--    if (x?.meta.showInSideBar) canBeShown++;-->
<!--  });-->
<!--  return canBeShown;-->
<!--};-->
<!--</script>-->

<template>
  <a-menu
      v-model:selectedKeys="selectedKeys"
      :mode="mode"
      :open-keys="openKeys"
      :theme="darkMode ? 'dark' : 'light'"
      class="scroll-menu"
      @click="onClick"
      @openChange="onOpenChange"
  >

    <a-menu-item
        v-if="isPhotographer"
        key="home" @click="toggleCollapsed">
      <template #icon>
        <home-filled @click="routeTo('home')"/>
      </template>
      <router-link to="/dashboard/home">
        {{ 'Dashboard' }}
      </router-link>
    </a-menu-item>
    <!--    todo:: create a routeTo function to toggle page on icon click-->

    <a-menu-item key="products" @click="toggleCollapsed">
      <template #icon>
        <price-tag class="h-8 w-8"/>

      </template>
      <router-link to="/dashboard/products">
        {{ 'Products' }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="orders" @click="toggleCollapsed">
      <template #icon>
        <promotion @click="routeTo('orders')"/>
      </template>
      <router-link to="/dashboard/orders">
        {{ t('Orders') }}
      </router-link>
    </a-menu-item>


    <a-menu-item
        key="payments" @click="toggleCollapsed">
      <template #icon>
        <wallet-filled @click="routeTo('payments')"/>
      </template>
      <router-link to="/dashboard/wallet/client-payments">
        {{ t('Payments') }}
      </router-link>
    </a-menu-item>

    <a-menu-item
        key="vendors" @click="toggleCollapsed">
      <template #icon>
        <office-building @click="routeTo('vendors')"/>
      </template>
      <router-link to="/dashboard/vendors">
        {{ t('Vendors') }}
      </router-link>
    </a-menu-item>

    <a-menu-item
        key="riders" @click="toggleCollapsed">
      <template #icon>
        <van @click="routeTo('riders')"/>
      </template>
      <router-link to="/dashboard/riders">
        {{ t('Riders') }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="userList" @click="toggleCollapsed">
      <template #icon>
        <user-filled @click="routeTo('users')"/>

      </template>
      <router-link to="/dashboard/users">
        {{ t('Users') }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="userProfile" @click="toggleCollapsed">
      <template #icon>
        <user-filled @click="routeTo('profile')"/>
      </template>
      <router-link to="/dashboard/profile">
        {{ t('Profile') }}
      </router-link>
    </a-menu-item>

    <a-menu-item
        v-if="isPhotographer" key="portfolio">
      <template #icon>
        <user @click="routeTo('portfolio')"/>
      </template>
      <router-link to="/dashboard/settings/portfolio">
        {{ t('Portfolio') }}
      </router-link>
    </a-menu-item>


    <!--    <a-sub-menu key="settings">-->
    <!--      <template #icon>-->
    <!--        <settings/>-->
    <!--      </template>-->
    <!--      <template #title>{{ t('Settings') }}  </template>-->

    <!--      <a-menu-item @click="toggleCollapsed" key="courseDetails">-->
    <!--        <router-link to="/dashboard/profile">-->
    <!--          {{ t('Profile') }}-->
    <!--        </router-link>-->
    <!--      </a-menu-item>-->

    <!--      <a-menu-item-->
    <!--          v-if="isPhotographer"-->
    <!--          @click="toggleCollapsed" key="portfolio">-->
    <!--        <router-link to="/dashboard/settings/portfolio">-->
    <!--          {{ t('Portfolio') }}-->
    <!--        </router-link>-->
    <!--      </a-menu-item>-->

    <!--&lt;!&ndash;      <a-menu-item&ndash;&gt;-->
    <!--&lt;!&ndash;          v-if="isPhotographer"&ndash;&gt;-->
    <!--&lt;!&ndash;          @click="toggleCollapsed" key="subscription">&ndash;&gt;-->
    <!--&lt;!&ndash;        <router-link to="/dashboard/settings/subscription">&ndash;&gt;-->
    <!--&lt;!&ndash;          {{ t('Subscriptions') }}&ndash;&gt;-->
    <!--&lt;!&ndash;        </router-link>&ndash;&gt;-->
    <!--&lt;!&ndash;      </a-menu-item>&ndash;&gt;-->
    <!--    </a-sub-menu>-->

    <span class="md:hidden">
      <a-menu-item key="logout" class="" @click="SignOut">

        <template #icon>
          <d-arrow-right/>
        </template>

        <sdButton class="font-semibold flex items-center gap-1 "
                  style="border-radius: 8px"
                  type="primary">
          <logout-outlined class=""/>

          <span class="h-fit flex items-center ">{{ t('Sign Out') }}</span>
        </sdButton>
    </a-menu-item>
    </span>


  </a-menu>
</template>
<script>
import {computed, defineComponent, reactive, ref, toRefs, watch, watchEffect,} from 'vue';
import VueTypes from 'vue-types';
import {useStore} from 'vuex';
import {useRoute, useRouter} from 'vue-router';
import versions from '../demoData/changelog.json';
import {NavTitle} from './style';
import {useI18n} from 'vue-i18n';
import {
  ArrowUp,
  CameraFilled,
  DArrowRight,
  HomeFilled,
  Message, OfficeBuilding,
  PriceTag,
  Promotion, ScaleToOriginal,
  User,
  UserFilled, Van,
  Wallet,
  WalletFilled
} from "@element-plus/icons-vue";
import {LogoutOutlined} from '@ant-design/icons-vue';
import {ElNotification} from "element-plus";
import Settings from "@/components/utilities/auth-info/Settings.vue";


export default defineComponent({
  name: 'AsideItems',
  props: {
    toggleCollapsed: VueTypes.func,
    events: VueTypes.object,
  },
  components: {
    Van,
    OfficeBuilding,
    ScaleToOriginal,
    Promotion,
    PriceTag,
    User,
    UserFilled,
    CameraFilled,
    Wallet,
    DArrowRight,
    Settings,
    WalletFilled,
    Message,
    HomeFilled,
    ArrowUp,
    NavTitle,
    LogoutOutlined
  },
  setup(props) {
    const {t} = useI18n();
    const store = useStore();
    const darkMode = computed(() => store.state.themeLayout.data);
    const mode = ref('inline');
    const {events} = toRefs(props);
    const {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    } = events.value;

    const router = computed(() => useRoute());

    const routeTo = (routeName) => {
      const myRouter = useRouter()
      myRouter.push({name: routeName})
    }
    const state = reactive({
      rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
      selectedKeys: ['home'],
      openKeys: ['dashboard'],
      preOpenKeys: ['dashboard'],
    });

    const myRouter = useRouter()


    const SignOut = () => {
      localStorage.removeItem("piczanguAuthData")
      ElNotification({
        title: 'Success',
        type: "success",
        position: "top-right",
        message: 'Logged Out'
      })

      myRouter.push({name: 'login'})
      //::todo Correct url to sign out
    };

    const onOpenChange = (keys) => {
      state.openKeys =
          keys[keys.length - 1] !== 'recharts'
              ? [keys.length && keys[keys.length - 1]]
              : keys;
    };

    const onClick = (item) => {
      if (item.keyPath.length === 1) state.openKeys = [];
    };

    watchEffect(() => {
      if (router.value.matched.length) {
        if (router.value.matched.length > 2) {
          state.selectedKeys = [router.value.matched[2].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else if (router.value.matched.length > 3) {
          state.selectedKeys = [router.value.matched[3].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else {
          state.selectedKeys = [router.value.matched[1].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        }
      }
    });

    watch(
        () => state.openKeys,
        (val, oldVal) => {
          state.preOpenKeys = oldVal;
        }
    );

    let userType = ref(JSON.parse(localStorage.getItem("piczanguUserDetails"))?.user_type)


    const loggedUser = JSON.parse(localStorage.getItem("piczanguUserDetails"))

    const isPhotographer = (JSON.parse(localStorage.getItem("piczanguUserDetails"))?.user_type === 'photographer') ? true : false

    return {
      mode,
      ...toRefs(state),
      darkMode,
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
      versions,
      onOpenChange,
      onClick,
      t,
      loggedUser,
      SignOut,
      router,
      routeTo,
      isPhotographer
    };
  },
});
</script>


