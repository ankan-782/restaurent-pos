import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProductsResponse } from "@/types/product";

export function useProducts(params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      console.log("[FETCH] useProducts:", params);
      const result = await api.getProducts(params);
      console.log("[FETCH] useProducts result:", result?.products?.length, "products");
      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfiniteProducts(params?: { limit?: number }) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("[FETCH] useInfiniteProducts:", { ...params, skip: pageParam * (params?.limit || 20) });
      return api.getProducts({ ...params, skip: pageParam * (params?.limit || 20) });
    },
    getNextPageParam: (lastPage: ProductsResponse, allPages) => {
      if (lastPage.products.length < (params?.limit || 20)) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      console.log("[FETCH] useProduct:", id);
      return api.getProduct(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("[FETCH] useCategories");
      return api.getCategories();
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useProductsByCategory(category: string, params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: ["products", "category", category, params],
    queryFn: async () => {
      console.log("[FETCH] useProductsByCategory:", category, params);
      const result = await api.getProductsByCategory(category, params);
      console.log("[FETCH] useProductsByCategory result:", result?.products?.length, "products");
      return result;
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProductSearch(query: string, params?: { limit?: number; skip?: number }) {
  return useQuery({
    queryKey: ["products", "search", query, params],
    queryFn: async () => {
      console.log("[FETCH] useProductSearch:", query, params);
      const result = await api.searchProducts(query, params);
      console.log("[FETCH] useProductSearch result:", result?.products?.length, "products");
      return result;
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useInfiniteProductsByCategory(category: string, params?: { limit?: number }) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", "category", category, params],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("[FETCH] useInfiniteProductsByCategory:", category, { ...params, skip: pageParam * (params?.limit || 20) });
      return api.getProductsByCategory(category, { ...params, skip: pageParam * (params?.limit || 20) });
    },
    getNextPageParam: (lastPage: ProductsResponse, allPages) => {
      if (lastPage.products.length < (params?.limit || 20)) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfiniteProductSearch(query: string, params?: { limit?: number }) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", "search", query, params],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("[FETCH] useInfiniteProductSearch:", query, { ...params, skip: pageParam * (params?.limit || 20) });
      return api.searchProducts(query, { ...params, skip: pageParam * (params?.limit || 20) });
    },
    getNextPageParam: (lastPage: ProductsResponse, allPages) => {
      if (lastPage.products.length < (params?.limit || 20)) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}