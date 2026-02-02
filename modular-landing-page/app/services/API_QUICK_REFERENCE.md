# API Service Quick Reference

Quick examples for common API operations.

## Setup

```typescript
import apiService from '@/app/services/api.service';

// Set base URL (optional, can use env variable)
apiService.setBaseURL('https://api.example.com');

// Set auth token after login
apiService.setAuthToken(token);
```

## Basic Requests

```typescript
// GET - Fetch all
const response = await apiService.get('/users');

// GET - Fetch one
const response = await apiService.get('/users/123');

// GET - With query params
const response = await apiService.get('/products', {
  params: { category: 'electronics', page: 1 }
});

// POST - Create
const response = await apiService.post('/users', { name: 'John', email: 'john@example.com' });

// PUT - Update (full)
const response = await apiService.put('/users/123', { name: 'John Doe', email: 'john@example.com' });

// PATCH - Update (partial)
const response = await apiService.patch('/users/123', { email: 'newemail@example.com' });

// DELETE - Remove
const response = await apiService.delete('/users/123');
```

## Authentication Control

```typescript
// Public endpoint (no auth)
await apiService.post('/auth/login', credentials, { requiresAuth: false });

// Public endpoint (no auth)
await apiService.post('/auth/register', userData, { requiresAuth: false });

// Protected endpoint (with auth - default)
await apiService.get('/user/profile');

// Explicitly require auth
await apiService.get('/user/orders', { requiresAuth: true });
```

## File Operations

```typescript
// Upload file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
await apiService.upload('/upload', formData);

// Download file
await apiService.download('/files/123', 'document.pdf');
```

## Error Handling

```typescript
import { ApiError } from '@/app/services/api.service';

try {
  const response = await apiService.get('/users');
  // Use response.data
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.message);

  if (apiError.status === 401) {
    // Handle unauthorized
  } else if (apiError.status === 404) {
    // Handle not found
  }
}
```

## Zustand Store Pattern

```typescript
import { create } from 'zustand';
import apiService, { ApiError } from '../services/api.service';

interface State {
  items: Item[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  createItem: (data: CreateItemData) => Promise<void>;
  updateItem: (id: number, data: UpdateItemData) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useStore = create<State>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<Item[]>('/items');
      set({ items: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },

  createItem: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.post<Item>('/items', data);
      set((state) => ({
        items: [...state.items, response.data],
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },

  updateItem: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.patch<Item>(`/items/${id}`, data);
      set((state) => ({
        items: state.items.map(item =>
          item.id === id ? response.data : item
        ),
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },

  deleteItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiService.delete(`/items/${id}`);
      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },
}));
```

## Component Usage

```typescript
'use client';

import { useEffect } from 'react';
import { useStore } from '@/app/store/your.store';

export default function Component() {
  const { items, loading, error, fetchItems, createItem, deleteItem } = useStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => deleteItem(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Custom Headers

```typescript
// Per request
await apiService.get('/data', {
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Global
apiService.setHeaders({
  'X-App-Version': '1.0.0'
});
```

## Timeout

```typescript
// Per request (5 seconds)
await apiService.get('/data', {
  timeout: 5000
});

// Default is 30 seconds
```

## Token Management

```typescript
// Set token
apiService.setAuthToken('your-jwt-token');

// Check if token exists
if (apiService.hasAuthToken()) {
  // Token is set
}

// Get token
const token = apiService.getAuthToken();

// Remove token
apiService.removeAuthToken();
```
