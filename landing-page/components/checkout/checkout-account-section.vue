<template>
  <form @submit.prevent="handleSubmit">
    <div class="tp-checkout-bill-form">
      <div class="tp-checkout-bill-inner">
        <!-- Step Indicator -->
        <div class="checkout-steps mb-4">
          <div class="steps-container d-flex justify-content-between align-items-center">
            <div class="step-item"
                 :class="{ active: currentStep === 1, completed: currentStep > 1 }"
                 @click="currentStep = 1">
              <div class="step-number">1</div>
              <div class="step-label">Account Information</div>
            </div>
            <div class="step-divider"></div>
            <div class="step-item"
                 :class="{ active: currentStep === 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-label">Delivery Information</div>
            </div>
          </div>
        </div>

        <!-- Step 1: Account Information -->
        <div v-show="currentStep === 1"
             class="checkout-step">
          <!-- Login/Create Account Toggle -->
          <div class="auth-mode-toggle mb-4">
            <div class="toggle-buttons">
              <button type="button"
                      :class="{ active: !isLoginMode }"
                      @click="isLoginMode = false">
                Create Account
              </button>
              <button type="button"
                      :class="{ active: isLoginMode }"
                      @click="isLoginMode = true">
                Login
              </button>
            </div>
          </div>

          <!-- Login Mode -->
          <div v-if="isLoginMode"
               class="login-form">
            <div class="row">
              <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Your Email</label>
                  <input v-model="loginData.email"
                         type="email"
                         placeholder="yourname@mail.com"
                         required
                         @input="hasUserTyped = true" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Password</label>
                  <input v-model="loginData.password"
                         type="password"
                         placeholder="Min. 6 character"
                         required
                         @input="hasUserTyped = true" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="login-options d-flex justify-content-between align-items-center">
                  <div class="remember-me">
                    <input type="checkbox"
                           id="remember-me"
                           v-model="loginData.rememberMe" />
                    <label for="remember-me"
                           class="ml-2">Remember me</label>
                  </div>
                  <a href="#"
                     class="forgot-password"
                     @click.prevent="handleForgotPassword">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Create Account Mode -->
          <div v-else
               class="create-account-form">
            <div class="row">
            <div class="col-md-6">
              <div class="tp-checkout-input">
                <label>First Name <span>*</span></label>
                <input v-model="formData['first_name']"
                       type="text"
                       placeholder="First Name"
                       required
                       @input="hasUserTyped = true" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="tp-checkout-input">
                <label>Last Name <span>*</span></label>
                <input v-model="formData['last_name']"
                       type="text"
                       placeholder="Last Name"
                       required
                       @input="hasUserTyped = true" />
              </div>
            </div>
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label>Email <span>*</span></label>
                <input required
                       v-model="formData['email']"
                       type="email"
                       placeholder="Email"
                       @input="hasUserTyped = true" />
              </div>
            </div>
            <div v-if="currentUserData === undefined || Object.keys(currentUserData).length === 0"
                 class="col-md-12">
              <div class="tp-checkout-input">
                <label>Password <span>*</span></label>
                <input required
                       v-model="formData['password']"
                       type="password"
                       placeholder="******"
                       @input="hasUserTyped = true" />
              </div>
            </div>
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label>Phone <span>*</span></label>
                <div class="flex">
                  <select required
                          v-model="formData['phone_code']"
                          class="border"
                          type="select"
                          @change="hasUserTyped = true">
                    <option value="+254"
                            label="+254" />
                  </select>
                  <input required
                         v-model="formData['phone_number']"
                         type="text"
                         placeholder=""
                         maxlength="9"
                         @input="hasUserTyped = true" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Delivery Information -->
        <div v-show="currentStep === 2"
             class="checkout-step">
          <div class="row">
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label>Delivery Location <span>*</span></label>
                <LocationSearch :default_latitude="formData?.profile?.latitude"
                                :default_longitude="formData?.profile?.longitude"
                                :location_address="formData?.profile?.address"
                                @location-selected="handleLocationSelected" />
              </div>
            </div>
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label>House No / Office No. <span>*</span></label>
                <input required
                       v-model="formData['profile']['suite_number']"
                       type="text"
                       placeholder="Apartment, suite, unit, etc."
                       @input="hasUserTyped = true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="checkout-navigation">
      <button v-if="currentStep === 2"
              type="button"
              class="tp-checkout-btn tp-checkout-btn-secondary w-100 mb-2"
              @click="currentStep = 1">
        Back
      </button>

      <button v-if="currentStep === 1 && isLoginMode"
              type="button"
              class="tp-checkout-btn w-100"
              @click="handleLogin">
        Login
      </button>

      <button v-if="currentStep === 1 && !isLoginMode"
              type="button"
              class="tp-checkout-btn w-100"
              @click="goToNextStep">
        Continue to Delivery
      </button>

      <button v-if="currentStep === 2 && (currentUserData === undefined || Object.keys(currentUserData).length === 0)"
              type="submit"
              class="tp-checkout-btn w-100">
        Create Account
      </button>

      <button v-else-if="currentStep === 2"
              type="submit"
              class="tp-checkout-btn w-100">
        Update Profile
      </button>
    </div>

    <div v-if="isUpdating"
         class="text-center mt-2 text-gray-600">
      <p>Automatically saving changes...</p>
    </div>
    <div v-if="lastUpdated"
         class="text-center mt-2 text-green-600">
      <p>Last updated: {{ lastUpdated }}</p>
    </div>
  </form>
