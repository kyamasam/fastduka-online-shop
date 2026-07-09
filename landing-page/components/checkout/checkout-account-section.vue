<template>
  <form @submit.prevent="handleSubmit">
    <div class="tp-checkout-bill-form">
      <div class="tp-checkout-bill-inner">
        <!-- Step 1: Account Information -->
        <div v-show="currentStep === 1"
             class="checkout-step">

          <!-- Login form (shown when user clicks "login" link) -->
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
              <div class="col-md-12 mt-2">
                <a href="#"
                   class="guest-link"
                   @click.prevent="isLoginMode = false">
                  Continue as guest instead
                </a>
              </div>
            </div>
          </div>

          <!-- Guest / Create Account form -->
          <div v-else
               class="guest-form">
            <div class="row">
              <!-- Phone number — always shown -->
              <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Phone <span>*</span></label>
                  <div class="flex">
                    <select v-model="formData['phone_code']"
                            class="border"
                            @change="hasUserTyped = true">
                      <option value="+254"
                              label="+254" />
                    </select>
                    <input required
                           v-model="formData['phone_number']"
                           type="text"
                           placeholder="7XXXXXXXX"
                           maxlength="9"
                           @input="hasUserTyped = true" />
                  </div>
                </div>
              </div>

              <!-- Create account checkbox -->
              <div class="col-md-12 mt-2 mb-3">
                <div class="create-account-check">
                  <input type="checkbox"
                         id="wants-account"
                         v-model="wantsAccount" />
                  <label for="wants-account">Create an account</label>
                </div>
              </div>

              <!-- Extra fields revealed when checkbox is ticked -->
              <template v-if="wantsAccount">
                <div class="col-md-6">
                  <div class="tp-checkout-input">
                    <label>First Name <span>*</span></label>
                    <input v-model="formData['first_name']"
                           type="text"
                           placeholder="First Name"
                           :required="wantsAccount"
                           @input="hasUserTyped = true" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="tp-checkout-input">
                    <label>Last Name <span>*</span></label>
                    <input v-model="formData['last_name']"
                           type="text"
                           placeholder="Last Name"
                           :required="wantsAccount"
                           @input="hasUserTyped = true" />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="tp-checkout-input">
                    <label>Email <span>*</span></label>
                    <input v-model="formData['email']"
                           type="email"
                           placeholder="Email"
                           :required="wantsAccount"
                           @input="hasUserTyped = true" />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="tp-checkout-input">
                    <label>Password <span>*</span></label>
                    <input v-model="formData['password']"
                           type="password"
                           placeholder="Min. 6 characters"
                           :required="wantsAccount"
                           @input="hasUserTyped = true" />
                  </div>
                </div>
              </template>

              <!-- Login link -->
              <div class="col-md-12 mt-2">
                <a href="#"
                   class="guest-link"
                   @click.prevent="isLoginMode = true">
                  Already have an account? Login
                </a>
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
                <LocationSearch v-if="deliveryLocationType === 'map'"
                                :default_latitude="formData?.profile?.latitude"
                                :default_longitude="formData?.profile?.longitude"
                                :location_address="formData?.profile?.address"
                                @location-selected="handleLocationSelected" />
                <div v-else
                     class="row">
                  <div class="col-md-6">
                    <select v-model="selectedCityId"
                            @change="handleCityChange"
                            class="w-100 border p-3">
                      <option :value="null"
                              disabled>Select city</option>
                      <option v-for="city in deliveryCities"
                              :key="city.id"
                              :value="city.id">{{ city.name }}</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <select v-model="selectedLocationId"
                            @change="handlePredefinedLocation"
                            class="w-100 border p-3"
                            :disabled="!selectedCity">
                      <option :value="null"
                              disabled>Select location</option>
                      <option v-for="location in selectedCity?.locations || []"
                              :key="location.id"
                              :value="location.id">
                        {{ location.name }} — {{ siteSettingsStore.currencySymbol }} {{ location.delivery_fee }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label>House Name and Number / Office Name and Number <span>*</span></label>
                <input required
                       v-model="formData['profile']['suite_number']"
                       type="text"
                       placeholder="Apartment, suite, unit, etc."
                       @input="hasUserTyped = true" />
              </div>
            </div>
            <div class="col-md-12">
              <div class="tp-checkout-input">
                <label for="delivery-note">Delivery Notes (Optional)</label>
                <textarea id="delivery-note"
                          v-model="deliveryNote"
                          rows="4"
                          maxlength="5000"
                          placeholder="Add directions or delivery instructions"></textarea>
                <small class="delivery-note-help">
                  You can also specify the name and phone number of the person we should contact for this delivery.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="checkout-navigation">
      <!-- Step 1 -->
      <div v-if="currentStep === 1"
           class="step-nav-row step-nav-row--end">
        <button v-if="isLoginMode"
                type="button"
                class="tp-checkout-btn step-nav-next"
                @click="handleLogin">
          Login
        </button>
        <button v-else
                type="button"
                class="tp-checkout-btn step-nav-next"
                @click="goToNextStep">
          Continue →
        </button>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2"
           class="step-nav-row">
        <button type="button"
                class="tp-checkout-btn tp-checkout-btn-secondary step-nav-back"
                @click="currentStep = 1">
          ← Back
        </button>
        <button type="submit"
                class="tp-checkout-btn step-nav-next">
          Continue →
        </button>
      </div>
    </div>

  </form>
</template>

<script setup>
import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";
import { useUserStore } from "@/pinia/useUserDataStore";
import _ from "lodash";
import { toast } from "vue3-toastify";

const emit = defineEmits(['step-changed', 'completed']);

const store = useUserStore();
const siteSettingsStore = useSiteSettingsStore();
const deliverySelection = useDeliverySelection();
const guestPhone = useGuestPhone();
const deliveryNote = useCookie('checkoutDeliveryNote', { default: () => '' });
const deliveryCities = ref([]);
const selectedCityId = ref(deliverySelection.value.cityId);
const selectedLocationId = ref(deliverySelection.value.locationId);
const deliveryLocationType = computed(() => siteSettingsStore.settings?.delivery_location_type || 'map');
const selectedCity = computed(() => deliveryCities.value.find((city) => city.id === selectedCityId.value));

const loadDeliveryCities = async () => {
  if (deliveryLocationType.value !== 'predefined') return;
  const { data, error, execute } = getDataUnauthed('/delivery-cities/');
  await execute();
  if (!error.value) deliveryCities.value = data.value?.results || data.value || [];
};

const handleCityChange = () => {
  selectedLocationId.value = null;
  deliverySelection.value = { cityId: selectedCityId.value, locationId: null, cityName: selectedCity.value?.name || '', locationName: '', deliveryFee: 0, latitude: null, longitude: null };
};

const handlePredefinedLocation = () => {
  const location = selectedCity.value?.locations?.find((item) => item.id === selectedLocationId.value);
  if (!location) return;
  const latitude = location.latitude ?? selectedCity.value.latitude ?? null;
  const longitude = location.longitude ?? selectedCity.value.longitude ?? null;
  deliverySelection.value = {
    cityId: selectedCity.value.id,
    locationId: location.id,
    cityName: selectedCity.value.name,
    locationName: location.name,
    deliveryFee: Number(location.delivery_fee),
    latitude,
    longitude,
  };
  formData.value.profile.address = `${location.name}, ${selectedCity.value.name}`;
  formData.value.profile.latitude = latitude;
  formData.value.profile.longitude = longitude;
  hasUserTyped.value = true;
};

const currentStep = ref(1);
const isLoginMode = ref(false);
const wantsAccount = ref(false);

watch(currentStep, (n) => emit('step-changed', n));

const setStep = (n) => { currentStep.value = n; };
defineExpose({ setStep });

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

const isUpdating = ref(false);
const lastUpdated = ref("");
const hasUserTyped = ref(false);

const handleLogin = async () => {
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
};

const goToNextStep = () => {
  if (!formData.value.phone_number) {
    toast.error("Please enter your phone number");
    return;
  }

  if (wantsAccount.value) {
    if (!formData.value.first_name || !formData.value.last_name ||
      !formData.value.email || !formData.value.password) {
      toast.error("Please fill in all account fields");
      return;
    }
  }

  // Save guest phone for payment section
  guestPhone.value = {
    phone_code: formData.value.phone_code || '+254',
    phone_number: formData.value.phone_number,
  };

  currentStep.value = 2;
};

const handleLocationSelected = (location) => {
  formData.value.profile.address = location?.address;
  formData.value.profile.latitude = location?.lat;
  formData.value.profile.longitude = location?.lng;
  hasUserTyped.value = true;
  deliverySelection.value = {
    cityId: null,
    locationId: null,
    cityName: '',
    locationName: location?.address || '',
    deliveryFee: Number(siteSettingsStore.settings?.default_delivery_fee || 0),
    latitude: location?.lat,
    longitude: location?.lng,
  };
};

const logout = () => {
  try {
    const user = useCookie("userData");
    user.value = undefined;
  } catch (e) {
    console.error(e);
  }
};

const updateUser = async () => {
  const url = `/users/${currentUserData?.value?.id}/`;
  isUpdating.value = true;

  const { error } = await getData(url, {
    method: "PATCH",
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
    toast.error("Failed to update profile");
    isUpdating.value = false;
    throw error;
  } else {
    await getCurrentUser();
    const now = new Date();
    lastUpdated.value = now.toLocaleTimeString();
    toast.success("Profile updated");
    isUpdating.value = false;
  }
};

const debouncedUpdateProfile = _.debounce(async () => {
  if (currentUserData?.value?.id) {
    updateUser();
  }
}, 2000);

const handleSubmit = async () => {
  if (!formData.value.profile.address || !formData.value?.profile?.suite_number) {
    toast.error("Please fill in all delivery information");
    return;
  }

  try {
    const success = await updateRegisterUser();
    if (success !== false) {
      emit('completed');
    }
  } catch {
    // errors already shown via toast in updateUser
  }
};

const updateRegisterUser = async () => {
  if (currentUserData?.value?.id) {
    await updateUser(); // throws on error
    return true;
  }

  if (wantsAccount.value) {
    logout();
    const { error } = await getDataUnauthed("/users/", {
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
    });

    if (error?.value) {
      error.value?.cause?.errors?.map((e) => {
        toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
      });
      return false;
    }

    toast.success("Account created successfully");
    await autoLoginUser(formData?.value?.email, formData?.value?.password);
    return true;
  }

  // Pure guest: delivery info already in deliverySelection cookie
  return true;
};

const autoLoginUser = async (email, password) => {
  const { data, error } = await getDataUnauthed("/token/", {
    method: "POST",
    body: { email, password },
  });

  if (!error.value) {
    const loginCookie = useCookie("currentUser");
    loginCookie.value = data.value;
    await getUserWithToken(loginCookie?.value?.access);
  }
};

const isLoggedIn = computed(() => Object.keys(store?.currentUserData).length);

const route = useRoute();

watch(
  () => route.path,
  async () => {
    Object.assign(formData.value, store.currentUserData);
  }
);

watch(
  formData,
  () => {
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
  await siteSettingsStore.fetchSettings();
  await loadDeliveryCities();
  if (currentUserData.value) {
    Object.assign(formData.value, currentUserData.value);
    // Logged-in users skip the account step — go straight to delivery
    currentStep.value = 2;
  } else {
    // Pre-fill phone from previous guest session if available
    if (guestPhone.value?.phone_number) {
      formData.value.phone_code = guestPhone.value.phone_code;
      formData.value.phone_number = guestPhone.value.phone_number;
    }
  }
});

watch(currentUserData, () => {
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

.step-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.step-nav-row--end {
  justify-content: flex-end;
}

.step-nav-back,
.step-nav-next {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 150px;
  width: 150px;
  min-height: 52px;
  padding: 10px 20px;
  margin: 0;
  line-height: 1.2;
}

@media (max-width: 575px) {
  .step-nav-row {
    gap: 12px;
  }

  .step-nav-back,
  .step-nav-next {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }

  .step-nav-row--end .step-nav-next {
    flex: 0 1 150px;
  }
}

/* Create account checkbox */
.create-account-check {
  display: flex;
  align-items: center;
  gap: 8px;
}

.create-account-check input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0989ff;
}

.create-account-check label {
  margin: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

/* Login / guest links */
.guest-link {
  color: #0989ff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.guest-link:hover {
  text-decoration: underline;
}

.tp-checkout-input textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e2e3;
  resize: vertical;
}

.delivery-note-help {
  display: block;
  margin-top: 6px;
  color: #666;
  line-height: 1.5;
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
