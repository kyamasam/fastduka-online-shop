<template>
  <div class="h-full">
    <PageHeaders title="Profile" class="ninjadash-page-header-main"></PageHeaders>
    <Main>
      <div class="flex flex-col gap-2 md:flex-row w-full items-center md:items-start md:gap-6">

        <div style=" border-bottom: 1px solid #F1F2F6; "
            class="w-full md:max-w-[41.67%] lg:max-w-[33.33%] xl:max-w-[23.33%] bg-white flex items-center
            md:items-start justify-center py-8 rounded-t-[10px] ">

          <div class="px-[12.5px]">
            <span class="">
              <figure class=" relative">
                <img
                    :src="userDetails?.profile?.profile_photo !== null ? userDetails?.profile?.profile_photo : 'https://wallpapers.com/images/high/pixel-landscape-1920-x-1080-modj7tzb2j6j6zc8.webp'"
                    alt="image" style="border-radius: 50%; height: 120px; width: 120px"
                    class="border-blue-700 p-1">

                <a-upload
                  v-model:file-list="profileFileList"
                  name="avatar"
                  :maxCount="1"
                  @change="uploadProfilePhoto"
                  accept=".jpg,.png,.jpeg"
                  class="avatar-uploader"
                  :show-upload-list="false"
                >
              <span class="absolute bottom-0  w-full h-[60px] flex items-end justify-end">
                <span style="border-radius: 50%; border: 4px solid white;"
                      class=" h-10 w-10 flex items-center justify-center bg-[#7700ce] text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                       stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>

                </span>
              </span>

                </a-upload>
            </figure>
            </span>
            <div>
              <base-loader v-if="loadingProfilePhotoUpload"/>
            </div>
          </div>
        </div>

        <div class="w-full p-2 flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <div
              class="h-[200px] w-full rounded bg-center bg-cover"
              :style="{ backgroundImage: 'url(' + userDetails?.profile?.cover_photo + ')' }"
            >
            </div>

            <a-upload
              v-model:file-list="fileList"
              :progress="{
            showInfo: true
          }"
              :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: false }"

              list-type="picture"
              accept=".jpg,.png,.jpeg"
              class="avatar-uploader w-full flex flex-col justify-center bg-gray-100 border border-dashed border-blue-400 p-4 rounded-lg"
              name="teaser"
              @change="handleChange"
              @remove="handleRemove"
            >
              <div class="ant-upload-drag-icon text-blue-400 w-full flex justify-center py-4">
                <upload class="h-8 w-8"></upload>
              </div>
              <div class="flex flex-col items-center">
                <p class="ant-upload-text">Click or drag file to this area to upload
                <span class="font-bold">
                  cover photo
                </span></p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                  band files
                </p>
              </div>
              <base-loader v-if="loadingCoverPhoto"/>


            </a-upload>


          </div>
          <div class="bg-white w-full p-[12.5px] rounded-[8px]">
            <a-form class=" md:mt-0"
                    layout="vertical"
                    name="register"
                    @finish="attemptSubmit"
                    @finishFailed="handleFailedSubmit"
                    :model="formState">
              <a-form-item
                  :rules="[{ message: 'Please a-input your Full name!' }]"
                  label="First Name"
                  name="first_name"
                  property="first_name"
              >
                <a-input size="small" v-model:value="formState.first_name" placeholder="Full name"/>
              </a-form-item>
              <a-form-item
                  :rules="[{ message: 'Please a-input your Full name!' }]"
                  label="Last Name"
                  name="last_name"
                  property="last_name"
              >
                <a-input size="small" v-model:value="formState.last_name" placeholder="Full name"/>
              </a-form-item>
              <a-form-item
                  :rules="[
                {  message: 'Please input your phone number!' },
              ]"
                  class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                  label="Phone"
                  name="phone"
                  property="phone"
              >
                <a-input-group compact>
                  <select id="countries"
                          style="border-radius: 4px 0 0 4px"
                          v-model="formState.phone_code"
                          class=" w-2/12 pt-2 h-12 bg-white border border-gray-300 text-gray-900
                   text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400

                     dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="+254" selected>+254</option>
                    <option value="+254" >+255</option>
                    <option value="+254" >+256</option>
                  </select>
                  <input type="text" id="phone"
                         v-model="formState.phone_number"
                         style="border-radius: 0 4px 4px 0; outline: none"
                         class=" h-12 w-10/12 bg-white border  border-gray-300 text-gray-900
                          text-sm rounded-lg focus:ring-blue-500
                          p-2.5 dark:bg-gray-700  dark:placeholder-gray-400
                          dark:text-white focus:border-blue-500 "
                         placeholder="716651612" >

                </a-input-group>
              </a-form-item>
              <a-form-item
                  :rules="[{  message: 'Please a-input your email!', type: 'email' }]"
                  class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                  label="Email Address"
                  property="email"
                  name="email"
              >
                <a-input placeholder="name@example.com" v-model:value="formState.email"/>
              </a-form-item>

              <div class="hidden">
                <a-form-item
                    :rules="[{ message: 'Please a-input your password!' }]"
                    class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    label="Password"
                    property="password"
                    name="password"
                >
                  <a-input-password class="h-12" placeholder="Password" type="Password" size="large" v-model:value="formState.password"/>
                </a-form-item>
              </div>



              <a-form-item>
                <sdButton
                    class="w-fit h-12 p-0 my-6 text-sm font-medium"
                    htmlType="submit"
                    size="large"
                    type="primary"
                >
                  Update Profile
                </sdButton>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";

