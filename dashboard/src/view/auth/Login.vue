<template>
  <BaseAuth :is-registration="false" title="Sign In">
    <div class="w-full h-full">
      <a-form
        :model="formState"
        layout="vertical"
        name="register"
        @finish="handleSubmit"
        @finishFailed="handleFail"
      >
        <a-form-item
          :rules="[
            {
              required: true,
              message: 'Please input a valid email!',
              type: 'email',
            },
          ]"
          class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
          label="Email"
          name="email"
        >
          <a-input v-model:value="formState.email" placeholder="tron" />
        </a-form-item>
        <a-form-item
          :rules="[
            { required: true, message: 'Please a-input your password!' },
          ]"
          class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
          label="Password"
          name="password"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="Password"
            size="large"
            type="Password"
          />
        </a-form-item>

        <a-form-item>
          <p
            class="mb-0 text-sm font-medium text-body dark:text-white60 w-full flex justify-end"
          >
            <router-link
              :to="{ name: 'forgotPassword' }"
              class="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary w-fit"
            >
              Forgot Password?
            </router-link>
          </p>
        </a-form-item>

        <a-form-item>
          <!--        <router-link to="dashboard/home">-->
          <!--         -->
          <!--        </router-link>-->
          <el-button
            class="w-full bg-red-400 border-none hover:bg-red-500 focus:bg-red-500 rounded-none p-0 my-6 text-sm font-medium"
            html-type="submit"
            size="large"
            type="primary"
            @click="handleSubmit"
          >
            <BaseLoader v-if="loginLoading" />
            Sign In
          </el-button>
        </a-form-item>
      </a-form>
    </div>
  </BaseAuth>
</template>

<script>
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { AuthWrapper } from "./style";
import BaseAuth from "@/view/auth/BaseAuth";
import axios from "axios";
import router from "@/routes";
import store from "@/vuex/store";
import { ElNotification } from "element-plus";
import BaseLoader from "@/components/BaseLoader";
import { baseUrl } from "@/utility/constants";
import { raiseServerError } from "@/utility/functions";

export default {
  name: "login",
  components: {
    BaseLoader,
    BaseAuth,
    AuthWrapper,
    LeftCircleOutlined,
    RightCircleOutlined,
  },
  data() {
    return {
      formState: {},
      cssPropsBg: {
        backgroundImage: `url(${"@/static/img/auth/camera.png"})`,
      },
      loginError: false,
      loginSuccess: false,
      errMessage: "",
      loginLoading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.loginLoading = true;

      axios
        .post(`${baseUrl}token/`, {
          email: this.formState.email?.replace(" ", ""),
          password: this.formState?.password,
        })
        .then((response) => {
          localStorage.setItem(
            "piczanguAuthData",
            JSON.stringify(response.data)
          );
          store.state.loggedUser = response.data;
        })
        .then(() => {
          // fetch user information
          store
            .dispatch("fetchList", {
              url: `users/get-current-user/`,
            })
            .then((resp) => {
              this.loginLoading = false;

              ElNotification({
                title: "Success",
                type: "success",
                position: "top-right",
                message: "login successful",
              });
              store.state.userProfile = resp.data?.profile?.profile_photo;
              store.state.loggedUser = resp.data;

              const galleryCode = JSON.parse(
                localStorage.getItem("galleryCodeToFetch")
              );
              localStorage.setItem(
                "piczanguUserDetails",
                JSON.stringify(resp.data)
              );
              const userDetails = JSON.parse(
                localStorage.getItem("piczanguUserDetails")
              );
              console.log(userDetails, "w");

              setTimeout(() => {
                if (galleryCode) {
                  router.push({
                    name: "checkout",
                    params: { galleryId: galleryCode },
                  });
                } else {
                  if (userDetails?.user_type === "client") {
                    router.push({ path: "dashboard/galleries" });
                  } else {
                    router.push({ path: "dashboard/products" });
                  }
                }
              }, 100);
            });
        })
        .catch((err) => {
          console.log("err", err);
          this.loginLoading = false;
          raiseServerError(err);
        });
    },
    handleFail() {
      ElNotification({
        title: "Error",
        type: "warning",
        position: "top-right",
        message: "Make sure all details are filled correctly",
      });
    },
  },
};
</script>
