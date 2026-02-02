import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import ThemeLayout from "./components/ThemeLayout";
import { SettingsHydration } from "./components/providers/SettingsHydration";
import { getSettings, getDefaultSettings } from "./lib/get-settings";


const jost = Jost({
  subsets: ["latin"],
})

// Generate dynamic metadata from settings
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const defaults = getDefaultSettings();

  return {
    title: settings?.title || defaults.title || "FastDuka",
    description: settings?.description || "Your online shop for quality products",
    icons: {
      icon: settings?.site_icon || "/favicon.ico",
    },
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings on the server for SEO
  const settings = await getSettings();

  return (
    <html lang="en">
      <body
        className={`${jost.className} antialiased`}
      >
        {/* Hydrate client-side Zustand store with server-fetched settings */}
        <SettingsHydration settings={settings} />

        <ThemeLayout>
          {children}
        </ThemeLayout>
      </body>
    </html>
  );
}
