import { getTheme } from '@/app/lib/get-theme';
import { loadMainThemeComponent, loadThemeLayout } from '@/app/lib/theme-loader';

interface ThemeLayoutProps {
  children: React.ReactNode;
}

// Server Component that loads theme-specific layout or components
export default async function ThemeLayout({ children }: ThemeLayoutProps) {
  // Get current theme from server-side API
  const themeName = await getTheme();

  // First, check if theme has a complete layout override
  const CustomLayout = await loadThemeLayout(themeName);

  // If theme provides custom layout, use it
  if (CustomLayout) {
    return <CustomLayout>{children}</CustomLayout>;
  }

  // Otherwise, load Header and Footer from theme
  // These will fall back to default if theme doesn't have them
  const Header = await loadMainThemeComponent(themeName, 'Header');
  const Footer = await loadMainThemeComponent(themeName, 'Footer');

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
