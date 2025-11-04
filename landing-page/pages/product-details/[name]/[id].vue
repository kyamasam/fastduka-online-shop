<template>
  <p v-if="pending">Loading...</p>
  <div v-if="data">
    <!-- breadcrumb start -->
    <product-details-breadcrumb :product="data" />
    <!-- breadcrumb end -->

    <!-- product details area start -->
    <product-details-area :product="data" />
    <!-- product details area end -->

    <!-- related products start -->
    <!-- <product-related :product-id="product.id" :category="product.category.name" /> -->
    <!-- related products end -->
  </div>
</template>

<script setup>
import { useProductStore } from "@/pinia/useProductStore";
import { useSiteSettingsStore } from "@/pinia/useSiteSettingsStore";

const route = useRoute();
const config = useRuntimeConfig();
const productStore = useProductStore();
const siteSettingsStore = useSiteSettingsStore();

// Ensure site settings are loaded
await siteSettingsStore.fetchSettings();

const baseUrl =
  config.public.siteUrl || siteSettingsStore.settings?.site_link || "https://fastduka.netlify.app";
const currentUrl = `${baseUrl}/product-details/${route.params.name}/${route.params.id}`;

// Fetch product data using composable pattern
const {
  data,
  error,
  pending,
  execute,
} = getDataUnauthed(`/product/${route?.params?.id}`);

// SEO setup function
const setupSEO = (product) => {
  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [
      product.primary_photo,
      ...(product.photos?.map((p) => p.photo) || []),
    ].filter(Boolean),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.category?.name || siteSettingsStore.settings?.title || "Fastduka",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.sale_price || product.selling_price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: currentUrl,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.review_stats?.average_rating || 0,
      reviewCount: product.review_stats?.total_reviews || 0,
      bestRating: 5,
      worstRating: 1,
    },
    review:
      product.reviews?.map((review) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.review_value,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          "@type": "Person",
          name: review.user?.first_name || "Anonymous",
        },
        datePublished: review.created_at,
        description: review.description,
        name: review.title,
      })) || [],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category?.name || "Products",
        item: `${baseUrl}/products/category/${product.category?.id || ""}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: currentUrl,
      },
    ],
  };

  // Use dynamic SEO with site settings
  useDynamicSeo({
    title: `Order ${product.name} online in Kenya`,
    description: `Buy ${product.name} online in Kenya. ${product.description?.slice(0, 150)}...`,
    keywords: `${product.name}, buy ${product.name}, ${product.category?.name}, meat delivery Kenya, online meat shop`,
    ogTitle: `Order ${product.name} online in Kenya`,
    ogDescription: product.description,
    ogImage: product.primary_photo,
    ogType: "product",
    canonical: currentUrl,
  });

  // Set product-specific structured data
  useHead({
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify(productSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema),
      },
    ],
  });
};

// Initial fetch
await execute();

// Set up SEO after data is loaded
watch(data, (newData) => {
  if (newData) {
    setupSEO(newData);
  }
}, { immediate: true });

// Watch for route changes to refetch data
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await execute();
    }
  }
);
</script>