<template>
  <form @submit="onSubmit">
    <div class="tp-login-input-wrapper">
      <div class="tp-login-input-box">
        <div class="tp-login-input">
          <input
            id="email"
            type="email"
            placeholder="yourname@mail.com"
            v-bind="email"
          />
        </div>
        <div class="tp-login-input-title">
          <label for="email">Your Email</label>
        </div>
      </div>
      <div class="tp-login-input-box">
        <div class="p-relative">
          <div class="tp-login-input">
            <input
              id="tp_password"
              :type="showPass ? 'text' : 'password'"
              name="password"
              placeholder="Min. 6 character"
              v-bind="password"
            />
          </div>
          <div class="tp-login-input-eye" id="password-show-toggle">
            <span class="open-eye" @click="togglePasswordVisibility">
              <template v-if="showPass">
                <svg-open-eye />
              </template>
              <template v-else>
                <svg-close-eye />
              </template>
            </span>
          </div>
          <div class="tp-login-input-title">
            <label for="tp_password">Password</label>
          </div>
        </div>
        <err-message :msg="errors.password" />
      </div>
    </div>
    <div
      class="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20"
    >
      <div class="tp-login-remeber">
        <input id="remeber" type="checkbox" />
        <label for="remeber">Remember me</label>
      </div>
      <div class="tp-login-forgot">
        <nuxt-link href="/forgot">Forgot Password?</nuxt-link>
      </div>
    </div>
    <div class="tp-login-bottom">
      <button type="submit" class="tp-login-btn w-100">Login</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from "@/pinia/useUserDataStore";
import { useForm } from "vee-validate";
import { toast } from "vue3-toastify";
import * as yup from "yup";
let showPass = ref<boolean>(false);
const store = useUserStore();
interface IFormValues {
  email?: string | null;
  password?: string | null;
}
const { errors, handleSubmit, defineInputBinds, resetForm } =
  useForm<IFormValues>({
    validationSchema: yup.object({
      email: yup.string().required().email().label("Email"),
      password: yup.string().required().min(6).label("Password"),
    }),
  });

const email = defineInputBinds("email");
const password = defineInputBinds("password");

const onSubmit = handleSubmit(async (values) => {
  const email_field = email?.value?.value;
  const password_field = password?.value?.value;
  const user = useCookie("currentUser");
  console.log("submitting", email_field, password_field);
  const { data: loginData, error: loginError } = await getDataUnauthed(
    "/token/",
    {
      method: "POST",
      body: {
        email: email_field,
        password: password_field,
      },
    }
  );

  console.log("lged in ", loginData, loginError);

  if (!loginError.value) {
    try {
      user.value = loginData?.value;
    } catch (e) {
      console.log("error setting user value in cookie");
      console.error(e);
    }
    toast.success("Login Success");

    // fetch user

    getCurrentUser();
  } else {
    loginError?.value?.data?.errors.map((er: any) => {
      toast.error(`${er?.attr?.replace("_", " ")} ${er?.detail}`);
    });
  }
});

const togglePasswordVisibility = () => {
  showPass.value = !showPass.value;
};
</script>
