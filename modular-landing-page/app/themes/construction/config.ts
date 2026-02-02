export const themeConfig = {
  name: "construction",
  displayName: "Construction Theme",
  description: "Bold theme for construction and industrial businesses",
  colors: {
    primary: "#FF6B00",
    secondary: "#1A1A1A",
    accent: "#FFD700",
    background: "#F5F5F5",
    text: "#1A1A1A",
  },
  fonts: {
    heading: "Roboto, sans-serif",
    body: "Open Sans, sans-serif",
  },
  layout: {
    maxWidth: "1400px",
    headerStyle: "bold",
    footerStyle: "industrial",
  },
};

export type ThemeConfig = typeof themeConfig;
