export const themeConfig = {
  name: "default",
  displayName: "Default Theme",
  description: "Clean and minimal ecommerce theme",
  colors: {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0070f3",
    background: "#ffffff",
    text: "#000000",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  layout: {
    maxWidth: "1200px",
    headerStyle: "default",
    footerStyle: "default",
  },
};

export type ThemeConfig = typeof themeConfig;
