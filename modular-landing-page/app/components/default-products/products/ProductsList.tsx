import { Product, ProductsResponse } from '@/types/product';
import { ProductsListClient } from './ProductsClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/product`, {
      cache: 'no-store', // Always fetch fresh data for SSR
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return [];
    }
    const data: ProductsResponse = await res.json();

    return data.results || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsList() {
  const products = await getProducts();

  return <ProductsListClient products={products} />;
}
