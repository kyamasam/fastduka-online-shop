export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  primary_photo?: string;
  images?: string[];
  selling_price: number;
  sale_price?: number;
  stock?: number;
  category?: Category;
  featured?: boolean;
  rating?: number;
  reviews_count?: number;
  slug?: string;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  results: Product[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface FeaturedProductsParams {
  featured?: number;
  limit?: number;
  offset?: number;
}
