<template>
  <div>
    <!-- breadcrumb start -->
    <breadcrumb-1 title="Profile" subtitle="profile area" :full_width="true" />

    <!-- profile area start -->
    <profile-area />
    <!-- profile area end -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "Profile Page" });
</script>
