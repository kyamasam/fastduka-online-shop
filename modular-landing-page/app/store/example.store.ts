/**
 * Example Store demonstrating API service usage with Zustand
 * You can use this as a template for your own stores
 */

import { create } from 'zustand';
import apiService, { ApiError } from '../services/api.service';

// Define your data types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Define store state
interface ExampleState {
  // User state
  user: User | null;
  users: User[];

  // Product state
  products: Product[];
  selectedProduct: Product | null;

  // Loading & error states
  loading: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  fetchProducts: (params?: { category?: string; limit?: number }) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;

  // Utility actions
  clearError: () => void;
  reset: () => void;
}

// Create the store
export const useExampleStore = create<ExampleState>((set, get) => ({
  // Initial state
  user: null,
  users: [],
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // Fetch all users (GET request)
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<User[]>('/users');
      set({ users: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Fetch single user (GET request with param)
  fetchUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<User>(`/users/${id}`);
      set({ user: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Create user (POST request)
  createUser: async (userData: Omit<User, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.post<User>('/users', userData);
      set((state) => ({
        users: [...state.users, response.data],
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Update user (PUT request)
  updateUser: async (id: number, userData: Partial<User>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.put<User>(`/users/${id}`, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? response.data : user
        ),
        user: state.user?.id === id ? response.data : state.user,
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Delete user (DELETE request)
  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        user: state.user?.id === id ? null : state.user,
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Fetch products with query params (GET with params)
  fetchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<Product[]>('/products', { params });
      set({ products: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Fetch single product
  fetchProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<Product>(`/products/${id}`);
      set({ selectedProduct: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message,
        loading: false
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    user: null,
    users: [],
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  }),
}));
