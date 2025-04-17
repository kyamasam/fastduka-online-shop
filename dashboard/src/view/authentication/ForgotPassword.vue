<template>
  <a-row justify="center">
    <a-col :xxl="6" :xl="12" :md="12" :sm="18">
      <AuthWrapper>
        <div class="ninjadash-authentication-top">
          <h2 class="ninjadash-authentication-top__title">Forgot Password?</h2>
        </div>
        <div class="ninjadash-authentication-content">
          <a-form @finish="handleSubmit" :model="formState" layout="vertical">
            <p class="forgot-text">
              Enter the email address you used when you joined and we’ll send
              you instructions to reset your password.
            </p>
            <a-form-item label="Email Address" name="email">
              <a-input
                type="email"
                v-model:value="formState.email"
                placeholder="name@example.com"
              />
            </a-form-item>
            <a-form-item>
              <sdButton
                class="btn-reset"
                htmlType="submit"
                type="primary"
                size="lg"
              >
                Send Reset Instructions
              </sdButton>
            </a-form-item>
            <p class="return-text">
              Return to <router-link to="/auth/login">Sign In</router-link>
            </p>
          </a-form>
        </div>
      </AuthWrapper>
    </a-col>
  </a-row>
</template>
<script>
import { reactive, defineComponent } from "vue";
import { AuthWrapper } from "./style";

const ForgotPassword = defineComponent({
  name: "ForgotPassword",
  components: { AuthWrapper },
  setup() {
    const handleSubmit = (values) => {
      console.log(values);
    };

    const formState = reactive({
      email: "",
    });

    return {
      handleSubmit,
      formState,
    };
  },
});

export default ForgotPassword;
</script>
