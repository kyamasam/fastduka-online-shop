<template>
  <form @submit.prevent="updateRegisterUser">
    <div class="tp-checkout-bill-form">
      <div class="tp-checkout-bill-inner">
        <div class="row">
          <div class="col-md-6">
            <div class="tp-checkout-input">
              <label>First Name </label>
              <input
                v-model="formData['first_name']"
                type="text"
                placeholder="First Name"
                @input="hasUserTyped = true"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="tp-checkout-input">
              <label>Last Name </label>
              <input
                v-model="formData['last_name']"
                type="text"
                placeholder="Last Name"
                @input="hasUserTyped = true"
              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="tp-checkout-input">
              <label>Delivery Location <span>*</span></label>
              <LocationSearch
                :default_latitude="formData?.profile?.latitude"
                :default_longitude="formData?.profile?.longitude"
                :location_address="formData?.profile?.address"
                @location-selected="handleLocationSelected"
              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="tp-checkout-input">
              <label>House No / Office No. <span>*</span></label>

              <input
                required
                v-model="formData['profile']['suite_number']"
                type="text"
                placeholder="Apartment, suite, unit, etc. (optional)"
                @input="hasUserTyped = true"
              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="tp-checkout-input">
              <label>Email<span>*</span></label>

              <input
                required
                v-model="formData['email']"
                type="email"
                placeholder="Email"
                @input="hasUserTyped = true"
              />
            </div>
          </div>
          <div
            v-if="
              currentUserData === undefined ||
              Object.keys(currentUserData).length === 0
            "
            class="col-md-12"
          >
            <div class="tp-checkout-input">
              <label>Password<span>*</span></label>

              <input
                required
                v-model="formData['password']"
                type="password"
                placeholder="******"
                @input="hasUserTyped = true"
              />
            </div>
          </div>

          <div class="col-md-12">
            <div class="tp-checkout-input">
              <label>Phone <span>*</span></label>
              <div class="flex">
                <select
                  required
                  v-model="formData['phone_code']"
                  class="border"
                  type="select"
                  @change="hasUserTyped = true"
                >
                  <option value="+254" label="+254" />
                </select>

                <input
                  required
                  v-model="formData['phone_number']"
                  type="text"
                  placeholder=""
                  maxlength="9"
                  @input="hasUserTyped = true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="
        currentUserData === undefined ||
        Object.keys(currentUserData).length === 0
      "
      type="submit"
      class="tp-checkout-btn w-100"
    >
      Create Account
    </button>
    <button v-else type="submit" class="tp-checkout-btn w-100">
      Update Profile
    </button>
    <div v-if="isUpdating" class="text-center mt-2 text-gray-600">
      <p>Automatically saving changes...</p>
    </div>
    <div v-if="lastUpdated" class="text-center mt-2 text-green-600">
      <p>Last updated: {{ lastUpdated }}</p>
    </div>
  </form>
</template>

<script setup>
import { useUserStore } from "@/pinia/useUserDataStore";
import _ from "lodash";
import { toast } from "vue3-toastify";
const store = useUserStore();

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

const handleLocationSelected = (location) => {
  console.log("Selected location:", location);
  formData.value.profile.address = location?.address;
  formData.value.profile.latitude = location?.lat;
  formData.value.profile.longitude = location?.lng;
  hasUserTyped.value = true; // Treat location selection as a user input
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
// Create a debounced function to update the user profile
const debouncedUpdateProfile = _.debounce(async () => {
  if (currentUserData?.value?.id) {
    updateUser();
  }
}, 2000); // Wait for 2 seconds of inactivity before updating

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

    // creating account failed, show error
    if (error?.value) {
      error.value?.cause?.errors?.map((e) => {
        toast.error(`${e?.attr?.replace("_", " ")} ${e?.detail}`);
      });
    } else {
      // succeeded
      toast.success("Account Created Successfully");
      autoLoginUser(formData?.value?.email, formData?.value?.password);
    }
  }
};

const autoLoginUser = async (email, password) => {
  // proceed to login the user
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

// Watch for changes to form data to trigger auto-update
watch(
  formData,
  () => {
    console.log("formdata changed", currentUserData.value);
    Object.assign(currentUserData.value, formData.value);

    // If user is logged in and has typed something, trigger the debounced update
    if (currentUserData?.value?.id && hasUserTyped.value) {
      debouncedUpdateProfile();
      hasUserTyped.value = false; // Reset after triggering update
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
