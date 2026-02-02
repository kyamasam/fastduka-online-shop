/**
 * Navigation Menu Item Structure
 * Each menu item can have nested children for dropdown menus
 */
export interface MenuItem {
  name: string;
  icon?: string; // Lucide icon name
  link: string;
  is_external?: boolean;
  order?: number;
  children?: MenuItem[];
}

export interface SiteSettings {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;

  // Site Information
  title: string;
  site_link: string;
  description: string;
  footer_description: string;
  industry: string;

  // Contact Information
  contact_email: string;
  contact_phone: string;
  location: string;
  location_link: string | null;

  // Branding
  primary_color: string;
  secondary_color: string;
  site_icon: string;
  site_logo: string;
  logo_text: string;
  logo_size_mobile: string;
  logo_size_desktop: string;

  // Social Media
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;

  // Menu & Navigation
  top_menu_structure: MenuItem[];

  // Currency & Payment
  currency_code: string;
  currency_symbol: string;
  mpesa_paybill_number: string;

  // FastDuka Integration
  fastduka_orgid: string;
  fastduka_config_id: string;
  fastduka_api_key: string;

  // Order & Delivery Settings
  default_tax_rate: string;
  minimum_order_amount: string;
  default_delivery_fee: string;
  free_delivery_threshold: string | null;
  default_delivery_radius: string;
  estimated_delivery_time_min: number;
  estimated_delivery_time_max: number;
  match_user_to_closest_vendor: boolean;

  // API Keys & Integrations
  google_maps_api_key: string;
  google_analytics_id: string | null;

  // Email Settings
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_password: string | null;
  default_from_email: string | null;

  // Site Settings
  maintenance_mode: boolean;
  items_per_page: number;
  enable_reviews: boolean;

  // Legal
  terms_and_conditions: string;
  privacy_policy: string;
}

export interface SettingsState {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}
