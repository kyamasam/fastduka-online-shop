// Default theme custom index page

import HeroBannerSlider from "@/components/banner/HeroBannerSlider";
import FeaturedProducts from "@/components/default-products/featured/FeaturedProducts";
import ProductsList from "@/components/default-products/products/ProductsList";


export default function DefaultIndexPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBannerSlider />

      {/* Image #2 - Featured Products Section */}
      <FeaturedProducts />

      {/* Image #1 - Products Offers Section */}
      <ProductsList />

      {/* CTA Section */}

    </div>
  );
}
