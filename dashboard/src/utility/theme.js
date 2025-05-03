// src/utility/theme.js
export function updateTheme(config) {
  try {
    // Get primary color from config or use default
    const primaryColor = config?.primary_color || "#FF4136";

    // Convert hex to RGB for CSS variables
    const rgbColor = hexToRgb(primaryColor);

    // Set RGB components as separate CSS variables
    document.documentElement.style.setProperty("--color-primary-r", rgbColor.r);
    document.documentElement.style.setProperty("--color-primary-g", rgbColor.g);
    document.documentElement.style.setProperty("--color-primary-b", rgbColor.b);

    // Also set the hex value for compatibility
    document.documentElement.style.setProperty("--color-primary", primaryColor);

    // Save to localStorage for persistence
    if (config) {
      localStorage.setItem("settingsData", JSON.stringify(config));
    }

    return true;
  } catch (error) {
    console.error("Error updating theme:", error);
    return false;
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

export function initTheme() {
  try {
    const settingsData = JSON.parse(localStorage.getItem("settingsData")) || {};
    updateTheme(settingsData);
  } catch (error) {
    console.error("Error initializing theme:", error);
  }
}
