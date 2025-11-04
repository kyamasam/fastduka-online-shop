<template>
  <div>
      <!-- breadcrumb start -->
      <breadcrumb-4 title="My account" subtitle="My account" :center="true" />
      <!-- breadcrumb end -->

      <!-- login area start -->
      <login-area/>
      <!-- login area end -->
  </div>
</template>

<script setup lang="ts">
// Use dynamic SEO with site settings
useDynamicSeo({
  title: "Login",
  description: "Sign in to your account to order fresh meat for delivery in Kenya.",
  keywords: "login, account, sign in, meat delivery Kenya",
});
</script>
