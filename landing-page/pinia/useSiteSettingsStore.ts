// import { defineStore } from "pinia";
// import { computed, ref } from "vue";

// export interface SiteSettings {
//   id: number;
//   created_at: string;
//   updated_at: string;
//   is_active: boolean;
//   title: string;
//   site_link: string;
//   description: string;
//   footer_description: string;
//   location: string;
//   location_link: string;
//   industry: string;
//   contact_email: string | null;
//   contact_phone: string | null;
//   primary_color: string;
//   secondary_color: string;
//   site_icon: string;
//   site_logo: string;
//   facebook_url: string | null;
//   twitter_url: string | null;
//   instagram_url: string | null;
//   youtube_url: string | null;
//   currency_code: string;
//   currency_symbol: string;
//   mpesa_paybill_number: string;
//   fastduka_orgid: string;
//   fastduka_config_id: string;
//   fastduka_api_key: string;
//   default_tax_rate: string;
//   minimum_order_amount: string;
//   default_delivery_fee: string;
//   free_delivery_threshold: string | null;
//   default_delivery_radius: string;
//   estimated_delivery_time_min: number;
//   estimated_delivery_time_max: number;
//   match_user_to_closest_vendor: boolean;
//   google_maps_api_key: string;
//   google_analytics_id: string | null;
//   smtp_host: string | null;
//   smtp_port: number | null;
//   smtp_user: string | null;
//   smtp_password: string | null;
//   default_from_email: string | null;
//   maintenance_mode: boolean;
//   items_per_page: number;
//   enable_reviews: boolean;
//   terms_and_conditions: string;
//   privacy_policy: string;
// }

// export const useSiteSettingsStore = defineStore("siteSettings", () => {
//   const settings = ref<SiteSettings | null>(null);
//   const loading = ref(false);
//   const error = ref<any>(null);

//   const fetchSettings = async () => {
//     // if (settings.value) return; // Don't fetch if already loaded

//     loading.value = true;
//     error.value = null;

//     try {
//       const response = await getDataUnauthed("/settings/");
//       console.log("Site settings response:", response);
//       settings.value = response.data.value as SiteSettings;
//     } catch (err) {
//       error.value = err;
//       console.error("Error fetching site settings:", err);
//     } finally {
//       loading.value = false;
//     }
//   };

//   // Computed properties for easy access to theme colors and other properties
//   const primaryColor = computed(
//     () => settings.value?.primary_color || "#098cfe"
//   );
//   const secondaryColor = computed(
//     () => settings.value?.secondary_color || "#ffffff"
//   );
//   const logo = computed(
//     () => settings.value?.site_logo || "/img/logo/logo.svg"
//   );
//   const title = computed(() => settings.value?.title || "Fastduka");
//   const currencySymbol = computed(
//     () => settings.value?.currency_symbol || "Ksh"
//   );

//   return {
//     settings,
//     loading,
//     error,
//     fetchSettings,
//     primaryColor,
//     secondaryColor,
//     logo,
//     title,
//     currencySymbol,
//   };
// });

import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface SiteSettings {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  title: string;
  site_link: string;
  description: string;
  footer_description: string;
  location: string;
  location_link: string;
  industry: string;
  contact_email: string | null;
  contact_phone: string | null;
  primary_color: string;
  secondary_color: string;
  site_icon: string;
  site_logo: string;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  currency_code: string;
  currency_symbol: string;
  mpesa_paybill_number: string;
  fastduka_orgid: string;
  fastduka_config_id: string;
  fastduka_api_key: string;
  default_tax_rate: string;
  minimum_order_amount: string;
  default_delivery_fee: string;
  free_delivery_threshold: string | null;
  default_delivery_radius: string;
  estimated_delivery_time_min: number;
  estimated_delivery_time_max: number;
  match_user_to_closest_vendor: boolean;
  google_maps_api_key: string;
  google_analytics_id: string | null;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_password: string | null;
  default_from_email: string | null;
  maintenance_mode: boolean;
  items_per_page: number;
  enable_reviews: boolean;
  terms_and_conditions: string;
  privacy_policy: string;
}

export const useSiteSettingsStore = defineStore("siteSettings", () => {
  const settings = ref<SiteSettings | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  const fetchSettings = async () => {
    // Only fetch if not already loaded
    if (settings.value) return settings.value;

    loading.value = true;
    error.value = null;

    try {
      const {
        data,
        error: fetchError,
        execute,
        pending,
      } = getDataUnauthed("/settings/");

      // Wait for the request to complete
      await execute();

      // Wait for pending to be false (ensures data is available)
      while (pending.value) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      if (fetchError.value) {
        throw fetchError.value;
      }

      console.log("Site settings response:", data.value);
      settings.value = data.value as SiteSettings;
      return settings.value;
    } catch (err) {
      error.value = err;
      console.error("Error fetching site settings:", err);
      // Use fallback settings during SSR if fetch fails
      if (process.server) {
        settings.value = {
          title: "Fastduka",
          description: "Online butchery in Kenya - Order fresh meat. Goat, Beef, pork, chicken",
          site_logo: "/img/logo/logo-red.svg",
          site_link: "https://fastduka.co.ke",
          primary_color: "#2E8B57",
          secondary_color: "#ffffff",
          currency_symbol: "Ksh",
          location: "Nairobi, Kenya",
          contact_email: "",
          contact_phone: "",
        } as any;
        return settings.value;
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const primaryColor = computed(
    () => settings.value?.primary_color || "#098cfe"
  );
  const secondaryColor = computed(
    () => settings.value?.secondary_color || "#ffffff"
  );
  const logo = computed(
    () => settings.value?.site_logo || "/img/logo/logo.svg"
  );
  const title = computed(() => settings.value?.title || "Fastduka");
  const currencySymbol = computed(
    () => settings.value?.currency_symbol || "Ksh"
  );

  return {
    settings,
    loading,
    error,
    fetchSettings,
    primaryColor,
    secondaryColor,
    logo,
    title,
    currencySymbol,
  };
});
