<template>
  <div class="tp-product-details-tab-nav tp-tab">
    <h3 class="text-black w-full border-bottom pb-4">Product Details</h3>
    <div class="tp-product-details-desc-wrapper">
      <div class="">
        <div class="col-xl-10">
          <div class="tp-product-details-desc-item pt-8">
            <div class="row">
              <span>{{ product?.category?.name }}</span>
              <h3 class="tp-product-details-desc-title">
                {{ product?.name }}
              </h3>
              <p>{{ product?.seo_description || product?.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tp-product-details-additional-info">
    <div class="">
      <div class="col-xl-10">
        <p v-if="!product?.additional_information">
          No additional information is available
        </p>
        <table v-else>
          <tbody>
            <tr v-for="(info, i) in product.additional_information" :key="i">
              <td class="capitalize">{{ info.key }}</td>
              <td class="capitalize">{{ info.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="tp-product-details-review-wrapper pt-16">
    <h3 class="text-black w-full border-bottom pb-4 mb-12">Reviews</h3>
    <div class="row">
      <div class="col-lg-6">
        <div class="tp-product-details-review-statics">
          <!-- number -->
          <div class="tp-product-details-review-number d-inline-block mb-50">
            <h3 class="tp-product-details-review-number-title">
              Customer reviews
            </h3>
            <div
              class="tp-product-details-review-summery d-flex align-items-center"
            >
              <div class="tp-product-details-review-summery-value">
                <span>{{ product?.review_stats?.average_rating }}/5</span>
              </div>
              <div
                class="tp-product-details-review-summery-rating d-flex align-items-center"
              >
                <span
                  v-for="item in parseInt(
                    product?.review_stats?.average_rating
                  )"
                  :key="item"
                  ><i class="fa-solid fa-star"></i
                ></span>
                <span
                  v-for="item in 5 -
                  parseInt(product?.review_stats?.average_rating)"
                  ><i class="fa-regular fa-star"></i
                ></span>
              </div>
            </div>
            <div class="tp-product-details-review-rating-list">
              <product-details-rating-item
                v-for="i in 5"
                :key="i"
                :star="6 - i"
                :percentage="
                  product?.review_stats?.rating_breakdown[6 - i]?.percentage ||
                  0
                "
                :count="
                  product?.review_stats?.rating_breakdown[6 - i]?.count || 0
                "
              />
            </div>
          </div>

          <!-- reviews -->
          <div class="tp-product-details-review-list pr-110">
            <h3 class="tp-product-details-review-title">Rating & Review</h3>
            <div v-if="product.reviews && product.reviews.length > 0">
              <div
                v-for="(item, i) in product.reviews"
                :key="i"
                class="tp-product-details-review-avater d-flex align-items-start"
              >
                <div class="tp-product-details-review-avater-thumb">
                  <a href="#">
                    <img
                      :src="
                        item?.user?.avatar ||
                        'https://cdn-icons-png.flaticon.com/512/552/552848.png'
                      "
                      alt="user"
                    />
                  </a>
                </div>
                <div class="tp-product-details-review-avater-content">
                  <div
                    class="tp-product-details-review-avater-rating d-flex align-items-center"
                  >
                    <span
                      v-for="item in parseInt(
                        product?.review_stats?.average_rating
                      )"
                      :key="item"
                      ><i class="fa-solid fa-star"></i
                    ></span>
                    <span
                      v-for="item in 5 -
                      parseInt(product?.review_stats?.average_rating)"
                      ><i class="fa-regular fa-star"></i
                    ></span>
                  </div>
                  <h3 class="tp-product-details-review-avater-title">
                    {{ item.title }}
                  </h3>
                  <span class="tp-product-details-review-avater-meta"
                    >{{ new Date(item.created_at)?.toLocaleDateString() }}
                  </span>
                  <span
                    class="tp-product-details-review-avater-meta capitalize"
                  >
                    <span v-if="item?.user">{{
                      item?.user?.first_name + "" + item?.user?.last_name ||
                      item?.user?.username
                    }}</span>
                    <span v-else>
                      {{ item?.reviewer_name }}
                    </span>
                  </span>

                  <div class="tp-product-details-review-avater-comment">
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <h5>No Reviews Found</h5>
            </div>
          </div>
        </div>
      </div>
      <!-- end col -->
      <div class="col-lg-6">
        <div class="tp-product-details-review-form">
          <h3 class="tp-product-details-review-form-title">
            Review this product
          </h3>
          <p>
            Your email address will not be published. Required fields are marked
            *
          </p>
          <!-- form start -->
          <forms-review-form :product="product" />
          <!-- form end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type IProduct } from "@/types/product-type";
// handleActiveMarker
const handleActiveMarker = (event: MouseEvent) => {
  const marker = document.getElementById("productTabMarker");
  if (marker && event.target) {
    marker.style.left = (event.target as HTMLButtonElement).offsetLeft + "px";
    marker.style.width = (event.target as HTMLButtonElement).offsetWidth + "px";
  }
};

defineProps<{ product: IProduct }>();

onMounted(() => {
  const nav_active = document.getElementById("nav-addInfo-tab");
  const marker = document.getElementById("productTabMarker");
  if (nav_active?.classList.contains("active") && marker) {
    marker.style.left = nav_active.offsetLeft + "px";
    marker.style.width = nav_active.offsetWidth + "px";
  }
});
</script>
