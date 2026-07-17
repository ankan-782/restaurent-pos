import type { Product, ProductsResponse } from "@/types/product";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  getProducts: (params?: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.skip) searchParams.set("skip", params.skip.toString());
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return fetchWithErrorHandling<ProductsResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.products}${query}`
    );
  },

  searchProducts: (query: string, params?: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams({ q: query });
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.skip) searchParams.set("skip", params.skip.toString());
    return fetchWithErrorHandling<ProductsResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.productsSearch}?${searchParams.toString()}`
    );
  },

  getCategories: (): Promise<Array<{ slug: string; name: string; url: string }>> => {
    return fetchWithErrorHandling<Array<{ slug: string; name: string; url: string }>>(
      `${API_BASE_URL}${API_ENDPOINTS.categories}`
    );
  },

  getProductsByCategory: (category: string, params?: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.skip) searchParams.set("skip", params.skip.toString());
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return fetchWithErrorHandling<ProductsResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.category}/${encodeURIComponent(category)}${query}`
    );
  },

  getProduct: (id: number): Promise<Product> => {
    return fetchWithErrorHandling<Product>(
      `${API_BASE_URL}${API_ENDPOINTS.product}/${id}`
    );
  },

  addToCart: (userId: number, products: Array<{ id: number; quantity: number }>) => {
    return fetchWithErrorHandling<{ id: number; products: Array<{ id: number; quantity: number }>; total: number }>(
      `${API_BASE_URL}${API_ENDPOINTS.cartAdd}`,
      {
        method: "POST",
        body: JSON.stringify({ userId, products }),
      }
    );
  },
};