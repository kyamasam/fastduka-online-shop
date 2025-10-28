<template>
  <div class="tp-footer-contact">
    <div class="tp-footer-contact-item d-flex align-items-start">
      <div class="tp-footer-contact-icon">
        <span>
          <SvgEmail />
        </span>
      </div>
      <div class="tp-footer-contact-content">
        <p>
          <a href="mailto:shofy@support.com">{{ settings?.contact_email ||'support@fastduka.co.ke'}}</a>
        </p>
      </div>
    </div>
    <div class="tp-footer-contact-item d-flex align-items-start">
      <div class="tp-footer-contact-icon">
        <span>
          <SvgLocation />
        </span>
      </div>
      <div class="tp-footer-contact-content">
        <p>
          <a
            :href="settings?.location_link"
            target="_blank"
          >
            {{ settings?.location }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SiteSettings } from "@/pinia/useSiteSettingsStore";
defineProps<{
  settings: SiteSettings;
}>();
</script>
