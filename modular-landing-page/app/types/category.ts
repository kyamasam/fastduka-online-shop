export interface CategoryType {
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
  parent: number;
  parent_obj: string;
  photo: string;
  children: string;
  category_type: CategoryType;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  results?: Category[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}
