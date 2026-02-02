# API Service

A centralized service for handling all API requests in your Next.js application.

## What's Included

- **`api.service.ts`** - Main API service with all HTTP methods
- **`API_SERVICE_GUIDE.md`** - Comprehensive guide with examples
- **`API_QUICK_REFERENCE.md`** - Quick reference for common patterns

## Features

- All HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Built-in timeout handling
- Request/response error handling
- Query parameter support
- File upload/download
- Authentication token management
- **Per-request authentication control** - Choose which requests need auth
- TypeScript support with full type safety
- Easy integration with Zustand stores

## Quick Start

### 1. Set up environment variable

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 2. Use in your Zustand store

```typescript
import { create } from 'zustand';
import apiService, { ApiError } from './services/api.service';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<Product[]>('/products');
      set({ products: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },
}));
```

### 3. Use in your component

```typescript
'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/product.store';

export default function ProductsPage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name} - ${product.price}</div>
      ))}
    </div>
  );
}
```

## Authentication Control

Control whether requests require authentication:

```typescript
// Public endpoint (no auth needed)
await apiService.post('/auth/login', credentials, {
  requiresAuth: false
});

// Protected endpoint (auth required - default)
await apiService.get('/user/profile');
```

## All HTTP Methods

```typescript
// GET
await apiService.get('/users');

// POST
await apiService.post('/users', { name: 'John' });

// PUT
await apiService.put('/users/1', { name: 'John Updated' });

// PATCH
await apiService.patch('/users/1', { name: 'John' });

// DELETE
await apiService.delete('/users/1');

// Upload
const formData = new FormData();
formData.append('file', file);
await apiService.upload('/upload', formData);

// Download
await apiService.download('/files/1', 'document.pdf');
```

## Token Management

```typescript
// After successful login
apiService.setAuthToken(token);

// Check if authenticated
if (apiService.hasAuthToken()) {
  // User is logged in
}

// Get current token
const token = apiService.getAuthToken();

// Logout
apiService.removeAuthToken();
```

## Documentation

- **[API Service Guide](./API_SERVICE_GUIDE.md)** - Complete guide with detailed examples
- **[Quick Reference](./API_QUICK_REFERENCE.md)** - Common patterns and snippets

## Examples

Check out these example files:

- **`app/store/example.store.ts`** - Example Zustand store implementation
- **`app/components/ExampleUsage.tsx`** - Example React component usage

## TypeScript Support

The service is fully typed. Always provide types for better IntelliSense:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Type the response
const response = await apiService.get<User[]>('/users');
// response.data is now User[]

const response2 = await apiService.get<User>('/users/1');
// response2.data is now User
```

## Error Handling

```typescript
import { ApiError } from './services/api.service';

try {
  const response = await apiService.get('/data');
} catch (error) {
  const apiError = error as ApiError;

  if (apiError.status === 401) {
    // Unauthorized - redirect to login
  } else if (apiError.status === 404) {
    // Not found
  }

  console.error(apiError.message);
}
```

## Configuration

```typescript
// Set base URL
apiService.setBaseURL('https://api.example.com');

// Set global headers
apiService.setHeaders({
  'X-App-Version': '1.0.0'
});

// Per-request configuration
await apiService.get('/data', {
  timeout: 10000, // 10 seconds
  headers: { 'X-Custom': 'value' },
  params: { page: 1, limit: 10 },
  requiresAuth: false, // Skip authentication
});
```

## Next Steps

1. Set up your `NEXT_PUBLIC_API_URL` in `.env.local`
2. Create your stores using the example as a template
3. Start making API calls from your stores
4. Refer to the [API Service Guide](./API_SERVICE_GUIDE.md) for advanced usage
