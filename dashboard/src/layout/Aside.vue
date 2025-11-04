

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

    <a-menu-item key="categories" @click="toggleCollapsed">
      <template #icon>
        <scale-to-original class="h-8 w-8"/>
      </template>
      <router-link to="/dashboard/categories">
        {{ 'Categories' }}
      </router-link>
    </a-menu-item>

    <a-menu-item key="blogs" @click="toggleCollapsed">
      <template #icon>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 3.5H2.5C2.08579 3.5 1.75 3.83579 1.75 4.25V15.75C1.75 16.1642 2.08579 16.5 2.5 16.5H17.5C17.9142 16.5 18.25 16.1642 18.25 15.75V4.25C18.25 3.83579 17.9142 3.5 17.5 3.5ZM16.5 14.75H3.5V5.25H16.5V14.75ZM4.75 7.5H11.25V9H4.75V7.5ZM4.75 10.5H15.25V12H4.75V10.5Z"/>
        </svg>
      </template>
      <router-link to="/dashboard/blogs">
        {{ 'Blogs' }}
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
        key="shops" @click="toggleCollapsed">
      <template #icon>
        <office-building @click="routeTo('shops')"/>
      </template>
      <router-link to="/dashboard/shops">
        {{ t('Shops') }}
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
    <a-menu-item key="settings" @click="toggleCollapsed">
      <template #icon>
        <user-filled @click="routeTo('settings')"/>
      </template>
      <router-link to="/dashboard/settings">
        {{ t('Settings') }}
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
  Tools,
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
    LogoutOutlined,Tools
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


