<template>
  <InfoWraper>
    <SearchBar/>
    <!--    <Message />-->
    <!--    <Notification />-->
    <!--    <Settings />-->

    <!-- <Support /> -->

    <div class="ninjadash-nav-actions__item ninjadash-nav-actions__author">
      <sdPopover action="click" placement="bottomRight">
        <template v-slot:content>
          <UserDropDown>
            <div class="user-dropdown w-full">
              <figure class="user-dropdown__info w-full">
                <img
                    :src="loggedUser?.profile?.profile_photo"
                    alt=""
                    class="h-16 w-16"
                    style="border-radius: 50%"
                />
                <figcaption>
                  <sdHeading as="h5" class="capitalize">{{ loggedUser?.username }}</sdHeading>
                  <p>{{ loggedUser?.email }}</p>
                </figcaption>
              </figure>
              <button class="bg-red-500 p-4 w-full text-white flex items-center gap-2 justify-center" @click="SignOut">
                Sign Out
                <arrow-right-bold class="w-5 h-5" />
              </button>
            </div>
          </UserDropDown>
        </template>
        <a class="ninjadash-nav-action-link" to="#">
          <a-avatar :src="loggedUser?.profile?.profile_photo"/>
          <span class="ninjadash-nav-actions__author--name">{{ loggedUser?.username }}</span>
          <unicon name="angle-down"></unicon>
        </a>
      </sdPopover>
    </div>
  </InfoWraper>
</template>

<script>
import {InfoWraper, UserDropDown} from './auth-info-style';
// import Support from "./Support";
import Settings from './Settings.vue';
import Notification from './Notification.vue';
import Message from './Message.vue';
import SearchBar from './Search.vue';
import {ElNotification} from 'element-plus';
import router from '@/routes';
import Button from '@/components/buttons/Buttons';
import {mapGetters} from "vuex"
import {deleteLocalStorageInformation} from "@/utility/functions"
import {ArrowRightBold} from "@element-plus/icons-vue";

export default {
  components: {
    ArrowRightBold,
    InfoWraper,
    SearchBar,
    Message,
    Notification,
    Settings,
    // Support,
    UserDropDown,
    Button,
  },
  data() {
    return {
      flag: 'english',
      loggedUser: JSON.parse(localStorage.getItem('piczanguUserDetails')),
    };
  },
  computed: {
    ...mapGetters(['getLoggedInUser'])
  },
  methods: {
    SignOut() {
      // localStorage.removeItem('piczanguAuthData');
      deleteLocalStorageInformation()
      ElNotification({
        title: 'Success',
        type: 'success',
        position: 'top-right',
        message: 'Logged Out',
      });
      router.push({name: 'login'});
      //::todo Correct url to sign out
    },
    onFlagChangeHandle(value) {
      this.flag = value;
    },
    retrieveCurrentUser() {
      this.loggedUser = JSON.parse(localStorage.getItem("piczanguUserDetails"))
    }
  },
  watch: {
    getLoggedInUser: {
      handler() {
        this.retrieveCurrentUser();
      },
      immediate: true,
    },
  },
  mounted() {
    this.retrieveCurrentUser();
  },
};
</script>
