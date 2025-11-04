#!/usr/bin/env node

// Simple script to help update remaining pages with dynamic SEO
// This file documents the pattern for manually updating remaining pages

const pageUpdates = {
  "pages/register.vue": {
    title: "Register",
    description: "Create an account to order fresh meat for delivery in Kenya.",
    keywords: "register, create account, sign up, meat delivery Kenya"
  },
  "pages/forgot.vue": {
    title: "Reset Password",
    description: "Reset your password to access your meat delivery account.",
    keywords: "forgot password, reset password, account recovery"
  },
  "pages/profile.vue": {
    title: "My Profile",
    description: "Manage your account settings and order history.",
    keywords: "profile, account settings, order history, Kenya"
  },
  "pages/wishlist.vue": {
    title: "Wishlist",
    description: "Save your favorite meat products for later purchase.",
    keywords: "wishlist, favorite products, meat selection Kenya"
  },
  "pages/search.vue": {
    title: "Search Results",
    description: "Find the perfect meat products for your needs.",
    keywords: "search, find products, meat search Kenya"
  },
  "pages/order.vue": {
    title: "Order History",
    description: "View your previous meat delivery orders and track current ones.",
    keywords: "orders, order history, delivery tracking Kenya"
  },
  "pages/coupons.vue": {
    title: "Coupons & Offers",
    description: "Browse current discounts and special offers on meat products.",
    keywords: "coupons, discounts, offers, meat deals Kenya"
  },
  "pages/404.vue": {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    keywords: "404, page not found, error"
  }
};

// Replace pattern:
// useSeoMeta({ title: "Original Title" });
//
// With:
// await useDynamicSeo({
//   title: "New Title",
//   description: "Description here",
//   keywords: "keywords here",
// });

console.log("Use this mapping to update remaining pages:");
console.log(JSON.stringify(pageUpdates, null, 2));