</template>

<script setup>
import { useUserStore } from "@/pinia/useUserDataStore";
import _ from "lodash";
import { toast } from "vue3-toastify";
const store = useUserStore();

const currentStep = ref(1);
const isLoginMode = ref(false);

const loginData = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const formData = ref({
  first_name: "",
  last_name: "",
  profile: {
    suite_number: "",
    latitude: null,
    longitude: null,
    address: "",
  },
  phone_code: "+254",
  password: "",
  phone_number: "",
  email: "",
});

// Auto-update functionality
const isUpdating = ref(false);
const lastUpdated = ref("");
const hasUserTyped = ref(false);

const handleLogin = async () => {
  // Validate login fields
  if (!loginData.value.email || !loginData.value.password) {
    toast.error("Please enter your email and password");
    return;
  }

  try {
    const { data, error } = await getDataUnauthed("/token/", {
      method: "POST",
      body: {
        email: loginData.value.email,
        password: loginData.value.password,
      },
    });

    if (!error.value) {
      const loginToken = useCookie("currentUser");
      loginToken.value = data.value;
      await getUserWithToken(loginToken?.value?.access);
      toast.success("Login successful");

      // Move to step 2
      currentStep.value = 2;
    } else {
      toast.error("Invalid email or password");
    }
  } catch (e) {
    console.error(e);
    toast.error("Login failed. Please try again");
  }
};

const handleForgotPassword = () => {
  toast.info("Password reset functionality coming soon");
  // TODO: Implement forgot password functionality
};

const goToNextStep = () => {
  // Validate step 1 fields
  if (!formData.value.first_name || !formData.value.last_name ||
    !formData.value.email || !formData.value.phone_number) {
    toast.error("Please fill in all required fields");
    return;
  }

  // Check password for new users
  if ((currentUserData.value === undefined || Object.keys(currentUserData.value).length === 0)
    && !formData.value.password) {
    toast.error("Please enter a password");
    return;
  }

  currentStep.value = 2;
};

const handleLocationSelected = (location) => {
  console.log("Selected location: *****", location);
  formData.value.profile.address = location?.address;
  formData.value.profile.latitude = location?.lat;
  formData.value.profile.longitude = location?.lng;
  hasUserTyped.value = true;
};

const logout = () => {
  try {
    const user = useCookie("userData");
    user.value = undefined;
  } catch (e) {
    console.error(e);
  }
};

const updateUser = async (isAutomaticUpdate = false) => {
  const url = `/users/${currentUserData?.value?.id}/`;
  isUpdating.value = true;

  const method = "PATCH";
  const { error } = await getData(url, {
    method: method,
    body: {
      first_name: formData?.value?.first_name,
      last_name: formData?.value?.last_name,
      email: formData?.value?.email,
      phone_code: formData?.value?.phone_code,
      phone_number: formData?.value?.phone_number,
      profile: {
        suite_number: formData?.value?.profile?.suite_number,
        address: formData?.value?.profile?.address,
        latitude: formData?.value?.profile?.latitude,
        longitude: formData?.value?.profile?.longitude,
      },
    },
  });

  if (error?.value) {
    error.value?.cause?.errors?.map((e) => {
      toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
    });

    toast.error(
      `Failed to update profile ${isAutomaticUpdate ? "automatically" : ""}`
    );
    isUpdating.value = false;
    throw error;
  } else {
    await getCurrentUser();
    const now = new Date();
    lastUpdated.value = now.toLocaleTimeString();
    toast.success(
      `Profile updated ${isAutomaticUpdate ? "automatically" : ""}`
    );
    isUpdating.value = false;
    return;
  }
};

const debouncedUpdateProfile = _.debounce(async () => {
  if (currentUserData?.value?.id) {
    updateUser();
  }
}, 2000);

