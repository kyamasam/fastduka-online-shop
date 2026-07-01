import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiService, { ApiError } from '../services/api.service';
import { SettingsState, SiteSettings } from '../types/settings';

/**
 * Global Settings Store
 * Manages site-wide settings fetched from /api/settings/
 * Settings are persisted to localStorage and accessible to all components
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: null,
      loading: false,
      error: null,

      /**
       * Fetch settings from the API
       * This should be called once when the app initializes
       */
      fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get<SiteSettings>('/settings');
          set({ settings: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          set({
            error: apiError.message,
            loading: false,
          });
          console.error('Failed to fetch settings:', apiError);
        }
      },

      /**
       * Update settings locally (for temporary changes)
       * Note: This doesn't persist to the backend
       */
      updateSettings: (newSettings: Partial<SiteSettings>) => {
        set((state) => ({
          settings: state.settings
            ? { ...state.settings, ...newSettings }
            : null,
        }));
      },
    }),
    {
      name: 'site-settings-storage', // localStorage key
      partialize: (state) => ({ settings: state.settings }), // Only persist settings, not loading/error
    }
  )
);

/**
 * Hook to get specific settings values with type safety
 */
export function useSetting<K extends keyof SiteSettings>(
  key: K
): SiteSettings[K] | null {
  return useSettingsStore((state) => state.settings?.[key] ?? null);
}

/**
 * Hook to get all settings
 */
export function useSettings(): SiteSettings | null {
  return useSettingsStore((state) => state.settings);
}

/**
 * Hook to get currency formatting settings
 */
export function useCurrency() {
  const currencyCode = useSetting('currency_code');
  const currencySymbol = useSetting('currency_symbol');

  return {
    code: currencyCode || 'KES',
    symbol: currencySymbol || 'Ksh',
  };
}

/**
 * Hook to get theme colors
 */
export function useThemeColors() {
  const primaryColor = useSetting('primary_color');
  const secondaryColor = useSetting('secondary_color');
  const topMenuBg = useSetting('top_menu_bg');
  const topMenuTextColor = useSetting('top_menu_text_color');
  

  return {
    primary: primaryColor || '#2E8B57',
    secondary: secondaryColor || '#ffffff',
    topMenuBgColor: topMenuBg||"#d1298b",
    topMenuTextColor: topMenuTextColor||"#ffffff" 
    
  };
}

/**
 * Hook to get branding assets
 */
export function useBranding() {
  const siteLogo = useSetting('site_logo');
  const siteIcon = useSetting('site_icon');
  const logoText = useSetting('logo_text');
  const title = useSetting('title');

  return {
    logo: siteLogo,
    icon: siteIcon,
    logoText: logoText || title || 'FastDuka',
    title: title || 'FastDuka',
  };
}

/**
 * Hook to get contact information
 */
export function useContactInfo() {
  const email = useSetting('contact_email');
  const phone = useSetting('contact_phone');
  const location = useSetting('location');

  return {
    email: email || '',
    phone: phone || '',
    location: location || '',
  };
}

/**
 * Hook to get social media links
 */
export function useSocialLinks() {
  const facebook = useSetting('facebook_url');
  const twitter = useSetting('twitter_url');
  const instagram = useSetting('instagram_url');
  const youtube = useSetting('youtube_url');
  const tiktok = useSetting('tiktok_url');

  return {
    facebook: facebook || '',
    twitter: twitter || '',
    instagram: instagram || '',
    youtube: youtube || '',
    tiktok: tiktok || '',
  };
}
