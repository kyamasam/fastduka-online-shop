# API Service Usage Guide

This guide explains how to use the centralized API service in your application.

## Overview

The API service (`api.service.ts`) provides a centralized way to handle all HTTP requests in your application. It includes:

- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Built-in timeout handling
- Request/response error handling
- Query parameter support
- File upload/download capabilities
- Easy authentication token management

## Basic Setup

### Configuration

The API service can be configured using environment variables or programmatically:

```typescript
// Using environment variables
// Add to your .env.local file:
NEXT_PUBLIC_API_URL=https://api.example.com

// Or configure programmatically
import apiService from '@/app/services/api.service';

apiService.setBaseURL('https://api.example.com');
```

### Setting Headers

```typescript
// Set custom headers
apiService.setHeaders({
  'X-Custom-Header': 'value',
});

// Set auth token
apiService.setAuthToken('your-jwt-token');

// Remove auth token
apiService.removeAuthToken();

// Check if auth token is set
if (apiService.hasAuthToken()) {
  console.log('User is authenticated');
}

// Get current auth token
const token = apiService.getAuthToken();
```

## Authentication Control

By default, all requests include the authentication token (if set). You can control this behavior per request:

### Public Endpoints (No Auth Required)

```typescript
// Make request without authentication, even if token is set globally
const response = await apiService.get('/public/products', {
  requiresAuth: false,
});

// Login request (obviously doesn't need auth)
const response = await apiService.post('/auth/login', credentials, {
  requiresAuth: false,
});

// Register endpoint
const response = await apiService.post('/auth/register', userData, {
  requiresAuth: false,
});
```

### Protected Endpoints (Auth Required - Default)

```typescript
// By default, all requests include auth token if it's set
const response = await apiService.get('/user/profile');

// Explicitly require auth (same as default behavior)
const response = await apiService.get('/user/orders', {
  requiresAuth: true,
});
```

### Mixed Scenarios

```typescript
// Example: App that works for both logged-in and guest users
const fetchProducts = async (isPublic = false) => {
  return await apiService.get('/products', {
    requiresAuth: !isPublic, // Skip auth for public access
  });
};

// Public access
await fetchProducts(true);

// Authenticated access (gets personalized results)
await fetchProducts(false);
```

## HTTP Methods

### GET Request

```typescript
// Simple GET
const response = await apiService.get('/users');

// GET with query parameters
const response = await apiService.get('/products', {
  params: {
    category: 'electronics',
    limit: 10,
    page: 1,
  }
});

// GET with custom headers
const response = await apiService.get('/protected', {
  headers: {
    'Authorization': 'Bearer token',
  }
});
```

### POST Request

```typescript
// POST with data
const response = await apiService.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// POST with custom config
const response = await apiService.post('/login', credentials, {
  timeout: 10000, // 10 seconds
});
```

### PUT Request

```typescript
// Update entire resource
const response = await apiService.put('/users/123', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
});
```

### PATCH Request

```typescript
// Partial update
const response = await apiService.patch('/users/123', {
  email: 'newemail@example.com',
});
```

### DELETE Request

```typescript
// Delete resource
const response = await apiService.delete('/users/123');

// Delete with params
const response = await apiService.delete('/cache', {
  params: {
    type: 'all',
  }
});
```

## File Operations

### Upload Files

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('description', 'Profile picture');

const response = await apiService.upload('/upload', formData);
```

### Download Files

```typescript
// Download with automatic filename
await apiService.download('/files/123', 'document.pdf');

// Download with query params
await apiService.download('/export', 'report.csv', {
  params: {
    format: 'csv',
    startDate: '2024-01-01',
  }
});
```

## Error Handling

```typescript
import { ApiError } from '@/app/services/api.service';

try {
  const response = await apiService.get('/users');
  console.log(response.data);
} catch (error) {
  const apiError = error as ApiError;
  console.error('Error:', apiError.message);
  console.error('Status:', apiError.status);
  console.error('Data:', apiError.data);
}
```

## Using with Zustand Stores

### Example Store

```typescript
import { create } from 'zustand';
import apiService, { ApiError } from '../services/api.service';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get<User[]>('/users');
      set({ users: response.data, loading: false });
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.post<User>('/users', userData);
      set((state) => ({
        users: [...state.users, response.data],
        loading: false
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({ error: apiError.message, loading: false });
    }
  },
}));
```

### Using in Components

```typescript
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/app/store/user.store';

export default function UsersPage() {
  const { users, loading, error, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Advanced Features

### Custom Timeout

```typescript
// Set global timeout
const apiService = new ApiService({
  timeout: 60000, // 60 seconds
});

// Or per request
const response = await apiService.get('/data', {
  timeout: 5000, // 5 seconds
});
```

### Response Types

The service automatically handles different response types:

- JSON responses (most common)
- Text responses
- Blob responses (for files)

### TypeScript Types

```typescript
// Type your responses for better type safety
interface Product {
  id: number;
  name: string;
  price: number;
}

const response = await apiService.get<Product[]>('/products');
// response.data is now typed as Product[]
```

## Authentication Example with Store

```typescript
// auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiService from '../services/api.service';

interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login - no auth required for login endpoint
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post<LoginResponse>(
            '/auth/login',
            { email, password },
            { requiresAuth: false } // Login doesn't need auth
          );

          const { token, user } = response.data;

          // Set token globally for future requests
          apiService.setAuthToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      // Register - no auth required
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post<LoginResponse>(
            '/auth/register',
            userData,
            { requiresAuth: false } // Registration doesn't need auth
          );

          const { token, user } = response.data;
          apiService.setAuthToken(token);

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          const apiError = error as ApiError;
          set({ error: apiError.message, loading: false });
        }
      },

      // Logout
      logout: () => {
        apiService.removeAuthToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Refresh user data - requires auth
      refreshUser: async () => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get<User>(
            '/auth/me'
            // requiresAuth defaults to true, so auth token is included
          );

          set({ user: response.data, loading: false });
        } catch (error) {
          const apiError = error as ApiError;
          if (apiError.status === 401) {
            // Token expired or invalid, logout
            get().logout();
          }
          set({ error: apiError.message, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to apiService when store is rehydrated
        if (state?.token) {
          apiService.setAuthToken(state.token);
        }
      },
    }
  )
);
```

## Best Practices

1. **Type your API responses** - Always provide TypeScript types for better type safety
2. **Handle errors gracefully** - Always wrap API calls in try-catch blocks
3. **Use loading states** - Show loading indicators during API calls
4. **Centralize API logic** - Keep all API calls in your stores, not in components
5. **Use environment variables** - Store API URLs in environment variables
6. **Set auth tokens globally** - Use `setAuthToken()` after login instead of passing tokens in every request
7. **Control authentication per request**:
   - Set `requiresAuth: false` for public endpoints (login, register, public data)
   - Leave default (or set `requiresAuth: true`) for protected endpoints
   - This prevents sending auth headers to public endpoints unnecessarily
8. **Persist auth state** - Use Zustand's persist middleware to save tokens across sessions
9. **Handle 401 errors** - Automatically logout users when receiving unauthorized responses

## Example: Complete Authentication Flow

```typescript
// auth.store.ts
import { create } from 'zustand';
import apiService from '../services/api.service';

interface AuthState {
  token: string | null;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: async (credentials) => {
    const response = await apiService.post('/auth/login', credentials);
    const { token, user } = response.data;

    // Set token globally for all future requests
    apiService.setAuthToken(token);

    set({ token, user });
  },

  logout: () => {
    apiService.removeAuthToken();
    set({ token: null, user: null });
  },
}));
```
