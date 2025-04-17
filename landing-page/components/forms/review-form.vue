<template>
  <form @submit="onSubmit">
    <div
      class="tp-product-details-review-form-rating flex flex-col align-items-start"
    >
      <p>Your Rating :</p>
      <div
        class="tp-product-details-review-form-rating-icon flex items-center space-x-4 space-y-2"
      >
        <template v-for="index in 5" :key="index">
          <span
            @mouseover="hoveredRating = index"
            @mouseleave="hoveredRating = 0"
            @click="rating = index"
            class="cursor-pointer transition-transform hover:scale-110"
          >
            <i
              class="fa-solid fa-star text-2xl"
              :class="
                (hoveredRating || rating) >= index
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
            ></i>
          </span>
        </template>
      </div>
    </div>

    <div class="tp-product-details-review-input-wrapper">
      <div class="tp-product-details-review-input-box">
        <div class="tp-product-details-review-input-box">
          <div class="tp-product-details-review-input">
            <input
              name="title"
              id="title"
              type="text"
              placeholder="Review Title"
              v-bind="title"
            />
          </div>
          <div class="tp-product-details-review-input-title">
            <label for="title">Review Title</label>
          </div>
          <err-message :msg="errors.title" />
        </div>
        <div class="tp-product-details-review-input">
          <Field name="description" v-slot="{ field }">
            <textarea
              v-bind="field"
              id="description"
              placeholder="Write your review here..."
            ></textarea>
          </Field>
        </div>
        <div class="tp-product-details-review-input-title">
          <label for="description">Write Review</label>
        </div>
        <err-message :msg="errors.description" />
      </div>

      <div class="tp-product-details-review-input-box">
        <div class="tp-product-details-review-input">
          <input
            name="name"
            id="name"
            type="text"
            placeholder="Your Name"
            v-bind="name"
          />
        </div>
        <div class="tp-product-details-review-input-title">
          <label for="name">Your Name</label>
        </div>
        <err-message :msg="errors.name" />
      </div>

      <div class="tp-product-details-review-input-box">
        <div class="tp-product-details-review-input">
          <input
            name="email"
            id="email"
            type="email"
            placeholder="your.email@example.com"
            v-bind="email"
          />
        </div>
        <div class="tp-product-details-review-input-title">
          <label for="email">Your Email</label>
        </div>
        <err-message :msg="errors.email" />
      </div>

      <!-- Create Account Section -->
      <div class="tp-product-details-review-suggetions mb-20">
        <div class="tp-product-details-review-remeber">
          <input id="createAccount" type="checkbox" v-model="createAccount" />
          <label for="createAccount"
            >Create an account for future purchases</label
          >
        </div>
      </div>

      <!-- Phone Fields (shown only when createAccount is true) -->
      <template v-if="createAccount">
        <div class="tp-product-details-review-input-box">
          <div class="tp-product-details-review-input">
            <input
              name="phone_code"
              id="phone_code"
              type="text"
              maxlength="4"
              placeholder="+254"
              v-bind="phone_code"
            />
          </div>
          <div class="tp-product-details-review-input-title">
            <label for="phone_code">Country Code</label>
          </div>
          <err-message :msg="errors.phone_code" />
        </div>

        <div class="tp-product-details-review-input-box">
          <div class="tp-product-details-review-input">
            <input
              name="phone_number"
              id="phone_number"
              type="text"
              placeholder="712345678"
              v-bind="phone_number"
            />
          </div>
          <div class="tp-product-details-review-input-title">
            <label for="phone_number">Phone Number</label>
          </div>
          <err-message :msg="errors.phone_number" />
        </div>
      </template>
    </div>

    <div class="tp-product-details-review-btn-wrapper">
      <button
        type="submit"
        class="tp-product-details-review-btn"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Submitting..." : "Submit Review" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Field, useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import * as yup from "yup";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const rating = ref(0);
const hoveredRating = ref(0);
const createAccount = ref(false);
const isSubmitting = ref(false);

const validationSchema = yup.object({
  title: yup.string().required().label("Title"),
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  description: yup.string().required().label("Review"),
  phone_number: yup.string().when("create_account", {
    is: true,
    then: () =>
      yup
        .string()
        .required()
        .matches(/^\d{9,10}$/, "Enter a valid phone number"),
    otherwise: () => yup.string(),
  }),
  phone_code: yup.string().when("create_account", {
    is: true,
    then: () =>
      yup
        .string()
        .required()
        .matches(/^\+\d{1,3}$/, "Enter a valid country code"),
    otherwise: () => yup.string(),
  }),
});

const { errors, handleSubmit, resetForm, defineInputBinds } = useForm({
  validationSchema,
  initialValues: {
    title: "",
    name: "",
    email: "",
    description: "",
    phone_number: "",
    phone_code: "+254",
  },
});

const name = defineInputBinds("name");
const title = defineInputBinds("title");
const email = defineInputBinds("email");
const phone_code = defineInputBinds("phone_code");
const phone_number = defineInputBinds("phone_number");

const onSubmit = handleSubmit(async (values) => {
  if (rating.value === 0) {
    toast.error("Please select a rating");
    return;
  }

  isSubmitting.value = true;

  try {
    // Start with base review data
    const reviewData = {
      title: values.title,
      name: values.name,
      email: values.email,
      description: values.description,
      product_id: props.product.id,
      review_value: rating.value,
      create_account: createAccount.value,
    };

    // Only add phone fields if creating account
    if (createAccount.value) {
      reviewData.phone_number = values.phone_number;
      reviewData.phone_code = values.phone_code;
    }

    const response = await getDataUnauthed("/reviews/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });

    if (response.data.value) {
      toast.success("Review submitted successfully!");
      resetForm();
      rating.value = 0;
      createAccount.value = false;
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error("Failed to submit review. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.text-warning {
  color: #ffd700;
}
.text-gray-300 {
  color: #d1d5db;
}
</style>
