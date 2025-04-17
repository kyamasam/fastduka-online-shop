<template>
  <BaseAuth :is-registration="false" title="Forgot Password ?">
    <div class="w-full ">
      <a-form
          :model="formState"
          layout="vertical"
          name="register"
          @finish="handleSubmit"
          @finishFailed="handleFail">
        <a-form-item
            :rules="[
            { required: true, message: 'Please input your email!'},
            { message: 'Please input a valid email!', type:'email'}
        ]"
            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60
            [&>div>div>label]:font-medium"
            label="Email Address"
            name="email"
        >
          <a-input v-model:value="formState.email"  placeholder="name@example.com"/>
        </a-form-item>

        <a-form-item>
          <!--        <router-link to="dashboard/home">-->
          <!--         -->
          <!--        </router-link>-->
          <sdButton
              class="w-full h-12 p-0 my-6 text-sm font-medium"
              html-type="submit"
              size="large"
              type="primary"
          >
            <BaseLoader v-if="loginLoading"/>
            Send Reset Code
          </sdButton>
        </a-form-item>

        <a-form-item>
          <p class="mb-0 text-sm font-medium text-body dark:text-white60">
            Return to
            <router-link class="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary" to="/">
              Sign in
            </router-link>
          </p>
        </a-form-item>
      </a-form>
    </div>


  </BaseAuth>
</template>

<script>
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons-vue";
import {AuthWrapper} from "./style";
import BaseAuth from "@/view/auth/BaseAuth"
import axios from "axios";
import store from "@/vuex/store";
import {ElNotification} from 'element-plus'
import BaseLoader from "@/components/BaseLoader";
import { baseUrl } from "@/utility/constants"

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
      formState: {
        email: "",
      },
      cssPropsBg: {
        backgroundImage: `url(${"@/static/img/auth/camera.png"})`,
      },
      loginError: false,
      loginSuccess: false,
      errMessage: '',
      loginLoading:false
    };
  },
  methods: {
    handleSubmit() {
      this.loginLoading = true
      store.commit('loginBegin')
      axios
          .post(`${baseUrl}users/send-reset-link/`, {...this.formState})
          .then(() => {
            ElNotification({
              title: "Success",
              type: "success",
              position: "top-right",
              message: "Password Reset Link Sent Successfully. Check your email"
            })
            this.loginLoading = false
            // router.push({name: 'renewPassword'})
          })
          .catch(err => {
            // this.loginError = true
            this.loginLoading = false
            err?.response?.data?.errors?.forEach(obj=>{
              ElNotification({
                title: `${obj?.code[0]?.toUpperCase()}${obj?.code?.substring(1)}`,
                type: "error",
                position: "top-right",
                message: obj?.detail
              })
            })

            // store.commit('loginErr')
          })
    },
    handleFail() {
      ElNotification({
        title: "Error",
        type: "error",
        position: "top-right",
        message: "Enter a valid email address"
      })
    }
  },
};
</script>

