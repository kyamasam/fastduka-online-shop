/**
 * Centralized API Service
 * Handles all HTTP methods and can be called by stores for API requests
 */

export interface ApiConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  requiresAuth?: boolean; // If true, requires auth token. If false, skips auth even if token is set
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout || 30000; // 30 seconds default
  }

  /**
   * Set or update the base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Set or update default headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Check if auth token is set
   */
  hasAuthToken(): boolean {
    return !!this.defaultHeaders['Authorization'];
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | undefined {
    return this.defaultHeaders['Authorization']?.replace('Bearer ', '');
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Remove leading slash from endpoint if baseURL already ends with one
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const baseURL = this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/';

    const url = new URL(cleanEndpoint, baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Make HTTP request with timeout
   */
  private async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.timeout, headers, requiresAuth = true, ...fetchConfig } = config;

    const url = this.buildURL(endpoint, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Build headers based on auth requirement
    let requestHeaders: Record<string, string> = { ...this.defaultHeaders };

    // If requiresAuth is false, remove Authorization header
    if (requiresAuth === false && requestHeaders['Authorization']) {
      const { Authorization, ...headersWithoutAuth } = requestHeaders;
      requestHeaders = headersWithoutAuth;
    }

    // Merge with custom headers
    if (headers && typeof headers === 'object') {
      requestHeaders = { ...requestHeaders, ...(headers as Record<string, string>) };
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: requestHeaders as HeadersInit,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response based on content type
      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text')) {
        data = (await response.text()) as T;
      } else {
        data = (await response.blob()) as T;
      }

      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
          data,
        } as ApiError;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
          statusText: 'Request Timeout',
        } as ApiError;
      }

      if (error.status) {
        throw error as ApiError;
      }

      throw {
        message: error.message || 'Network error',
        data: error,
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * Upload file(s)
   */
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    config?: Omit<ApiRequestConfig, 'headers'>
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, ...restConfig } = config || {};

    // Build headers based on auth requirement
    let uploadHeaders = { ...this.defaultHeaders };

    // Remove Content-Type header for FormData (browser will set it with boundary)
    const { 'Content-Type': _, ...headersWithoutContentType } = uploadHeaders;
    uploadHeaders = headersWithoutContentType;

    // If requiresAuth is false, remove Authorization header
    if (requiresAuth === false && uploadHeaders['Authorization']) {
      const { Authorization, ...headersWithoutAuth } = uploadHeaders;
      uploadHeaders = headersWithoutAuth;
    }

    return this.request<T>(endpoint, {
      ...restConfig,
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
      requiresAuth, // Pass through to request method
    });
  }

  /**
   * Download file
   */
  async download(
    endpoint: string,
    filename?: string,
    config?: ApiRequestConfig
  ): Promise<void> {
    const response = await this.request<Blob>(endpoint, {
      ...config,
      method: 'GET',
    });

    // Create download link
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;
