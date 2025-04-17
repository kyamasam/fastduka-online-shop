interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

interface IReview {
  id: number;
  description: string;
  reviewer_name: string;
  title: string;
  product_name: string;
  review_value: number;
  user: IUser;
  created_at: string;
  updated_at: string;
}

interface IReviewBreakdown {
  count: number;
  percentage: number;
}

interface IReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_display: string;
  rating_breakdown: {
    [key: string]: IReviewBreakdown;
  };
}

interface IAdditionalInformation {
  key: string;
  value: string;
}

export interface IProduct {
  id: number;
  name: string;
  featured: boolean;
  description: string;
  additional_information: IAdditionalInformation[];
  seo_description: string;
  primary_photo: string;
  category: ICategory;
  category_id: number;
  selling_price: number;
  sale_price: number | null;
  allowable_discount: number | null;
  on_sale: boolean;
  in_stock: boolean;
  variants: any[]; // Type can be made more specific if variant structure is known
  photos: IPhoto[];
  inventory: number;
  reviews: IReview[];
  created_at: string;
  updated_at: string;
  review_stats: IReviewStats;
}

export interface ICategory {
  id: number;
  name: string;
  parent: number | null;
  photo: null | string;
  children: ICategory[];
  created_at: Date;
  updated_at: Date;
}

export interface IPhoto {
  id: number;
  product: number;
  photo: string;
  created_at: Date;
  updated_at: Date;
}
