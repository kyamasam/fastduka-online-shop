<template>
  <a-form
    class="md:mt-0"
    layout="vertical"
    name="register"
    @finish="attemptSubmit"
    @finishFailed="handleFailedSubmit"
    :model="formState"
  >
    <div class="my-2 flex gap-2 flex-wrap w-full justify-end"></div>

    <h3 class="my-2 font-semibold text-lg w-fit">My Rate</h3>

    <a-form-item
      :rules="[{ required: true, message: 'Please your Rate Frequency' }]"
      label="Rate Frequency"
      name="rate_frequency"
    >
      <a-select
        v-model:value="formState.rate_frequency"
        class="w-full rounded-lg h-10 capitalize"
        style="border-radius: 8px"
        size="small"
        placeholder="Please select"
        :options="rateFrequency"
      ></a-select>

      <!--                <a-input size="small" v-model:value="formState.nature_of_photography" placeholder="baby shower"/>-->
    </a-form-item>

    <a-form-item
      :rules="[{ required: true, message: 'Please your Rate Frequency' }]"
      label="Price"
      name="rate_price"
    >
      <a-input-number
        size="large"
        v-model:value="formState.rate_price"
        class="w-full rounded h-10"
        placeholder="1000"
        prop="name"
      />
    </a-form-item>

    <a-form-item
      :rules="[{ required: true, message: 'Please your Rate Frequency' }]"
      label="Currency"
      name="rate_currency"
    >
      <a-select
        v-model:value="formState.rate_currency"
        class="w-full rounded-lg h-10"
        style="border-radius: 8px"
        size="small"
        placeholder="Please select"
        :options="rateCurrency"
      ></a-select>
    </a-form-item>
    <a-button
      html-type="submit"
      class="ant-btn-primary bg-blue-500 rounded w-fit flex justify-center gap-2 items-center"
    >
      Save Rate
    </a-button>
  </a-form>
</template>

<script>
import store from "@/vuex/store";
import {
  ArrowRight,
  CaretRight,
  EditPen,
  Remove,
} from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
export default {
  name: "PhotographerRate",
  components: { Remove, ArrowRight, CaretRight, EditPen },
  props: {
    portfolio: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      formState: {
        photographer_portfolio: this.portfolio?.id,
        rate_currency: this.portfolio?.rate_currency || "KES",
        rate_frequency: this.portfolio?.rate_frequency || "daily",
        rate_price: this.portfolio?.rate_price,
      },
      rateFrequency: [
        { label: "Daily", value: "daily" },

        { label: "Hourly", value: "hourly" },
        { label: "Weekly ", value: "weekly " },
      ],
      rateCurrency: [{ label: "Kenya Shillings", value: "KES" }],
      formDisabled: true,
    };
  },
  methods: {
    attemptSubmit() {
      store
        .dispatch("patchData", {
          url: "photographer-portfolio",
          id: this.portfolio?.id,
          data: { ...this.formState },
        })
        .then((res) => {
          this.formDisabled = true;
        })
        .catch((err) => {
          // this.formDisabled = true
        });
    },

    handleFailedSubmit(err) {
      console.log("errors", err);
      err.errorFields.map((error) => {
        setTimeout(function () {
          ElNotification({
            title: `${error?.errors[0]}`,
            type: "warning",
            position: "top-right",
            message: `${error?.name[0]}`,
          });
        }, 200);
      });
    },

    attemptFetch() {
      this.formState = { ...this.portfolio };
    },
  },
  mounted() {
    this.attemptSubmit();
  },
};
</script>

<style scoped></style>
