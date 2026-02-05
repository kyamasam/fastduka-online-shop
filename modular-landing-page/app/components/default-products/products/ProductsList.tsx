import { Product, ProductsResponse } from '@/types/product';
import { ProductsListClient } from './ProductsClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE_URL}/product`);
    if (categoryId) {
      url.searchParams.append('category_id', categoryId);
    }

    const res = await fetch(url.toString(), {
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

export default async function ProductsList({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const categoryId = searchParams?.category as string | undefined;
  const products = await getProducts(categoryId);

  return <ProductsListClient products={products} />;
}
