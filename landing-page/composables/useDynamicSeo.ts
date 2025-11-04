import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";

export interface SeoOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string;
  twitterCard?: string;
  canonical?: string;
  ogType?: string;
  product?: any; // For product-specific schema
}

export const useDynamicSeo = (options: SeoOptions = {}): {
  title: string;
  description: string;
  ogImage: string;
} => {
  const siteSettingsStore = useSiteSettingsStore();

  // Settings should already be loaded from app.vue
  const settings = siteSettingsStore.settings;

  if (!settings) {
    console.warn("Site settings not available, using fallback values");
  }

  // Generate dynamic values based on site settings
  const siteTitle: string = settings?.title || "Fastduka";
  const siteDescription: string = settings?.description || "Online butchery in Kenya - Order fresh meat. Goat, Beef, pork, chicken";
  const siteLogo: string = settings?.site_logo || "/img/logo/logo-red.svg";
  const siteUrl: string = settings?.site_link || "https://fastduka.co.ke";

  // Construct final meta values
  const finalTitle: string = options.title ? `${options.title} - ${siteTitle}` : siteTitle;
  const finalDescription: string = options.description || siteDescription;
  const finalOgTitle: string = options.ogTitle || finalTitle;
  const finalOgDescription: string = options.ogDescription || finalDescription;
  const finalOgImage: string = options.ogImage || siteLogo;
  const finalKeywords: string = options.keywords || "Order Beef online, Fish online, Chicken online, Mutton online, Steak Nairobi, meat home delivery, online butchery Kenya";

  // Set the meta tags
  useSeoMeta({
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    ogTitle: finalOgTitle,
    ogDescription: finalOgDescription,
    ogImage: finalOgImage,
    ogUrl: options.canonical || siteUrl,
    ogType: (options.ogType as any) || "website",
    ogSiteName: siteTitle,
    twitterCard: (options.twitterCard as any) || "summary_large_image",
    twitterTitle: finalOgTitle,
    twitterDescription: finalOgDescription,
    twitterImage: finalOgImage,
    robots: "index, follow",
    author: siteTitle,
    generator: "Nuxt.js",
    viewport: "width=device-width, initial-scale=1",
  });

  // Set structured data for better SEO using useHead
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteTitle,
          description: siteDescription,
          url: siteUrl,
          logo: finalOgImage,
          contactPoint: {
            "@type": "ContactPoint",
            email: settings?.contact_email || "",
            telephone: settings?.contact_phone || "",
            contactType: "Customer Service",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: settings?.location || "Nairobi, Kenya",
          },
          sameAs: [
            settings?.facebook_url,
            settings?.twitter_url,
            settings?.instagram_url,
            settings?.youtube_url,
          ].filter(Boolean),
        }),
      },
    ],
  });

  return {
    title: finalTitle,
    description: finalDescription,
    ogImage: finalOgImage,
  };
};