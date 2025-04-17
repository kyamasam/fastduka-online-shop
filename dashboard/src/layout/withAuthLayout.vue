<template>
  <AuthenticationWrap
    :style="{
      backgroundImage: `url('${require('../static/img/admin-bg-light.png')}')`,
    }"
  >
    <div class="ninjadash-authentication-wrap">
      <div class="ninjadash-authentication-brand">
        <img :src="require('../static/img/Logo_Dark.svg')" alt="" />
      </div>
      <router-view></router-view>
    </div>
  </AuthenticationWrap>
</template>
<script>
import { Aside, Content, AuthenticationWrap } from "./style";

const AuthLayout = {
  name: "AuthLayout",
  components: { Aside, Content, AuthenticationWrap },
};

export default AuthLayout;
</script>
