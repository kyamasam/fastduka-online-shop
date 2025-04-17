<template>
  <div class="">
    <PageHeaders
      title="Portfolio"
      :nav="{ app: 'Home', route: 'Photographer Portfolio' }"
      class="ninjadash-page-header-main"
    ></PageHeaders>

    <Main>
      <div
        class="flex flex-col gap-2 md:flex-row w-full items-center md:items-start md:gap-6"
      >
        <div
          style="border-bottom: 1px solid #f1f2f6"
          class="w-full md:max-w-[41.67%] lg:max-w-[33.33%] xl:max-w-[23.33%] bg-white flex items-center md:items-start justify-center py-8 rounded-t-[10px]"
        >
          <div class="px-[12.5px] w-full">
            <span class="">
              <figure class="relative w-fit mx-auto flex flex-col items-center">
                <img
                  :src="
                    loggedUser?.profile?.profile_photo !== null
                      ? loggedUser?.profile?.profile_photo
                      : 'https://wallpapers.com/images/high/pixel-landscape-1920-x-1080-modj7tzb2j6j6zc8.webp'
                  "
                  alt="image"
                  style="border-radius: 50%; height: 120px; width: 120px"
                  class="border-blue-700 p-1"
                />
                <p>@{{ loggedUser?.username }}</p>
              </figure>
            </span>
            <PhotographerRate
              v-if="photographerDetailsLength > 0"
              :portfolio="photographerDetails[0]"
            />
          </div>
        </div>

        <div class="w-full p-2 flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <div
              class="h-[200px] w-full rounded bg-center bg-cover"
              :style="{
                backgroundImage:
                  'url(' +
                  photographerDetails?.[0]?.photographer_profile?.cover_photo +
                  ')',
              }"
            ></div>

            <a-upload
              v-if="photographerDetailsLength > 0"
              v-model:file-list="fileList"
              :progress="{
                showInfo: true,
              }"
              :show-upload-list="{
                showPreviewIcon: true,
                showRemoveIcon: false,
              }"
              list-type="picture"
              accept=".jpg,.png,.jpeg"
              class="avatar-uploader w-full flex flex-col justify-center bg-gray-100 border border-dashed border-blue-400 p-4 rounded-lg"
              name="teaser"
              @change="handleChange"
              @remove="handleRemove"
            >
              <div
                class="ant-upload-drag-icon text-blue-400 w-full flex justify-center py-4"
              >
                <upload class="h-8 w-8"></upload>
              </div>
              <div class="flex flex-col items-center">
                <p class="ant-upload-text">
                  Click or drag file to this area to upload
                  <span class="font-bold"> cover photo </span>
                </p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </div>

              <base-loader v-if="loadingCoverPhotoUpload" />
            </a-upload>
            <p v-else>
              Create a portfolio first in order to update cover photo
            </p>

            <!--            <span class="py-2 flex gap-2"-->
            <!--                      v-if="photographerDetailsLength > 0"-->

            <!--                >-->
            <!--                  <a-upload-->
            <!--                    class="h-fit w-fit "-->
            <!--                    v-model:file-list="fileList"-->
            <!--                    @change="handleChange"-->
            <!--                    @remove="handleRemove"-->
            <!--                    name="avatar"-->
            <!--                    :maxCount="1"-->
            <!--                    accept=".jpg,.png,.jpeg"-->
            <!--                    :show-upload-list="false"-->
            <!--                  >-->
            <!--                    <a-button class="flex gap-2 items-center">-->
            <!--                      Change Cover Photo-->
            <!--                      <template #icon>-->
            <!--                        <upload class="h-4 w-4"/>-->
            <!--                      </template>-->
            <!--                    </a-button>-->
            <!--                  </a-upload>-->

            <!--                </span>-->

            <!--                <p v-else> Create a portfolio first in order to update cover photo</p>-->
          </div>

          <div class="bg-white w-full p-[12.5px] rounded-[8px]">
            <a-form
              class="md:mt-0"
              layout="vertical"
              name="register"
              @finish="attemptSubmit"
              @finishFailed="handleFailedSubmit"
              :model="formState"
            >
              <a-form-item
                :rules="[
                  {
                    required: true,
                    message: 'Please the Nature of your photography!',
                  },
                ]"
                label="Nature Of Photography"
                name="specialization_ids"
              >
                <a-select
                  v-model:value="formState.specialization_ids"
                  mode="multiple"
                  class="w-full rounded-lg"
                  style="border-radius: 8px"
                  size="large"
                  placeholder="Please select"
                  :options="options"
                ></a-select>
                <div class="p-1 bg-gray-50">
                  <h3 class="font-semibold underline">
                    Selected Specializations
                  </h3>
                  <a-tag
                    v-for="specialty in photographerDetails[0]?.specializations"
                    :key="specialty"
                    >{{ specialty?.name }}</a-tag
                  >
                </div>
              </a-form-item>

              <a-form-item
                :rules="[
                  { required: true, message: 'Please input your Tagline!' },
                ]"
                label="Tagline"
                name="name"
                property="name"
              >
                <a-input
                  size="small"
                  v-model:value="formState.name"
                  placeholder="tagline"
                  prop="name"
                />
              </a-form-item>

              <a-form-item
                :rules="[
                  { required: true, message: 'Please input your Description!' },
                ]"
                label="Bio/Description"
                name="description"
                property="description"
              >
                <a-textarea
                  class="rounded-lg w-full"
                  v-model:value="formState.description"
                  placeholder="Bio"
                />
              </a-form-item>
              <!--              {{photographerSpecialties}}-->

              <a-form-item
                :rules="[{ message: 'Please input your Hourly rate!' }]"
                label="Port Folio Gallery"
                v-if="photographerDetailsLength > 0 && !updatingCover"
                name="gallery"
                property="gallery"
              >
                <div class="clearfix">
                  <a-upload
                    v-model:file-list="fileList"
                    name="avatar"
                    :maxCount="10"
                    accept=".jpg,.png,.jpeg"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="true"
                  >
                    <div>
                      <loading-outlined v-if="loadingPhotos"></loading-outlined>
                      <plus-outlined v-else></plus-outlined>
                      <div class="ant-upload-text">Add Image</div>
                    </div>
                  </a-upload>
                  <a-button
                    :loading="loadingPhotos"
                    v-if="fileList.length"
                    class="w-fit rounded-md"
                    @click="submitMultipleImages()"
                  >
                    Save Portfolio Images
                  </a-button>

                  <div
                    v-if="photographerDetails[0]?.photos.length > 0"
                    class="flex flex-wrap gap-2"
                  >
                    <a-image-preview-group> </a-image-preview-group>
                    <a-image
                      v-for="photo in photographerDetails[0]?.photos"
                      :key="photo"
                      class="h-32 w-32"
                      :src="photo?.photo"
                    />
                  </div>
                  <!--                  <a-modal-->

                  <a-modal
                    :open="previewVisible"
                    :title="previewTitle"
                    @cancel="handleCancel"
                  >
                    <img
                      alt="example"
                      style="width: 100%"
                      :src="previewImage"
                    />
                  </a-modal>
                </div>

                <div
                  class="w-full flex items-start gap-2 flex-wrap"
                  v-if="!imageList.length < 0"
                >
                  <span
                    v-for="image in imageList"
                    class="h-32 w-32 ring-1 rounded"
                  >
                    <img alt="img" :src="image" />
                  </span>
                </div>
              </a-form-item>

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
    <!--    {{loggedUser}}-->
  </div>
