<template>
  <BaseAuth>
    <template #default>
      <a-form :model="formState"
              class=" md:mt-0"
              layout="vertical"
              name="register"
              @finish="handleSubmit"
              @finishFailed="handleFailedSubmit">
        <a-form-item
            :rules="[{ message: 'Please input your First name!' }]"
            label="First Name"
            name="first_name"
            property="first_name"
        >
          <a-input v-model:value="formState.first_name" placeholder="First name" size="small"/>
        </a-form-item>
        <a-form-item
            :rules="[{message: 'Please input your Last name!' }]"
            label="Last Name"
            name="last_name"
            property="last_name"
        >
          <a-input v-model:value="formState.last_name" placeholder="Last name" size="small"/>
        </a-form-item>
        <a-form-item
            :rules="[
                { required: true, message: 'Please input your phone number!' },
              ]"
            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
            label="Phone"
            name="phone_number"
            property="phone_number"
        >
          <a-input-group compact>
            <select id="countries"
                    v-model="formState.phone_code"
                    class=" w-2/12 pt-2 h-12 bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                     dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    style="background-color: #f9fafb">
              <option selected value="+254">+254</option>
              <option value="+254">+255</option>
              <option value="+254">+256</option>
            </select>
            <input id="phone" v-model="formState.phone_number"
                   class=" h-12 w-10/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="716651612"
                   type="text">

          </a-input-group>
        </a-form-item>
        <a-form-item
            :rules="[{ required: true, message: 'Please input your email!', type: 'email' }]"
            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
            label="Email Address"
            name="email"
            property="email"
        >
          <a-input v-model:value="formState.email" placeholder="name@example.com"/>
        </a-form-item>
        <a-form-item
            :rules="[{ required: true, message: 'Please select purpose!' }]"
            label="How do you intent to use this platform"
            name="user_type"
            property="user_type"
        >
          <a-select

              v-model:value="formState.user_type"

              class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
              size="large">
            <a-select-option value="client">To Download Photos</a-select-option>

            <a-select-option value="photographer">To Share Photos</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            :rules="[{ required: true, message: 'Please input your username!' }]"
            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
            label="Username"
            name="username"
            property="username"
        >
          <a-input v-model:value="formState.username" placeholder="tron" size="large" type="text"/>
        </a-form-item>
        <a-form-item
            :rules="[{ required: true, message: 'Please input your password!' }]"
            class="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
            label="Password"
            name="password"
            property="password"
        >
          <a-input-password v-model:value="formState.password" placeholder="Password" size="large" type="Password"/>
        </a-form-item>
        <div class="flex items-center justify-between">
          <a-form-item
              :rules="[{ required: true, message: 'Please accept terms accept to proceed' }]"
              name="accepted_terms">
            <a-checkbox v-model:checked="formState.accepted_terms">
              Creating an account means you’re okay with our Terms of Service and Privacy Policy
            </a-checkbox>
          </a-form-item>

        </div>
        <a-form-item>
          <sdButton
              class="w-full h-12 p-0 my-6 text-sm font-medium"
              htmlType="submit"
              size="large"
              type="primary"
          >
            <BaseLoader v-if="registerLoading"/>
            Create Account
          </sdButton>
        </a-form-item>
      </a-form>
    </template>

    <template #footer>
      <p class="mb-0 text-sm font-medium text-body dark:text-white">
        Already have an account?
        <router-link class="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary" to="/">
          Sign In
        </router-link>
      </p>
    </template>
  </BaseAuth>

</template>

<script>
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons-vue"
import {AuthWrapper} from "./style"
import BaseAuth from "@/view/auth/BaseAuth"
import axios from "axios"
import router from "@/routes"
import {ElNotification} from "element-plus"
import BaseLoader from "@/components/BaseLoader"
import {baseUrl} from "@/utility/constants"
import {raiseServerError} from "@/utility/functions"

export default {
  name: "login",
  components: {
    BaseLoader,
    BaseAuth,
    AuthWrapper,
    LeftCircleOutlined,
    RightCircleOutlined
  },
  data() {
    return {
      formState: {
        phone_code: '+254'
      },
      cssPropsBg: {
        backgroundImage: `url(${"@/static/img/auth/camera.png"})`
      },
      registerLoading: false
    }
  },
  methods: {
    handleSubmit() {

      this.registerLoading = true
      axios
          .post(`${baseUrl}users/`, {...this.formState})
          .then((response) => {
            this.registerLoading = false

            ElNotification({
              title: "Success",
              type: "success",
              position: "top-right",
              message: "registration successful"
            })

            router.push({name: "login"})
          })
          .catch(err => {
            // this.loginError = true
            this.registerLoading = false
            console.log(err.response.data)
            raiseServerError(err)
            // store.commit('loginErr')
          })
    },
    handleFailedSubmit() {
      ElNotification({
        title: "ERROR",
        type: "error",
        position: "top-right",
        message: "Make Sure all the fields are filled correctly"
      })
    }
  }
}
</script>

<style scoped>
/* For demo */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}

.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}

.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.site-input-group-wrapper .site-input-split {
  background-color: #fff;
}

.site-input-group-wrapper .site-input-right {
  border-left-width: 0;
}

.site-input-group-wrapper .site-input-right:hover,
.site-input-group-wrapper .site-input-right:focus {
  border-left-width: 1px;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right {
  border-right-width: 0;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right:hover,
.site-input-group-wrapper .ant-input-rtl.site-input-right:focus {
  border-right-width: 1px;
}

[data-theme='dark'] .site-input-group-wrapper .site-input-split {
  background-color: transparent;
}
</style>
