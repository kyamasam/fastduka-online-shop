import { ThemeConfig } from "@/app/themes/default/config";
import { ComponentType } from "react";

// Dynamic theme loader
export async function loadTheme(themeName: string): Promise<ThemeConfig> {
  try {
    const theme = await import(`@/app/themes/${themeName}/config`);
    return theme.themeConfig;
  } catch (error) {
    console.warn(`Theme "${themeName}" not found, falling back to default`);
    const defaultTheme = await import("@/app/themes/default/config");
    return defaultTheme.themeConfig;
  }
}

// Load theme component
export async function loadMainThemeComponent(themeName: string, componentName: string) {
  try {
    const component = await import(`@/app/themes/${themeName}/components/${componentName}`);
    return component.default;
  } catch (error) {
    console.warn(`Component "${componentName}" not found in theme "${themeName}"`);
    const defaultComponent = await import(`@/app/themes/default/components/${componentName}`);
    return defaultComponent.default;
  }
}

// Server-side theme page resolver
// Returns the correct page component based on theme
export async function getThemePageComponent(
  themeName: string,
  pagePath: string
): Promise<{ Component: ComponentType; isOverride: boolean }> {
  // Try theme-specific page first
  try {
    const themePageModule = await import(
      `@/app/themes/${themeName}/pages/${pagePath}/page`
    );
    return {
      Component: themePageModule.default,
      isOverride: true,
    };
  } catch (error) {
    // Theme override doesn't exist, will use default
    return {
      Component: null as any, // Will be handled by page itself
      isOverride: false,
    };
  }
}

// Load theme layout component if it exists
// Returns null if theme doesn't have a custom layout
export async function loadThemeLayout(
  themeName: string
): Promise<ComponentType<{ children: React.ReactNode }> | null> {
  try {
    const layoutModule = await import(`@/app/themes/${themeName}/layout`);
    return layoutModule.default;
  } catch (error) {
    // Theme doesn't have custom layout, will use default
    return null;
  }
}