const handleSubmit = async () => {
  // Validate step 2 fields
  if (!formData.value.profile.address || !formData.value?.profile?.suite_number) {
    toast.error("Please fill in all delivery information");
    return;
  }

  await updateRegisterUser();
};

const updateRegisterUser = async () => {
  let url = "/users/";
  let method = "POST";
  let data = null;
  let error = null;
  console.log("user", currentUserData);

  if (currentUserData?.value?.id) {
    updateUser();
  } else {
    logout();
    ({ data, error } = await getDataUnauthed(url, {
      method: "POST",
      body: {
        first_name: formData?.value?.first_name,
        last_name: formData?.value?.last_name,
        email: formData?.value?.email,
        password: formData?.value?.password,
        phone_code: formData?.value?.phone_code,
        phone_number: formData?.value?.phone_number,
        profile: {
          suite_number: formData?.value?.profile?.suite_number,
          address: formData?.value?.profile?.address,
          latitude: formData?.value?.profile?.latitude,
          longitude: formData?.value?.profile?.longitude,
        },
      },
    }));

    if (error?.value) {
      error.value?.cause?.errors?.map((e) => {
        toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
      });
    } else {
      toast.success("Account Created Successfully");
      autoLoginUser(formData?.value?.email, formData?.value?.password);
    }
  }
};

const autoLoginUser = async (email, password) => {
  const email_field = email;
  const password_field = password;
  const { data, error } = await getDataUnauthed("/token/", {
    method: "POST",
    body: {
      email: email_field,
      password: password_field,
    },
  });

  if (!error.value) {
    const loginData = useCookie("currentUser");
    loginData.value = data.value;
    await getUserWithToken(loginData?.value?.access);
  } else {
    console.log("we hare ");
  }
};

const isLoggedIn = computed(() => {
  return Object.keys(store?.currentUserData).length;
});

const route = useRoute();

watch(
  () => route.path,
  async () => {
    console.log("watch", store.currentUserData);
    Object.assign(formData.value, store.currentUserData);
  }
);

watch(
  formData,
  () => {
    console.log("formdata changed", currentUserData.value);
    Object.assign(currentUserData.value, formData.value);

    if (currentUserData?.value?.id && hasUserTyped.value) {
      debouncedUpdateProfile();
      hasUserTyped.value = false;
    }
  },
  { deep: true }
);

const currentUserData = useCookie("userData");

onMounted(async () => {
  if (currentUserData.value) {
    Object.assign(formData.value, currentUserData.value);
  } else {
    Object.assign(formData.value, {
      first_name: "",
      last_name: "",
      profile: {
        suite_number: "",
        address: "",
      },
      phone_code: "+254",
      password: "",
      phone_number: "",
      email: "",
    });
  }
});

watch(currentUserData, () => {
  console.log("changed", currentUserData.value);
  if (currentUserData.value) {
    Object.assign(formData.value, {
      ...currentUserData.value,
      profile: {
        suite_number: currentUserData?.value?.profile?.suite_number || "",
        address: currentUserData?.value?.profile?.address || "",
        latitude: currentUserData?.value?.profile?.latitude || null,
        longitude: currentUserData?.value?.profile?.longitude || null,
      },
    });
  }
});
</script>

<style scoped>
.checkout-steps {
  padding: 20px 0;
}

.steps-container {
  max-width: 500px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 14px;
  color: #999;
  text-align: center;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background-color: #0989ff;
  color: white;
}

.step-item.active .step-label {
  color: #0989ff;
  font-weight: 600;
}

.step-item.completed .step-number {
  background-color: #28a745;
  color: white;
}

.step-item.completed .step-label {
  color: #28a745;
}

.step-divider {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 10px;
  margin-bottom: 30px;
}

.checkout-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tp-checkout-btn-secondary {
  background-color: #6c757d;
}

.tp-checkout-btn-secondary:hover {
  background-color: #5a6268;
}

.checkout-navigation {
  margin-top: 20px;
}

/* Auth Mode Toggle */
.auth-mode-toggle {
  margin-bottom: 30px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 8px;
}

.toggle-buttons button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.toggle-buttons button.active {
  background: #0989ff;
  color: white;
  box-shadow: 0 2px 4px rgba(9, 137, 255, 0.2);
}

.toggle-buttons button:hover:not(.active) {
  background: rgba(9, 137, 255, 0.1);
}

/* Login Form */
.login-options {
  margin-top: 15px;
  padding-top: 10px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input[type="checkbox"] {
  width: auto;
  margin: 0;
  margin-right: 8px;
  cursor: pointer;
}

.remember-me label {
  margin: 0;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.forgot-password {
  color: #ff0000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #cc0000;
  text-decoration: underline;
}
</style>