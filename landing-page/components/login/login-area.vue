<template>
  <section class="tp-login-area pb-140 p-relative z-index-1 fix">
    <div class="tp-login-shape">
      <img class="tp-login-shape-1" src="" alt="shape" />
      <img class="tp-login-shape-2" src="" alt="shape" />
      <img class="tp-login-shape-3" src="" alt="shape" />
      <img class="tp-login-shape-4" src="" alt="shape" />
    </div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-8">
          <div class="tp-login-wrapper">
            <div class="tp-login-top text-center mb-30">
              <h3 class="tp-login-title">Login to Shofy.</h3>
              <p>
                Don’t have an account?
                <span
                  ><nuxt-link href="/register"
                    >Create a free account</nuxt-link
                  ></span
                >
              </p>
            </div>
            <div class="tp-login-option">
              <!-- social login start -->
              <login-social />
              <!-- social login end -->
              <div class="tp-login-mail text-center mb-40">
                <p>or Sign in with <a href="#">Email</a></p>
              </div>
              <!-- form start -->
              <forms-login-form />
              <!-- form end -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
