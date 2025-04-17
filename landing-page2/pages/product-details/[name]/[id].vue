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
const route = useRoute();
const config = useRuntimeConfig();

const productStore = useProductStore();
const data = ref();
const error = ref();
const pending = ref();

const baseUrl =
  config.public.siteUrl || "https://fastduka.netlify.app";
const currentUrl = `${baseUrl}/product-details/${route.params.name}/${route.params.id}`;

// Fetch product data
const fetchProduct = async () => {
  pending.value = true;
  try {
    const response = await getDataUnauthed(`/product/${route?.params?.id}`);
    data.value = response.data.value;
    error.value = response.error.value;

    // Once we have the product data, set up SEO
    if (data.value) {
      setupSEO(data.value);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

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
      name: product.category?.name || "Fastduka World",
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

  // Set meta tags and schemas
  useHead({
    title: `Order ${product.name} online in Kenya | Fastduka World`,
    meta: [
      {
        name: "description",
        content: `Buy ${
          product.name
        } online in Kenya. ${product.description?.slice(0, 150)}...`,
      },
      {
        name: "keywords",
        content: `${product.name}, buy ${product.name}, ${product.category?.name}, meat delivery Kenya, online meat shop`,
      },
      // Open Graph
      {
        property: "og:title",
        content: `Order ${product.name} online in Kenya | Fastduka`,
      },
      {
        property: "og:description",
        content: product.description,
      },
      {
        property: "og:image",
        content: product.primary_photo,
      },
      {
        property: "og:url",
        content: currentUrl,
      },
      {
        property: "og:type",
        content: "product",
      },
      {
        property: "og:site_name",
        content: "Fastduka",
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: `Order ${product.name} online in Kenya | Fastduka`,
      },
      {
        name: "twitter:description",
        content: product.description,
      },
      {
        name: "twitter:image",
        content: product.primary_photo,
      },
    ],
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
await fetchProduct();

// Watch for route changes to refetch data
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProduct();
    }
  }
);
</script>
