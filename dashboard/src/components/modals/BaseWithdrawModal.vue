<template>
  <!--  Withdrawal UI-->
  <div>
    <el-dialog
      v-model="open"
      title="Withdraw Cash"
      @close="closeModal"
      class="w-10/12 md:w-5/12"
      width="30%"
      draggable
      style="border-radius: 10px"
    >
      <div>
        <a-form
          class="md:mt-0"
          layout="vertical"
          name="register"
          @finish="attemptSubmit"
          @finishFailed="handleFailedSubmit"
          :model="formState"
        >
          <a-form-item
            label="Withdrawal Amount"
            :rules="[
              { required: true, message: 'Withdrawal Amount Must be set' },
            ]"
            name="transaction_amount"
          >
            <a-input-number
              id="inputNumber"
              style="border-radius: 4px; width: 100%"
              v-model:value="formState.transaction_amount"
              :formatter="
                (value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              :min="0"
              size="large"
              placeholder="3,000,000"
            />
          </a-form-item>
          <a-form-item
            name="phone_number"
            :rules="[{ required: true, message: 'Phone Number Must be set' }]"
            help="712345678 , cannot be more than 9 characters"
            label="Phone Number"
          >
            <a-input-group compact>
              <select
                id="countries"
                style="
                  border-radius: 4px 0 0 4px;
                  background-color: white;
                  color: black;
                "
                v-model="formState.phone_code"
                class="w-2/12 pt-2 h-12 bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="+254" selected>+254</option>
                <option value="+254">+255</option>
                <option value="+254">+256</option>
              </select>
              <a-input-number
                id="phone"
                name="phone_number"
                v-model:value="formState.phone_number"
                :maxlength="9"
                style="
                  border-radius: 0 4px 4px 0;
                  outline: none;
                  background-color: white;
                  color: black;
                "
                class="h-12 w-10/12 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:border-blue-500"
                placeholder="716651612   Cannot have special characters"
              />
            </a-input-group>
          </a-form-item>
          <a-space />
          <a-form-item>
            <span class="flex flex-wrap gap-4 justify-end">
              <a-button @click="open = false" style="border-radius: 4px"
                >Cancel</a-button
              >
              <a-button
                type="primary"
                :loading="isLoading"
                class="bg-blue-500"
                style="border-radius: 4px"
                htmlType="submit"
              >
                Confirm Withdrawal
              </a-button>
            </span>
          </a-form-item>
        </a-form>
      </div>
    </el-dialog>
  </div>
  <!--  Withdrawal UI-->
</template>

<script setup>
import { loggedInUser } from "@/utility/constants";
import store from "@/vuex/store";
import { ElDialog } from "element-plus";
import { computed, ref } from "vue";
const open = ref(true);

const formState = ref({
  phone_number: null,
  phone_code: loggedInUser?.phone_code,
  transaction_amount: 10,
  transaction_currency: "KES",
  payment_method: "mpesa",
});

formState.value["phone_number"] = loggedInUser?.phone_number;

const hasSpecialCharacters = computed(() => {
  const regex = /[!@#$%^&*(),.?":{}|<>]/;
  return regex.test(formState.phone_number);
});

const isTooLong = computed(() => {
  return formState.phone_number.length > 9;
});

const validatePhoneNumber = () => {
  if (formState.phone_number) {
    formState.phone_number = formState.phone_number
      .replace(/[^\d]/g, "")
      .slice(0, 9);
  }
};
const isLoading = ref(false);
const attemptSubmit = () => {
  // store
  //     .dispatch('putData', {url:'users', id:1, data: this.formState})
  console.log("form", formState.value);
  let base = formState.value;
  base.customer_account_number = `${base.phone_code}${base.phone_number}`;
  let payload = formState.value;

  // delete base.phone_code;
  // delete base.phone_number;
  isLoading.value = true;
  store
    .dispatch("postData", { url: "wallet/withdraw", data: formState.value })
    .then((res) => {
      isLoading.value = false;

      // console.log('nice')
      open.value = !open.value;
      window.location.reload()
    })
    .catch(() => {
      isLoading.value = false;
    });
};
const handleFailedSubmit = (err) => {
  console.log("errors", err);
};

const loggedUser = JSON.parse(localStorage.getItem("piczanguUserDetails"));

const emit = defineEmits(["toggleModal"]);

const closeModal = () => {
  emit("toggleModal");
};
</script>

<style scoped></style>
