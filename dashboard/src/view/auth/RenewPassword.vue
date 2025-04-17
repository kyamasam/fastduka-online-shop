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
            class="hidden"
            :rules="[{ required: true, message: 'Please input reset code!' }]"
            label="Reset Code"
            name="code"
            property="code"
        >
          <a-input size="small" v-model:value="formState.code" placeholder="X6734"/>
        </a-form-item>
        <a-form-item
          :rules="[
            { required: true, message: 'Please input your email!'},
            { message: 'Please input a valid email!', type:'email'}
        ]"
          class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"

          label="Email Address"
          name="email"
        >
          <a-input size="small" v-model:value="formState.email"  placeholder="name@example.com"/>
        </a-form-item>

        <a-form-item

            :rules="[{ required: true, message: 'Please input your password!' }]"
            class=" [&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
            label="New Password"
            name="password"
        >
          <a-input-password class="py-3" size="large" v-model:value="formState.password" placeholder="Password" type="Password"/>
        </a-form-item>
<!--        <a-form-item-->
<!--            :rules="[{ required: true, message: 'Passwords do not match !' }]"-->
<!--            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"-->
<!--            label="Confirm Password"-->
<!--            name="confirmPassword"-->
<!--        >-->
<!--          <a-input-password size="large" v-model:value="formState.password" placeholder="Password" type="Password"/>-->
<!--        </a-form-item>-->


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
            Reset Password
          </sdButton>
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
import router from "@/routes";
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
        code:''
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
      const postData ={
        email: this.formState?.email,
        "password_reset_code" : this.formState?.code,
        password: this.formState?.password
      }
      axios
          .post(`${baseUrl}users/reset-password/`, postData)
          .then(() => {
            this.loginLoading = false
            router.push({name: 'login'})
            ElNotification({
              title: "Success",
              type: "success",
              position: "top-right",
              message: "Password Changed Succesfully"
            })
          })
          .catch(err => {
            // this.loginError = true
            this.loginLoading = false
            // router.push({name: 'login'})
            err?.response?.data?.errors?.forEach(obj=>{
              ElNotification({
                title: `${obj?.code[0]?.toUpperCase()}${obj?.code?.substring(1)}`,
                type: "error",
                position: "top-right",
                message: obj?.detail
              })
            })
          })
    },
    handleFail() {
      ElNotification({
        title: "Error",
        type: "error",
        position: "top-right",
        message: "Fill all required fields"
      })
    }
  },
  mounted(){
    this.formState.code = this.$route?.params?.passwordResetCode
  }
};
</script>

