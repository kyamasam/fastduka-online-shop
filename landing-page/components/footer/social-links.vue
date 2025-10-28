<template>
  <template v-for="item in social_data"
            :key="item.id">
    <a v-if="item.link"
       :href="item.link"
       target="_blank"
       rel="noopener noreferrer">
      <i :class="item.icon"></i>
    </a>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";

const siteSettingsStore = useSiteSettingsStore();

const social_data = computed(() => {
  // Add safety check for settings
  if (!siteSettingsStore.settings) {
    return [];
  }

  const links = [];

  if (siteSettingsStore.settings.facebook_url) {
    links.push({
      id: 1,
      link: siteSettingsStore.settings.facebook_url,
      icon: "fa-brands fa-facebook-f",
      title: "Facebook",
    });
  }

  if (siteSettingsStore.settings.twitter_url) {
    links.push({
      id: 2,
      link: siteSettingsStore.settings.twitter_url,
      icon: "fa-brands fa-twitter",
      title: "Twitter",
    });
  }

  if (siteSettingsStore.settings.instagram_url) {
    links.push({
      id: 3,
      link: siteSettingsStore.settings.instagram_url,
      icon: "fa-brands fa-instagram",
      title: "Instagram",
    });
  }

  if (siteSettingsStore.settings.youtube_url) {
    links.push({
      id: 4,
      link: siteSettingsStore.settings.youtube_url,
      icon: "fa-brands fa-youtube",
      title: "YouTube",
    });
  }

  return links;
});
</script>