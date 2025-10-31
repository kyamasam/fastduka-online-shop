<template>
  <div class="tp-footer-bottom">
    <div class="container">
      <div class="tp-footer-bottom-wrapper">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="tp-footer-copyright">
              <p>
                © {{ new Date().getFullYear() }} All Rights Reserved Fastduka Online
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="tp-footer-payment text-md-end">
              <p>
                <img src="/img/footer/footer-pay.png" alt="pay-img" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import  type { SiteSettings } from "@/pinia/useSiteSettingsStore";
defineProps<{
  settings: SiteSettings;
}>();
</script>
