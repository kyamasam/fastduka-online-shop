export interface ProductType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent: number | null;
  parent_obj: { name: string } | null;
  photo: string | null;
  children: Category[];
  category_type: ProductType;
  created_at: string;
  updated_at: string;
}

export interface ProductPhoto {
  id: number;
  product: number;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface RatingBreakdown {
  count: number;
  percentage: number;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_display: string;
  rating_breakdown: {
    [key: string]: RatingBreakdown; // Handles keys "1", "2", "3", etc.
  };
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  featured: boolean;
  description: string;
  additional_information: string | null;
  seo_description: string | null;
  primary_photo: string;
  category: Category;
  category_id: number;
  product_type: ProductType;
  selling_price: number;
  sale_price: number;
  allowable_discount: number | null;
  on_sale: boolean;
  in_stock: boolean;
  variants: any[]; 
  photos: ProductPhoto[];
  inventory: number; 
  reviews: any[];
  created_at: string;
  updated_at: string;
  review_stats: ReviewStats;
  is_taxable: boolean;
  price_includes_tax: boolean;
  tax_rate: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface FeaturedProductsParams {
  featured?: number;
  limit?: number;
  offset?: number;
}