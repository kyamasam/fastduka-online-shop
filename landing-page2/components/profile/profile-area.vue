<template>
  <section class="profile__area pb-120">
    <div class="md:px-24">
      <div class="profile__inner p-relative">
        <div
          v-if="userData !== undefined && Object.keys(userData).length !== 0"
          class="row"
        >
          <div class="col-xxl-4 col-lg-4">
            <div class="profile__tab mr-20">
              <!-- profile nav start -->
              <profile-nav />
              <!-- profile nav end -->
            </div>
          </div>
          <div class="col-xxl-8 col-lg-8">
            <div class="profile__tab-content">
              <div class="tab-content" id="profile-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="nav-profile"
                  role="tabpanel"
                  aria-labelledby="nav-profile-tab"
                >
                  <profile-info />
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-order"
                  role="tabpanel"
                  aria-labelledby="nav-order-tab"
                >
                  <profile-orders />
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-password"
                  role="tabpanel"
                  aria-labelledby="nav-password-tab"
                >
                  <profile-password />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="md:px-24 md:w-1/2"
      v-if="userData === undefined || Object.keys(userData).length === 0"
    >
      <h4 class="border-b py-3 mb-8">Login</h4>
      <forms-login-form></forms-login-form>
    </div>
  </section>
</template>

<script setup lang="ts">
const userData = useCookie("userData");
</script>
