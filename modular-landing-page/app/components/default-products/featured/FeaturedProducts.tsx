import { Product, ProductsResponse } from '@/types/product';
import { FeaturedProductsClient } from './FeaturedProductsClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/product?featured=1`, {
      cache: 'no-store', // Always fetch fresh data for SSR
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch featured products:', res.statusText);
      return [];
    }
    const data: ProductsResponse = await res.json();
    console.log("results****", data)

    return data.results || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return <FeaturedProductsClient products={products} />;
}
