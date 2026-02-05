import { getSettings } from '@/lib/get-settings';
import Navigation from '@/components/Navigation';

export default async function Header() {
  // Fetch settings on server side
  const settings = await getSettings();

  // Extract menu structure and branding from settings
  const menuItems = settings?.top_menu_structure || [];
  const logo = settings?.site_logo || undefined;
  const logoText = settings?.logo_text || settings?.title || 'FastDuka';
  const primaryColor = settings?.primary_color || '#2E8B57';
  const menuBgColor = settings?.top_menu_bg || '#ffffff';
  const menuTextColor = settings?.top_menu_text_color || '#000000';

  return (
    <Navigation
      menuItems={menuItems}
      logo={logo}
      logoText={logoText}
      primaryColor={primaryColor}
      menuBgColor={menuBgColor}
      menuTextColor={menuTextColor}
    />
  );
}