</template>

<script>
import { Main } from "../../styled";

import BaseCameraIcon from "@/components/BaseCameraIcon";
import BaseLoader from "@/components/BaseLoader.vue";
import ButtonGroup from "@/components/buttons/ButtonGroup";
import PageHeaders from "@/components/pageHeaders/PageHeaders";
import { allowedUsers } from "@/utility/functions";
import PhotographerRate from "@/view/auth/profile/components/PhotographerRate";
import store from "@/vuex/store";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons-vue";
import {
  CirclePlusFilled,
  Delete,
  Refresh,
  Upload,
} from "@element-plus/icons-vue";
import { ElButton, ElNotification, ElUpload } from "element-plus";
import mapGetters from "vuex";

export default {
  name: "",
  components: {
    BaseLoader,
    Delete,
    Refresh,
    PhotographerRate,
    Upload,
    CirclePlusFilled,
    BaseCameraIcon,
    ButtonGroup,
    PageHeaders,
    Main,
    ElButton,
    ElUpload,
    PlusOutlined,
    LoadingOutlined,
  },
  data() {
    return {
      complete: false,
      loggedUser: null,
      formState: {},
      headers: {
        authorization: "authorization-text",
      },
      options: [],
      value2: [],
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
      loadingCoverPhotoUpload: false,
      photographerDetails: [],
      photographerDetailsLength: 0,
      portFolioGalleryImages: [],
      photographerSpecialtyLoading: false,
      photographerSpecialties: [],
      loadingPhotos: false,
      togglePhotographerRate: false,
      imageUrl: "",
      imageList: [],
      updatingCover: false,
      profileUrl: "",
      info: {
        file: {
          status: "uploading",
        },
      },
      showDelete: false,
      counter: 0,
    };
  },
  methods: {
    checkObjectLength() {
      // this.photographerDetailsLength = this.photographerDetails.length
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    attemptSubmit() {
      if (this.formState?.created_at) {
        store.dispatch("putData", {
          url: "photographer-portfolio",
          id: this.photographerDetails[0]?.id,
          data: { ...this.formState },
        });
      } else {
        store.dispatch("postData", {
          url: "photographer-portfolio",
          data: { ...this.formState },
        });
      }
    },
    handleFailedSubmit(err) {
      console.log("errors", err);
      err.errorFields.map((error) => {
        setTimeout(function () {
          ElNotification({
            title: `${error?.errors[0]}`,
            type: "warning",
            position: "top-right",
            message: `${error?.name[0]}`,
          });
        }, 200);
      });
    },
    handleCancel() {
      this.previewVisible = false;
      this.previewTitle = "";
    },
    formatAndDisplayPhotos() {
      let data = [];
      // this.photographerDetails?.photos.map(image=>{
      //   let newUrl = imageUrl?.replace('/media/media/', '/media/')
      //   data.push(newUrl )
      // })
      // this.imageList = data
    },
    handleChange(info) {
      this.counter++;
      if (this.counter <= 1) {
        this.loadingProfilePhotoUpload = true;
        this.handleUploadPhotos(
          info,
          "profile_cover_photo",
          this.photographerDetails[0]?.photographer_profile_id,
          this.fileList
        )
          .then(() => {
            this.loadingProfilePhotoUpload = false;
            this.counter = 0;
            this.photographerPortfolio();
            this.getSetCurrentUser();
            this.fileList = [];
          })
          .catch(() => {
            this.counter = 0;
            this.loadingProfilePhotoUpload = false;
            this.fileList = [];
          });
      }
    },

    submitMultipleImages() {
      this.loadingPhotos = true;
      this.info.file.status = "submit";
      this.handleUploadPhotos(
        this.info,
        "portfolio_photo",
        this.photographerDetails[0]?.id,
        this.fileList
      )
        .then(() => {
          this.loadingPhotos = false;
          this.photographerPortfolio();
        })
        .catch(() => {
          this.loadingPhotos = true;
        });
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    formatImageUrl() {
      // this.imageUrl= ''
      // let imageUrl = this.photographerDetails.cover_photo
      // let newUrl = imageUrl.replace('/media/media/', '/media/')
      // this.imageUrl= newUrl
    },
    photographerPortfolio() {
      console.log("getting portfolio");
      this.loading = true;
      store
        .dispatch("fetchList", { url: "photographer-portfolio" })
        .then((res) => {
          const results = res?.data?.results;
          this.photographerDetails = results;
          this.formState = { ...results?.[0] };
          this.formState.specialization_ids =
            results?.[0]?.specializations?.map((item) => item.id);
          if (results?.[0].hasOwnProperty("id")) {
            this.photographerDetailsLength = 4;
          }
          this.loading = false;
          this.formatImageUrl();
          this.formatAndDisplayPhotos();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getPhotographerSpecialty() {
      this.photographerSpecialtyLoading = true;
      store
        .dispatch("fetchList", { url: "photography-specialty" })
        .then((res) => {
          const results = res.data?.results.map((item) => ({
            label: `${item?.name}`,
            value: item?.id,
          }));

          this.options = results;
          this.photographerSpecialties = results;
        });
    },

    formatProfileUrl() {
      // this.profileUrl = ''
      // let currentUrl = this.loggedUser?.profile?.profile_photo
      // let newUrl = currentUrl.replace('/media/media/', '/media/')
      // this.profileUrl = newUrl
    },
    currentUser() {
      this.loggedUser = JSON.parse(localStorage.getItem("piczanguUserDetails"));
      this.formatProfileUrl();
    },

    performOnMount() {
      this.currentUser();
      this.photographerPortfolio();
      this.getPhotographerSpecialty();
    },
  },
  mounted() {
    this.performOnMount();
    allowedUsers("photographer");
  },
  computed: {
    ...mapGetters["getProfileImage"],
  },
};
</script>

<style>
.max {
  @apply flex flex-col;
}

img {
  vertical-align: middle;
  border-style: none;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
  border-radius: 8px;
}
</style>
