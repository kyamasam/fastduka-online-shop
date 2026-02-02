export const themeConfig = {
  name: "clothing",
  displayName: "Clothing Store Theme",
  description: "Elegant theme for fashion and clothing stores",
  colors: {
    primary: "#000000",
    secondary: "#8B7355",
    accent: "#C9A98D",
    background: "#FAFAFA",
    text: "#2C2C2C",
  },
  fonts: {
    heading: "Playfair Display, serif",
    body: "Lato, sans-serif",
  },
  layout: {
    maxWidth: "1280px",
    headerStyle: "elegant",
    footerStyle: "minimal",
  },
};

export type ThemeConfig = typeof themeConfig;
