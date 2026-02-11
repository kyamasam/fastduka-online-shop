import { ProductsResponse, ShopQueryParams, Category } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function getProducts(params?: ShopQueryParams, pageSize: number = 16): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Add page size limit
    queryParams.append('limit', String(pageSize));

    // Calculate offset based on page number
    if (params?.page && params.page > 1) {
      const offset = (params.page - 1) * pageSize;
      queryParams.append('offset', String(offset));
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Skip page as we've already calculated offset
        if (key === 'page') return;

        if (value !== undefined && value !== null && value !== '') {
          // Handle category_id as array
          if (key === 'category_id' && typeof value === 'string') {
            value.split(',').forEach(id => {
              queryParams.append('category_id', id);
            });
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const url = `${API_BASE_URL}/product?${queryParams.toString()}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch products:', res.statusText);
      return { count: 0, next: null, previous: null, results: [] };
    }

    const data: ProductsResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/category`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch categories:', res.statusText);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/product`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return { min: 0, max: 10000000 };
    }

    const data: ProductsResponse = await res.json();

    if (data.results.length === 0) {
      return { min: 0, max: 10000000 };
    }

    const prices = data.results.map(p => p.selling_price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 10000000 };
  }
}