import PageHeaders from "@/components/pageHeaders/PageHeaders";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import BaseCameraIcon from "@/components/BaseCameraIcon";
import { ElUpload, ElButton, ElNotification } from "element-plus"
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import store from "@/vuex/store";
import {Loading, Upload, UploadFilled} from "@element-plus/icons-vue";
import coverPhoto from "@/view/galleries/CoverPhoto.vue"
import { mapGetters } from "vuex"
import BaseLoader from "@/components/BaseLoader.vue"
import { allowedUsers } from "@/utility/functions"
export default {
  name : '',
  computed: {
    ...mapGetters(['getLoggedInUser']),
    coverPhoto () {
      return coverPhoto
    }
  },
  components : {
    BaseLoader,
    Upload,
    BaseCameraIcon,
    ButtonGroup,
    PageHeaders,
    Main,
    ElUpload, UploadFilled, ElButton, PlusOutlined, LoadingOutlined
  },
  data(){
    return {
      formState: {},
      loggedUser: null,
      fileList : [],
      headers : {
        authorization: 'authorization-text',
      },
      loading: false,
      userDetails: {},
      userDetailsLength: 0,
      attachments:[],
      loadingCoverPhoto: false,
      loadingProfilePhotoUpload: false,
      profileFileList:[],
      imageUrl:'https://wallpapers.com/images/high/pixel-landscape-1920-x-1080-modj7tzb2j6j6zc8.webp',
      profilePhoto:'',
      coverPhotoBody: new FormData(),
      profilePhotoBody: new FormData(),
      defaultImg: `https://wallpapers.com/images/high/pixel-landscape-1920-x-1080-modj7tzb2j6j6zc8.webp`,
      counter: 0,
      localStorageUser: null
    }
  },
  methods : {
    formatImageUrl(){
      this.imageUrl= ''
      let imageUrl = this.userDetails.cover_photo
      // let newUrl = imageUrl.formatImageUrl('/media/media/', '/media/')
      this.imageUrl= newUrl
    },
    fetchPhotographerProfile(){
      this.loading=true
      store.dispatch('fetchList', {url: 'users/get-current-user/'}).then((res)=>{
        this.userDetails = res.data
        this.formState = {...res.data}
        this.userDetailsLength = Object.keys(this.userDetails).length
        this.loading=false
      }).catch(()=>{
        this.loading=false
      })
    },

    handleChanges(info){
      this.loadingProfilePhotoUpload = true;
      this.handleUploadPhotos(info,
        "profile_cover_photo",
        this.userDetails?.profile?.id,
        this.fileList).then(()=>{
        this.loadingProfilePhotoUpload = false;
        this.fetchPhotographerProfile()
        this.getSetCurrentUser()
      }).catch(()=>{
        this.loadingProfilePhotoUpload = true;
      })
    },
    handleChange (info) {
      this.counter++
      if (this.counter <= 1) {
        this.loadingCoverPhoto = true;
        this.handleUploadPhotos(
          info,
          "profile_cover_photo",
          this.userDetails?.profile?.id,
          this.fileList
        ).then(() => {
          this.loadingCoverPhoto = false;
          this.counter = 0
          this.fetchPhotographerProfile()
          this.getSetCurrentUser()
          this.fileList = []
        })
          .catch(() => {
            this.counter = 0
            this.loadingCoverPhoto = false;
            this.fileList = []
          })
      }
    },

    uploadProfilePhoto (info) {
      this.loadingProfilePhotoUpload = true;
      this.counter++
      if (this.counter <= 1) {
        this.handleUploadPhotos(info, "profile_photo",
          this.userDetails?.profile?.id, this.profileFileList).then(() => {
          this.fetchPhotographerProfile()
          this.getSetCurrentUser()
          this.loadingProfilePhotoUpload = false;
          this.counter = 0
        }).catch(() => {
          this.loadingProfilePhotoUpload = false;
          this.counter = 0
        })
      }

    },
    attemptSubmit (){
      delete this.formState.profile
      store.dispatch('putData',
          {url:'users', id:this.formState?.id, data: this.formState})
        .then(()=>{
          // update local storage
          this.updateLocalStorageUserDetails()
          })
    },
    updateLocalStorageUserDetails(){
      store.dispatch("fetchList", {
        url: `users/get-current-user/`
      }).then(resp => {
        localStorage.removeItem("piczanguUserDetails")
        localStorage.setItem("piczanguUserDetails", JSON.stringify(resp.data))
        localStorage.setItem("piczanguUserDetails", JSON.stringify(resp.data))
        this.localStorageUser = resp.data
      })
    },
    handleFailedSubmit(){
      console.log('errors')
    },
    currentUser(){
      this.loggedUser = JSON.parse(localStorage.getItem("piczanguUserDetails"))
    },

    performOnMount(){
      this.currentUser()
      this.fetchPhotographerProfile()
    }
  },
  mounted() {
    this.performOnMount()
    allowedUsers('all')

  },
  // watch: {
  //   imageList: {
  //     handler: function () {
  //       this.checkLimit();
  //     },
  //     deep: true,
  //   },
  // }
}
</script>

<style >
img {
  vertical-align: middle;
  border-style: none;
}

</style>